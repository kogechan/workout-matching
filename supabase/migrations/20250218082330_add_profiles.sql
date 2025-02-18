ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read their own profile"
ON profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id);