"use client";
import { useState } from "react";
import Modal from "../components/Modal";
import NavBar from "../components/NavBar";
import PDFTab from "../components/PDFTab";
import { PDFDownloadLink } from "@react-pdf/renderer";

export default function Home() {
  const [tab, setTab] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<string | undefined>(undefined);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between dark:bg-slate-700">
      <NavBar setTab={setTab} setTitle={setTitle} />
      {tab && title ? (
        <>
          <div className="preserve-whitespace min-height:20px">{<br />} </div>
          <h1 className="font-bold text-3xl">{title}</h1>
          <div
            className="text-xs mb-4 flex justify-center"
            style={{
              fontFamily: "Courier New, Courier, monospace",
            }}
          >
            <pre>
              <br />
              {tab}
            </pre>
          </div>

          <PDFDownloadLink
            document={<PDFTab title={title} tab={tab} />}
            fileName={title}
          >
            {({ loading }) =>
              loading ? (
                "loading..."
              ) : (
                <button className="rounded-lg bg-gray-300 px-5 py-2 transition-colors hover:border-gray-200 hover:bg-gray-400 dark:border-neutral-500 dark:bg-gray-600">
                  Download Tab as PDF
                </button>
              )
            }
          </PDFDownloadLink>
          <div className="preserve-whitespace min-height:20px">{<br />} </div>
        </>
      ) : undefined}
      <Modal setTab={setTab} setTitle={setTitle} />
      <div className="preserve-whitespace min-height:20px">{<br />} </div>
    </main>
  );
}
