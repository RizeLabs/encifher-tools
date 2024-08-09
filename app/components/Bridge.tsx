"use client";
import React, { useState } from "react";

type bridgeSuccessType = {
  isSuccessful: boolean;
  signet_txid: string | undefined;
  encifher_txid: string | undefined;
  error: string | undefined;
};

const Bridge = () => {
  const [address, setAddress] = useState<string>("");
  const [success, setSuccess] = useState<bridgeSuccessType>({
    isSuccessful: false,
    signet_txid: undefined,
    encifher_txid: undefined,
    error: undefined,
  });

  const bridge = async () => {
    try {
      const resp = await fetch("/api/bridge", {
        method: "POST",
        body: JSON.stringify({
          address
        }),
      });
      const { txid_btc, txid_encifher } = await resp.json();
      console.log(txid_btc, txid_encifher);
      setSuccess({ isSuccessful: true, signet_txid: txid_btc, encifher_txid: txid_encifher, error: undefined });
    } catch (error) {
      console.log(error);
      setSuccess({
        isSuccessful: false,
        signet_txid: undefined,
        encifher_txid: undefined,
        error: error as string,
      });
    }
  }

  return (
    <div className="border border-[#A994FF] rounded-lg p-[30px] bg-[#7857FF] bg-opacity-[30%] flex flex-col space-y-5 ">
      <h1 className="text-[23px] font-semibold">Bridge</h1>
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
      <button className="bg-[#2E00E5] text-white p-3 rounded-lg border border-black" onClick={bridge}>
        Bridge 0.01 eBTC
      </button>
    </div>
  );
};

export default Bridge;
