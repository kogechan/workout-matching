CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id)
);

-- 1️⃣ 外部キー制約を削除 (制約名を調べて変更)
ALTER TABLE profiles DROP CONSTRAINT profiles_user_id_fkey;

--DROP INDEX IF EXISTS profiles_pkey;

-- 2️⃣ user_id カラムを削除
--ALTER TABLE profiles DROP COLUMN user_id;

-- 3️⃣ 新しい user_id カラムを作成し、users.id に紐付ける
--ALTER TABLE profiles ADD COLUMN user_id UUID REFERENCES users(id);

-- 1️⃣ 外部キー制約を削除 (制約名を調べて変更)
ALTER TABLE posts DROP CONSTRAINT posts_user_id_fkey;

--DROP INDEX IF EXISTS posts_pkey;

-- 2️⃣ user_id カラムを削除
--ALTER TABLE posts DROP COLUMN user_id;

-- 3️⃣ 新しい user_id カラムを作成し、users.id に紐付ける
--ALTER TABLE posts ADD COLUMN user_id UUID REFERENCES users(id);

-- 1️⃣ 外部キー制約を削除 (制約名を調べて変更)
ALTER TABLE messages DROP CONSTRAINT messages_user_id_fkey;;

--DROP INDEX IF EXISTS messages_pkey;

-- 2️⃣ user_id カラムを削除
--ALTER TABLE messages DROP COLUMN user_id;

-- 3️⃣ 新しい user_id カラムを作成し、users.id に紐付ける
--ALTER TABLE messages ADD COLUMN user_id UUID REFERENCES users(id);



