import { Fragment, useEffect, useState } from 'react';
import Error from 'next/error';
import { CircularProgress } from '@material-ui/core';
import { Group } from '@zoonk/models';
import { getGroup } from '@zoonk/services';
import GroupEditForm from './GroupEditForm';
import GroupFormContainer from './GroupFormContainer';
import GroupsBreadcrumb from './GroupsBreadcrumb';
import useTranslation from './useTranslation';

interface GroupEditProps {
  id: string;
}

const GroupEdit = ({ id }: GroupEditProps) => {
  const translate = useTranslation();
  const [group, setGroup] = useState<Group.Get | null | undefined>();

  useEffect(() => {
    getGroup(id).then(setGroup);
  }, [id]);

  if (group === undefined) return <CircularProgress />;
  if (group === null) return <Error statusCode={404} />;

  return (
    <Fragment>
      <GroupsBreadcrumb
        topicId={group.topics[0]}
        groupId={id}
        groupName={group.title}
        title={translate('group_edit')}
      />
      <GroupFormContainer type="edit">
        <GroupEditForm data={group} />
      </GroupFormContainer>
    </Fragment>
  );
};

export default GroupEdit;
