CREATE POLICY "Allow users to delete only their own posts"
ON posts FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to update only their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id);