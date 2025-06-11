// index.tsx を修正
import { GetServerSideProps, NextPage } from 'next';
import { SearchPage } from '../../components/search/SearchPage';
import supabase from '@/lib/supabase';
import { ProfileData } from '@/type/chat';
import Head from 'next/head';
import { parseCookies } from 'nookies'; // nookiesをインストールする必要があります

interface SearchPageProps {
  initialProfiles: ProfileData[];
}

export const getServerSideProps: GetServerSideProps<SearchPageProps> = async (
  context
) => {
  // クッキーからセッション情報を取得
  const cookies = parseCookies(context);
  const token = cookies['sb-access-token']; // Supabaseのトークン名に応じて調整

  let currentUserId = null;

  // 現在のユーザーIDを取得
  if (token) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);
    if (!userError && user) {
      currentUserId = user.id;
    }
  }

  // 初期プロフィールを取得
  let query = supabase.from('profiles').select('*');

  // 自分のプロフィールを除外
  if (currentUserId) {
    query = query.neq('id', currentUserId);
  }

  const { data, error } = await query.limit(20);

  if (error) {
    console.error('Error fetching initial profiles:', error);
    return {
      props: {
        initialProfiles: [],
      },
    };
  }

  // ブロックユーザーも除外する場合
  if (data && currentUserId) {
    const { data: blockData } = await supabase
      .from('user_blocks')
      .select('user_id, blocked_user_id')
      .eq('is_deleted', false)
      .or(`user_id.eq.${currentUserId},blocked_user_id.eq.${currentUserId}`);

    const blockedUserIds = new Set();
    blockData?.forEach((block) => {
      if (block.user_id === currentUserId) {
        blockedUserIds.add(block.blocked_user_id);
      } else {
        blockedUserIds.add(block.user_id);
      }
    });

    const filteredData = data.filter(
      (profile) => !blockedUserIds.has(profile.id)
    );

    return {
      props: {
        initialProfiles: filteredData || [],
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
