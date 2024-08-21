'use client'
import React from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const routes: { name: string; route: string }[] = [
    { name: "Resources", route: "https://docs.encifher.io/docs/intro" },
    { name: "Docs", route: "https://docs.encifher.io/docs/intro" },
  ];

  const addEncifherNetworkConfig = async () => {
    try {
      if ((window as any).ethereum) {
        await (window as any).ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x2328",
              chainName: "Encifher Devnet",
              rpcUrls: ["https://rpc.encifher.io"],
              iconUrls: [
                "https://encifher.io/enc.svg",
                "https://encifher.io/enc.png",
              ],
              nativeCurrency: {
                name: "enc Bitcoin",
                symbol: "ebtc",
                decimals: 18,
              },
              blockExplorerUrls: ["https://explorer.encifher.io"],
            },
          ],
        });
      } else {
        alert("Injected ethereum not found");
      }
    } catch (err) {
      alert("Error occured while adding Encifher network config");
      console.log(err);
    }
  };

  return (
    <div className="flex flex-row items-center justify-between bg-white bg-opacity-[10%] py-[20px] px-[30px] rounded-full mt-[35px] mx-[80px]">
      <Image src={"/logo.svg"} width={170} height={35} alt="logo" />
      <div className="flex space-x-8 font-[300] items-center">
        {routes.map((route, index) => (
          <div key={index}>
            <Link href={route.route} target="_blank">{route.name}</Link>
          </div>
        ))}
      </div>
      <button onClick={() => addEncifherNetworkConfig()} className="bg-white flex flex-row space-x-2 text-black items-center py-2 px-5 text-[18px]  rounded-full">
        <Image src={"/metamask.svg"} width={30} height={30} alt="metamask fox"/>
        <p>Add to Metamask</p>
      </button>
    </div>
  );
};

export default Navbar;
