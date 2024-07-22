'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from '@/components/BookCard';
import { useBookManagementRead } from '@/blockchain/hooks/useBookManagementRead';
import { Book } from '@/types';


const BookMarketplace: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const { data : rawBooks, isLoading, isError, refetch } = useBookManagementRead('getBookDetails');

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (rawBooks && rawBooks.length > 0) {
        const enrichedBooks = await Promise.all(rawBooks.map(async (book) => {
          const ipfsData = await getBookDetailsFromIPFS(book.ipfsCid);
          return {
            id: Number(book.id),
            views: Number(book.views),
            address: book.owner,
            title: ipfsData.Name ,
            author: ipfsData.Author ,
            description: ipfsData.Description ,
            coverUrl: ipfsData.CoverPageUrl ,
            pdfUrl: ipfsData.encryptedBookUrl,
            encryptedKeyString : ipfsData.encryptedKeyString
          };
        }));
        setBooks(enrichedBooks);
      }
    };

    fetchBookDetails();
  }, [rawBooks]);

  const getBookDetailsFromIPFS = async (ipfsCid: string) => {
    try {
      const response = await axios.get(ipfsCid);
      return response.data;
    } catch (error) {
      console.error('Error fetching book details from IPFS:', error);
      return {};
    }
  };

  if (isLoading) {
    return <div className="text-center mt-8">Loading books...</div>;
  }

  if (isError) {
    return <div className="text-center mt-8 text-red-500">Error loading books. Please try again later.</div>;
  }

  if (!rawBooks || rawBooks.length === 0) {
    return <div className="text-center mt-8">No books available.</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Book Marketplace</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              address1={book.address}
              description={book.description}
              coverUrl={book.coverUrl}
              pdfUrl={book.pdfUrl}
              views={book.views}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookMarketplace;
