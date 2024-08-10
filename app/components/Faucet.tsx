"use client";
import { Spinner } from "@nextui-org/react";
import React, { useState } from "react";

type faucetSuccessType = {
  isSuccessful: boolean;
  encifher_txid: string | undefined;
  error: string | undefined;
};

const Faucet = () => {
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);

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
          address: "0x72d2F62A93305752CC57D48Ea217CA687EA43dc0",
          value: 0.01,
        }),
      });
      const { txid } = await resp.json();
      setSuccess({ isSuccessful: true, encifher_txid: txid, error: undefined });
      setLoading(false);
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
    <div className="rounded-[32px] p-[40px] bg-gradient-to-b from-[#00000080] to-[#212121] bg-opacity-[50%] flex flex-col space-y-[30px] w-[55%]">
      <h1 className="text-[35px] font-[400]">Faucet</h1>

      <input
        type="text"
        required
        id="address"
        placeholder="Wallet Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="bg-[#2D146C] text-white py-3 px-6 border border-gray-400 rounded-full "
      />

      <button
        className=" bg-gradient-to-b from-[#7754FF] to-[#643CFF] text-white p-3 rounded-full "
        onClick={mint}
      >
        {loading ? <Spinner /> : "Claim 0.01 eBTC"}
      </button>
      {success.error && (
        <div className="text-[18px] text-red-300 text-wrap">
          Error: Something went wrong
        </div>
      )}
      {success.encifher_txid && (
        <div className="flex flex-col space-y-1 text-[18px]">
          <h3 className="text-sm font-semibold">L2 TxId:</h3>
          <a
            href={`https://explorer.encifher.io/tx/${success.encifher_txid}`}
            className="overflow-hidden text-ellipsis"
          >
            {success.encifher_txid}
          </a>
        </div>
      )}
    </div>
  );
};

export default Faucet;
