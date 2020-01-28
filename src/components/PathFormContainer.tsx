import { useContext } from 'react';
import { DeviceHub } from '@material-ui/icons';
import { GlobalContext } from '@zoonk/utils';
import FormContainer from './FormContainer';

interface PathFormContainerProps {
  children: React.ReactNode;
  type?: 'add' | 'edit';
}

/**
 * Container for a learning path form.
 */
const PathFormContainer = ({
  children,
  type = 'edit',
}: PathFormContainerProps) => {
  const { translate } = useContext(GlobalContext);
  const title = type === 'edit' ? 'path_edit' : 'path_add';

  return (
    <FormContainer icon={<DeviceHub />} title={translate(title)}>
      {children}
    </FormContainer>
  );
};

export default PathFormContainer;
