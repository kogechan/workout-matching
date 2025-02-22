-- 🔹 messages テーブルを作成
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- 🔹 全ユーザーがメッセージを読み取れるようにする
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all users to read messages"
ON messages FOR SELECT
USING (true);

-- 🔹 自分のメッセージのみ送信・削除できるようにする
CREATE POLICY "Allow users to insert their own messages"
ON messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own messages"
ON messages FOR DELETE
USING (auth.uid() = user_id);