import ReactHtmlParser from 'react-html-parser';

interface ViwerProps {
  /**
   * HTML content coming from the editor. We're using the HTML content
   * here to avoid having to load a Quill instance, which doesn't work
   * on server-side rendering.
   */
  html: string;
}

const Viewer = ({ html }: ViwerProps) => {
  return (
    <div className="ql-snow">
      <div className="ql-editor ql-container">{ReactHtmlParser(html)}</div>
    </div>
  );
};

export default Viewer;
