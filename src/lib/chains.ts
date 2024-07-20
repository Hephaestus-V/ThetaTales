import { Chain } from 'wagmi/chains'

export const ThetaTestnet
= {
 id:  365,
 name: 'Theta Testnet',
 nativeCurrency: { name: 'Theta Testnet', symbol: 'TFUEL', decimals: 18 },
 rpcUrls: {
   default: { http: ['https://eth-rpc-api-testnet.thetatoken.org/rpc'] },},
 blockExplorers: {
   default: { name: 'Theta Testnet Explorer', url: 'https://testnet-explorer.thetatoken.org/' },
 },
} as const satisfies Chain 