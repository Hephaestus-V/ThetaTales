import React from 'react';
import { Button } from '@/components/ui/button';
import { SubscriptionCardProps } from '@/types';

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ duration, price, features }) => {
  return (
    <div className="bg-gradient-to-br from-blue-500  rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
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
        <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold py-3 rounded-full transform transition-transform duration-300 hover:scale-105">
          Subscribe Now
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionCard;