"use client";
import React, { SetStateAction, useState } from "react";

const Toggle = ({
  callback,
}: {
  callback: React.Dispatch<SetStateAction<string>>;
}) => {
  const [active, setActive] = useState<"faucet" | "bridge">("faucet");
  const toggle = (element: "faucet" | "bridge") => {
    setActive(element);
    callback(element);
  };

  return (
    <div>
      <ul className="flex bg-[#252525] bg-opacity-[40%] w-max rounded-full border border-[#6B45FF]">
        <li className="m-1">
          <button
            onClick={() => toggle("faucet")}
            className={`${
              active == "faucet"
                ? "bg-gradient-to-b from-[#7754FF] to-[#643CFF]"
                : ""
            } py-4 px-12 text-sm rounded-full`}
          >
            Faucet
          </button>
        </li>
        <li className="m-1">
          <button
            onClick={() => toggle("bridge")}
            className={`${
              active == "bridge"
                ? "bg-gradient-to-b from-[#7754FF] to-[#643CFF]"
                : ""
            } py-4 px-12 text-sm rounded-full`}
          >
            Bridge
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Toggle;
