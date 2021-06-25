import { useState } from 'react';
import { GetStaticProps } from 'next';

import { FaCalendar, FaUser } from 'react-icons/fa';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';


import { getPrismicClient } from '../services/prismic';
// import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

function convertToInterface(response: any): Post[] {
  const posts = response.results.map(post => {
    return {
      uid: post.slugs[0],
      first_publication_date: format(new Date(post.first_publication_date), 'dd MMM yyyy'),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      }
    }
  });

  return posts;
}

export default function Home(props: HomeProps) {
  const { postsPagination } = props;
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [posts, setPosts] = useState(postsPagination.results);

  const handleNextPage = (): void => {
    const urlParams = new URLSearchParams(nextPage);

    const newPageSize = Number(urlParams.get('pageSize')) + 1;
    urlParams.set('pageSize', String(newPageSize));

    const str = 'pageSize=' + newPageSize;
    const str2 = 'pageSize=' + newPageSize + 1;

    const url = nextPage.replace(str, str2);

    fetch(url)
      .then(response => response.json())
      .then(responseData => {
        setNextPage(responseData.next_page);
        const newPosts = convertToInterface(responseData);
        setPosts([...posts, ...newPosts]);
      });
  }

  return (
    <div className={styles.container}>
      {posts?.map(post => (
        <div className={styles.content} key={post.uid}>

          <p className={styles.title}>{post.data.title}</p>
          <p className={styles.subtitle}>
            {post.data.subtitle}
          </p>
          <div className={styles.footer}>
            <div>
              <FaCalendar size={15} />
              <p>{post.first_publication_date}</p>
            </div>
            <div>
              <FaUser size={15} />
              <p>{post.data.author}</p>
            </div>
          </div>
        </div>
      ))}
      {!nextPage || (
        <div className={styles.loadMore} onClick={handleNextPage}>
          <p>Carregar mais posts</p>
        </div>
      )}
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();


  try {
    const response = await prismic.query(Prismic.predicates.at('document.type', 'posts'), {
      pageSize: 1
    })

    const posts = convertToInterface(response);

    return {
      props: {
        postsPagination: {
          next_page: response.next_page,
          results: posts
        }
      },
      revalidate: 60 * 60 * 24, //24 hours
    }
  } catch {
    return {
      props: {
        postsPagination: {
          next_page: null,
          results: []
        }
      },
      revalidate: 60 * 60 * 24, //24 hours
    }
  }

};
