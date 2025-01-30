import { PrismaClient, Role } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  {
    // # レコードを1件削除
    console.log('# レコードを1件削除');

    // 指定のユーザーの email を更新します。
    const post = await prisma.post.delete({
      where: {
        id: 1,
      },
    });

    console.dir(post, { depth: null });
    /*

      {
        id: 1,
        createdAt: 2024-09-30T00:01:29.286Z,
        updatedAt: 2024-09-30T00:01:29.286Z,
        title: 'I started using Prisma with TypeScript Project!',
        likes: 0,
        published: false,
        authorId: 1
      }

     */
  }

  {
    // # レコードを複数件削除
    console.log('# レコードを複数件削除');

    // 指定の文字列がtitleに含まれる投稿を削除します。
    const posts = await prisma.post.deleteMany({
      where: {
        title: {
          contains: 'Next.js',
        },
      },
    });

    console.dir(posts, { depth: null });
    /*

      { count: 2 }

     */
  }

  {
    // # 全てのレコードを削除
    console.log('# 全てのレコードを削除');

    // 指定のユーザーの email を更新します。
    const tags = await prisma.tag.deleteMany();
    const posts = await prisma.post.deleteMany();
    const profile = await prisma.profile.deleteMany();
    const user = await prisma.user.deleteMany();

    console.dir(tags, { depth: null });
    console.dir(posts, { depth: null });
    console.dir(profile, { depth: null });
    console.dir(user, { depth: null });
    /*

      { count: 3 }
      { count: 2 }
      { count: 2 }
      { count: 3 }

     */
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
