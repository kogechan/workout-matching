import { GetServerSideProps, NextPage } from 'next';
import { SearchPage } from '../../components/search/SearchPage';
import supabase from '@/lib/supabase';
import { ProfileData } from '@/type/chat';
import Head from 'next/head';

interface SearchPageProps {
  initialProfiles: ProfileData[];
}

export const getServerSideProps: GetServerSideProps<
  SearchPageProps
> = async () => {
  const { data, error } = await supabase.from('profiles').select('*').limit(20);

  if (error) {
    console.error('Error fetching initial profiles:', error);
    return {
      props: {
        initialProfiles: [],
      },
    };
  }

  return {
    props: {
      initialProfiles: data || [],
    },
  };
};

const Home: NextPage<SearchPageProps> = ({ initialProfiles }) => {
  return (
    <>
      <Head>
        <title>合トレ仲間を探す</title>
        <meta name="description" content="合トレ仲間を探そう！" />
      </Head>
      <SearchPage initialProfiles={initialProfiles} />
    </>
  );
};

export default Home;
