"use client";

import Modal from "../components/Modal";
import NavBar from "../components/NavBar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between dark:bg-slate-700">
      <NavBar />
      <Modal />
      <div></div>
    </main>
  );
}
