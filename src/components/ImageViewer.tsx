import { theme } from '@zoonk/utils';

interface ImageViewerProps {
  src?: string;
  height?: string;
  width?: string;
  align?: 'center' | 'left' | 'right';
  alt?: string;
  title?: string;
}

const ImageViewer = ({
  src,
  height,
  width,
  align,
  alt,
  title,
}: ImageViewerProps) => {
  const float = align === 'left' || align === 'right' ? align : 'none';

  if (!src) return null;

  return (
    <div style={{ float, textAlign: align, margin: theme.spacing(0, 1) }}>
      <img
        src={src}
        title={title}
        alt={alt}
        style={{ maxWidth: width || '100%', height: height || 'auto' }}
      />
    </div>
  );
};

export default ImageViewer;
