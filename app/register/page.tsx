"use client";

import RegisterCard from "../../components/RegisterCard";
import NavBar from "../../components/NavBar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between dark:bg-slate-700">
      <NavBar />
      <RegisterCard />
      <div></div>
      <div></div>
      <div></div>
    </main>
  );
}
