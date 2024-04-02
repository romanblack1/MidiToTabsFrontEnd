"use client";
import { useState } from "react";
import Modal from "../components/Modal";
import NavBar from "../components/NavBar";

export default function Home() {
  const [tab, setTab] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<string | undefined>(undefined);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between dark:bg-slate-700">
      <NavBar />
      {tab ? (
        <>
          <div className="preserve-whitespace min-height:20px">{<br />} </div>
          <h1 className="font-bold text-3xl">{title}</h1>
          <div
            className="text-xs mb-4 flex justify-center dark:bg-slate-500"
            style={{
              fontFamily: "Courier New, Courier, monospace",
              width: "1000px",
            }}
          >
            <pre>
              <br />
              {tab}
            </pre>
          </div>
        </>
      ) : undefined}
      <Modal setTab={setTab} setTitle={setTitle} />
      <div className="preserve-whitespace min-height:20px">{<br />} </div>
    </main>
  );
}
