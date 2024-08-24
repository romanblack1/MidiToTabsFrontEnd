"use client";
import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import Image from "next/image";
import Link from "next/link";

// Define formatting options for a date
const options: Intl.DateTimeFormatOptions = {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true, // Use 12-hour clock
    timeZoneName: 'short' // Include the short time zone name (e.g., PST)
};

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
  const [savedTabs, setSavedTabs] = useState<SavedTab[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchUserData = async (userId: string) => {
    // Example API call to get user data
    const response = await fetch(`/api/get_my_tabs?user_id=${userId}`, {
      method: "GET",
    });
    const data = await response.json();
    setSavedTabs(data);
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
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
    storedUserId ? fetchUserData(storedUserId) : null;
  }, []);

  if (!userId) {
    return <div>Loading...</div>;
  }

  const formatDate = (dateString: string): string => {
    const isoTimestamp = dateString.replace(' ', 'T'); // "2024-08-21T23:05:57.581+00"
    const date = new Date(isoTimestamp); // Create a Date object from the ISO timestamp
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', isoTimestamp);
      return 'Invalid date';
    }
    return new Intl.DateTimeFormat('en-US', options).format(date);
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
              <Link
                className=""
                href="/"
                onClick={() => {
                  console.log("link clicked");
                  localStorage.setItem("tabTitle", savedTab.tabs.name);
                  localStorage.setItem("tabContent", savedTab.tabs.tab);
                }}
              >
                {savedTab.tabs.name}
              </Link>
              <span>
                {savedTab.tabs.created_by + " on " + formatDate(savedTab.tabs.created_at)}
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
                      savedTabs.filter(
                        (tab) => tab.tabs.id !== savedTab.tabs.id
                      )
                    );
                    deleteConnection(userId, savedTab.tabs.id.toString());
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
