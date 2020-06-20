import { Fragment, useState } from 'react';
import dynamic from 'next/dynamic';
import { Activity } from '@zoonk/models';
import EditsItem from './EditsItem';
import NoItems from './NoItems';

// Dynamically loading this component to reduce the first load size.
const EditsLoadMore = dynamic(() => import('./EditsLoadMore'), {
  ssr: false,
});

interface EditsListProps {
  data: Activity.Get[];
  displayTitle?: boolean;
  itemPath?: string;
  limit: number;
}

const EditsList = ({ data, displayTitle, itemPath, limit }: EditsListProps) => {
  const [items, setItems] = useState<Activity.Get[]>(data);

  if (items.length === 0) return <NoItems />;

  return (
    <Fragment>
      {items.map((item) => (
        <EditsItem displayTitle={displayTitle} edits={item} key={item.id} />
      ))}

      <EditsLoadMore
        itemPath={itemPath}
        lastItem={items[items.length - 1].id}
        length={items.length}
        limit={limit}
        onLoadMore={(res) => setItems([...items, ...res])}
      />
    </Fragment>
  );
};

export default EditsList;
