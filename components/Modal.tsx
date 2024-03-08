import React, { useState, SetStateAction } from "react";
import "./Modal.css";
import Image from "next/image";

interface ModalProps {
  setTab: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function Modal({ setTab }: ModalProps): JSX.Element {
  const [modal, setModal] = useState(false);
  const [file, setFile] = useState<File | undefined>();
  const [tuningOffset, setTuningOffset] = useState("0");
  const [capoOffset, setCapoOffset] = useState("0");

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleButtonClick = (button: string) => {
    setTuningOffset(button);
  };

  async function handleOnSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    file ? console.log("name", file) : console.log("missing midi file");

    const midiFileFormData = new FormData();
    if (!file) {
      console.error("No MIDI file provided");
    } else {
      // Append midiFile to FormData
      midiFileFormData.append("midiFile", file);
      // Append tuningOffset and capoOffset to FormData
      midiFileFormData.append("tuningOffset", tuningOffset);
      midiFileFormData.append("capoOffset", capoOffset);
    }
    //api call
    const res = await fetch("http://localhost:3000/api", {
      method: "POST",
      body: midiFileFormData,
    });
    setTab(await res.text());
    setModal(false);
    // alert(await res.text());
  }

  const handleCapoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCapoOffset(e.target.value); // Update capoOffset state with selected value
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
          src="/Banjo-Kazooie_logo_black.svg"
          alt="Banjo Kazooie"
          className="dark:invert"
          width={100}
          height={24}
          priority
        />
      </button>
      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h2 className="title-modal">Create Guitar Tab</h2>
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
                  (tuningOffset === "-1" ? "bg-gray-400" : "bg-gray-300")
                }
                onClick={() => handleButtonClick("-1")}
                style={{ marginLeft: "10px", marginRight: "10px" }}
              >
                Drop D
              </button>
              <button
                className={
                  "rounded-lg px-5 py-3 transition-colors " +
                  (tuningOffset === "-2" ? "bg-gray-400" : "bg-gray-300")
                }
                onClick={() => handleButtonClick("-2")}
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

            <form>
              <input
                type="file"
                name="midi_file"
                accept=".mid"
                onChange={handleFileChange}
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
