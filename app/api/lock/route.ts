const axios = require("axios");
const bitcoin = require("bitcoinjs-lib");
const ECPairFactory = require("ecpair").default;
const ecc = require("tiny-secp256k1");

bitcoin.initEccLib(ecc);
const ECPair = ECPairFactory(ecc);

const aliceSecret = '2bd806c97f0e00af1a1fc3328fa763a9269723c8db8fac4f93af71db186d6e90';
const bobSecret = '81b637d8fcd2c6da6359e6963113a1170de795e4b725b84d1e0b4cfd9ec58ce9';
const charlieSecret = '81b637d8fcd2c6da6359e6963113a1170de795e4b725b84d1e0b4cfd9ec58ce8';
const internalSecret = '1229101a0fcf2104e8808dab35661134aa5903867d44deb73ce1c7e4eb925be8';

const mutinyNetUrl = 'https://mutinynet.com/api/tx';

const createMultiSigTapScript = (pubkeys: Buffer[]) => {
    const script = bitcoin.script.compile([
        pubkeys[0],
        bitcoin.opcodes.OP_CHECKSIGVERIFY,
        pubkeys[1],
        bitcoin.opcodes.OP_CHECKSIG,
        pubkeys[2],
        bitcoin.opcodes.OP_CHECKSIGADD,
        bitcoin.script.number.encode(1),
        bitcoin.opcodes.OP_GREATERTHANOREQUAL,
        //   Buffer.alloc(20, 0) 
    ]);
    return script;
};

const createTimelockScript = (blockCount: number, senderPubKey: Buffer) => {
    return bitcoin.script.compile([
        bitcoin.script.number.encode(blockCount),
        bitcoin.opcodes.OP_CSV,
        bitcoin.opcodes.OP_DROP,
        senderPubKey,
        bitcoin.opcodes.OP_CHECKSIG
    ]);
};

const createInsribeScript = (evmAddress: string) => {
    if (evmAddress.length !== 42) {
        throw new Error('Invalid EVM address');
    }
    return bitcoin.script.compile([
        bitcoin.opcodes.OP_RETURN,
        Buffer.from(evmAddress.slice(2), 'hex')
    ]);
}

const fundAddress = async (address: string) => {
    const faucetUrl = `https://faucet.mutinynet.com/api/onchain`
    const txid = axios.post(faucetUrl, { address, sats: 100000 }).then((response: any) => response.data.txid);
    return txid;
}

const waitForConfirmation = async (txid: string, userTaprootAddress: string) => {
    try {
        while (true) {
            const response = await axios.get(`${mutinyNetUrl}/${txid}`);
            const status = response.data.status.confirmed;
            if (!status) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                continue;
            }

            const outputs = response.data.vout;
            const index = outputs.findIndex((output: any) => {
                return output["scriptpubkey_address"] === userTaprootAddress;
            });

            return index;
        }
    } catch (error: any) {
        if (error.response && error.response.data === "Transaction not found") {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return waitForConfirmation(txid, userTaprootAddress);
        } else {
            console.error('Error:', error);
            throw error;
        }
    }
}

export async function POST(req: Request) {
    const { address }: { address: string } = await req.json();
    try {
        const aliceKeyPair = ECPair.fromPrivateKey(Buffer.from(aliceSecret, 'hex'));
        const bobKeyPair = ECPair.fromPrivateKey(Buffer.from(bobSecret, 'hex'));
        const charlieKeyPair = ECPair.fromPrivateKey(Buffer.from(charlieSecret, 'hex'));
        const internalKeyPair = ECPair.fromPrivateKey(Buffer.from(internalSecret, 'hex'));
        const internalPubkey = internalKeyPair.publicKey.slice(1);

        // Create a multisig script
        const multisigScript = createMultiSigTapScript([
            aliceKeyPair.publicKey,
            bobKeyPair.publicKey,
            charlieKeyPair.publicKey
        ]);

        // Time lock script
        const timelockScript = createTimelockScript(200, aliceKeyPair.publicKey);

        // Inscribe script
        const inscribeScript = createInsribeScript(address);

        const taprootSpendInfo = bitcoin.payments.p2tr({
            internalPubkey,
            scriptTree: [{ output: multisigScript }, { output: timelockScript }],
            network: bitcoin.networks.testnet
        });
        const destinationTaprootAddress = taprootSpendInfo.address;
        console.log(`This is the address where we are locking BTC: ${destinationTaprootAddress}`);

        // User taproot address
        const taprootPayment = bitcoin.payments.p2tr({
            internalPubkey: aliceKeyPair.publicKey.slice(1),
            network: bitcoin.networks.testnet
        });
        const userTaprootAddress = taprootPayment.address;

        const prevTxid = await fundAddress(userTaprootAddress);
        const vout = await waitForConfirmation(prevTxid, userTaprootAddress);
        const amount = 5000;
        const change = 94000;

        const prevUtxo = {
            value: 100000,
            script: taprootPayment.output,
        };

        // Tweak the key pair
        const tweakSigner = aliceKeyPair.tweak(
            bitcoin.crypto.taggedHash('TapTweak', Buffer.concat([aliceKeyPair.publicKey.slice(1)]))
        );

        const txx = new bitcoin.Psbt({ network: bitcoin.networks.testnet })
            .addInput({
                hash: prevTxid,
                index: vout,
                witnessUtxo: prevUtxo,
                tapInternalKey: aliceKeyPair.publicKey.slice(1),
            })
            .addOutputs([
                { address: destinationTaprootAddress, value: amount },
                { address: userTaprootAddress, value: change },
                { script: inscribeScript, value: 0 }
            ])
            .signInput(0, tweakSigner)
            .finalizeInput(0);

        const signedTx = txx.extractTransaction().toHex();
        const txid = axios.post(mutinyNetUrl, signedTx).then((response: any) => response.data.toString());
        console.log(`Transaction sent`);
        return Response.json({ txid });

    } catch (error) {
        console.error("Error sending transaction:", error);
    }
};