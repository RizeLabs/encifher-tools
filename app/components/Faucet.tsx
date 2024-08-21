"use client";
import { Spinner } from "@nextui-org/react";
import React, { useState } from "react";
import Popup from "./Popup";

type faucetSuccessType = {
  isSuccessful: boolean;
  encifher_txid: string | undefined;
  error: string | undefined;
};

const Faucet = () => {
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const [success, setSuccess] = useState<faucetSuccessType>({
    isSuccessful: false,
    encifher_txid: undefined,
    error: undefined,
  });

  const mint = async () => {
    setLoading(true);
    try {
      const resp = await fetch("/api/mint", {
        method: "POST",
        body: JSON.stringify({
          address: address,
          value: 0.01,
        }),
      });
      const { txid } = await resp.json();
      setSuccess({ isSuccessful: true, encifher_txid: txid, error: undefined });
      setLoading(false);
      setShowModal(true);
    } catch (error) {
      console.log(error);
      setSuccess({
        isSuccessful: false,
        encifher_txid: undefined,
        error: error as string,
      });
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[32px] p-[20px] sm:p-[30px] md:p-[40px] bg-gradient-to-b from-[#00000080] to-[#212121] bg-opacity-[50%] flex flex-col space-y-[20px] sm:space-y-[25px] md:space-y-[30px] w-[90%] sm:w-[75%] md:w-[60%] lg:w-[55%] mx-auto">
      <h1 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[35px] font-[400]">Faucet</h1>

      <input
        type="text"
        required
        id="address"
        placeholder="Wallet Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="bg-[#2D146C] text-white py-2 px-4 sm:py-3 sm:px-6 border border-gray-400 rounded-full "
      />

      <button
        className="bg-gradient-to-b from-[#7754FF] to-[#643CFF] text-white py-2 sm:py-3 px-4 rounded-full"
        onClick={mint}
      >
        {loading ? <Spinner /> : "Claim 0.01 eBTC"}
      </button>

      {success.error && (
        <div className="text-[16px] sm:text-[18px] text-red-300 break-words">
          Error: Something went wrong
        </div>
      )}

      {success.encifher_txid && showModal && (
        <Popup
          type={"faucet"}
          txid={success.encifher_txid}
          setShowModal={setShowModal}
        />
      )}
    </div>

  );
};

export default Faucet;