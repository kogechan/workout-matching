// search.ts - 修正版
import { NextApiRequest, NextApiResponse } from 'next';
import supabase from '@/lib/supabase';

// リクエストボディの型定義
interface SearchRequestBody {
  currentUserId: string | null;
  age: string | null;
  location: string | null;
  gender: string | null;
  training_experience: string | null;
  favorite_muscle: string | null;
  difficult_muscle: string | null;
  belong_gym: string | null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      currentUserId,
      age,
      location,
      gender,
      training_experience,
      favorite_muscle,
      difficult_muscle,
      belong_gym,
    }: SearchRequestBody = req.body;

    console.log('Search API called with currentUserId:', currentUserId);

    let query = supabase.from('profiles').select('*');

    // 現在のユーザを除外
    if (currentUserId) {
      query = query.neq('id', currentUserId);
    }

    // フィルター適用
    if (age) {
      const ageRange = age.match(/\d+/g);
      if (ageRange) {
        if (ageRange.length === 2) {
          const minAge = parseInt(ageRange[0]);
          const maxAge = parseInt(ageRange[1]);
          query = query.gte('age', minAge).lte('age', maxAge);
        } else if (ageRange.length === 1 && age.includes('以上')) {
          const minAge = parseInt(ageRange[0]);
          query = query.gte('age', minAge);
        } else {
          const exactAge = parseInt(ageRange[0]);
          query = query.eq('age', exactAge);
        }
      }
    }

    if (location) query = query.eq('location', location);
    if (gender) query = query.eq('gender', gender);
    if (training_experience)
      query = query.eq('training_experience', training_experience);
    if (favorite_muscle) query = query.eq('favorite_muscle', favorite_muscle);
    if (difficult_muscle)
      query = query.eq('difficult_muscle', difficult_muscle);
    if (belong_gym) query = query.eq('belong_gym', belong_gym);

    const { data, error } = await query;

    if (error) {
      console.error('Profile query error:', error);
      throw error;
    }

    // currentUserIdが存在する場合のみブロックユーザーの処理を行う
    if (data && currentUserId) {
      console.log('Fetching block data for user:', currentUserId);

      const { data: blockData, error: blockError } = await supabase
        .from('user_blocks')
        .select('user_id, blocked_user_id')
        .eq('is_deleted', false)
        .or(`user_id.eq.${currentUserId},blocked_user_id.eq.${currentUserId}`);

      if (blockError) {
        console.error('Error fetching block data:', blockError);
        // エラーが発生してもプロフィールは返す（ブロック機能が使えないだけ）
        return res.status(200).json(data || []);
      }

      console.log('Block data found:', blockData?.length || 0, 'records');

      const blockedUserIds = new Set<string>();
      blockData?.forEach((block) => {
        if (block.user_id === currentUserId) {
          blockedUserIds.add(block.blocked_user_id);
        } else if (block.blocked_user_id === currentUserId) {
          blockedUserIds.add(block.user_id);
        }
      });

      console.log('Blocked user IDs:', Array.from(blockedUserIds));

      const filteredData = data.filter(
        (profile) => !blockedUserIds.has(profile.id)
      );

      console.log(
        `Filtered ${data.length} profiles to ${filteredData.length} profiles`
      );

      return res.status(200).json(filteredData);
    }

    // currentUserIdがない場合はそのままデータを返す
    return res.status(200).json(data || []);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
