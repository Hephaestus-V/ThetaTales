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
    coverUrl: "dashboard-ui.png"
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    address: "0x1b...239B",
    description: "A powerful story of racial injustice and loss of innocencjdsflkja lasdjflkjadsk e in the American South.",
    coverUrl: "dashboard-ui.png"
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    address: "0xC7...1272",
    description: "A dystopian novel set in a totalitarian society.",
    coverUrl: "dashboard-ui.png"
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    address: "0xE0...5a0E",
    description: "A classic romance novel set in 19th century England.",
    coverUrl: "dashboard-ui.png"
  },
  {
    id: 5,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    address: "0xE0...5a0E",
    description: "A classic romance novel set in 19th century England dflasdjflkads alsdfjlasdj.",
    coverUrl: "dashboard-ui.png"
  },
  {
    id: 6,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    address: "0xE0...5a0E",
    description: "A classic romance novel set in 19th century England afsdfsd asdfjlalsd asdfhkhsdf dsfajl.",
    coverUrl: "dashboard-ui.png"
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
              title={book.title}
              author={book.author}
              address={book.address}
              description={book.description}
              coverUrl={book.coverUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookMarketplace;