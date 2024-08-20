"use client";
import React, { useState } from "react";
import NavBar from "../../components/NavBar";
import Image from "next/image";

export default function Home() {
  const [savedTabs, setSavedTabs] = useState<string[]>(["tab b"]);
  const [hovered, setHovered] = useState(false);

  const toggleSaved = (tabName: string) => {
    if (savedTabs.includes(tabName)) {
      // Remove tab if it's already saved
      setSavedTabs(savedTabs.filter((tab) => tab !== tabName));
    } else {
      // Add tab to savedTabs
      setSavedTabs([...savedTabs, tabName]);
    }
  };

  return (
    <main
      className="flex flex-col dark:bg-slate-700 mt-14 mb-5 "
      style={{
        minHeight: "calc(100vh - 4.75rem)",
      }}
    >
      <NavBar />
      <div className="flex flex-col items-center justify-around w-screen">
        <h1 className="font-bold text-3xl m-3">My Saved Tabs</h1>
        <div className="grid grid-cols-2 gap-3">
          {savedTabs.map((tabName, index) => (
            <React.Fragment key={index}>
              <div>{tabName}</div>
              <div className="ml-auto">
                <Image
                  src={hovered ? "/trash.png" : "/saved.png"}
                  alt="saved tab"
                  className="dark:invert"
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  width={24}
                  height={24}
                  onClick={() => {
                    setSavedTabs(savedTabs.filter((tab) => tab !== tabName));
                  }}
                />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </main>
  );
}
