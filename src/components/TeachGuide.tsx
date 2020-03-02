import { useContext } from 'react';
import { useRouter } from 'next/router';
import {
  Card,
  CardContent,
  CardHeader,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { getPageTitle, GlobalContext } from '@zoonk/utils';
import EditorView from './EditorView';

type Section = 'lesson' | 'example' | 'article' | 'ref' | 'course' | 'book';

interface CustomPanelProps {
  children: React.ReactNode;
}

interface CustomSummaryProps {
  section: Section;
}

interface CustomDetailsProps {
  children?: React.ReactNode;
  content: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginBottom: theme.spacing(1),
    },
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  details: { display: 'block' },
}));

const CustomPanel = ({ children }: CustomPanelProps) => (
  <ExpansionPanel variant="outlined">{children}</ExpansionPanel>
);

const CustomSummary = ({ section }: CustomSummaryProps) => {
  const { translate } = useContext(GlobalContext);
  const classes = useStyles();

  return (
    <ExpansionPanelSummary
      expandIcon={<ExpandMore />}
      aria-controls={`${section}-content`}
      id={`${section}-header`}
    >
      <Typography className={classes.heading}>
        {translate(`teach_${section}_title` as any)}
      </Typography>
    </ExpansionPanelSummary>
  );
};

const CustomDetails = ({ children, content }: CustomDetailsProps) => {
  const classes = useStyles();

  return (
    <ExpansionPanelDetails className={classes.details}>
      <EditorView content={content} />
      {children}
    </ExpansionPanelDetails>
  );
};

const TeachGuide = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();
  const classes = useStyles();
  const id = String(query.id);
  const title = getPageTitle(id);

  return (
    <div className={classes.root}>
      <Card variant="outlined">
        <CardHeader title={translate('teach_title')} />
        <CardContent>
          <EditorView content={translate('teach_intro')} />
        </CardContent>
      </Card>

      <CustomPanel>
        <CustomSummary section="lesson" />
        <CustomDetails
          content={translate('teach_lesson_desc', { title, id })}
        />
      </CustomPanel>

      <CustomPanel>
        <CustomSummary section="example" />
        <CustomDetails
          content={translate('teach_example_desc', { title, id })}
        />
      </CustomPanel>

      <CustomPanel>
        <CustomSummary section="article" />
        <CustomDetails
          content={translate('teach_article_desc', { title, id })}
        />
      </CustomPanel>

      <CustomPanel>
        <CustomSummary section="ref" />
        <CustomDetails content={translate('teach_ref_desc', { title, id })} />
      </CustomPanel>

      <CustomPanel>
        <CustomSummary section="course" />
        <CustomDetails
          content={translate('teach_course_desc', { title, id })}
        />
      </CustomPanel>

      <CustomPanel>
        <CustomSummary section="book" />
        <CustomDetails content={translate('teach_book_desc', { title, id })} />
      </CustomPanel>
    </div>
  );
};

export default TeachGuide;
