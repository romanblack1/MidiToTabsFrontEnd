"use client";

import RegeisterCard from "../../components/RegisterCard";
import Link from "next/link";
import NavBar from "../../components/NavBar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between dark:bg-slate-700">
      <NavBar />
      <Link href="/">Go Home</Link>
      <RegeisterCard />
      <div></div>
      <div></div>
      <div></div>
    </main>
  );
}
