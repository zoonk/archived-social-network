import dynamic from 'next/dynamic';

const GoogleDriveViewer = dynamic(() => import('./GoogleDriveViewer'));
const PDFViewer = dynamic(() => import('./PDFViewer'));
const VimeoPlayer = dynamic(() => import('./VimeoPlayer'));
const YoutubePlayer = dynamic(() => import('./YoutubePlayer'));

interface ShortcodeRendererProps {
  identifier: 'drive' | 'pdf' | 'vimeo' | 'youtube';
  attributes: {
    [key: string]: string;
  };
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
  const { id, url } = attributes;

  switch (identifier) {
    case 'drive':
      return <GoogleDriveViewer id={id} />;
    case 'pdf':
      return <PDFViewer url={url} />;
    case 'vimeo':
      return <VimeoPlayer id={id} />;
    case 'youtube':
      return <YoutubePlayer id={id} />;
    default:
      return null;
  }
};

export default ShortcodeRenderer;
