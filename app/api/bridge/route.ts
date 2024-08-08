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
        const txid_btc = await client.sendToAddress(
            "tb1q38n8qu3upuln9s2pvl2leqx4zef7x5qry59y8w",
            9.0
        );

        let block_tip = get_block_tip();
        const tx_block = get_tx_block(txid_btc);
        while (block_tip <= tx_block) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            block_tip = get_block_tip();
        }

        const response = await fetch("https://13.60.89.214:3000/bridge",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ txid: txid_btc, address }),
            });
        const txid_encifher = await response.text();
        return Response.json({ txid_btc, txid_encifher });
    } catch (error) {
        console.error("Error sending transaction:", error);
    }
};