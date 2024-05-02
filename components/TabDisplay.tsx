import React, { useState, SetStateAction } from "react";
import PDFTab from "../components/PDFTab";
import { PDFDownloadLink } from "@react-pdf/renderer";

interface ModalProps {
  tab: string;
  title: string;
}

export default function TabDisplay({ tab, title }: ModalProps): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-between w-11/12">
      <h1 className="font-bold text-3xl m-3">{title}</h1>
      <div
        className="text-xs flex overflow-x-auto max-w-2/3"
        style={{
          fontFamily: "Courier New, Courier, monospace",
        }}
      >
        <pre>{tab}</pre>
      </div>

      <PDFDownloadLink
        document={<PDFTab title={title} tab={tab} />}
        fileName={title}
      >
        {({ loading }) =>
          loading ? (
            "loading..."
          ) : (
            <button className="rounded-lg bg-gray-300 px-5 py-2 transition-colors hover:border-gray-200 hover:bg-gray-400 dark:border-neutral-500 dark:bg-gray-600 m-2 mb-4">
              Download Tab as PDF
            </button>
          )
        }
      </PDFDownloadLink>
    </div>
  );
}
