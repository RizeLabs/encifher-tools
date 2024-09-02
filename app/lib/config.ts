'use client';
import { Chain, getDefaultConfig } from '@rainbow-me/rainbowkit'

const encifher = {
   id: 9000,
   name: 'Encifher Devnet',
   iconUrl: 'https://encifher.io/enc.png',
   nativeCurrency: {
      name: 'Encrypted bitcoin',
      symbol: 'eBTC',
      decimals: 18
   },
   rpcUrls: {
      default: { http: ["https://rpc.encifher.io"] }
   }
} as const satisfies Chain

export const config = getDefaultConfig({
   appName: 'Encifher DEX',
   projectId: 'cbabb06b3a049fce0e9231318d94998e',
   chains: [encifher]
});