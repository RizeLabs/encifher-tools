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
      const response = await axios.post(
        "/api/bridge",
        { address },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 30000,
        }
      );
      const { txid_btc, txid_encifher } = response.data;
      console.log(txid_btc, txid_encifher);
      setSuccess({
        isSuccessful: true,
        signet_txid: txid_btc,
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
    <div className="rounded-[32px] p-[40px] bg-gradient-to-b from-[#00000080] to-[#212121] bg-opacity-[50%] flex flex-col space-y-[30px] w-[55%]">
      <h1 className="text-[35px] font-[400]">Bridge</h1>
      <p>Your Taproot Address: 0x842434...adnzxu</p>
      <p>Balance: 10.000 SATS</p>
      <input
        type="text"
        required
        id="address"
        placeholder="address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="bg-[#2D146C] text-white py-3 px-6 border border-gray-400 rounded-full"
      />
      <button
        className=" bg-gradient-to-b from-[#7754FF] to-[#643CFF] text-white p-3 rounded-full "
        onClick={bridge}
      >
        {loading ? <Spinner /> : "Bridge 0.01 eBTC"}
      </button>
      <div className="mt-2 text-center">
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
