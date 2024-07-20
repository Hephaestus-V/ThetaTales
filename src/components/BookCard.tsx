import React from 'react';
import { Button } from '@/components/ui/button';
import { BookProps } from '@/types';

const BookCard: React.FC<BookProps> = ({ title, author, address, description, coverUrl }) => {
  return (
    <div className="bg-transparent backdrop-blur-sm rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
      <img src={coverUrl} alt={`${title} Cover`} className="w-full h-64 object-cover"/>
      <div className="p-4 flex flex-col flex-grow">
      <h2 className="text-xl font-semibold text-black dark:text-white">{title}</h2>
        <p className="text-muted-foreground">Author: {author}</p>
        <p className="text-muted-foreground">{address}</p>
        <p className="text-muted-foreground mt-2 flex-grow">{description}</p>
        <Button className="w-full mt-4">View</Button>
      </div>
    </div>
  );
};

export default BookCard;