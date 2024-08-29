import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "./NavBar.css";

interface NavBarProps {
  setTab?: React.Dispatch<React.SetStateAction<string | undefined>>;
  setTitle?: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function NavBar({ setTab, setTitle }: NavBarProps): JSX.Element {
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
        <Link className="mr-4" href="/all_tabs">
          All Tabs
        </Link>
        {username ? (
          <Link className="mr-4" href={`/${userId}`}>
            My Tabs
          </Link>
        ) : null}
        <Link className="" href="/login">
          {username ? username : "Login"}
        </Link>
      </div>
    </div>
  );
}
