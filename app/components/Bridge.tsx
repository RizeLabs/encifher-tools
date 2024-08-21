"use client";
import React, { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import axios from "axios";
import { fetchBalance, waitForConfirmation } from "../lib/bitcoin";

type bridgeSuccessType = {
  isSuccessful: boolean;
  signet_txid: string | undefined;
  encifher_txid: string | undefined;
  error: string | undefined;
};

const Bridge = () => {
  const taprootAddress = "tb1pstekwspqy68cjmawca4vzf5kgfsth54uqxvtgeylqeecp4kr4ymqctxgzv";
  const [balance, setBalance] = useState<string | undefined>('');
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const balance = await fetchBalance(taprootAddress);
      setBalance(balance?.toString());
    };
    fetch();
  }, []);

  const [success, setSuccess] = useState<bridgeSuccessType>({
    isSuccessful: false,
    signet_txid: undefined,
    encifher_txid: undefined,
    error: undefined,
  });

  const bridge = async () => {
    setLoading(true);
    try {
      const lockResponse = await axios.post(
        "/api/lock",
        { address },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 50000,
        }
      );
      const { txid } = lockResponse.data;
      await waitForConfirmation(txid);

      const response = await axios.post(
        "/api/bridge",
        { txid },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 50000,
        }
      );
      const { txid_encifher } = response.data;
      console.log(txid, txid_encifher);
      setSuccess({
        isSuccessful: true,
        signet_txid: txid,
        encifher_txid: txid_encifher,
        error: undefined,
      });
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
  };

  return (
    <div className="rounded-[32px] p-[20px] md:p-[40px] bg-gradient-to-b from-[#00000080] to-[#212121] bg-opacity-[50%] flex flex-col space-y-[20px] md:space-y-[30px] w-full md:w-[55%] mx-auto">
      <h1 className="text-[24px] md:text-[35px] font-[400]">Bridge</h1>
      <p className="text-sm md:text-base">
        Your Taproot Address: {taprootAddress.slice(0, 15) + '...' + taprootAddress.slice(-15)}
      </p>
      <p className="text-sm md:text-base">Balance: {balance} SATS</p>
      <input
        type="text"
        required
        id="address"
        placeholder="address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="bg-[#2D146C] text-white py-2 px-4 md:py-3 md:px-6 border border-gray-400 rounded-full text-sm md:text-base"
      />
      <button
        className="bg-gradient-to-b from-[#7754FF] to-[#643CFF] text-white p-2 md:p-3 rounded-full text-sm md:text-base"
        onClick={bridge}
      >
        {loading ? <Spinner /> : "Bridge 0.01 eBTC"}
      </button>
      <div className="mt-2 text-center text-sm md:text-base">
        {success.isSuccessful && (
          <span>
            Yay! Checkout the tx:{" "}
            <a
              href={`https://explorer.encifher.io/tx/${success.encifher_txid}`}
              target="_blank"
              className="text-yellow-400"
            >
              Encifher scan
            </a>
          </span>
        )}
        {!success.isSuccessful && success.error && <>Oops! Please try again.</>}
      </div>
    </div>
  );
};

export default Bridge;