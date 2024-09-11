import { ethers, Wallet } from "ethers";
import { eUsdcAddress, eUsdtAddress, eERC20Abi } from "./constant";
import { encryptAmount } from "../utils/fhevm";
import { parseAmount } from "../utils/token";

const provider = new ethers.JsonRpcProvider("https://rpc.encifher.io/");
const pk = process.env.FAUCET_KEY as string;
const wallet = new Wallet(pk, provider);
const faucetAddress = process.env.FAUCET_ADDRESS as string;

export async function POST(req: Request) {
  const { address, value, selectedToken }:
    { address: string; value: string, selectedToken: string } = await req.json();
  const tokenAddress = selectedToken === "eUSDC" ? eUsdcAddress : eUsdtAddress;
  try {
    const eAmountIn = await encryptAmount(faucetAddress, parseAmount(value), eUsdtAddress);
    const contract = new ethers.Contract(eUsdtAddress, eERC20Abi, wallet);
    const tx = await wallet.sendTransaction({
      to: tokenAddress,
      data: contract.interface.encodeFunctionData(
        "transfer",
        [address, eAmountIn.handles[0], eAmountIn.inputProof]
      ),
    });
    return Response.json({ txid: tx.hash });
  } catch (error: any) {
    console.error(error);
    return Response.error();
  }
}