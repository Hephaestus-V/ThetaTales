
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { cookieStorage, createStorage } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { ThetaTestnet } from '@/lib/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

// Your WalletConnect Cloud project ID
export const projectId = '8e4751caa6e0c88939be236f11f8e6a8'

// Create a metadata object
const metadata = {
  name: 'ThetaTales',
  description: 'AppKit Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Create wagmiConfig
const chains = [mainnet, sepolia,ThetaTestnet] as const
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
  // Optional - Override createConfig parameters
})