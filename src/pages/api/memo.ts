import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(
    '✅ APIリクエストを受信:',
    req.method,
    req.headers['content-type']
  ); // ✅ 追加！

  // `req.body` の内容を確認
  console.log('📡 APIが受け取ったデータ (before parsing):', req.body);

  if (req.method === 'POST') {
    try {
      if (!req.body || typeof req.body !== 'object') {
        console.error('❌ JSONデータが正しく送信されていません:', req.body);
        return res.status(400).json({ error: 'JSONデータを送信してください' });
      }

      console.log('📡 APIが受け取ったデータ:', req.body); // ✅ 受け取ったデータをログ出力

      const { value, weight, rep, date, memo, category } = req.body;

      // バリデーションチェック
      if (!value || weight === undefined || rep === undefined) {
        console.error('❌ 入力データが不足しています:', req.body);
        return res
          .status(400)
          .json({ error: 'すべての項目を入力してください' });
      }

      const parsedDate = isNaN(Date.parse(date)) ? new Date() : new Date(date);

      // データベースに保存
      const newWorkout = await prisma.workoutRecord.create({
        data: {
          value,
          weight: Number(weight),
          rep: Number(rep),
          date: parsedDate,
          memo,
          category,
        },
      });

      console.log('✅ データが正常に保存されました:', newWorkout);
      res.status(201).json(newWorkout);
    } catch (error) {
      console.error('❌ サーバーエラー:', error);
      res.status(500).json({ error: 'データの保存に失敗しました' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}