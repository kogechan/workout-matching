--自分の投稿のみ作成、更新、削除できるポリシー
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read their posts"
ON posts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their posts"
ON posts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their posts"
ON posts FOR DELETE
USING (auth.uid() = user_id);