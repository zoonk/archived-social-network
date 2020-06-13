import { GroupWork } from '@material-ui/icons';
import FormContainer from './FormContainer';
import useTranslation from './useTranslation';

interface GroupFormContainerProps {
  children: React.ReactNode;
  type?: 'add' | 'edit';
}

const GroupFormContainer = ({
  children,
  type = 'edit',
}: GroupFormContainerProps) => {
  const translate = useTranslation();
  const title = type === 'edit' ? 'group_edit' : 'group_create';

  return (
    <FormContainer icon={<GroupWork />} title={translate(title)}>
      {children}
    </FormContainer>
  );
};

export default GroupFormContainer;
