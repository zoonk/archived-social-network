import dynamic from 'next/dynamic';
import { Avatar, CircularProgress, Typography } from '@material-ui/core';
import { theme } from '@zoonk/utils';
import useAuth from './useAuth';

const LoginForm = dynamic(() => import('./LoginForm'), { ssr: false });

interface FormHeaderProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
}

/**
 * Container for wrapping a form for editing some content.
 */
const FormContainer = ({ children, icon, title }: FormHeaderProps) => {
  const { user } = useAuth();

  // If the user isn't logged in, then display a login form.
  if (user === null) {
    return <LoginForm />;
  }

  // If the authentication status is undefined, then display a loading component.
  if (user === undefined) {
    return <CircularProgress />;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: theme.spacing(4),
      }}
    >
      <Avatar style={{ backgroundColor: theme.palette.primary.main }}>
        {icon}
      </Avatar>

      <Typography component="h2" variant="h5">
        {title}
      </Typography>

      {children}
    </div>
  );
};

export default FormContainer;
