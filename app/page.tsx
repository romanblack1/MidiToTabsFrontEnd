"use client";
import { useState } from "react";
import Modal from "../components/Modal";
import NavBar from "../components/NavBar";
import TabDisplay from "../components/TabDisplay";

export default function Home() {
  const [tab, setTab] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<string | undefined>(undefined);

  return (
    <main
      className="flex flex-col justify-around dark:bg-slate-700 mt-14 mb-5 "
      style={{
        minHeight: "calc(100vh - 4.75rem)",
      }}
    >
      <NavBar setTab={setTab} setTitle={setTitle} />
      <div className="flex flex-col items-center justify-around w-screen">
        {tab && title ? <TabDisplay tab={tab} title={title} /> : null}
        <Modal setTab={setTab} setTitle={setTitle} />
      </div>
    </main>
  );
}
