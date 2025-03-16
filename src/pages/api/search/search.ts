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
    const { currentUserId, age, location, gender, training_experience } =
      req.body;

    // supabaseクエリの構築
    let query = supabase.from('profiles').select('*');

    // 現在のユーザを除外
    if (currentUserId) {
      query = query.neq('id', currentUserId);
    }

    // 距離フィルターの適用
    /*  if (useLocationDistance && userLocation) {
        // Postgresの地理空間関数を使用して距離を計算
        // ST_MakePoint(lon, lat)とST_DWithin(geom1, geom2, distance)を使用
        query = query.rpc('profiles_within_distance', { 
          lat: userLocation.latitude,
          lng: userLocation.longitude,
          distance_in_km: distance
        });
      } */

    // 年齢フィルターの適用
    if (age) {
      const [minAge, maxAge] = age.split('_');
      if (maxAge) {
        query = query.gte('age', parseInt(minAge)).lte('age', parseInt(maxAge));
      } else {
        query = query.gte('age', parseInt(minAge.replace('+', '')));
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
