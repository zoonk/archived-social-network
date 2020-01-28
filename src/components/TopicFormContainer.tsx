import { useContext } from 'react';
import { Subject } from '@material-ui/icons';
import { GlobalContext } from '@zoonk/utils';
import FormContainer from './FormContainer';

interface TopicFormContainerProps {
  children: React.ReactNode;
  type?: 'add' | 'edit';
}

/**
 * Container for a topic form.
 */
const TopicFormContainer = ({
  children,
  type = 'edit',
}: TopicFormContainerProps) => {
  const { translate } = useContext(GlobalContext);
  const title = type === 'edit' ? 'edit_topic' : 'topic_create';

  return (
    <FormContainer icon={<Subject />} title={translate(title)}>
      {children}
    </FormContainer>
  );
};

export default TopicFormContainer;
