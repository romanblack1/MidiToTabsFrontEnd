import React, { useState, SetStateAction } from "react";
import PDFTab from "../components/PDFTab";
import { PDFDownloadLink } from "@react-pdf/renderer";

interface ModalProps {
  tab: string;
  title: string;
}

export default function TabDisplay({ tab, title }: ModalProps): JSX.Element {
  return (
    <>
      <div className="preserve-whitespace min-height:20px">{<br />} </div>
      <h1 className="font-bold text-3xl">{title}</h1>
      <div
        className="text-xs mb-4 flex justify-center overflow-scroll w-3/4"
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
    </>
  );
}
