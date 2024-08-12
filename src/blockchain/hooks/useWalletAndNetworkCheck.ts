// useWalletAndNetworkCheck.ts
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';

// Theta Testnet Chain ID (replace with Theta Mainnet ID if you're using mainnet)
const THETA_CHAIN_ID = 365; // This is for Theta Testnet. For Mainnet, use 361

export function useWalletAndNetworkCheck() {
  const { isConnected,chainId } = useAccount();
  
  const [isReady, setIsReady] = useState<boolean>(true );

  useEffect(() => {
    setIsReady(true)
    // if (isConnected && chainId === THETA_CHAIN_ID) {
    //   setIsReady(true);
    // } else {
    //   setIsReady(false);
    // }
  }, [isConnected, chainId]);

  return {
    isWalletConnected: isConnected,
    isCorrectNetwork: chainId === THETA_CHAIN_ID,
    isReady,
  };
}