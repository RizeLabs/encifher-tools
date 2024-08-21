"use client";
import Image from "next/image";
import Bridge from "./components/Bridge";
import { useState } from "react";
import Faucet from "./components/Faucet";
import Toggle from "./components/Toggle";

export const maxDuration = 300;

export default function Home() {
  const [selected, setSelected] = useState("faucet");
  const selectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    console.log(e.target.value);
    setSelected(e.target.value!);
  };
  return (
    <main className="flex min-h-screen flex-col items-center px-24 py-12 w-full">
      <div className="flex flex-col space-y-8 items-center w-[80%]">
        <Toggle callback={setSelected} />
        {selected == "bridge" && (
          <div className="flex flex-col items-center space-y-3">
            <Bridge />
            <p className=" text-pretty w-[55%] ">
              We have bootstraped the process for bridging for you by assigning you a random taproot address
              which already contains some test btc. Which will be used to bridge to encifher network.
            </p>
          </div>
        )}
        {selected == "faucet" && <Faucet />}
      </div>
    </main>
  );
}
