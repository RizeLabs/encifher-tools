"use client";
import React, { useState } from "react";

type faucetSuccessType = {
  isSuccessful: boolean;
  signet_txid: string | undefined;
  encifher_txid: string | undefined;
  error: string | undefined;
};

const Faucet = () => {
  const [success, setSuccess] = useState<faucetSuccessType>({
    isSuccessful: false,
    signet_txid: undefined,
    encifher_txid: undefined,
    error: undefined,
  });

  const mint = async()=>{

  }

  return (
    <div className="border border-[#A994FF] rounded-lg p-[30px] bg-[#7857FF] bg-opacity-[30%] flex flex-col space-y-5 ">
      <h1 className="text-[23px] font-semibold">Faucet</h1>
      <div className="flex flex-col space-y-1">
        <label htmlFor="address">Address:</label>
        <input
          type="text"
          required
          id="address"
          placeholder="address"
          className="bg-black text-white p-3 border border-gray-400 rounded-lg "
        />
      </div>
      <button className="bg-[#2E00E5] text-white p-3 rounded-lg" onClick={mint}>
        Claim 0.01 eBTC
      </button>
    </div>
  );
};

export default Faucet;
