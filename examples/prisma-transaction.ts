import { PrismaClient, Role } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  {
    // # 全てのレコードの削除をトランザクションで実行
    console.log('# 全てのレコードの削除をトランザクションで実行');

    const deleteTag = prisma.tag.deleteMany();
    const deletePost = prisma.post.deleteMany();
    const deleteProfile = prisma.profile.deleteMany();
    const deleteUser = prisma.user.deleteMany();

    // シクエンシャルにdeleteManyを実行します。
    const transaction = await prisma.$transaction([
      deleteTag,
      deletePost,
      deleteProfile,
      deleteUser,
    ]);

    console.dir(transaction, { depth: null });
    /*

      [ { count: 3 }, { count: 5 }, { count: 2 }, { count: 3 } ]

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
