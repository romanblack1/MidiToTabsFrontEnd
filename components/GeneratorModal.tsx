import React, { useEffect, useState } from "react";
import "./Modal.css";
import Image from "next/image";

interface GeneratorModalProps {
    setModalDisplay: React.Dispatch<React.SetStateAction<string>>;
    setTab: React.Dispatch<React.SetStateAction<string | undefined>>;
    setTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
    file: File;
    channelInfo: [string, number, number][];
}

export default function GeneratorModal({
    setModalDisplay,
    setTab,
    setTitle,
    file,
    channelInfo,
}: GeneratorModalProps): JSX.Element {
    const [channelSelected, setChannelSelected] = useState(channelInfo[0][2]);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        // Access localStorage only in the browser
        const storedUserId = localStorage.getItem("userId");

        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

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
            midiFileFormData.append("channelSelected", channelSelected.toString());
            midiFileFormData.append("tuningOffset", "0");
            midiFileFormData.append("capoOffset", "0");
            midiFileFormData.append("userId", userId ? userId : "null")
        }
        //api call
        const res = await fetch("/api", {
            method: "POST",
            body: midiFileFormData,
        });
        const title_string = file.name.replace(/\.mid$/i, "");
        let modified_title = title_string.replace(/_/g, " ").replace(/-/g, " ");
        setTitle(modified_title);
        const response_text = await res.text();
        let index_of_tabId = response_text.indexOf("tab_id: ");
        let tabIdStr = response_text.substring(index_of_tabId);
        tabIdStr = tabIdStr.replace("tab_id: ", "");
        let tabIdNum = parseInt(tabIdStr); // the id of the generated tab as a number
        setTab(response_text.substring(0, index_of_tabId));
        setModalDisplay("0");
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
                        onClick={() => setModalDisplay("channel_info")}
                    />
                </div>

                <span className="title-modal">Choose a channel</span>

                <button className="close-modal" onClick={() => setModalDisplay("0")}>
                    X
                </button>

                <div className="flex flex-row justify-between w-5/6">
                    <span>Name</span>
                    <span>Length</span>
                </div>

                {channelInfo.map((channelInfo) => (
                    <button
                        className={
                            "w-full rounded-lg m-1 " +
                            (channelSelected === channelInfo[2]
                                ? "bg-gray-400 dark:bg-gray-600"
                                : "bg-gray-300 dark:bg-gray-400")
                        }
                        key={channelInfo[0]}
                        onClick={() => setChannelSelected(channelInfo[2])}
                    >
                        <div className="flex flex-row justify-between">
                            <span className="px-8">{channelInfo[0]}</span>
                            <span className="px-8">{channelInfo[1]}</span>
                        </div>
                    </button>
                ))}

                <button
                    className="rounded-lg bg-gray-300 px-5 py-2 mt-2 hover:border-gray-200 hover:bg-gray-400 dark:border-neutral-500 dark:bg-gray-600"
                    onClick={handleOnSubmit}
                >
                    Generate Tab
                </button>

                <button
                    className="bottom-right text-sm text-blue-600 underline"
                    onClick={() => setModalDisplay("advanced_settings")}
                >
                    Advanced
                </button>
            </div>
        </div>
    );
}
