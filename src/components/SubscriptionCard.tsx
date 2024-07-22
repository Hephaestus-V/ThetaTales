'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { SubscriptionCardProps } from '@/types';
import { useWalletAndNetworkCheck } from '@/blockchain/hooks/useWalletAndNetworkCheck';
import { useSubscriptionWrite } from '@/blockchain/hooks/useSubscriptionContract';
import { parseEther } from 'viem';

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ duration, price, features }) => {
  const { isReady, isWalletConnected, isCorrectNetwork } = useWalletAndNetworkCheck();

  const getPlan = (): number => {
    switch (duration) {
      case '1 month': return 0; // SubscriptionPlan.OneMonth
      case '3 months': return 1; // SubscriptionPlan.ThreeMonths
      case '6 months': return 2; // SubscriptionPlan.SixMonths
      default: throw new Error('Invalid duration');
    }
  };

  const { write,isPending, isSuccess } = useSubscriptionWrite("subscribe");

  const handleSubscribe = async () => {
    if (!isWalletConnected) {
      alert('Please connect your wallet to subscribe.');
      return;
    }
    if (!isCorrectNetwork) {
      alert('Please switch to the Theta network to subscribe.');
      return;
    }

    try {
      console.log(getPlan())
      console.log(parseEther(price.split(' ')[0]))
      console.log(process.env.NEXT_PUBLIC_SUBSCRIPTION_CONTRACT_ADDRESS)
      await write([getPlan()],(price.split(' ')[0]));
    } catch (error) {
      console.error('Subscription error:', error);
      alert('An error occurred while subscribing. Please try again.');
    }
  };
  
  return (
    <div className="bg-gradient-to-br from-blue-500 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      <div className="p-6 flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-4 text-white">{duration} NFT Subscription</h2>
        <p className="text-3xl font-semibold mb-6 text-yellow-300">{price}</p>
        <ul className="mb-6 flex-grow">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center mb-2 text-white">
              <svg className="w-4 h-4 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        <Button 
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold py-3 rounded-full transform transition-transform duration-300 hover:scale-105" 
          onClick={handleSubscribe}
          disabled={!isReady || isPending}
        >
          {isPending ? 'Processing...' : isSuccess ? 'Subscribed!' : 'Subscribe Now'}
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionCard;