"use client";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import NavBar from "../../components/NavBar";
import Image from "next/image";
import Link from "next/link";

// Define formatting options for a date
const options: Intl.DateTimeFormatOptions = {
  month: "numeric",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: true, // Use 12-hour clock
  timeZoneName: "short", // Include the short time zone name (e.g., PST)
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

const compareDates = (a: Tab, b: Tab) => {
  const dateA = new Date(a.created_at.replace(" ", "T"));
  const dateB = new Date(b.created_at.replace(" ", "T"));
  return dateB.getTime() - dateA.getTime(); // Newest to Oldest
};

// function to sort tabs based on selected option
const compareFn = (sortOption: string) => (a: Tab, b: Tab) => {
  switch (sortOption) {
    case "Newest to Oldest":
    default:
      return compareDates(a, b);
    case "Oldest to Newest":
      return compareDates(b, a);
    case "A-Z":
      return a.name.localeCompare(b.name);
    case "Z-A":
      return b.name.localeCompare(a.name);
  }
}

// function to filter tabs based on search bar query
const filterFn = (searchQuery: string) => (a: Tab) => {
    return a.name.toLowerCase().includes(searchQuery);
}

export default function Home() {
  const [allTabs, setAllTabs] = useState<Tab[]>([]);
  const [savedTabs, setSavedTabs] = useState<SavedTab[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  // set default sort state
  const [sortOption, setSortOption] = useState<string>("Newest to Oldest");
  const [searchQuery, setSearchQuery] = useState('');

  // create shallow copy of allTabs to sort
  const sortedAllTabs = useMemo(() => {
    return allTabs.slice().sort(compareFn(sortOption));
  }, [allTabs, sortOption]);

  // create shallow copy of sortedAllTabs to filter
  const filteredSortedAllTabs = useMemo(() => {
    return sortedAllTabs.filter(filterFn(searchQuery));
  }, [sortedAllTabs, searchQuery]);

  const fetchAllTabs = async () => {
    // Example API call to get user data
    const response = await fetch("/api/get_all_tabs", {
      method: "GET",
    });
    const data = await response.json();
    setAllTabs(data);
  };

  const fetchSavedTabs = async (userId: string) => {
    // Example API call to get user data
    const response = await fetch(`/api/get_my_tabs?user_id=${userId}`, {
      method: "GET",
    });
    const data = await response.json();
    setSavedTabs(data);
  };

  // set tabs with data from database
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

  const formatDate = (dateString: string): string => {
    const isoTimestamp = dateString.replace(" ", "T"); // "2024-08-21T23:05:57.581+00"
    const date = new Date(isoTimestamp); // Create a Date object from the ISO timestamp
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", isoTimestamp);
      return "Invalid date";
    }
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  // Handle dropdown change with type annotation
  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  // Function to handle search input changes
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
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

        <div className="mb-4 flex items-center">
          {/* Dropdown for sorting */}
          <div className="mb-4">
            <label htmlFor="sortOptions" className="mr-2">Sort by:</label>
            <select
              style={{ color: 'black', lineHeight: '1.5'}}
              id="sortOptions"
              value={sortOption}
              onChange={handleSortChange}
              className="p-2 border rounded"
            >
              <option value="Newest to Oldest">Newest to Oldest</option>
              <option value="Oldest to Newest">Oldest to Newest</option>
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
            </select>
          </div>
          
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search tabs..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="p-2 border rounded ml-6"
              style={{ color: 'black', lineHeight: '1.5', position: 'relative', zIndex: '0'}}
            />
          </div>
        </div>

        {userId ? (
          <div className="grid grid-cols-3 gap-3">
            <span>Name</span>
            <span>Created By</span>
            <span className="ml-auto">Saved</span>

            {filteredSortedAllTabs.map((allTab) => (
              <React.Fragment key={allTab.id}>
                <Link
                  className=""
                  href="/"
                  onClick={() => {
                    localStorage.setItem("tabTitle", allTab.name);
                    localStorage.setItem("tabContent", allTab.tab);
                  }}
                >
                  {allTab.name}
                </Link>
                <span>
                  {allTab.created_by + " on " + formatDate(allTab.created_at)}
                </span>
                <div className="ml-auto">
                  {savedTabs.some(
                    (savedTab) => savedTab.tabs.id === allTab.id
                  ) ? (
                    <Image
                      src="/saved.png"
                      alt="saved tab"
                      className="dark:invert"
                      width={24}
                      height={24}
                      onClick={() => {
                        toggleSaved(userId, allTab);
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
                        toggleSaved(userId, allTab);
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

            {filteredSortedAllTabs.map((allTab) => (
              <React.Fragment key={allTab.id}>
                <Link
                  className=""
                  href="/"
                  onClick={() => {
                    localStorage.setItem("tabTitle", allTab.name);
                    localStorage.setItem("tabContent", allTab.tab);
                  }}
                >
                  {allTab.name}
                </Link>
                <span>
                  {allTab.created_by + " on " + formatDate(allTab.created_at)}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
