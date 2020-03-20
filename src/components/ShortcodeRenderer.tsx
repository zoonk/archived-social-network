import dynamic from 'next/dynamic';

const GoogleDriveViewer = dynamic(() => import('./GoogleDriveViewer'));
const ImageViewer = dynamic(() => import('./ImageViewer'));
const PDFViewer = dynamic(() => import('./PDFViewer'));
const VimeoPlayer = dynamic(() => import('./VimeoPlayer'));
const YoutubePlayer = dynamic(() => import('./YoutubePlayer'));

interface ShortcodeRendererProps {
  identifier: 'drive' | 'img' | 'pdf' | 'vimeo' | 'youtube';
  attributes: any;
}

/**
 * Render custom components for the editor view.
 * For example:
 * `[[ youtube id="dqTTojTija8" ]]`
 */
const ShortcodeRenderer = ({
  identifier,
  attributes,
}: ShortcodeRendererProps) => {
  switch (identifier) {
    case 'drive':
      return <GoogleDriveViewer {...attributes} />;
    case 'img':
      return <ImageViewer {...attributes} />;
    case 'pdf':
      return <PDFViewer {...attributes} />;
    case 'vimeo':
      return <VimeoPlayer {...attributes} />;
    case 'youtube':
      return <YoutubePlayer {...attributes} />;
    default:
      return null;
  }
};

export default ShortcodeRenderer;
