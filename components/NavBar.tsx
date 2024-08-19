import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "./NavBar.css";

interface NavBarProps {
  setTab?: React.Dispatch<React.SetStateAction<string | undefined>>;
  setTitle?: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function NavBar({ setTab, setTitle }: NavBarProps): JSX.Element {
  const tabs = ["1", "3", "5", "6", "7", "11", "12", "18", "aaaaa", "aabaa"];
  const [tabSearch, setTabSearch] = useState<string[]>([]);
  const handleTabSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value == "") {
      setTabSearch([]);
      return false;
    } else {
      setTabSearch(tabs.filter((w) => w.includes(e.target.value)).slice(0, 4));
    }
  };

  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Access localStorage only in the browser
    const storedUserId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("username");

    if (storedUserId) {
      setUserId(storedUserId);
    }
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="navbar">
      <Link className="" href="/">
        <Image
          src="/logo.png"
          alt="logo"
          width={40}
          height={40}
          priority
          onClick={() => {
            if (setTab && setTitle) {
              setTab(undefined);
              setTitle(undefined);
            }
          }}
        />
      </Link>
      <Link className="text-xl font-normal text-center" href="/help">
        Getting Started/Help
      </Link>
      <div className="flex flex-row text-2xl ml-auto font-semibold">
        {username ? (
          <div>
            <Link className="mr-4" href="/tabs">
              All Tabs
            </Link>
            <Link className="mr-4" href="/id">
              My Tabs
            </Link>
          </div>
        ) : null}
        <Link className="" href="/login">
          {username ? username : "Login"}
        </Link>
      </div>
    </div>
  );
}
