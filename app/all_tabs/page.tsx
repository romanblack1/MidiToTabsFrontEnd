"use client";
import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import Image from "next/image";
import Link from "next/link";

type SavedTab = {
  tabs: Tab;
};

type Tab = {
  name: string;
  id: number;
  tab: string;
  created_by: string;
  created_at: string;
};

export default function Home() {
  const [allTabs, setAllTabs] = useState<Tab[]>([]);
  const [savedTabs, setSavedTabs] = useState<SavedTab[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

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
    setUserId(storedUserId);
    storedUserId ? fetchSavedTabs(storedUserId) : null;
  }, []);

  // Example API call to create connection
  const createConnection = async (userId: string, tabId: string) => {
    const response = await fetch(
      `/api/connections?user_id=${userId}&tab_id=${tabId}`,
      {
        method: "POST",
      }
    );
    const data = await response.text();
    console.log(data);
  };

  // Example API call to create connection
  const deleteConnection = async (userId: string, tabId: string) => {
    const response = await fetch(
      `/api/connections?user_id=${userId}&tab_id=${tabId}`,
      {
        method: "DELETE",
      }
    );
    const data = await response.text();
    console.log(data);
  };

  const toggleSaved = (userId: string, tab: Tab) => {
    if (savedTabs.some((savedTab) => savedTab.tabs.id === tab.id)) {
      // Remove tab if it's already saved
      setSavedTabs(savedTabs.filter((cur_tab) => cur_tab.tabs.id !== tab.id));
      deleteConnection(userId, tab.id.toString());
    } else {
      // Add tab to savedTabs
      setSavedTabs([...savedTabs, { tabs: tab }]);
      createConnection(userId, tab.id.toString());
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
        {userId ? (
          <div className="grid grid-cols-3 gap-3">
            <span>Name</span>
            <span>Created By</span>
            <span className="ml-auto">Saved</span>

            {allTabs.map((all_tab, index) => (
              <React.Fragment key={index}>
                <Link className="" href="/">
                  <button
                    onClick={() => {
                      console.log("button clicked");
                      localStorage.setItem("tabTitle", all_tab.name);
                      localStorage.setItem("tabContent", all_tab.tab);
                    }}
                  >
                    {all_tab.name}
                  </button>
                </Link>

                <span>{all_tab.created_by + ": " + all_tab.created_at}</span>
                <div className="ml-auto">
                  {savedTabs.some(
                    (savedTab) => savedTab.tabs.id === all_tab.id
                  ) ? (
                    <Image
                      src="/saved.png"
                      alt="saved tab"
                      className="dark:invert"
                      width={24}
                      height={24}
                      onClick={() => {
                        toggleSaved(userId, all_tab);
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
                        toggleSaved(userId, all_tab);
                      }}
                      priority
                    />
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <span>Name</span>
            <span>Created By</span>

            {allTabs.map((all_tab, index) => (
              <React.Fragment key={index}>
                <Link className="" href="/">
                  <button
                    onClick={() => {
                      localStorage.setItem("tabTitle", all_tab.name);
                      localStorage.setItem("tabContent", all_tab.tab);
                    }}
                  >
                    {all_tab.name}
                  </button>
                </Link>

                <span>{all_tab.created_by + ": " + all_tab.created_at}</span>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
