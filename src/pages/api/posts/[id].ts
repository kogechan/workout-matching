import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    await prisma.post.delete({ where: { id: Number(id) } });
    return res.status(200).json({ message: '削除しました' });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
