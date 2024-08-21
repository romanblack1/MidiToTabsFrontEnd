"use client";
import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import Image from "next/image";

export default function Home() {
  const [savedTabs, setSavedTabs] = useState<string[]>([
    "tab b",
    "tab d",
    "tab e",
  ]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState(null);

  //   const fetchUserData = async (userId: string) => {
  //     // Example API call to get user data
  //     const response = await fetch(`/api/get_my_tabs?userid=${userId}`);
  //     const data = await response.json();
  //     setUserData(data);
  //   };

  //   const deleteTab = async (userId: string) => {
  //     // Example API call to get user data
  //     const response = await fetch(`/api/delete_tab`);
  //     const data = await response.json();
  //     setUserData(data);
  //   };

  //   useEffect(() => {
  //     const storedUserId = localStorage.getItem("userId");
  //     setUserId(storedUserId);

  //     userId ? fetchUserData(userId) : null;
  //   }, []);

  //   if (!userId) {
  //     return <div>Loading...</div>;
  //   }

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
                  src={hoveredIndex === index ? "/trash.png" : "/saved.png"}
                  alt="saved tab"
                  className="dark:invert"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  width={24}
                  height={24}
                  onClick={() => {
                    setSavedTabs(savedTabs.filter((tab) => tab !== tabName));
                    // deleteTab(tabName);
                  }}
                />
              </div>
            </React.Fragment>
          ))}
          {userData}
        </div>
      </div>
    </main>
  );
}
