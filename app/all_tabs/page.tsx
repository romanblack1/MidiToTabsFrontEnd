"use client";
import React, { useState } from "react";
import NavBar from "../../components/NavBar";
import Image from "next/image";

export default function Home() {
  const all_tabs = ["tab aaaaaaaaaaaa", "tab b", "tab c", "tab c"];
  const [savedTabs, setSavedTabs] = useState<string[]>(["tab b"]);

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
        <h1 className="font-bold text-3xl m-3">All Tabs</h1>
        <div className="grid grid-cols-2 gap-3">
          {all_tabs.map((tabName, index) => (
            <React.Fragment key={index}>
              <div>{tabName}</div>
              <div className="ml-auto">
                {savedTabs.includes(tabName) ? (
                  <Image
                    src="/saved.png"
                    alt="saved tab"
                    className="dark:invert"
                    width={24}
                    height={24}
                    onClick={() => {
                      toggleSaved(tabName);
                    }}
                  />
                ) : (
                  <Image
                    src="/not_saved.png"
                    alt="unsaved tab"
                    className="dark:invert"
                    width={24}
                    height={24}
                    onClick={() => {
                      toggleSaved(tabName);
                    }}
                    priority
                  />
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </main>
  );
}
