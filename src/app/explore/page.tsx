import React, { useEffect, useState } from 'react';
import { useContractRead } from 'wagmi';
import { getContract } from 'wagmi/actions';
import BookCard from '@/components/BookCard';

// ABI for the getBookDetails function
const abi = [
  {
    name: 'getBookDetails',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        components: [
          { name: 'ipfsCid', type: 'string' },
          // Add other fields from your Book struct here
        ],
        name: '',
        type: 'tuple[]',
      },
    ],
  },
];

interface ContractBook {
    ipfsCid: string;
  // Add other fields that your contract returns
}


interface BookDetails {
  author: string;
  frontPageCid: string;
  encryptedBookCid: string;
  encryptedSymmetricKey: string;
  name: string;
}

const BookMarketplace: React.FC = () => {
  const [books, setBooks] = useState<BookDetails[]>([]);

  const { data: bookDetailsFromContract } = useContractRead({
    ...getContract({
      address: process.env.BOOK_CONTRACT as `0x${string}`,
      abi: abi,
    }),
    functionName: 'getBookDetails',
  });
  useEffect(() => {
    const fetchBookDetails = async () => {
      if (bookDetailsFromContract && Array.isArray(bookDetailsFromContract)) {
        const bookPromises = bookDetailsFromContract.map(async (book: ContractBook) => {
          try {
            const response = await fetch(`https://ipfs.io/ipfs/${book.ipfsCid}`);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return await response.json() as BookDetails;
          } catch (error) {
            console.error('Error fetching book details from IPFS:', error);
            return null;
          }
        });

        const fetchedBooks = await Promise.all(bookPromises);
        setBooks(fetchedBooks.filter((book): book is BookDetails => book !== null));
      }
    };

    fetchBookDetails();
  }, [bookDetailsFromContract]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Book Marketplace</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book, index) => (
            <BookCard
              key={index}
              title={book.name}
              author={book.author}
              coverUrl={`https://ipfs.io/ipfs/${book.frontPageCid}`}
              // You may want to add other props here
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookMarketplace;