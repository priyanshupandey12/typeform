  "use client"
  import React from "react";
  import { trpc } from "~/trpc/client";

  export default function Home() {
    const { data, isLoading, error } = trpc.chaicode.useQuery({ email: "hello@example.com" });

    return (
      <main className="min-h-screen min-w-screen flex justify-center items-center bg-black text-white">
        <div>
          <h1 className="text-3xl">aakhir kaar hohi gya </h1>
          <h2>
            Server Status: {isLoading ? "Loading..." : error ? "Error" : data?.message}
          </h2>
        </div>
      </main>
    );
  }
