import dynamic from 'next/dynamic';
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
import { appLanguage, getPageTitle } from '@zoonk/utils';
import useTranslation from './useTranslation';

const TeachArticleEn = dynamic(() => import('./Teach/en/Article'));
const TeachArticlePt = dynamic(() => import('./Teach/pt/Article'));
const TeachBookEn = dynamic(() => import('./Teach/en/Book'));
const TeachBookPt = dynamic(() => import('./Teach/pt/Book'));
const TeachCourseEn = dynamic(() => import('./Teach/en/Course'));
const TeachCoursePt = dynamic(() => import('./Teach/pt/Course'));
const TeachIntroEn = dynamic(() => import('./Teach/en/Intro'));
const TeachIntroPt = dynamic(() => import('./Teach/pt/Intro'));
const TeachExampleEn = dynamic(() => import('./Teach/en/Example'));
const TeachExamplePt = dynamic(() => import('./Teach/pt/Example'));
const TeachLessonEn = dynamic(() => import('./Teach/en/Lesson'));
const TeachLessonPt = dynamic(() => import('./Teach/pt/Lesson'));
const TeachReferenceEn = dynamic(() => import('./Teach/en/Reference'));
const TeachReferencePt = dynamic(() => import('./Teach/pt/Reference'));

type Section = 'lesson' | 'example' | 'article' | 'ref' | 'course' | 'book';

interface CustomPanelProps {
  children: React.ReactNodeArray;
}

interface CustomSummaryProps {
  section: Section;
}

interface CustomDetailsProps {
  children: React.ReactNode;
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
  const translate = useTranslation();
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

const CustomDetails = ({ children }: CustomDetailsProps) => {
  const classes = useStyles();

  return (
    <ExpansionPanelDetails className={classes.details}>
      {children}
    </ExpansionPanelDetails>
  );
};

const TeachGuide = () => {
  const translate = useTranslation();
  const { query } = useRouter();
  const classes = useStyles();
  const id = String(query.id);
  const title = getPageTitle(id);

  return (
    <div className={classes.root}>
      <Card variant="outlined">
        <CardHeader title={translate('teach_title')} />
        <CardContent>
          {appLanguage === 'en' && <TeachIntroEn />}
          {appLanguage === 'pt' && <TeachIntroPt />}
        </CardContent>
      </Card>

      <CustomPanel>
        <CustomSummary section="lesson" />
        <CustomDetails>
          {appLanguage === 'en' && <TeachLessonEn id={id} title={title} />}
          {appLanguage === 'pt' && <TeachLessonPt id={id} title={title} />}
        </CustomDetails>
      </CustomPanel>

      <CustomPanel>
        <CustomSummary section="example" />
        <CustomDetails>
          {appLanguage === 'en' && <TeachExampleEn id={id} title={title} />}
          {appLanguage === 'pt' && <TeachExamplePt id={id} title={title} />}
        </CustomDetails>
      </CustomPanel>

      <CustomPanel>
        <CustomSummary section="article" />
        <CustomDetails>
          {appLanguage === 'en' && <TeachArticleEn id={id} title={title} />}
          {appLanguage === 'pt' && <TeachArticlePt id={id} title={title} />}
        </CustomDetails>
      </CustomPanel>

      <CustomPanel>
        <CustomSummary section="ref" />
        <CustomDetails>
          {appLanguage === 'en' && <TeachReferenceEn id={id} title={title} />}
          {appLanguage === 'pt' && <TeachReferencePt id={id} title={title} />}
        </CustomDetails>
      </CustomPanel>

      <CustomPanel>
        <CustomSummary section="course" />
        <CustomDetails>
          {appLanguage === 'en' && <TeachCourseEn id={id} title={title} />}
          {appLanguage === 'pt' && <TeachCoursePt id={id} title={title} />}
        </CustomDetails>
      </CustomPanel>

      <CustomPanel>
        <CustomSummary section="book" />
        <CustomDetails>
          {appLanguage === 'en' && <TeachBookEn id={id} title={title} />}
          {appLanguage === 'pt' && <TeachBookPt id={id} title={title} />}
        </CustomDetails>
      </CustomPanel>
    </div>
  );
};

export default TeachGuide;
