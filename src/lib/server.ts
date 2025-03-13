import { createClient } from '@supabase/supabase-js';
import { IncomingHttpHeaders } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest } from 'next/server';

// サーバーサイドでSupabaseクライアントを作成する関数
export const createServerSupabaseClient = ({
  req,
  res,
}: {
  req: NextApiRequest | NextRequest | Request;
  res?: NextApiResponse;
}) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  /* const cookies = new Map(
    // Cookie文字列を解析
    (req.headers as IncomingHttpHeaders).cookie?.split(';').map(cookie => {
      const [key, value] = cookie.split('=')
      return [key.trim(), value]
    }) || []
  ) */

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      // Cookieからセッション情報を取得
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        // クッキーをヘッダーに含める
        cookie: (req.headers as IncomingHttpHeaders).cookie || '',
      },
    },
  });
};
