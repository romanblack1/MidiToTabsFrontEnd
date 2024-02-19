'use client'

import Image from "next/image";
import { useState } from "react";
import Modal from "../../components/Modal";
import Head from 'next/head'
import LoginForm from '../../components/login-form'
import Link from 'next/link';


export default function Home() {

  const tabs = ["1", "3", "5", "6", "7", "11", "12", "18", "aaaaa", "aabaa"]
  const [tabSearch, setTabSearch] = useState<string[]>([])
  const handleTabSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value == '') {
      setTabSearch([])
      return false
    }
    else {
      setTabSearch(tabs.filter(w => w.includes(e.target.value)).slice(0, 4))
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between dark:bg-slate-700">
      <div className="bg-gray-200 w-full h-12 flex items-center px-6 dark:bg-slate-600">
        <Link className="mr-auto text-black text-2xl font-semibold dark:text-slate-800" href="/">
          Logo
        </Link>
        <p className="flex-grow text-center"> </p>
        <form>
          <div className="relative">
            <input className="dark:bg-slate-500" type="search" placeholder="Search" onChange={(e) => handleTabSearch(e)} />
          </div>
          {
            (tabSearch.length > 0) &&
            (<div className="absolute top-8 p-1 flex flex-col bg-slate-500">
              {
                tabSearch.map(s => (<span>{s}</span>))
              }

            </div>)
          }
        </form>
        <p className="flex-grow text-center"> </p>
        <p className="flex-grow text-center"> </p>
        <p className="flex-grow text-center text-black text-2xl font-semibold dark:text-slate-800">Browse</p>
        <Link className="ml-auto text-black text-2xl font-semibold dark:text-slate-800" href="/page2">
          Login
        </Link>
      </div>
      <div>
        <h1 className="font-bold text-2xl">Login</h1>
        <Link href="/">
          Go Home
        </Link>
      </div>
      <div>
        <LoginForm />
      </div>
      <div></div>
      <div></div>
      <div></div>
    </main>
  );
}
