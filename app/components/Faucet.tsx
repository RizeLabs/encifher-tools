"use client";
import React, { useState } from "react";

type faucetSuccessType = {
  isSuccessful: boolean;
  encifher_txid: string | undefined;
  error: string | undefined;
};

const Faucet = () => {
  const [address, setAddress] = useState<string>("");
  const [success, setSuccess] = useState<faucetSuccessType>({
    isSuccessful: false,
    encifher_txid: undefined,
    error: undefined,
  });

  const mint = async () => {
    try {
      const resp = await fetch("/api/mint", {
        method: "POST",
        body: JSON.stringify({
          address: "0x72d2F62A93305752CC57D48Ea217CA687EA43dc0",
          value: 0.01,
        }),
      });
      const { txid } = await resp.json();
      setSuccess({ isSuccessful: true, encifher_txid: txid, error: undefined });
    } catch (error) {
      console.log(error);
      setSuccess({
        isSuccessful: false,
        encifher_txid: undefined,
        error: error as string,
      });
    }
  };

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
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="bg-black text-white p-3 border border-gray-400 rounded-lg "
        />
      </div>
      <button className="bg-[#2E00E5] text-white p-3 rounded-lg border border-[#A994FF]" onClick={mint}>
        Claim 0.01 eBTC
      </button>
      {success.error && (
        <div className="text-[18px] text-red-300 text-wrap">
          Error: Something went wrong
        </div>
      )}
      {success.encifher_txid && (
        <div className="flex flex-col space-y-1 text-[18px]">
          <h3 className="text-sm font-semibold">L2 TxId:</h3>
          <a href="#" className="overflow-hidden text-ellipsis">{success.encifher_txid}</a>
        </div>
      )}
    </div>
  );
};

export default Faucet;
