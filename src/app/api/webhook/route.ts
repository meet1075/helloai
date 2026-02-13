import {
  CallEndedEvent,
  CallTranscriptionReadyEvent,
  CallSessionParticipantLeftEvent,
  CallRecordingReadyEvent,
  CallSessionStartedEvent,
} from "@stream-io/node-sdk";
import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { StreamVideo } from "@stream-io/video-react-sdk";
import { streamVideo } from "@/lib/stream-video";
import { NextRequest, NextResponse } from "next/server";
import { and, eq, not } from "drizzle-orm";
import { inngest } from "@/inngest/client";

function verifySignatureWithSDK(body: string, signature: string): boolean {
  return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature");
  const apiKey = req.headers.get("x-api-key");
  if (!signature || !apiKey) {
    return NextResponse.json(
      { error: "Missing signature or API key" },
      { status: 400 },
    );
  }
  const body = await req.text();
  if (!verifySignatureWithSDK(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  let payload: unknown;
  try {
    payload = JSON.parse(body) as Record<string, unknown>;
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }
  const eventType = (payload as Record<string, unknown>)?.type;
  if (eventType === "call.session_started") {
    const event = payload as CallSessionStartedEvent;
    const meetingId = event.call.custom?.meetingId as string | undefined;

    if (!meetingId) {
      return NextResponse.json(
        { error: "Missing meetingId in call.custom" },
        { status: 400 },
      );
    }
    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.id, meetingId),
          not(eq(meetings.status, "completed")),
          not(eq(meetings.status, "cancelled")),
          not(eq(meetings.status, "active")),
          not(eq(meetings.status, "processing")),
        ),
      );
    if (!existingMeeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    await db
      .update(meetings)
      .set({ status: "active", startedAt: new Date() })
      .where(eq(meetings.id, existingMeeting.id));

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeeting.agentId));

    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 },
      );
    }

    try {
      const call = streamVideo.video.call("default", meetingId);

      const realTimeClient = await streamVideo.video.connectOpenAi({
        call,
        openAiApiKey: process.env.OPENAI_API_KEY,
        agentUserId: existingAgent.id,
      });

      realTimeClient.updateSession({
        instructions: existingAgent.instructions,
        voice: "alloy",
        input_audio_transcription: { model: "whisper-1" },
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500,
        },
        max_response_output_tokens: 300, // Limit agent responses (cheaper)
        temperature: 0.8,
      });
    } catch (error) {
      return NextResponse.json(
        {
          error: "Failed to connect OpenAI agent",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      );
    }
  } else if (eventType === "call.session_participant_left") {
    const event = payload as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid.split(":")[1];
    if (!meetingId) {
      return NextResponse.json(
        { error: "Missing meetingId in call_cid" },
        { status: 400 },
      );
    }
    const call = streamVideo.video.call("default", meetingId);
    await call.end();
  } else if (eventType === "call.session_ended") {
    const event = payload as CallEndedEvent;
    const meetingId = event.call.custom?.meetingId;
    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }
    await db
      .update(meetings)
      .set({ status: "processing", endedAt: new Date() })
      .where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")));
  } else if (eventType === "call.transcription_ready") {
    const event = payload as CallTranscriptionReadyEvent;
    const meetingId = event.call_cid.split(":")[1];
    if (!meetingId) {
      return NextResponse.json(
        { error: "Missing meetingId in call_cid" },
        { status: 400 },
      );
    }
    const [updatedMeeting] = await db
      .update(meetings)
      .set({ transcritpUrl: event.call_transcription.url })
      .where(eq(meetings.id, meetingId))
      .returning();
    if (!updatedMeeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    await inngest.send({
      name: "meetings/processing",
      data: {
        meetingId:updatedMeeting.id,
        transcriptUrl: updatedMeeting.transcritpUrl,
      },
    });
  } else if (eventType === "call.recording_ready") {
    const event = payload as CallRecordingReadyEvent;
    const meetingId = event.call_cid.split(":")[1];
    if (!meetingId) {
      return NextResponse.json(
        { error: "Missing meetingId" },
        { status: 400 },
      );
    }
   await db
      .update(meetings)
      .set({ recordingUrl: event.call_recording.url })
      .where(eq(meetings.id, meetingId))
   
  }

  return NextResponse.json({ message: "ok" });
}
