import { useState } from "react";
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

  return (
    <div className="navbar">
      <Link className="mr-auto" href="/">
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
      {/* <p className="flex-grow text-center"> </p>
      <form>
        <div className="relative">
          <input
            className="dark:bg-slate-500"
            type="search"
            placeholder="Search"
            onChange={(e) => handleTabSearch(e)}
          />
        </div>
        {tabSearch.length > 0 && (
          <div className="absolute top-8 p-1 flex flex-col bg-slate-500">
            {tabSearch.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        )}
      </form> */}
      {/* <p className="flex-grow text-center"> </p>
      <p className="flex-grow text-center"> </p>
      <p className="flex-grow text-center text-black text-2xl font-semibold dark:text-slate-800">
        Browse
      </p> */}
      <Link className="ml-auto text-2xl font-semibold" href="/login">
        Login
      </Link>
    </div>
  );
}
