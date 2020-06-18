/* eslint-disable no-param-reassign */
const CustomLeaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.sup) {
    children = <sup>{children}</sup>;
  }

  if (leaf.sub) {
    children = <sub>{children}</sub>;
  }

  return <span {...attributes}>{children}</span>;
};

export default CustomLeaf;
