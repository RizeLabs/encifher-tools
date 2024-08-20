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

const mutinyNetUrl = 'https://mutinynet.com/api/tx';

const waitForConfirmation = async (txid: string) => {
  try {
    while (true) {
      const response = await axios.get(`${mutinyNetUrl}/${txid}`);
      const status = response.data.status.confirmed;
      if (!status) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }

      return true;
    }
  } catch (error: any) {
    if (error.response && error.response.data === "Transaction not found") {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return waitForConfirmation(txid);
    } else {
      console.error('Error:', error);
      throw error;
    }
  }
}

export async function POST(req: Request) {
  const { address, txid }: { address: string, txid: string } = await req.json();
  try {
    await waitForConfirmation(txid);
    const response = await axios.post(
      "http://13.60.89.214:3000/bridge",
      { txid, address },
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