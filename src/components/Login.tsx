"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
function Login() {
  return (
    <main className="flex h-screen flex-col items-center justify-center bg-[#11A37F]">
      <Image
        width={300}
        height={300}
        alt="logo"
        src="https://links.papareact.com/2i6"
      />
      <button
        onClick={() => signIn("google")}
        className="text-bold text-bold animate-pulse text-3xl text-white"
      >
        Sign in to use copy of chatGPT
      </button>
    </main>
  );
}

export default Login;
