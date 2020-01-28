import { useContext } from 'react';
import { DeviceHub } from '@material-ui/icons';
import { GlobalContext } from '@zoonk/utils';
import FormContainer from './FormContainer';

interface ChapterFormContainerProps {
  children: React.ReactNode;
  type?: 'add' | 'edit';
}

/**
 * Container for a chapter form.
 */
const ChapterFormContainer = ({
  children,
  type = 'edit',
}: ChapterFormContainerProps) => {
  const { translate } = useContext(GlobalContext);
  const title = type === 'edit' ? 'chapter_edit' : 'chapter_add';

  return (
    <FormContainer icon={<DeviceHub />} title={translate(title)}>
      {children}
    </FormContainer>
  );
};

export default ChapterFormContainer;
