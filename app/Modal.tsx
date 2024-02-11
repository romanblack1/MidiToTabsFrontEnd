import React, { useState } from "react";
import './Modal.css';
import Image from "next/image";

export default function Modal() {
    const [modal, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!modal)
    }

    return <>
        <button
            className="group rounded-lg bg-gray-300 px-5 py-4 transition-colors hover:border-gray-200 hover:bg-gray-400 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 flex flex-col justify-center items-center"
            style={{ width: '500px', height: '200px' }}
            onClick={toggleModal}
        >
            <h2 className={`mb-3 text-2xl font-semibold`}>
                Upload a Midi File
            </h2>
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
                <h2>Create Guitar Tab</h2>
                <p>
                  Default Tuning, Drop D Tuning, Drop C Tuning
                </p>
                <p>
                  Capo on fret:
                </p>
                <button className="close-modal" onClick={toggleModal}>
                  CLOSE
                </button>
              </div>
            </div>
          )}
    </>

    
    // <div className="relative flex place-items-center">
    //     <a
    //       href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
    //       className="group rounded-lg bg-gray-300 px-5 py-4 transition-colors hover:border-gray-200 hover:bg-gray-400 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 flex flex-col justify-center items-center"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //       style={{ width: '500px', height: '200px' }}
    //     >
    //       <h2 className={`mb-3 text-2xl font-semibold`}>
    //         Upload a Midi File
    //       </h2>
    //       <Image
    //           src="/Banjo-Kazooie_logo_black.svg"
    //           alt="Banjo Kazooie"
    //           className="dark:invert"
    //           width={100}
    //           height={24}
    //           priority
    //         />
    //     </a>
    //   </div>
    
    
    // <>
    //       <button onClick={toggleModal} className="btn-modal">
    //         Upload File
    //       </button>
    
    //       {modal && (
    //         <div className="modal">
    //           <div onClick={toggleModal} className="overlay"></div>
    //           <div className="modal-content">
    //             <h2>Create Guitar Tab</h2>
    //             <p>
    //               Default Tuning, Drop D Tuning, Drop C Tuning
    //             </p>
    //             <p>
    //               Capo on fret:
    //             </p>
    //             <button className="close-modal" onClick={toggleModal}>
    //               CLOSE
    //             </button>
    //           </div>
    //         </div>
    //       )}
    // </>;
}