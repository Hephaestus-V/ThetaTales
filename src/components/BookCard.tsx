import React from 'react';

interface BookCardProps {
  title: string;
  author: string;
  coverUrl: string;
  description?: string;
}

const BookCard: React.FC<BookCardProps> = ({ title, author, coverUrl, description }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <img className="w-full" src={coverUrl} alt={`Cover of ${title}`} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base mb-2">By {author}</p>
        {description && (
          <p className="text-gray-700 text-sm">{description}</p>
        )}
      </div>
    </div>
  );
};

export default BookCard;