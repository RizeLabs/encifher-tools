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

export async function POST(req: Request) {
  const { txid }: { txid: string } = await req.json();
  try {
    const response = await axios.post(
      "http://13.60.89.214:3000/bridge",
      { txid },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      }
    );
    const txid_encifher = response.data;
    return Response.json({ txid_encifher });
  } catch (error) {
    console.error("Error sending transaction:", error);
    return Response.error();
  }
}