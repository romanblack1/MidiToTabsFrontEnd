import React, { useState, SetStateAction } from "react";
import "./Modal.css";
import Image from "next/image";

interface ModalProps {
  setTab: React.Dispatch<React.SetStateAction<string | undefined>>;
  setTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function Modal({ setTab, setTitle }: ModalProps): JSX.Element {
  const [modal, setModal] = useState(false);
  const [file, setFile] = useState<File | undefined>();
  const [tuningOffset, setTuningOffset] = useState("0");
  const [capoOffset, setCapoOffset] = useState("0");
  const [channelSelected, setChannelSelected] = useState("-1");

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleButtonClick = (button: string) => {
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
    let title_string = file.name.replace(".mid", "");
    setTitle(title_string.replace("_", " "));
    setTab(await res.text());
    setModal(false);
  }

  const handleCapoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCapoOffset(e.target.value); // Update capoOffset state with selected value
  };

  const handleChannelSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChannelSelected(e.target.value); // Update channelSelected state with selected value
  };

  async function handleFileChange(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault();

    const target = e.target as HTMLInputElement & { files: FileList };

    setFile(target.files[0]);
  }

  return (
    <>
      <button
        className="group rounded-lg bg-gray-300 px-5 py-4 transition-colors hover:border-gray-200 hover:bg-gray-400 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 flex flex-col justify-center items-center"
        style={{ width: "500px", height: "200px" }}
        onClick={toggleModal}
      >
        <h2 className={`mb-3 text-2xl font-semibold`}>Upload a Midi File</h2>
        <Image
          src="/upload_icon.png"
          alt="Upload Midi File Here"
          className="dark:invert"
          width={80}
          height={80}
          priority
        />
      </button>
      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <span className="title-modal">Create Guitar Tab </span>
            <span className="sub-title-modal">(.mid files only)</span>
            <br></br>
            <p>Tuning: </p>
            <div className="flex flex-row justify-center">
              <button
                className={
                  "rounded-lg px-5 py-3 transition-colors " +
                  (tuningOffset === "0" ? "bg-gray-400" : "bg-gray-300")
                }
                onClick={() => handleButtonClick("0")}
              >
                Default
              </button>
              <button
                className={
                  "rounded-lg px-5 py-3 transition-colors " +
                  (tuningOffset === "-2" ? "bg-gray-400" : "bg-gray-300")
                }
                onClick={() => handleButtonClick("-2")}
                style={{ marginLeft: "10px", marginRight: "10px" }}
              >
                Drop D
              </button>
              <button
                className={
                  "rounded-lg px-5 py-3 transition-colors " +
                  (tuningOffset === "-4" ? "bg-gray-400" : "bg-gray-300")
                }
                onClick={() => handleButtonClick("-4")}
              >
                Drop C
              </button>
            </div>

            <div className="mt-3 mb-3 flex flex-row justify-between">
              <p>Capo on fret:</p>
              <select value={capoOffset} onChange={handleCapoChange}>
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

            <div className="mt-3 mb-3 flex flex-row justify-between">
              <p>Track to Translate:</p>
              <select value={channelSelected} onChange={handleChannelSelected}>
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

            <form>
              <input
                type="file"
                name="midi_file"
                accept=".mid"
                onChange={handleFileChange}
                required
              />
              <button
                className="rounded-lg bg-gray-300 px-5 py-2 transition-colors hover:border-gray-200 hover:bg-gray-400 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                onClick={handleOnSubmit}
              >
                Submit
              </button>
            </form>

            <button className="close-modal" onClick={toggleModal}>
              X
            </button>
          </div>
        </div>
      )}
    </>
  );
}
