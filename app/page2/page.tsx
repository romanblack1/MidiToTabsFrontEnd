'use client'

import LoginForm from '../../components/login-form'
import Link from 'next/link';
import TopBar from "../../components/top-bar";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between dark:bg-slate-700">
      <TopBar/>
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
