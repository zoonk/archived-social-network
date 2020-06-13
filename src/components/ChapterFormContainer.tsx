import { DeviceHub } from '@material-ui/icons';
import FormContainer from './FormContainer';
import useTranslation from './useTranslation';

interface ChapterFormContainerProps {
  children: React.ReactNode;
  type?: 'add' | 'edit';
}

const ChapterFormContainer = ({
  children,
  type = 'edit',
}: ChapterFormContainerProps) => {
  const translate = useTranslation();
  const title = type === 'edit' ? 'chapter_edit' : 'chapter_add';

  return (
    <FormContainer icon={<DeviceHub />} title={translate(title)}>
      {children}
    </FormContainer>
  );
};

export default ChapterFormContainer;
