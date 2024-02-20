"use client";

import LoginCard from "../../components/LoginCard";
import Link from "next/link";
import NavBar from "../../components/NavBar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between dark:bg-slate-700">
      <NavBar />
      <Link href="/">Go Home</Link>
      <LoginCard />
      <div></div>
      <div></div>
      <div></div>
    </main>
  );
}
