import React from 'react';
import SubscriptionCard from '@/components/SubscriptionCard';

export default function SubscriptionPage() {
  const subscriptions = [
    { duration: '1 month', price: '0.1 ETH', features: ['Basic access', 'Limited content'] },
    { duration: '3 months', price: '0.25 ETH', features: ['Full access', 'Exclusive content', 'Priority support'] },
    { duration: '6 months', price: '0.45 ETH', features: ['Full access', 'Exclusive content', 'Priority support', 'Early access to new features'] },
  ];
  

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