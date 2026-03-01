import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileUrl: string;
  doublePageMode?: boolean;
}

export default function PDFViewer({ fileUrl, doublePageMode = false }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const goToPrevPage = () => {
    if (doublePageMode) {
      setPageNumber((prev) => Math.max(1, prev - 2));
    } else {
      setPageNumber((prev) => Math.max(1, prev - 1));
    }
  };

  const goToNextPage = () => {
    if (doublePageMode) {
      setPageNumber((prev) => Math.min(numPages - 1, prev + 2));
    } else {
      setPageNumber((prev) => Math.min(numPages, prev + 1));
    }
  };

  const hasNextPage = doublePageMode ? pageNumber < numPages - 1 : pageNumber < numPages;
  const hasPrevPage = pageNumber > 1;

  return (
    <div className="flex flex-col items-center space-y-4">
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }
        error={
          <div className="text-red-600 p-8 bg-red-50 rounded-lg">
            載入PDF時發生錯誤，請重試
          </div>
        }
      >
        <div className={`flex ${doublePageMode ? 'space-x-0' : 'justify-center'} bg-white shadow-2xl`}>
          {doublePageMode && pageNumber <= numPages ? (
            <>
              <Page
                pageNumber={pageNumber}
                width={400}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
              {pageNumber + 1 <= numPages && (
                <Page
                  pageNumber={pageNumber + 1}
                  width={400}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              )}
            </>
          ) : (
            <Page
              pageNumber={pageNumber}
              width={800}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          )}
        </div>
      </Document>

      {numPages > 1 && (
        <div className="flex items-center space-x-4 bg-white px-6 py-3 rounded-full shadow-lg">
          <button
            onClick={goToPrevPage}
            disabled={!hasPrevPage}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-gray-700">
            {doublePageMode && pageNumber + 1 <= numPages
              ? `${pageNumber}-${pageNumber + 1} / ${numPages}`
              : `${pageNumber} / ${numPages}`}
          </span>
          <button
            onClick={goToNextPage}
            disabled={!hasNextPage}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
