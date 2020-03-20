interface PDFViewerProps {
  url: string;
}

/**
 * Display a PDF file.
 */
const PDFViewer = ({ url }: PDFViewerProps) => {
  return <iframe src={url} width="100%" height="700px" title="PDF" />;
};

export default PDFViewer;
