import React, { useState } from "react";
import "./Modal.css";
import Image from "next/image";

export default function Modal() {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  const [highlightedButton, setHighlightedButton] = useState("default");

  const handleButtonClick = (button: string) => {
    setHighlightedButton(button);
  };

  return (
    <>
      <button
        className="group rounded-lg bg-gray-300 px-5 py-4 transition-colors hover:border-gray-200 hover:bg-gray-400 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 flex flex-col justify-center items-center dark:bg-slate-600"
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
            <div className="flex flex-row">
              <button
                className={
                  "rounded-lg px-5 py-3 transition-colors " +
                  (highlightedButton === "default"
                    ? "bg-gray-400"
                    : "bg-gray-300")
                }
                onClick={() => handleButtonClick("default")}
              >
                Default
              </button>
              <button
                className={
                  "rounded-lg px-5 py-3 transition-colors "  +
                  (highlightedButton === "dropD"
                    ? "bg-gray-400"
                    : "bg-gray-300")
                }
                onClick={() => handleButtonClick("dropD")}
                style={{ marginLeft: "10px", marginRight: "10px" }}
              >
                Drop D
              </button>
              <button
                className={
                  "rounded-lg px-5 py-3 transition-colors " +
                  (highlightedButton === "dropC"
                    ? "bg-gray-400"
                    : "bg-gray-300")
                }
                onClick={() => handleButtonClick("dropC")}
              >
                Drop C
              </button>
            </div>

            <div className="mt-3 flex flex-row justify-between">
              <p>Capo on fret:</p>
              <select>
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

            <div className="flex justify-center">
              <button className="rounded-lg bg-gray-300 px-5 py-2 transition-colors hover:border-gray-200 hover:bg-gray-400 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
                Submit
              </button>
            </div>

            <button className="close-modal" onClick={toggleModal}>
              X
            </button>
          </div>
        </div>
      )}
    </>
  );
}
