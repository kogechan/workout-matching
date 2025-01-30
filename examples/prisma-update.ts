import { Prisma, PrismaClient, Role } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  {
    // # レコードを1件更新
    console.log('# レコードを1件更新');

    // 指定のユーザーの email を更新します。
    const user = await prisma.user.update({
      where: {
        email: 'bob@example.com',
      },
      data: {
        email: 'bob_new_email@example.com',
      },
    });

    console.dir(user, { depth: null });
    /*
      {
        id: 2,
        email: 'bob_new_email@example.com',
        name: 'Bob',
        password: '$argon2id$v=19$m=65536,t=3,p=4$bH610I0WUB8VfR3UnBkiJg$pHzWBjWIbbBWOkmFviZ4V+vpbRYhEnQpEgWaWun/+sI',
        role: 'ADMIN'
      }
     */
  }

  {
    // # レコードを複数件更新
    console.log('# レコードを複数件更新');

    // 指定のユーザーの email を更新します。
    const users = await prisma.user.updateMany({
      where: {
        email: {
          contains: 'example.com',
        },
      },
      data: {
        role: 'ADMIN',
      },
    });

    console.dir(users, { depth: null });
    /*

      { count: 3 }

     */
  }

  {
    // # 更新 or 作成 (Upsert)
    console.log('# 更新 or 作成 (Upsert)');

    // 指定のユーザーの email を更新します。
    const user = await prisma.user.upsert({
      where: {
        email: 'alice@example.com',
      },
      update: {
        name: 'Alice Jackson',
        role: 'ADMIN',
      },
      create: {
        email: 'alice@example.com',
        name: 'Alice Jackson',
        role: 'ADMIN',
        password: await argon2.hash('alicepass'),
      },
      include: {
        profile: true,
      },
    });

    console.dir(user, { depth: null });
    /*

      {
        id: 1,
        email: 'alice@example.com',
        name: 'Alice Jackson',
        password: '$argon2id$v=19$m=65536,t=3,p=4$0YKtwtCBe1gB1OEbXub9Ww$DlwURMT9V6MN5NXX/uDyt/ykH9Y8ikSi+dXuYbugv5Q',
        role: 'ADMIN',
        profile: { id: 1, bio: 'I love Prisma!', userId: 1 }
      }

     */
  }

  {
    // # 数値を更新
    console.log('# 数値を更新');

    // 指定のユーザーの年齢を1つ増やします。
    const users = await prisma.post.update({
      where: {
        id: 1,
      },
      data: {
        likes: {
          increment: 1,
        },
      },
    });

    console.dir(users, { depth: null });
    /*
      {
        id: 1,
        createdAt: 2024-09-29T23:46:52.431Z,
        updatedAt: 2024-09-29T23:46:53.022Z,
        title: 'I started using Prisma with TypeScript Project!',
        likes: 1,
        published: false,
        authorId: 1
      }
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
