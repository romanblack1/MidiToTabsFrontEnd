import React, { useState } from "react";
import "./Modal.css";
import Image from "next/image";

interface AdvancedGeneratorModalProps {
  setModalDisplay: React.Dispatch<React.SetStateAction<string>>;

  setTab: React.Dispatch<React.SetStateAction<string | undefined>>;
  setTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
  file: File;
}

export default function AdvancedGeneratorModal({
  setModalDisplay,
  setTab,
  setTitle,
  file,
}: AdvancedGeneratorModalProps): JSX.Element {
  const [tuningOffset, setTuningOffset] = useState("0");
  const [capoOffset, setCapoOffset] = useState("0");
  const [channelSelected, setChannelSelected] = useState("-1");

  const handleTuningButtonClick = (button: string) => {
    setTuningOffset(button);
  };

  async function handleOnSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    if (!file) {
      alert("Must Submit A Midi File (.mid)");
      return;
    }

    const midiFileFormData = new FormData();
    if (!file) {
      console.error("No MIDI file provided");
    } else {
      // Append midiFile to FormData
      midiFileFormData.append("midiFile", file);
      // Append channelSelected, tuningOffset, and capoOffset to FormData
      midiFileFormData.append("channelSelected", channelSelected);
      midiFileFormData.append("tuningOffset", tuningOffset);
      midiFileFormData.append("capoOffset", capoOffset);
    }
    //api call
    const res = await fetch("/api", {
      method: "POST",
      body: midiFileFormData,
    });
    const title_string = file.name.replace(".mid", "");
    let modified_title = title_string.replace(/_/g, " ").replace(/-/g, " ");
    setTitle(modified_title);
    setTab(await res.text());
    setModalDisplay("0");
  }

  const handleCapoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCapoOffset(e.target.value); // Update capoOffset state with selected value
  };

  const handleChannelSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChannelSelected(e.target.value); // Update channelSelected state with selected value
  };

  return (
    <div className="modal">
      <div onClick={() => setModalDisplay("0")} className="overlay" />
      <div className="modal-content flex flex-col items-center">
        <div className="return-home">
          <Image
            className="cursor-pointer"
            src="/back_icon.png"
            alt="back"
            width={15}
            height={15}
            priority
            onClick={() => setModalDisplay("generator")}
          />
        </div>

        <span className="title-modal">Advanced Settings</span>

        <button className="close-modal" onClick={() => setModalDisplay("0")}>
          X
        </button>

        <div className="flex justify-start w-full mb-1">Tuning:</div>
        <div className="flex flex-row justify-center">
          <button
            className={
              "rounded-lg px-5 py-3 transition-colors " +
              (tuningOffset === "0"
                ? "bg-gray-400 dark:bg-gray-600"
                : "bg-gray-300 dark:bg-gray-400")
            }
            onClick={() => handleTuningButtonClick("0")}
          >
            Default
          </button>
          <button
            className={
              "rounded-lg px-5 py-3 transition-colors " +
              (tuningOffset === "-2"
                ? "bg-gray-400 dark:bg-gray-600"
                : "bg-gray-300 dark:bg-gray-400")
            }
            onClick={() => handleTuningButtonClick("-2")}
            style={{ marginLeft: "10px", marginRight: "10px" }}
          >
            Drop D
          </button>
          <button
            className={
              "rounded-lg px-5 py-3 transition-colors " +
              (tuningOffset === "-4"
                ? "bg-gray-400 dark:bg-gray-600"
                : "bg-gray-300 dark:bg-gray-400")
            }
            onClick={() => handleTuningButtonClick("-4")}
          >
            Drop C
          </button>
        </div>

        <div className="mt-3 flex flex-row justify-between w-full">
          <p>Capo on fret:</p>
          <select
            className=" dark:bg-gray-500"
            value={capoOffset}
            onChange={handleCapoChange}
          >
            <option value="0">No Capo</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
          </select>
        </div>

        <div className="mt-3 mb-3 flex flex-row justify-between w-full">
          <p>Channel to Translate:</p>
          <select
            className=" dark:bg-gray-500"
            value={channelSelected}
            onChange={handleChannelSelected}
          >
            <option value="-1">Detect</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
          </select>
        </div>

        <button
          className="rounded-lg bg-gray-300 px-5 py-2 transition-colors hover:border-gray-200 hover:bg-gray-400 dark:border-neutral-500 dark:bg-gray-600"
          onClick={handleOnSubmit}
        >
          Generate Tab
        </button>
      </div>
    </div>
  );
}
