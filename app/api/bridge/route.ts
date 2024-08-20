const axios = require("axios");
const Client = require("bitcoin-core");

const client = new Client({
  network: "testnet",
  username: "bitcoin",
  password: "bitcoin",
  host: "16.171.55.106",
  port: 38332,
  wallet: "encifher",
});

const BASE_URL = "https://mempool.encifher.io/api";

export const maxDuration = 300;

export async function POST(req: Request) {
  const { address }: { address: string } = await req.json();
  try {
    const txid_btc = "52e29dad72b21979ff5b07e78249985a6c73577eff9748e17feef9f45c627693"
    const response = await axios.post(
      "http://13.60.89.214:3000/bridge",
      { txid: txid_btc, address },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      }
    );
    const txid_encifher = response.data;
    return Response.json({ txid_btc, txid_encifher });
  } catch (error) {
    console.error("Error sending transaction:", error);
    return Response.error();
  }
}

export const config = {
    api: {
        bodyParser: process.env.NODE_ENV !== "production",
    }
}