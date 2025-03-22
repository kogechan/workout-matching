import { GetServerSideProps, NextPage } from 'next';
import { SearchPage } from './SearchPage';
import supabase from '@/lib/supabase';
import { ProfileData } from '@/type/chat';

interface SearchPageProps {
  initialProfiles: ProfileData[];
}

const Home: NextPage<SearchPageProps> = ({ initialProfiles }) => {
  return (
    <>
      <SearchPage initialProfiles={initialProfiles} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
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

export default Home;
