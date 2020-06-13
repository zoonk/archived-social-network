import { Subject } from '@material-ui/icons';
import FormContainer from './FormContainer';
import useTranslation from './useTranslation';

interface TopicFormContainerProps {
  children: React.ReactNode;
  type?: 'add' | 'edit';
}

const TopicFormContainer = ({
  children,
  type = 'edit',
}: TopicFormContainerProps) => {
  const translate = useTranslation();
  const title = type === 'edit' ? 'edit_topic' : 'topic_create';

  return (
    <FormContainer icon={<Subject />} title={translate(title)}>
      {children}
    </FormContainer>
  );
};

export default TopicFormContainer;
