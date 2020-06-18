import { Element } from 'slate';
import Blockquote from './Blockquote';
import Divider from './Divider';
import Heading from './Heading';
import Image from './Image';
import Link from './Link';
import List from './List';
import PDF from './PDFViewer';
import Table from './Table';
import TableCell from './TableCell';
import TableRow from './TableRow';
import Text from './Text';
import Video from './Video';

interface CustomElementProps {
  attributes: any;
  children: React.ReactNode;
  element: Element;
}

const CustomElement = (props: CustomElementProps) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case 'blockquote':
      return <Blockquote {...attributes}>{children}</Blockquote>;
    case 'h2':
      return (
        <Heading {...attributes} title={element.children[0].text}>
          {children}
        </Heading>
      );
    case 'ul':
      return <ul {...attributes}>{children}</ul>;
    case 'li':
      return <List {...attributes}>{children}</List>;
    case 'ol':
      return <ol {...attributes}>{children}</ol>;
    case 'code':
      return <pre {...attributes}>{children}</pre>;
    case 'hr':
      return <Divider {...attributes} />;
    case 'new-line':
      return <p {...attributes}>{children}</p>;
    case 'link':
      return (
        <Link {...attributes} href={element.url}>
          {children}
        </Link>
      );
    case 'table':
      return <Table {...attributes}>{children}</Table>;
    case 'table-row':
      return <TableRow {...attributes}>{children}</TableRow>;
    case 'table-cell':
      return <TableCell {...attributes}>{children}</TableCell>;
    case 'image':
      return <Image {...props} />;
    case 'video':
      return (
        <Video {...attributes} url={element.url}>
          {children}
        </Video>
      );
    case 'pdf':
      return (
        <PDF {...attributes} url={element.url}>
          {children}
        </PDF>
      );
    default:
      return <Text {...attributes}>{children}</Text>;
  }
};

export default CustomElement;
