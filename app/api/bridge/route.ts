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

const get_block_tip = async () => {
    const url = `${BASE_URL}/blocks/tip/height`;
    const response = await fetch(url);
    const block_tip = await response.json();
    return block_tip;
}
const get_tx_block = async (txid: string) => {
    const url = `${BASE_URL}/tx/${txid}/status`
    const response = await fetch(url);
    const tx_block = await response.json();
    return tx_block.block_height;
}

export async function POST(req: Request) {
    const { address }: { address: string } = await req.json();
    try {
        const txid_btc = "883d1961977332316923001ea1bd21d008624b297614f092eee3e0651b2b4a93";
        const response = await axios.post("http://13.60.89.214:3000/bridge",
            { txid: txid_btc, address },
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 30000,
            }
        );
        const txid_encifher = response.data;
        return Response.json({ txid_btc, txid_encifher });
    } catch (error) {
        console.error("Error sending transaction:", error);
    }
};

export const config = {
    api: {
        bodyParser: process.env.NODE_ENV !== "production",
    }
}