"use client";

import { useEffect, useState } from "react";
import LoginCard from "../../components/LoginCard";
import NavBar from "../../components/NavBar";

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Access localStorage only in the browser
    const storedUsername = localStorage.getItem("username");

    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <main className="flex flex-col justify-around dark:bg-slate-700 h-screen">
      <NavBar />
      <div className="flex flex-col items-center justify-around w-screen">
        <LoginCard />
      </div>
    </main>
  );
}
