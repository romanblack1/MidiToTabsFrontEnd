"use client";

import RegisterCard from "../../components/RegisterCard";
import NavBar from "../../components/NavBar";

export default function Home() {
  return (
    <main className="flex flex-col justify-around dark:bg-slate-700 h-screen">
      <NavBar />
      <div className="flex flex-col items-center justify-around w-screen">
        <RegisterCard />
      </div>
    </main>
  );
}
