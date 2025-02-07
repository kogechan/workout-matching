import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import supabase from '@/lib/supabase';
import jwt from 'jsonwebtoken';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' });

  const { email, password } = req.body;

  // ユーザーを取得
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return res.status(401).json({ error: 'ユーザーが見つかりません。' });

  // パスワードの照合
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid)
    return res.status(401).json({ error: 'パスワードが正しくありません。' });

  // Supabase の認証を試みる
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return res.status(401).json({ error: 'ログインに失敗しました。' });

  // JWT トークンを発行
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.NEXTAUTH_SECRET!,
    {
      expiresIn: '7d',
    }
  );

  return res.status(200).json({ user, token });
}
