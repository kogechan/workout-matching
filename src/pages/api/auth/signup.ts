import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import supabase from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' });

  const { username, email, password } = req.body;

  // 既に登録されているメールアドレスか確認
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser)
    return res
      .status(400)
      .json({ error: 'このメールアドレスは既に登録されています。' });

  // パスワードのハッシュ化
  const hashedPassword = await bcrypt.hash(password, 10);

  // Supabase で認証ユーザーを作成
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });

  // Prisma にユーザー情報を保存
  const newUser = await prisma.user.create({
    data: { username, email, password: hashedPassword },
  });

  return res.status(201).json({ user: newUser });
}
