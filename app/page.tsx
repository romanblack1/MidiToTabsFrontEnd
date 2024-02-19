'use client'

import Image from "next/image";
import { useState } from "react";
import Modal from "../components/Modal";
import Head from 'next/head'
import LoginForm from '../components/login-form'
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
      <Modal />

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Learn{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Templates{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Explore starter templates for Next.js.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  );
}
