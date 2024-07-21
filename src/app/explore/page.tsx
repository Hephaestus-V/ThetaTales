'use client';

import React from 'react';
import BookCard from '@/components/BookCard';

// Sample book data
const sampleBooks = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    address: "0x7d...b01E",
    description: "A classic novel about the American Dream in the Jazz Age dflajsdlfjlasdkj alsdfjklajsd.",
    coverUrl: "https://gateway.pinata.cloud/ipfs/QmYg8DZBJDm7brdVsrW47hX6iR5CztYmJxLM2SMFLh5SV1",
    pdfUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf"
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    address: "0x1b...239B",
    description: "A powerful story of racial injustice and loss of innocencjdsflkja lasdjflkjadsk e in the American South.",
    coverUrl: "https://gateway.pinata.cloud/ipfs/QmPt2W4tbCfdcqZ8vpUFcGgtPDvQgnsLgyM2G9xQBDkSrP",
    pdfUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf"
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    address: "0xC7...1272",
    description: "A dystopian novel set in a totalitarian society.",
    coverUrl: "https://gateway.pinata.cloud/ipfs/QmfJfWM72Ge7DMmp5AJtqD3ebrXEXuMdpKTXwY4ddGQA9N",
    pdfUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf"
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    address: "0xE0...5a0E",
    description: "A classic romance novel set in 19th century England.",
    coverUrl: "dashboard-ui.png",
    pdfUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf"
  },
  {
    id: 5,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    address: "0xE0...5a0E",
    description: "A classic romance novel set in 19th century England dflasdjflkads alsdfjlasdj.",
    coverUrl: "dashboard-ui.png",
    pdfUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf"
  },
  {
    id: 6,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    address: "0xE0...5a0E",
    description: "A classic romance novel set in 19th century England afsdfsd asdfjlalsd asdfhkhsdf dsfajl.",
    coverUrl: "dashboard-ui.png",
    pdfUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf"
  }
];

const BookMarketplace: React.FC = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Book Marketplace</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sampleBooks.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              address={book.address}
              description={book.description}
              coverUrl={book.coverUrl}
              pdfUrl={book.pdfUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookMarketplace;