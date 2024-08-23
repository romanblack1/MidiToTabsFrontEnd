"use client";
import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import Image from "next/image";

type Tab = {
  name: string;
  created_at: string;
  tab_id: number;
  user_id: number;
};

type SavedTab = {
  name: string;
  created_at: string;
  tab_id: number;
  user_id: number;
};

export default function Home() {
  const [allTabs, setAllTabs] = useState<Tab[]>([]);
  const [savedTabs, setSavedTabs] = useState<SavedTab[]>([]);

  const fetchAllTabs = async () => {
    // Example API call to get user data
    const response = await fetch("/api/get_all_tabs", {
      method: "GET",
    });

    const data = await response.json();
    console.log(data);
    setAllTabs(data);
  };
  const fetchSavedTabs = async (userId: string) => {
    // Example API call to get user data
    const response = await fetch(`/api/get_my_tabs?userid=${userId}`, {
      method: "GET",
    });
    const data = await response.json();
    console.log(data);
    setSavedTabs(data);
  };

  useEffect(() => {
    fetchAllTabs();

    const storedUserId = localStorage.getItem("userId");
    storedUserId ? fetchSavedTabs(storedUserId) : null;
  });

  const toggleSaved = (tab: Tab) => {
    if (savedTabs.some((savedTab) => savedTab.tab_id === tab.tab_id)) {
      // Remove tab if it's already saved
      setSavedTabs(
        savedTabs.filter((cur_tab) => cur_tab.tab_id !== tab.tab_id)
      );
    } else {
      // Add tab to savedTabs
      setSavedTabs([...savedTabs, tab]);
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
        <div className="grid grid-cols-3 gap-3">
          <span>Name</span>
          <span>Created By</span>
          <span className="ml-auto">Saved</span>

          {allTabs.map((tab, index) => (
            <React.Fragment key={index}>
              <button
                onClick={() => {
                  // if (setTab && setTitle) {
                  //   setTab(undefined);
                  //   setTitle(undefined);
                  // }
                }}
              >
                {tab.name}
              </button>
              <div className="ml-auto">
                {savedTabs.some(
                  (savedTab) => savedTab.tab_id === tab.tab_id
                ) ? (
                  <Image
                    src="/saved.png"
                    alt="saved tab"
                    className="dark:invert"
                    width={24}
                    height={24}
                    onClick={() => {
                      toggleSaved(tab);
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
                      toggleSaved(tab);
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
