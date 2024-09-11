import { Wallet, ethers } from "ethers";

const rpc_url: string = process.env.RPC_URL as string;

const provider = new ethers.JsonRpcProvider(rpc_url);
const pk = process.env.PRIVATE_KEY as string;
const wallet = new Wallet(pk, provider);

export async function POST(req: Request) {
  const { address, value }: { address: string; value: string } =
    await req.json();
  const tx = await wallet.sendTransaction({
    to: address,
    value: ethers.parseEther(value),
  });

  return Response.json({ txid: tx.hash });
}