'use client';

import { useSearchParams } from 'next/navigation';
import { pdfjs, Document as PDFDocument, Page as PDFPage } from 'react-pdf';
import { useState } from 'react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface PDFViewerProps {
  pdfUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const handlePreviousPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages || 1));
  };

  const handleZoomIn = () => {
    setScale((prevScale) => prevScale + 0.1);
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.1));
  };

  return (
    <div className="pdf-viewer">
      <div className="pdf-container">
        <div className="pdf-document-container">
          <div className="pdf-content">
            <PDFDocument file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
              <PDFPage 
                pageNumber={pageNumber} 
                renderAnnotationLayer={false} 
                renderTextLayer={false} 
                scale={scale}
              />
            </PDFDocument>
          </div>
        </div>
        <div className="pdf-controls">
          <button onClick={handlePreviousPage} disabled={pageNumber <= 1}>Previous</button>
          <p>
            Page {pageNumber} of {numPages}
          </p>
          <button onClick={handleNextPage} disabled={pageNumber >= (numPages || 1)}>Next</button>
          <button onClick={handleZoomOut}>-</button>
          <button onClick={handleZoomIn}>+</button>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  const searchParams = useSearchParams();
  const pdfUrl = searchParams.get('pdfUrl') ?? '';

  return <PDFViewer pdfUrl={pdfUrl} />;
}