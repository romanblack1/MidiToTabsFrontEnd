"use client";
import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import Image from "next/image";
import Link from "next/link";

type Tab = {
  tab: SavedTab;
};

type SavedTab = {
  name: string;
  tab_id: number;
  tab: string;
  created_by: string;
  created_at: string;
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
    const response = await fetch(`/api/get_my_tabs?user_id=${userId}`, {
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
  }, []);

  const toggleSaved = (tab: SavedTab) => {
    if (savedTabs.some((savedTab) => savedTab.tab_id === tab.tab_id)) {
      // Remove tab if it's already saved
      setSavedTabs(
        savedTabs.filter((cur_tab) => cur_tab.tab_id !== tab.tab_id)
      );
      // todo: deleteTab(tabName);
    } else {
      // Add tab to savedTabs
      setSavedTabs([...savedTabs, tab]);
      // todo: saveTab(tabName);
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

          {allTabs.map((all_tab, index) => (
            <React.Fragment key={index}>
              <Link className="" href="/">
                <button
                  onClick={() => {
                    localStorage.setItem("tabTitle", all_tab.tab.name);
                    localStorage.setItem("tabContent", all_tab.tab.tab);
                  }}
                >
                  {all_tab.tab.name}
                </button>
              </Link>

              <span>
                {all_tab.tab.created_by + ": " + all_tab.tab.created_at}
              </span>
              <div className="ml-auto">
                {savedTabs.some(
                  (savedTab) => savedTab.tab_id === all_tab.tab.tab_id
                ) ? (
                  <Image
                    src="/saved.png"
                    alt="saved tab"
                    className="dark:invert"
                    width={24}
                    height={24}
                    onClick={() => {
                      toggleSaved(all_tab.tab);
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
                      toggleSaved(all_tab.tab);
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
