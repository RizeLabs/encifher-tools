// import * as bitcoin from 'bitcoinjs-lib';
// const ECPairFactory = require("ecpair").default;
// const ecc = require("tiny-secp256k1");

// bitcoin.initEccLib(ecc);
// const ECPair = ECPairFactory(ecc);
// const aliceSecret = '2bd806c97f0e00af1a1fc3328fa763a9269723c8db8fac4f93af71db186d6e90';

// export function generateUserTaprootAddress() {
//     const aliceKeyPair = ECPair.fromPrivateKey(Buffer.from(aliceSecret, 'hex'));
//     return bitcoin.payments.p2tr({
//         internalPubkey: Buffer.from(aliceKeyPair.publicKey.slice(1)),
//         network: bitcoin.networks.testnet
//     }).address;
// }

import axios from 'axios';

export async function fetchBalance(address: string) {
    try {
        const response = await fetch(`https://mutinynet.com/api/address/${address}`)
            .then((response) => response.json())
        return response.chain_stats.funded_txo_sum - response.chain_stats.spent_txo_sum;
    } catch (error) {
        console.log(error);
    }
}

export async function waitForConfirmation(txid: string) {
    try {
        while (true) {
            const mutinyNetUrl = 'https://mutinynet.com/api/tx';
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