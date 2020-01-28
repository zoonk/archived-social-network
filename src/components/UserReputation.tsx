import { Avatar, Chip } from '@material-ui/core';

interface UserReputationProps {
  xp: number;
}

/**
 * Display a user's reputation.
 */
const UserReputation = ({ xp }: UserReputationProps) => {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Chip
        avatar={<Avatar component="span" src="/coin.svg" />}
        component="span"
        label={`${xp} XP`}
        size="small"
        color="primary"
      />
    </span>
  );
};

export default UserReputation;
