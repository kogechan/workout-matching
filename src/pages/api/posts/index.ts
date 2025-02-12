import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const posts = await prisma.post.findMany({
      include: { user: true }, // ユーザー情報を含める
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(posts);
  }

  if (req.method === 'POST') {
    const { content, userId } = req.body;
    if (!content || !userId) {
      return res.status(400).json({ error: 'タイトル・内容が必須です。' });
    }

    const newPost = await prisma.post.create({
      data: { content, userId },
    });

    return res.status(201).json(newPost);
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
