import PDFViewer from './PDFViewer';

interface GoogleDriveViewerProps {
  id: string;
}

/**
 * Preview a file from Google Drive.
 */
const GoogleDriveViewer = ({ id }: GoogleDriveViewerProps) => {
  const url = `https://drive.google.com/file/d/${id}/preview`;
  return <PDFViewer url={url} />;
};

export default GoogleDriveViewer;
