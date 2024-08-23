"use client";
import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import Image from "next/image";
import Link from "next/link";

type SavedTab = {
  tab: Tab;
};

type Tab = {
  name: string;
  id: number;
  tab: string;
  created_by: string;
  created_at: string;
};

export default function Home() {
  const [savedTabs, setSavedTabs] = useState<SavedTab[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchUserData = async (userId: string) => {
    // Example API call to get user data
    const response = await fetch(`/api/get_my_tabs?user_id=${userId}`, {
      method: "GET",
    });
    const data = await response.json();
    console.log(data);
    setSavedTabs(data);
  };

  const deleteTab = async (userId: string) => {
    // Example API call to get user data
    const response = await fetch(`/api/delete_tab`);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
    storedUserId ? fetchUserData(storedUserId) : null;
  }, []);

  if (!userId) {
    return <div>Loading...</div>;
  }

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
        <div className="grid grid-cols-3 gap-3">
          <span>Name</span>
          <span>Created By</span>
          <span className="ml-auto">Saved</span>

          {savedTabs.map((savedTab, index) => (
            <React.Fragment key={index}>
              <Link className="" href="/">
                <button
                  onClick={() => {
                    localStorage.setItem("tabTitle", savedTab.tab.name);
                    localStorage.setItem("tabContent", savedTab.tab.tab);
                  }}
                >
                  {savedTab.tab.name}
                </button>
              </Link>
              <span>
                {savedTab.tab.created_by + ": " + savedTab.tab.created_at}
              </span>
              <div className="ml-auto">
                <Image
                  src={hoveredIndex === index ? "/trash.png" : "/saved.png"}
                  alt="saved tab"
                  className="dark:invert"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  width={24}
                  height={24}
                  onClick={() => {
                    setSavedTabs(
                      savedTabs.filter((tab) => tab.tab.id !== savedTab.tab.id)
                    );
                    // todo: deleteTab(tabName);
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
