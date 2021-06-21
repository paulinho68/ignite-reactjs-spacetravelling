import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import { FaCalendar, FaUser } from 'react-icons/fa';

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

export default function Home(props: HomeProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.title}>Como utilizar Hooks</p>
        <p className={styles.subtitle}>
          Pensando em sincronização em vez de ciclos de vida.
        </p>
        <div className={styles.footer}>
          <div>
            <FaCalendar size={15} />
            <p>15 Mar 2021</p>
          </div>
          <div>
            <FaUser size={15} />
            <p>Joseph Oliveira</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// export const getStaticProps = async () => {
//   const prismic = getPrismicClient();
//   const postsResponse = await prismic.query(
//     [
//       Prismic.predicates.at('document.type', 'posts')
//     ],
//     {
//       fetch: ['posts.title', 'posts.content'],
//       pageSize: 5
//     }
//   );

//   console.log(postsResponse);
//   // const posts = postsResponse.results.map(post => {
//   //   return {
//   //     slug: post.uid,
//   //     title: RichText.asText(post.data.title),
//   //     excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
//   //     updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
//   //       day: '2-digit',
//   //       month: 'long',
//   //       year: 'numeric'
//   //     })
//   //   }
//   // });

//   return {
//     props: [],
//     revalidate: 60 * 60 * 24, //24 hours
//   }
// };
