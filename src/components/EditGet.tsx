import { useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import EditsItem from '@zoonk/components/EditsItem';
import { Activity } from '@zoonk/models';
import { getActivity } from '@zoonk/services';

interface EditGetProps {
  id: string;
}

const EditGet = ({ id }: EditGetProps) => {
  const [activity, setActivity] = useState<Activity.Get>();

  useEffect(() => {
    getActivity(id).then(setActivity);
  }, [id]);

  if (!activity) return <CircularProgress />;

  return <EditsItem displayTitle edits={activity} />;
};

export default EditGet;
