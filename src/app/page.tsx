"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client"; 
import Image from "next/image";
import { useState } from "react";

export default function Home() {
const { 
        data: session, 
    } = authClient.useSession() 
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const onSubmit=()=>{ 
    authClient.signUp.email({
        email, 
        password, 
        name, 
    }, {
        // onRequest: () => {
        //     //show loading
        // },
        onSuccess: () => {
            window.alert("Successful");
        },
        onError: () => {
            window.alert("Something went wrong");
        },
})
  }
  const onLogin=()=>{ 
    authClient.signIn.email({
        email, 
        password, 
        
    }, {
        // onRequest: () => {
        //     //show loading
        // },
        onSuccess: () => {
            window.alert("Successful");
        },
        onError: () => {
            window.alert("Something went wrong");
        },
})
  }
  if(session){
    return(
      <div>
        <p>logged in as {session.user.name}</p>
        <Button onClick={() => authClient.signOut()}>Sign Out</Button>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-y-10">
  <div className="p-4 gap-y-4 flex flex-col">
    <Input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
    <Input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
    <Input placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
    <Button onClick={onSubmit}>Create User</Button>
  </div>
  <div className="p-4 gap-y-4 flex flex-col">
    {/* <Input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} /> */}
    <Input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
    <Input placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
    <Button onClick={onLogin}>Login</Button>
  </div>
  </div>
  );
}
