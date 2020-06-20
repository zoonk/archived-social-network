import { Grid, makeStyles } from '@material-ui/core';
import GroupDetails from '@zoonk/components/GroupDetails';
import ItemCredits from '@zoonk/components/ItemCredits';
import MenuCommunity from '@zoonk/components/MenuCommunity';
import useTranslation from '@zoonk/components/useTranslation';
import { Group } from '@zoonk/models';

const useStyles = makeStyles((theme) => ({
  column: {
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
}));

interface GroupBaseProps {
  children: React.ReactNode;
  group: Group.Get;
}

const GroupBase = ({ children, group }: GroupBaseProps) => {
  const translate = useTranslation();
  const classes = useStyles();
  const { createdBy, createdById, id } = group;
  const author = { ...createdBy, id: createdById };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4} className={classes.column}>
        <GroupDetails group={group} />
        <ItemCredits editors={[author]} title={translate('created_by')} />
        <MenuCommunity category="groups" id={id} />
      </Grid>

      <Grid item xs={12} sm={6} md={8} className={classes.column}>
        {children}
      </Grid>
    </Grid>
  );
};

export default GroupBase;
