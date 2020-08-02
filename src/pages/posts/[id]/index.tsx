import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import Error from 'next/error';
import { useRouter } from 'next/router';
import {
  CircularProgress,
  Container,
  Divider,
  makeStyles,
} from '@material-ui/core';
import LinkList from '@zoonk/components/LinkList';
import Meta from '@zoonk/components/Meta';
import PostBar from '@zoonk/components/PostBar';
import PostFooter from '@zoonk/components/PostFooter';
import PostHeader from '@zoonk/components/PostHeader';
import RichTextViewer from '@zoonk/components/rich-text/RichTextViewer';
import { getPlainText, getPostImage } from '@zoonk/components/rich-text/posts';
import { Post } from '@zoonk/models';
import { getPost, getPosts } from '@zoonk/services';
import { appLanguage, PostContext } from '@zoonk/utils';

const CommentList = dynamic(() => import('@zoonk/components/CommentList'), {
  ssr: false,
});

const MarkAsRead = dynamic(() => import('@zoonk/components/MarkAsRead'), {
  ssr: false,
});

interface PostPageProps {
  data: Post.Get | null;
}

const useStyles = makeStyles((theme) => ({
  root: { marginBottom: '89px' },
  container: {
    [theme.breakpoints.only('sm')]: {
      padding: theme.spacing(0, 4),
    },
  },
}));

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPosts({ limit: 50 });
  const paths = posts.map((post) => ({ params: { id: post.id } }));
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps<PostPageProps> = async ({
  params,
}) => {
  const id = String(params?.id);
  const data = await getPost(id);
  return { props: { data }, revalidate: 1 };
};

const PostPage = ({ data }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { isFallback } = useRouter();
  const classes = useStyles();

  if (!data && isFallback) return <CircularProgress />;
  if (!data) return <Error statusCode={404} />;

  const { content, cover, id, language, sites, title } = data;
  const siteImg = sites.find((site) => Boolean(site.image));
  const image = cover || getPostImage(content) || siteImg?.image;

  return (
    <PostContext.Provider value={{ ...data }}>
      <main className={classes.root}>
        <Meta
          title={title}
          description={getPlainText(content).slice(0, 200)}
          canonicalUrl={`https://${language}.zoonk.org/posts/${id}`}
          image={image}
          noIndex={language !== appLanguage}
        />
        <MarkAsRead data={data} />
        <PostHeader />
        <Container maxWidth="md" className={classes.container}>
          <RichTextViewer content={content} />
          <LinkList sites={sites} />
          <PostFooter id={id} />
          <Divider />
          <CommentList />
        </Container>
        <PostBar />
      </main>
    </PostContext.Provider>
  );
};

export default PostPage;
