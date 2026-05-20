  "use client"
  import React, { useEffect } from "react";
import { useLoggedIn } from "~/hooks/api/auth";
import { useRouter } from "next/router";
  

  export default function Home() {
     const {user}=useLoggedIn()
     const router=useRouter()
     useEffect(()=>{
      if(user && user.id) {
       router.replace('/dashboard')
      } else{
          router.replace('/login')
      }
     },[user,router])

    return (
      <main className="min-h-screen min-w-screen flex justify-center items-center bg-black text-white">
        <div>
         
        </div>
      </main>
    );
  }
