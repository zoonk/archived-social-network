import { theme } from '@zoonk/utils';

interface DividerViewProps {
  children: React.ReactNode;
}

/**
 * Divider component for a post view.
 */
const DividerView = ({ children }: DividerViewProps) => {
  return (
    <div
      style={{
        margin: '16px 25%',
        border: 'none',
        height: '1px',
        width: '50%',
        backgroundColor: theme.palette.divider,
      }}
    >
      {children}
    </div>
  );
};

export default DividerView;
