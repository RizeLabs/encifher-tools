import Image from "next/image";
import Link from "next/link";
import React from "react";

const Popup = ({
  type,
  txid,
  setShowModal,
}: {
  type: "faucet" | "bridge";
  txid: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleBackgroundClick = () => {
    setShowModal(false);
  };

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
<div>
      <div
        className="justify-center items-center content-center flex overflow-x-hidden overflow-y-hidden fixed inset-0 z-50 outline-none focus:outline-none"
        onClick={handleBackgroundClick} // Close modal when background is clicked
      >
        <div
          className="relative my-6 mx-auto w-[400px]"
          onClick={handleContentClick} // Prevent click from closing the modal
        >
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gradient-to-b from-[#361B8D] to-[#11016B] outline-none focus:outline-none h-[330px] items-center space-y-4 p-10">
            <Image src={"/tick.svg"} alt="" width={100} height={100} />
            <h1 className="text-[28px] font-[500]">Deposit successful</h1>
            <Link
              className="flex flex-row space-x-2 border px-4 py-1 bg-[#613DDD] rounded-full border-transparent text-gray-300"
              href={`https://explorer.encifher.io/tx/${txid}`}
              target="_blank"
            >
              <p className="text-[18px] font-[400]">
                txn : {txid.slice(0, 10)}...{txid.slice(-4)}
              </p>
              <Image src={"/link.svg"} alt="" width={16} height={16} />
            </Link>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 backdrop-blur-sm"></div>
    </div>
  );
};

export default Popup;
