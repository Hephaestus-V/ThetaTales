import Link from 'next/link';
import { BookCardProps } from '@/types';


const BookCard: React.FC<BookCardProps> = ({ id, title, author, address, description, coverUrl, pdfUrl }) => {
  return (
    <div className="bg-transparent backdrop-blur-sm rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
      <img src={coverUrl} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-2">By {author}</p>
        <p className="text-gray-500 mb-2">Address: {address}</p>
        <p className="text-gray-700 mb-4 flex-grow">{description}</p>
      </div>
      <div className="p-4">
        <Link href={`/book-viewer/${id}?pdfUrl=${encodeURIComponent(pdfUrl)}`} className="block w-full bg-blue-500 text-white text-center px-4 py-2 rounded-md hover:bg-blue-600">
          View PDF
        </Link>
      </div>
    </div>
  );
};

export default BookCard;
