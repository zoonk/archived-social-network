import ReactMarkdown from 'react-markdown';
import shortcodes from 'remark-shortcodes';
import Divider from './Divider';
import EditorHeading from './EditorHeading';
import EditorList from './EditorList';
import EditorText from './EditorText';
import Image from './Image';
import LinkView from './LinkView';
import ShortcodeRenderer from './ShortcodeRenderer';
import TableBodyView from './TableBodyView';
import TableCellView from './TableCellView';
import TableHeadView from './TableHeadView';
import TableRowView from './TableRowView';
import TableView from './TableView';

interface EditorViewProps {
  content: string;
}

/**
 * Visualize some HTML content from a markdown editor.
 */
const EditorView = ({ content }: EditorViewProps) => {
  return (
    <ReactMarkdown
      source={content}
      plugins={[[shortcodes, { startBlock: '[[', endBlock: ']]' }]]}
      renderers={{
        heading: EditorHeading,
        image: Image,
        link: LinkView,
        listItem: EditorList,
        paragraph: EditorText,
        shortcode: ShortcodeRenderer,
        table: TableView,
        tableHead: TableHeadView,
        tableBody: TableBodyView,
        tableRow: TableRowView,
        tableCell: TableCellView,
        thematicBreak: Divider,
      }}
    />
  );
};

export default EditorView;
