'use client'

import React,{useEffect} from 'react';
import SubscriptionCard from '@/components/SubscriptionCard';
import { useRouter } from 'next/navigation';
import { useWalletAndNetworkCheck } from '@/blockchain/hooks/useWalletAndNetworkCheck';
import { useSubscriptionRead } from '@/blockchain/hooks/useSubscriptionContract';

export default function SubscriptionPage() {
  const subscriptions = [
    { duration: '1 month', price: '1 TFUEL', features: ['Basic access', 'Limited content'] },
    { duration: '3 months', price: '2 TFUEL', features: ['Full access', 'Exclusive content', 'Priority support'] },
    { duration: '6 months', price: '5 TFUEL', features: ['Full access', 'Exclusive content', 'Priority support', 'Early access to new features'] },
  ];

  const {isCorrectNetwork}=useWalletAndNetworkCheck();

  const router = useRouter();

  useEffect(() => {
      if (!isCorrectNetwork) {
      alert('Please connect to the correct network.');
      router.push('/');
      }
  }, [isCorrectNetwork, router]);
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Choose Your NFT Subscription</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {subscriptions.map((sub, index) => (
          <SubscriptionCard key={index} {...sub} />
        ))}
      </div>
    </div>
  );
}