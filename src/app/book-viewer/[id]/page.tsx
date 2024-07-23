'use client';

import { useSearchParams } from 'next/navigation';
import { pdfjs, Document as PDFDocument, Page as PDFPage } from 'react-pdf';
import { useState } from 'react';
import {useAccount} from 'wagmi'
import { useEffect } from 'react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface PDFViewerProps {
  pdfUrl: string;
  encryptedKeyString : string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl , encryptedKeyString}) => {

  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [pdfFile, setPdfFile] = useState<string | null>(null);

   useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch('/api/access-book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `123`
          },
          body: JSON.stringify({
            encryptedBookUrl: pdfUrl,
            encryptedKeyString: encryptedKeyString
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch PDF');
        }
        const arrBuffer = await response.arrayBuffer();
        const blob = new Blob([arrBuffer])
        var url = URL.createObjectURL(blob);
        setPdfFile(url)
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    };

    if (pdfUrl && encryptedKeyString) {
      fetchPdf();
    }
  }, [pdfUrl, encryptedKeyString]);





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
            <PDFDocument file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
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

  const pdfUrl = searchParams?.get('pdfUrl') ?? ' ';
  const encryptedKeyString = searchParams?.get('encryptedKeyString') ?? '';

  return <PDFViewer pdfUrl={pdfUrl} encryptedKeyString={encryptedKeyString} />;
}