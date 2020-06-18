import { forwardRef } from 'react';

interface PDFProps {
  url: string;
}

const getPDFUrl = (url: string) => {
  const isDrive = url.includes('drive.google');

  if (isDrive) {
    const file = url.replace('/view', '/preview');
    return file;
  }

  return url;
};

const PDF = forwardRef<HTMLDivElement, PDFProps>((props, ref) => {
  const { children, url } = props;
  const src = getPDFUrl(url);

  return (
    <div ref={ref} contentEditable={false}>
      <iframe src={src} width="100%" height="700px" title="PDF">
        {children}
      </iframe>
    </div>
  );
});

export default PDF;
