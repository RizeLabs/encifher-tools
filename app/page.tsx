"use client";
import Bridge from "./components/Bridge";
import { useState } from "react";
import Faucet from "./components/Faucet";
import Toggle from "./components/Toggle";

export const maxDuration = 300;

export default function Home() {
  const [selected, setSelected] = useState("faucet");
  // const selectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   e.preventDefault();
  //   console.log(e.target.value);
  //   setSelected(e.target.value!);
  // };
  return (
    <main className="flex min-h-screen flex-col items-center px-6 sm:px-12 md:px-24 py-6 sm:py-8 md:py-12 w-ful">
      <div className="flex flex-col space-y-6 sm:space-y-8 items-center w-full sm:w-[90%] md:w-[80%]">
        {/* <Toggle callback={setSelected} /> */}
        {selected == "bridge" ? <Bridge /> : <Faucet />}
      </div>
    </main>
  );
}