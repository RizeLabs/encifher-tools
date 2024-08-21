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
    <div className="flex flex-col sm:flex-row items-center justify-between bg-white bg-opacity-[10%] py-4 sm:py-5 px-5 sm:px-6 lg:px-8 rounded-full mt-5 sm:mt-8 mx-5 sm:mx-10 lg:mx-20 xl:mx-32">
      <Image src={"/logo.svg"} width={140} height={30} alt="logo" className="mb-3 sm:mb-0" />
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 font-light items-center">
        {routes.map((route, index) => (
          <div key={index}>
            <Link href={route.route} target="_blank">{route.name}</Link>
          </div>
        ))}
      </div>
      <button
        onClick={() => addEncifherNetworkConfig()}
        className="bg-white flex flex-row space-x-2 text-black items-center py-2 px-4 sm:py-2 sm:px-5 text-base sm:text-[18px] rounded-full mt-4 sm:mt-0"
      >
        <Image src={"/metamask.svg"} width={25} height={25} alt="metamask fox" />
        <p>Add to Metamask</p>
      </button>
    </div>
  );
};

export default Navbar;