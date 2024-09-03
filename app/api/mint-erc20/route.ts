import { ethers, Wallet } from "ethers";
import { eUsdtAddress, eERC20Abi } from "./constant";
import { encryptAmount } from "../utils/fhevm";

const provider = new ethers.JsonRpcProvider("https://rpc.encifher.io/");
const pk = process.env.FAUCET_KEY as string;
const wallet = new Wallet(pk, provider);
const faucetAddress = process.env.FAUCET_ADDRESS as string;

export async function POST(req: Request) {
  const { address, value }: { address: string; value: number } = await req.json();
  try {
    const eAmountIn = await encryptAmount(faucetAddress, value, eUsdtAddress);
    const contract = new ethers.Contract(eUsdtAddress, eERC20Abi, wallet);
    const tx = await wallet.sendTransaction({
      to: eUsdtAddress,
      data: contract.interface.encodeFunctionData(
        "transfer",
        [address, eAmountIn.handles[0], eAmountIn.inputProof]
      ),
    });
    await tx.wait();
    return Response.json({ txid: tx.hash });
  } catch (error: any) {
    console.error(error);
    return Response.error();
  }
}