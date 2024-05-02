import React, { useState } from "react";
import "./Modal.css";
import Image from "next/image";

interface ChannelInfoModalProps {
  setModalDisplay: React.Dispatch<React.SetStateAction<string>>;
  setButtonFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  setChannelInfo: React.Dispatch<
    React.SetStateAction<Array<[string, number, number]>>
  >;
}

export default function ChannelInfoModal({
  setModalDisplay,
  setButtonFile,
  setChannelInfo,
}: ChannelInfoModalProps): JSX.Element {
  const [file, setFile] = useState<File | undefined>();

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
    }
    // api call
    const res = await fetch("/api/channel_info", {
      method: "POST",
      body: midiFileFormData,
    });
    setChannelInfo(await res.json());

    setModalDisplay("generator");
  }

  async function handleFileChange(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault();

    const target = e.target as HTMLInputElement & { files: FileList };

    setFile(target.files[0]);
    setButtonFile(target.files[0]);
  }

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
            onClick={() => setModalDisplay("0")}
          />
        </div>

        <span className="title-modal">Upload File</span>

        <button className="close-modal" onClick={() => setModalDisplay("0")}>
          X
        </button>

        <div className="mt-4 mb-6">
          Upload the Midi file of the song you wish to translate.
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
            className="rounded-lg bg-gray-300 px-5 py-2 transition-colors hover:border-gray-200 hover:bg-gray-400 dark:border-neutral-500 dark:bg-gray-600"
            onClick={handleOnSubmit}
          >
            Submit File
          </button>
        </form>
      </div>
    </div>
  );
}
