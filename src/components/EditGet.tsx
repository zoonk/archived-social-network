import { useEffect, useState } from 'react';
import Error from 'next/error';
import { CircularProgress } from '@material-ui/core';
import EditsItem from '@zoonk/components/EditsItem';
import { Activity } from '@zoonk/models';
import { getActivity } from '@zoonk/services';

interface EditGetProps {
  id: string;
}

const EditGet = ({ id }: EditGetProps) => {
  const [activity, setActivity] = useState<Activity.Get | null>();

  useEffect(() => {
    getActivity(id).then(setActivity);
  }, [id]);

  if (activity === undefined) return <CircularProgress />;
  if (activity === null) return <Error statusCode={404} />;

  return <EditsItem displayTitle edits={activity} />;
};

export default EditGet;
