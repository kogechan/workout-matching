// search.ts - サービスロールキーを使用してRLSをバイパス
import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

// 通常のクライアント（プロフィール検索用）
import supabase from '@/lib/supabase';

// サービスロールキーを使用したクライアント（ブロックデータ取得用）
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // サービスロールキー
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

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
    } = req.body;

    // プロフィール検索は通常のクライアントを使用
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
      throw error;
    }

    // ブロックユーザーを除外（サービスロールキーを使用）
    if (data && currentUserId) {
      // サービスロールキーを使用してブロックデータを取得
      const { data: blockData, error: blockError } = await supabaseAdmin
        .from('user_blocks')
        .select('user_id, blocked_user_id')
        .eq('is_deleted', false)
        .or(`user_id.eq.${currentUserId},blocked_user_id.eq.${currentUserId}`);

      if (blockError) {
        console.error('Error fetching block data:', blockError);
        // エラーが発生してもプロフィールは返す（ブロック機能が使えないだけ）
        return res.status(200).json(data);
      }

      const blockedUserIds = new Set<string>();
      blockData?.forEach((block) => {
        if (block.user_id === currentUserId) {
          blockedUserIds.add(block.blocked_user_id);
        } else if (block.blocked_user_id === currentUserId) {
          blockedUserIds.add(block.user_id);
        }
      });

      const filteredData = data.filter(
        (profile) => !blockedUserIds.has(profile.id)
      );

      return res.status(200).json(filteredData);
    }

    return res.status(200).json(data || []);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
