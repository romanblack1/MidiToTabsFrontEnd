"use client";
import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import Image from "next/image";

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);

  // const [allTabs, setAllTabs] = useState<string[]>([]);
  // const [savedTabs, setSavedTabs] = useState<string[]>([]);

  const fetchAllTabs = async () => {
    // Example API call to get user data
    const response = await fetch("/api/get_all_tabs", {
      method: "GET",
    });

    const data = await response.json();
    console.log(data);
    // setAllTabs(data);
  };
  const fetchSavedTabs = async (userId: string) => {
    // Example API call to get user data
    const response = await fetch(`/api/get_my_tabs?userid=${userId}`, {
      method: "GET",
    });
    const data = await response.json();
    console.log(data);
    // setSavedTabs(data);
  };

  useEffect(() => {
    fetchAllTabs();

    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
    storedUserId ? fetchSavedTabs(storedUserId) : null;
  });

  // const toggleSaved = (tabName: string) => {
  //   if (savedTabs.includes(tabName)) {
  //     // Remove tab if it's already saved
  //     setSavedTabs(savedTabs.filter((tab) => tab !== tabName));
  //   } else {
  //     // Add tab to savedTabs
  //     setSavedTabs([...savedTabs, tabName]);
  //   }
  // };

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
          hello
          {/* {allTabs.map((tabName, index) => (
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
          ))} */}
        </div>
      </div>
    </main>
  );
}
