import { Wallet, ethers } from "ethers";
import { eERC20Abi } from "./abi";
import { config } from "../../lib/config"
import { encryptAmount } from "../utils/fhevm";
import { writeContract, waitForTransactionReceipt } from "wagmi/actions";
import { toHex } from "viem";

const eUSDTAddress = "0x62E2e51Ce065eA0Cb7036aD3A06cF1766fb8F647";
const faucetAddress = "0xe835a53972b23b150d0feb06967c3eb6e7dddcec";

export async function POST(req: Request) {
  const { address, value }: { address: string; value: number } = await req.json();
  const eAmountIn = await encryptAmount(faucetAddress, value, eUSDTAddress);

  let hash = await writeContract(config, {
    address: eUSDTAddress,
    abi: eERC20Abi,
    functionName: "transfer",
    args: [address, toHex(eAmountIn.handles[0]), toHex(eAmountIn.inputProof)]
  })

  let _ = await waitForTransactionReceipt(config, { hash })
  return Response.json({ txid: hash });
}
