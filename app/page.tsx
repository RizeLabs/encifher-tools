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
    <main className="flex min-h-screen flex-col items-center p-24 w-full">
      <div className="flex flex-col space-y-8 items-center min-w-[80%]">
        <Toggle callback={setSelected}/>
        {selected == "bridge" && <Bridge />}
        {selected == "faucet" && <Faucet />}
      </div>
    </main>
  );
}
