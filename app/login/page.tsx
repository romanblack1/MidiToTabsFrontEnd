"use client";

import LoginCard from "../../components/LoginCard";
import NavBar from "../../components/NavBar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between dark:bg-slate-700">
      <NavBar />
      <LoginCard />
      <div></div>
      <div></div>
      <div></div>
    </main>
  );
}
