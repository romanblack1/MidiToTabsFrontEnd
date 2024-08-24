"use client";

import NavBar from "../../components/NavBar";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col justify-around justify-items-center dark:bg-slate-700 h-screen">
      <NavBar />
      <div className="flex flex-col items-center justify-around">
        <div className="w-2/3">
          This wesbsite can translate a Midi file of your choosing into a guitar
          tab!
        </div>
        <br />
        <div className="w-2/3">
          Don&apos;t have a Midi file? Simply look up the Midi file of a
          specific song you wish to play, or browse through a list of free Midi
          files on websites like this: https://bitmidi.com/
        </div>
        <br />
        <div className="w-2/3">
          Have an audio file but not a midi file? Use this tool to convert the
          audio file: https://basicpitch.spotify.com/
        </div>
        <Link
          className="rounded-lg bg-gray-300 hover:bg-gray-400 dark:bg-neutral-800/30 dark:hover:bg-gray-600 transition-colors px-3 py-2"
          href="/"
        >
          <div className="font-2xl font-semibold">Home</div>
        </Link>
      </div>
    </main>
  );
}
