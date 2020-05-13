import { useContext } from 'react';
import { GroupWork } from '@material-ui/icons';
import { GlobalContext } from '@zoonk/utils';
import FormContainer from './FormContainer';

interface GroupFormContainerProps {
  children: React.ReactNode;
  type?: 'add' | 'edit';
}

const GroupFormContainer = ({
  children,
  type = 'edit',
}: GroupFormContainerProps) => {
  const { translate } = useContext(GlobalContext);
  const title = type === 'edit' ? 'group_edit' : 'group_create';

  return (
    <FormContainer icon={<GroupWork />} title={translate(title)}>
      {children}
    </FormContainer>
  );
};

export default GroupFormContainer;
