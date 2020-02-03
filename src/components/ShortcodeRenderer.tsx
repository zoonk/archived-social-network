import dynamic from 'next/dynamic';

const VimeoPlayer = dynamic(() => import('./VimeoPlayer'));
const YoutubePlayer = dynamic(() => import('./YoutubePlayer'));

interface ShortcodeRendererProps {
  identifier: 'vimeo' | 'youtube';
  attributes: {
    id: string;
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
  const { id } = attributes;

  switch (identifier) {
    case 'vimeo':
      return <VimeoPlayer id={id} />;
    case 'youtube':
      return <YoutubePlayer id={id} />;
    default:
      return null;
  }
};

export default ShortcodeRenderer;
