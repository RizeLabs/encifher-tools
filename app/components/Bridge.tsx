"use client";
import React, { useState } from "react";
import { Spinner } from "@nextui-org/react";
import axios from "axios";

type bridgeSuccessType = {
  isSuccessful: boolean;
  signet_txid: string | undefined;
  encifher_txid: string | undefined;
  error: string | undefined;
};

const Bridge = () => {
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  
  const [success, setSuccess] = useState<bridgeSuccessType>({
    isSuccessful: false,
    signet_txid: undefined,
    encifher_txid: undefined,
    error: undefined,
  });

  const bridge = async () => {

    setLoading(true);
    try {
      const response = await axios.post("/api/bridge",
        { address },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000,
        }
      );
      const { txid_btc, txid_encifher } = response.data;
      console.log(txid_btc, txid_encifher);
      setSuccess({ isSuccessful: true, signet_txid: txid_btc, encifher_txid: txid_encifher, error: undefined });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setSuccess({
        isSuccessful: false,
        signet_txid: undefined,
        encifher_txid: undefined,
        error: error as string,
      });
      setLoading(false);
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
      <button className="bg-[#2E00E5] text-white p-3 rounded-lg border border-[#A994FF]" onClick={bridge}>
        {loading ? <Spinner /> :"Bridge 0.01 eBTC"}
      </button>
      <div className="mt-2 text-center">
        {success.isSuccessful && <span>Yay! Checkout the tx: <a href={`https://explorer.encifher.io/tx/${success.encifher_txid}`} target="_blank"
          className="text-yellow-400">Encifher scan</a></span>}
        {!success.isSuccessful && success.error && <>Oops! Please try again.</>}
      </div>
    </div>
  );
};

export default Bridge;
