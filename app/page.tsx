"use client";
import { useState } from "react";
import Modal from "../components/Modal";
import NavBar from "../components/NavBar";
import TabDisplay from "../components/TabDisplay";

export default function Home() {
  const [tab, setTab] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<string | undefined>(undefined);

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-around dark:bg-slate-700">
      <NavBar setTab={setTab} setTitle={setTitle} />
      {tab && title ? <TabDisplay tab={tab} title={title} /> : null}
      <Modal setTab={setTab} setTitle={setTitle} />
    </main>
  );
}
