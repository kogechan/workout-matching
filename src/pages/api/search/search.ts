import supabase from '@/lib/supabase';
import { NextApiRequest, NextApiResponse } from 'next';

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

    // supabaseクエリの構築
    let query = supabase.from('profiles').select('*');

    // 現在のユーザを除外
    if (currentUserId) {
      query = query.neq('id', currentUserId);
    }

    // 年齢フィルターの適用
    if (age) {
      // 年齢文字列から数値部分を抽出
      const ageRange = age.match(/\d+/g);

      if (ageRange) {
        if (ageRange.length === 2) {
          // 範囲指定の場合（例: 18〜25歳）
          const minAge = parseInt(ageRange[0]);
          const maxAge = parseInt(ageRange[1]);
          query = query.gte('age', minAge).lte('age', maxAge);
        } else if (ageRange.length === 1 && age.includes('以上')) {
          // 〜以上の場合（例: 51歳以上）
          const minAge = parseInt(ageRange[0]);
          query = query.gte('age', minAge);
        } else {
          // 単一年齢の場合
          const exactAge = parseInt(ageRange[0]);
          query = query.eq('age', exactAge);
        }
      }
    }

    // 居住地フィルター
    if (location) {
      query = query.eq('location', location);
    }

    // 性別フィルター
    if (gender) {
      query = query.eq('gender', gender);
    }

    // トレーニング歴フィルター
    if (training_experience) {
      query = query.eq('training_experience', training_experience);
    }

    // 得意部位フィルター
    if (favorite_muscle) {
      query = query.eq('favorite_muscle', favorite_muscle);
    }

    // 苦手部位フィルター
    if (difficult_muscle) {
      query = query.eq('difficult_muscle', difficult_muscle);
    }

    // 所属ジムフィルター
    if (belong_gym) {
      query = query.eq('belong_gym', belong_gym);
    }

    // クエリの実行
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error });
  }
}
