import { Wallet, ethers } from "ethers";

const rpc_url: string = process.env.RPC_URL as string;

const provider = new ethers.JsonRpcProvider(rpc_url);
const pk = process.env.PRIVATE_KEY as string;
const wallet = new Wallet(pk, provider);

export async function POST(req: Request) {
  const { address, value }: { address: string; value: number } =
    await req.json();
  const txid = await wallet.sendTransaction({
    to: address,
    value: ethers.parseEther(value.toString()),
  });
  console.log(txid);

  return Response.json({ txid: txid.hash });
}
