'use client'

import React from 'react';
import Link from 'next/link';
import { BookCardProps } from '@/types';
import { useWalletAndNetworkCheck } from '@/blockchain/hooks/useWalletAndNetworkCheck';
import { useSubscriptionRead } from '@/blockchain/hooks/useSubscriptionContract';
import { useAccount } from 'wagmi';


const BookCard: React.FC<BookCardProps> = ({ id, title, author, address1, description, coverUrl, pdfUrl, encryptedKeyString }) => {
  const { isReady, isWalletConnected, isCorrectNetwork } = useWalletAndNetworkCheck();
  const {address}=useAccount();
  const {data:userToken}=useSubscriptionRead('userTokens',[address]);
  const {data:subscriptionStatus}=useSubscriptionRead('checkSubscriptionStatus',[userToken]);
  
  const handleViewClick = (e: React.MouseEvent) => {
    if (!isWalletConnected) {
      e.preventDefault();
      alert('Please connect your wallet to view book details.');
    } else if (!isCorrectNetwork) {
      e.preventDefault();
      alert('Please switch to the Theta network to view book details.');
    }
    else if(!userToken){
      e.preventDefault();
      alert('please subscribe to avail our Service');
    }
    else if(!subscriptionStatus){
      e.preventDefault();
      alert('Your Subscription Has Expired, Please Subscribe again');
    }
    
  };

  return (
    <div className="bg-transparent backdrop-blur-sm rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
      <img src={coverUrl} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-2">By {author}</p>
        <p className="text-gray-500 mb-2">Address: {address1}</p>
        <p className="text-gray-700 mb-4 flex-grow">{description}</p>
      </div>
      <div className="p-4">
        <Link 
          href={`/book-viewer/${id}?pdfUrl=${encodeURIComponent(pdfUrl)}&encryptedKeyString=${encodeURIComponent(encryptedKeyString)}`}
          className={`block w-full text-white text-center px-4 py-2 rounded-md ${isReady ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
          onClick={handleViewClick}
        >
          View PDF
        </Link>
      </div>
    </div>
  );
};

export default BookCard;