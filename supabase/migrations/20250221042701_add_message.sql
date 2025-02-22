-- 認証済みユーザーのみメッセージを取得できるようにする
CREATE POLICY "Allow authenticated users to read messages"
ON messages FOR SELECT
USING (auth.uid() IS NOT NULL);