import React, { useState } from "react";
import "./Modal.css";
import Image from "next/image";
import GeneratorModal from "./GeneratorModal";
import AdvancedGeneratorModal from "./AdvancedGeneratorModal";
import ChannelInfoModal from "./ChannelInfoModal";

interface ModalProps {
  setTab: React.Dispatch<React.SetStateAction<string | undefined>>;
  setTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function ModalButton({
  setTab,
  setTitle,
}: ModalProps): JSX.Element {
  const [modalDisplay, setModalDisplay] = useState("0");
  const [channelInfo, setChannelInfo] = useState<[string, number, number][]>(
    []
  );
  const [file, setFile] = useState<File | undefined>();

  function renderModal(modalDisplay: string) {
    switch (modalDisplay) {
      case "channel_info":
        return (
          <ChannelInfoModal
            setModalDisplay={setModalDisplay}
            setButtonFile={setFile}
            setChannelInfo={setChannelInfo}
          />
        );
      case "generator":
        return (
          <GeneratorModal
            setModalDisplay={setModalDisplay}
            setTab={setTab}
            setTitle={setTitle}
            file={file!}
            channelInfo={channelInfo!}
          />
        );
      case "advanced_settings":
        return (
          <AdvancedGeneratorModal
            setModalDisplay={setModalDisplay}
            setTab={setTab}
            setTitle={setTitle}
            file={file!}
          />
        );
      default:
        return null;
    }
  }

  return (
    <>
      <button
        className="m-20px rounded-lg bg-gray-300 hover:bg-gray-400 dark:bg-neutral-800/30 dark:hover:bg-gray-600 flex flex-col justify-center items-center w-5/12 min-w-64 max-w-lg h-48"
        onClick={() => setModalDisplay("channel_info")}
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

      {renderModal(modalDisplay)}
    </>
  );
}
