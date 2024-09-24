"use client";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import TabDisplay from "../components/TabDisplay";
import ModalButton from "../components/ModalButton";

export default function Home() {
  const [tab, setTab] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<string | undefined>(undefined);

  useEffect(() => {
    const storedTabTitle = localStorage.getItem("tabTitle");
    const storedTabContent = localStorage.getItem("tabContent");

    storedTabTitle ? setTitle(storedTabTitle) : null;
    storedTabContent ? setTab(storedTabContent) : null;
  }, []);

  return (
    <main className="flex flex-col justify-around dark:bg-slate-700 pt-14 pb-5 overflow-x-hidden min-h-screen">
      <NavBar setTab={setTab} setTitle={setTitle} />
      <div className="flex flex-col items-center justify-around w-screen pb-6">
        {tab && title ? <TabDisplay tab={tab} title={title} /> : null}
        <ModalButton setTab={setTab} setTitle={setTitle} />
      </div>
    </main>
  );
}
