import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';
import { RichText } from "prismic-dom";
import Prismic from '@prismicio/client';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { FaCalendar, FaClock, FaParagraph, FaUser } from 'react-icons/fa';
import { format } from 'date-fns';
import { useRouter } from 'next/router';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();
  if (router.isFallback) {
    return (
      <div className={commonStyles.container}>
        <span>Carregando...</span>
      </div>
    )
  }
  const stipulatedTime = post.data.content.map(item => `${item.heading} ${RichText.asText(item.body)}`).map(paragraph => paragraph.split(' ').length).reduce((acc, current) => acc + current) / 200;

  return (
    <>
      <img className={styles.banner} src={post.data.banner.url} alt="Banner" />
      <div className={commonStyles.container}>
        <h1 className={styles.title}>{post.data.title}</h1>
        <div className={styles.info}>
          <ul>
            <li>
              <FaCalendar color={'#BBBBBB'} size={20} />
              <p>{format(new Date(post.first_publication_date), 'dd MMM yyyy').toLocaleLowerCase()}</p>
            </li>
            <li>
              <FaUser color={'#BBBBBB'} size={20} />
              <p>{post.data.author}</p>
            </li>
            <li>
              <FaClock color={'#BBBBBB'} size={20} />
              <p>
                {`${Math.ceil(stipulatedTime)} min`}
              </p>
            </li>
          </ul>
        </div>
        {post.data.content.map(item => (
          <div className={styles.content} key={item.heading}>
            <h1>{item.heading}</h1>
            {/* <p> */}
            <div
              dangerouslySetInnerHTML={{ __html: RichText.asHtml(item.body) }}
            />
            {/* </p> */}
          </div>
        ))}
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [
      Prismic.predicates.at('document.type', 'posts')
    ],
    {
      fetch: ['posts.uid'],
      pageSize: 3,
    }
  );
  const paths = posts.results.map(post => ({
    params: { slug: post.uid }
  }))

  return {
    paths,
    fallback: true
  }
};

export const getStaticProps: GetServerSideProps = async ({ req, params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data?.title,
      subtitle: response.data?.subtitle,
      banner: {
        url: response.data?.banner?.url
      },
      author: response.data.author,
      content: response.data.content
    }
  };

  return {
    props: { post }
  }
};
