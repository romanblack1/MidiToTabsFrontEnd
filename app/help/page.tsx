"use client";

import { useState } from "react";
import NavBar from "../../components/NavBar";
import Link from "next/link";
import FAQ from "../../components/FAQ";

export default function Home() {
  const [faqs, setfaqs] = useState([
    {
      question: "What can this website do?",
      answer:
        "This wesbsite can translate a Midi file of your choosing into a guitar tab!",
      open: true,
    },
    {
      question: "Don't have a Midi file? ",
      answer:
        "Simply look up the Midi file of a specific song you wish to play, or browse through a list of free Midifiles on websites like this: https://bitmidi.com/",
      open: false,
    },
    {
      question: "Which track should I choose to create a tab out of?",
      answer:
        "Unsure which track to choose? Use this tool to identify the sounds each track contains: https://signal.vercel.app/edit. Just upload your midi file and click through the displayed tracks to figure out which sounds you want to be tabulated! The tracks will display what instrument is being played, so pick that one from the list given to you when generating your tab.",
      open: false,
    },
    {
      question: "Can I translate a non-Midi music file?",
      answer:
        "Use this tool to convert the audio file: https://basicpitch.spotify.com/",
      open: false,
    },
    {
      question: "What does logging in do?",
      answer:
        "Logging in credits you with tabs you create, and allows you to save specific tabs from the all tabs page to your account",
      open: false,
    },
  ]);

  const toggleFAQ = (index: number) => {
    setfaqs(
      faqs.map((faq, i) => {
        if (i === index) {
          faq.open = !faq.open;
        } else {
          faq.open = false;
        }

        return faq;
      })
    );
  };

  return (
    <main className="flex flex-col justify-center justify-items-center items-center dark:bg-slate-700 mt-14 mb-5">
      <NavBar />
      <h1 className="font-bold text-3xl">FAQs</h1>
      <div className="faqs">
        {faqs.map((faq, i) => (
          <FAQ faq={faq} index={i} toggleFAQ={toggleFAQ} key={i} />
        ))}
      </div>
      <Link
        className="rounded-lg bg-gray-300 hover:bg-gray-400 dark:bg-neutral-800/30 dark:hover:bg-gray-600 transition-colors px-3 py-2"
        href="/"
      >
        <div className="font-2xl font-semibold">Home</div>
      </Link>
    </main>
  );
}
