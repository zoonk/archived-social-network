import { Fragment, useContext, useEffect, useState } from 'react';
import Error from 'next/error';
import { CircularProgress } from '@material-ui/core';
import GroupEditForm from '@zoonk/components/GroupEditForm';
import GroupFormContainer from '@zoonk/components/GroupFormContainer';
import GroupsBreadcrumb from '@zoonk/components/GroupsBreadcrumb';
import { Group } from '@zoonk/models';
import { getGroup } from '@zoonk/services';
import { GlobalContext } from '@zoonk/utils';

interface GroupEditProps {
  id: string;
}

const GroupEdit = ({ id }: GroupEditProps) => {
  const { translate } = useContext(GlobalContext);
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
