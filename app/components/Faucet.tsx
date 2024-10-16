"use client";
import { Spinner } from "@nextui-org/react";
import React, { useState } from "react";
import Popup from "./Popup";
import Image from "next/image";
type faucetSuccessType = {
  isSuccessful: boolean;
  encifher_txid: string | undefined;
  error: string | undefined;
};

const Faucet = () => {
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState("eBTC");
  const [status, setStatus] = useState("");
  const value = selectedToken === "eBTC" ? "0.01" : "10";
  // const suffix = selectedToken === "eBTC" ? "" : "-erc20";

  const tokens = [
    { symbol: "eBTC", icon: "/btc.svg" },
    // { symbol: "eUSDC", icon: "/usdc.svg" },
    // { symbol: "eUSDT", icon: "/usdt.svg" },
  ];

  const [success, setSuccess] = useState<faucetSuccessType>({
    isSuccessful: false,
    encifher_txid: undefined,
    error: undefined,
  });

  const mint = async () => {
    setLoading(true);
    try {
      // const resp = await fetch(`/api/mint${suffix}`, {
      //   method: "POST",
      //   body: JSON.stringify({
      //     address,
      //     value,
      //     selectedToken
      //   }),
      // });
      // const { txid } = await resp.json();
      let tx_id = ""
      const tokens = ["eBTC"];
      for (const token of tokens) {
        setStatus(`Claiming ${token}`);
        const suffix = token === "eBTC" ? "" : "-erc20";
        const value = token === "eBTC" ? "0.01" : "10";
        const resp = await fetch(`/api/mint${suffix}`, {
          method: "POST",
          body: JSON.stringify({
            address,
            value,
            selectedToken: token
          }),
        });
        const { txid } = await resp.json();
        if (token === tokens[0]) tx_id = txid;
      };

      setSuccess({ isSuccessful: true, encifher_txid: tx_id, error: undefined });
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
      <h1 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[35px] font-[400]">
        Faucet
      </h1>
      <div className="flex flex-col space-y-1 items-center w-auto mb-0 relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="bg-gradient-to-b from-[#7754FF] to-[#643CFF] py-2 sm:py-3 px-4  text-white p-2 rounded-full flex items-center"
        >
          <Image
            src={
              tokens.find((token) => token.symbol === selectedToken)
                ?.icon || "/eth.svg"
            }
            width={20}
            height={20}
            alt={selectedToken}
          />
          <span className="ml-2">{selectedToken}</span>
          <Image
            src={"/down.svg"}
            width={16}
            height={16}
            alt="down-arrow"
            className="ml-2"
          />
        </button>
        {dropdownOpen && (
          <ul className="absolute top-full mt-2 w-[50%]  bg-[#2D146C] text-white py-2 px-4 sm:py-3 sm:px-6 border border-gray-400 rounded-lg z-10">
            {tokens.map((token) => (
              <li
                key={token.symbol}
                className="flex items-center p-2 hover:bg-[#444444] cursor-pointer"
                onClick={() => {
                  setSelectedToken(token.symbol);
                  setDropdownOpen(false);
                }}
              >
                <Image
                  src={token.icon}
                  width={20}
                  height={20}
                  alt={token.symbol}
                />
                <span className="ml-2 text-white">{token.symbol}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
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
        {loading ? (<span className="flex justify-center items-center gap-4"><p>{status} </p><Spinner color="default"/></span>) : <span>{`Claim ${value} ${selectedToken}`}</span>}
      </button>

      {success.error && (
        <div className="text-[16px] sm:text-[18px] text-red-300 break-words">
          Error: Something went wrong
        </div>
      )}

      {success.encifher_txid && showModal && (
        <Popup
          type={"faucet"}
          txid={success.encifher_txid || ""}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
};

export default Faucet;
