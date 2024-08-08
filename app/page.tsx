"use client";
import Image from "next/image";
import Bridge from "./components/Bridge";
import { useState } from "react";
import Faucet from "./components/Faucet";

export default function Home() {
  const [selected, setSelected] = useState("faucet");
  const selectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    console.log(e.target.value);
    setSelected(e.target.value!);
  };
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="hero-wrap"></div>
      <div className="z-10 w-[70%] flex flex-col items-center space-y-20 border py-[80px] rounded-xl bg-gray-800">
        <div className="flex flex-row space-x-2">
          <Image src={"/logo.svg"} alt="logo" width={200} height={200} />
        </div>
        <div className="flex flex-col space-y-2 w-[50%]">
          <div className="flex flex-col items-center">
            {" "}
            <select
              id="type"
              className="flex flex-row text-lg bg-transparent w-max focus:border-0"
              onChange={selectChange}
              defaultValue={"faucet"}
            >
              <option selected value="faucet">
                Faucet
              </option>
              <option value="bridge">Bridge</option>
            </select>
          </div>

          {selected == "bridge" && <Bridge />}
          {selected == "faucet" && <Faucet />}
        </div>
      </div>
    </main>
  );
}
