"use client"
import Image from "next/image";
import Bridge from "./components/Bridge";
import { useState } from "react";
import Faucet from "./components/Faucet";

export default function Home() {
  const [selected, setSelected] = useState("bridge");
  const selectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    console.log(e.target.value)
    setSelected(e.target.value!);
  };
  return (
    <main className="flex min-h-screen flex-col items-center space-y-20 p-24">
      <div className="flex flex-row space-x-2">
        <Image src={"/logo.svg"} alt="logo" width={30} height={30} />
        <h1 className="text-[30px]">ENCIFHER</h1>
      </div>
      <div className="flex flex-col space-y-2 w-[50%]">
        <select
          id="type"
          className="flex flex-row text-sm items-start bg-transparent w-max focus:border-0"
          onChange={selectChange}
        >
          <option selected value="bridge">
            Bridge
          </option>
          <option value="faucet">Faucet</option>{" "}
        </select>
        {
          selected == "bridge" && <Bridge />
        }
        {
          selected == "faucet" && <Faucet />
        }
      </div>
    </main>
  );
}
