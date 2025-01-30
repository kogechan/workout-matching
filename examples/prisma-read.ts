import { Prisma, PrismaClient, Role } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  {
    // # 1行のデータを追加
    console.log('# 全件取得');

    // Userテーブルから全てのユーザーを取得します。
    const users = await prisma.user.findMany();

    console.dir(users, { depth: null });
    /*
      [
        {
          id: 1,
          email: 'alice@example.com',
          name: 'Alice',
          password: '$argon2id$v=19$m=65536,t=3,p=4$URXgN4PUkhaQv7ahABtR9w$VzUsWVbOuyCadOyqQFfnbHgr4FTqaKHb8vfmd+yNm1U',
          role: 'USER'
        },
        {
          id: 2,
          email: 'bob@example.com',
          name: 'Bob',
          password: '$argon2id$v=19$m=65536,t=3,p=4$eyRuPyFjF1uiAjUZ8Iv9NQ$OBls4QbH2nyDa6UPFXJZJqwRv+/p2RTkb9npEe3x8CA',
          role: 'ADMIN'
        },
        {
          id: 3,
          email: 'charlie@example.com',
          name: 'Charlie',
          password: '$argon2id$v=19$m=65536,t=3,p=4$CEY2xNhni2nkFUuSWwggeQ$wHfBxiaxTeS/RBItkooOil0zV1wuSRhFkwV/TWPgZ18',
          role: 'USER'
        }
      ]
     */
  }

  {
    // ### 生成された型を利用
    console.log('# 一意のレコードを取得');

    // email が alice@example.com のユーザーを取得します。
    const user = await prisma.user.findUnique({
      where: {
        email: 'alice@example.com',
      },
    });

    console.dir(user, { depth: null });
    /*
      {
        id: 1,
        email: 'alice@example.com',
        name: 'Alice',
        password: '$argon2id$v=19$m=65536,t=3,p=4$URXgN4PUkhaQv7ahABtR9w$VzUsWVbOuyCadOyqQFfnbHgr4FTqaKHb8vfmd+yNm1U',
        role: 'USER'
      }
     */
  }

  {
    // # 最初のレコードを取得
    console.log('# 最初のレコードを取得');

    // id を昇順で並べ替えて最初のレコードを取得します。
    const users = await prisma.user.findFirst({
      orderBy: {
        id: 'asc',
      },
    });

    console.dir(users, { depth: null });
    /*
      {
        id: 1,
        email: 'alice@example.com',
        name: 'Alice',
        password: '$argon2id$v=19$m=65536,t=3,p=4$URXgN4PUkhaQv7ahABtR9w$VzUsWVbOuyCadOyqQFfnbHgr4FTqaKHb8vfmd+yNm1U',
        role: 'USER'
      }
     */
  }

  {
    // ### 条件を指定して全件取得
    console.log('# レコードの絞り込み');
    console.log('### 条件を指定して全件取得');

    // User テーブルから email の末尾が b@example.com であるユーザーをすべて取得します。
    const users = await prisma.user.findMany({
      where: {
        email: {
          endsWith: 'b@example.com',
        },
      },
    });

    console.dir(users, { depth: null });
    /*
      [
        {
          id: 2,
          email: 'bob@example.com',
          name: 'Bob',
          password: '$argon2id$v=19$m=65536,t=3,p=4$eyRuPyFjF1uiAjUZ8Iv9NQ$OBls4QbH2nyDa6UPFXJZJqwRv+/p2RTkb9npEe3x8CA',
          role: 'ADMIN'
        }
      ]
     */
  }

  {
    // ### 関連テーブルのフィールドで絞り込み
    console.log('### 関連テーブルのフィールドで絞り込み');

    // bioに指定の文字列が入っているユーザーを取得します。
    const users = await prisma.user.findMany({
      where: {
        profile: {
          bio: {
            contains: 'Prisma',
          },
        },
      },
      include: {
        profile: true,
      },
    });

    console.dir(users, { depth: null });
    /*
      [
        {
          id: 1,
          email: 'alice@example.com',
          name: 'Alice',
          password: '$argon2id$v=19$m=65536,t=3,p=4$URXgN4PUkhaQv7ahABtR9w$VzUsWVbOuyCadOyqQFfnbHgr4FTqaKHb8vfmd+yNm1U',
          role: 'USER',
          profile: { id: 1, bio: 'I love Prisma!', userId: 1 }
        }
      ]
     */
  }

  {
    // ### ロジカル演算子を使用して複数条件で絞り込む
    console.log('### ロジカル演算子を使用して複数条件で絞り込む');

    // nameがBで始まるユーザー、または、profileのageが30未満でroleがUSERで、かつ、todosのtitleにFinishが含まれるユーザーを取得
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              startsWith: 'B',
            },
          },
          {
            AND: {
              profile: {
                bio: {
                  contains: 'Prisma',
                },
              },
              role: {
                equals: 'USER',
              },
              posts: {
                some: {
                  title: {
                    contains: 'I',
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        posts: true,
        profile: true,
      },
      orderBy: {
        id: 'desc',
      },
    });

    console.dir(users, { depth: null });
    /*
      [
        {
          id: 2,
          email: 'bob@example.com',
          name: 'Bob',
          password: '$argon2id$v=19$m=65536,t=3,p=4$S88nPdqUUrFbwrCOCF+6lg$7m70qcgYekM5FzqjARgD5adRjGbUGc9R6ouGzcNPcj4',
          role: 'ADMIN',
          posts: [],
          profile: null
        },
        {
          id: 1,
          email: 'alice@example.com',
          name: 'Alice',
          password: '$argon2id$v=19$m=65536,t=3,p=4$eDHdyNM1T7zHMnqq86WM+g$ZVOwimCTNFNUqouSH/nM7/EOY68fpEMDEa9D9gjoPf0',
          role: 'USER',
          posts: [
            {
              id: 1,
              createdAt: 2024-09-29T14:10:03.997Z,
              updatedAt: 2024-09-29T14:10:03.997Z,
              title: 'I started using Prisma with TypeScript Project!',
              likes: 0,
              published: false,
              authorId: 1
            },
            {
              id: 2,
              createdAt: 2024-09-29T14:10:04.006Z,
              updatedAt: 2024-09-29T14:10:04.006Z,
              title: 'I need to study Next.js more',
              likes: 0,
              published: false,
              authorId: 1
            }
          ],
          profile: { id: 1, bio: 'I love Prisma!', userId: 1 }
        }
      ]
     */
  }

  {
    // ### 取得するレコード数を制限
    console.log('### 取得するレコード数を制限');

    // id の昇順で並べ替えて最初の 1 件のレコードを取得します。
    const users = await prisma.user.findMany({
      take: 1,
      orderBy: {
        id: 'asc',
      },
    });

    console.dir(users, { depth: null });
    /*
      [
        {
          id: 1,
          email: 'alice@example.com',
          name: 'Alice',
          password: '$argon2id$v=19$m=65536,t=3,p=4$q5sAc7ztOE8XPEEsFAKMiw$wQpXqGftKAJAHIdhZSxGLlQP8znuegjPa4o75lXtdas',
          role: 'USER'
        }
      ]
     */
  }

  {
    // # 並び替え
    console.log('# 並び替え');

    // 全てのユーザーを id 降順で取得します。
    const users = await prisma.user.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    console.dir(users, { depth: null });
    /*
      [
        {
          id: 3,
          email: 'charlie@example.com',
          name: 'Charlie',
          password: '$argon2id$v=19$m=65536,t=3,p=4$0K8BgEg3gMe1BU8Bf1OTow$ZF0tIPmOUXNdx+Kega42S3wXwkWE1S1EG6UzJdIbYUg',
          role: 'USER'
        },
        {
          id: 2,
          email: 'bob@example.com',
          name: 'Bob',
          password: '$argon2id$v=19$m=65536,t=3,p=4$OeYaQFzym1x3hyYz9hFi5A$cQnUcMxItKICdH3L81tcJGtt4UH5ZQPN40w/T1J+DoY',
          role: 'ADMIN'
        },
        {
          id: 1,
          email: 'alice@example.com',
          name: 'Alice',
          password: '$argon2id$v=19$m=65536,t=3,p=4$oeE+IIuCc9ka3qaVP0TTqQ$CQ7nFv84h6Ps/+5nxcxF1dfj1UI/IAWJb8Ky1uagSNY',
          role: 'USER'
        }
      ]
     */
  }

  {
    // ### 関連テーブルのフィールドで並び替え
    console.log('### 関連テーブルのフィールドで並び替え');

    // ユーザーをプロファイルのIDの昇順で取得します
    const users = await prisma.user.findMany({
      orderBy: {
        profile: {
          id: 'asc',
        },
      },
      include: {
        profile: true,
      },
    });

    console.dir(users, { depth: null });
    /*
      [
        {
          id: 1,
          email: 'alice@example.com',
          name: 'Alice',
          password: '$argon2id$v=19$m=65536,t=3,p=4$mS8Zn891irACL19JF+0zkQ$uSBHLlDR4toFqdyKW9/W0Z5ugc1A4E8XiTNsxQYohtw',
          role: 'USER',
          profile: { id: 1, bio: 'I love Prisma!', userId: 1 }
        },
        {
          id: 3,
          email: 'charlie@example.com',
          name: 'Charlie',
          password: '$argon2id$v=19$m=65536,t=3,p=4$iW+stIwaunOUFy8VdkUPZg$hAMnyPgc8zzH5fIJFTg1anPnwH5WLfZD2hZi4BHp58w',
          role: 'USER',
          profile: { id: 2, bio: 'Next.js is awesome!', userId: 3 }
        },
        {
          id: 2,
          email: 'bob@example.com',
          name: 'Bob',
          password: '$argon2id$v=19$m=65536,t=3,p=4$/c9Dls0s2k+T5hmsRy72+g$bsaV2AQIdr1MOYyi44xtV9SKB/XdHVKLjXoFStlFm4U',
          role: 'ADMIN',
          profile: null
        }
      ]
     */
  }

  {
    // ### 関連テーブルのフィールドで集計された値で並び替え
    console.log('### 関連テーブルのフィールドで集計された値で並び替え');

    // ユーザーを投稿数の降順で取得
    const users = await prisma.user.findMany({
      orderBy: {
        posts: {
          _count: 'desc',
        },
      },
      include: {
        posts: true,
      },
    });

    console.dir(users, { depth: null });
    /*
      [
        {
          id: 3,
          email: 'charlie@example.com',
          name: 'Charlie',
          password: '$argon2id$v=19$m=65536,t=3,p=4$JVwE94JACwCmXQy19wO/NA$+FAHesqU0RVNqKpwPhztwWFBHo89EJrhQaN3qlfEvm0',
          role: 'USER',
          posts: [
            {
              id: 3,
              createdAt: 2024-09-29T14:19:15.091Z,
              updatedAt: 2024-09-29T14:19:15.091Z,
              title: 'I cannot wait for Next.js Conference',
              likes: 0,
              published: false,
              authorId: 3
            },
            {
              id: 4,
              createdAt: 2024-09-29T14:19:15.093Z,
              updatedAt: 2024-09-29T14:19:15.093Z,
              title: 'I am planning to use Prisma',
              likes: 0,
              published: false,
              authorId: 3
            },
            {
              id: 5,
              createdAt: 2024-09-29T14:19:15.095Z,
              updatedAt: 2024-09-29T14:19:15.095Z,
              title: "I am doing 100 Days' TypeScript Challenge",
              likes: 0,
              published: false,
              authorId: 3
            }
          ]
        },
        {
          id: 1,
          email: 'alice@example.com',
          name: 'Alice',
          password: '$argon2id$v=19$m=65536,t=3,p=4$ilfSfsxC5tU4u7qcRGWHVQ$CQcqlcQ9Yx3oL/chzS8gFoPCnQo4DyJLgqGz2VJSc6Y',
          role: 'USER',
          posts: [
            {
              id: 1,
              createdAt: 2024-09-29T14:19:15.079Z,
              updatedAt: 2024-09-29T14:19:15.079Z,
              title: 'I started using Prisma with TypeScript Project!',
              likes: 0,
              published: false,
              authorId: 1
            },
            {
              id: 2,
              createdAt: 2024-09-29T14:19:15.086Z,
              updatedAt: 2024-09-29T14:19:15.086Z,
              title: 'I need to study Next.js more',
              likes: 0,
              published: false,
              authorId: 1
            }
          ]
        },
        {
          id: 2,
          email: 'bob@example.com',
          name: 'Bob',
          password: '$argon2id$v=19$m=65536,t=3,p=4$Rhs6Q8rVXjxtmDh2AAdJyg$A6j5gR973GdT5PsRDlBtU4QtO7K12M5AofFtqdsmjj0',
          role: 'ADMIN',
          posts: []
        }
      ]
     */
  }

  {
    // # フィールドの絞り込み
    console.log('# フィールドの絞り込み');

    // email フィールドのみを取得します。
    const users = await prisma.user.findMany({
      select: {
        email: true,
      },
    });

    console.dir(users, { depth: null });
    /*
      [
        { email: 'alice@example.com' },
        { email: 'bob@example.com' },
        { email: 'charlie@example.com' }
      ]
     */
  }

  {
    // ### 関連テーブルのレコードを取得
    console.log('### 関連テーブルのレコードを取得');

    // ユーザーに紐づく、関連する`Todo`の全フィールドと`Profile`の指定フィールドを取得します。
    const users = await prisma.user.findFirst({
      include: {
        posts: true,
        profile: {
          select: {
            bio: true,
          },
        },
      },
    });

    console.dir(users, { depth: null });
    /*
      {
        id: 1,
        email: 'alice@example.com',
        name: 'Alice',
        password: '$argon2id$v=19$m=65536,t=3,p=4$szWJQ93EmPKJvNtfvFhwPg$8h1mHWY/SJsEwIh9UIb9T78v1E2ZaOGm/j1Eu+txNC8',
        role: 'USER',
        posts: [
          {
            id: 1,
            createdAt: 2024-09-29T14:22:48.054Z,
            updatedAt: 2024-09-29T14:22:48.054Z,
            title: 'I started using Prisma with TypeScript Project!',
            likes: 0,
            published: false,
            authorId: 1
          },
          {
            id: 2,
            createdAt: 2024-09-29T14:22:48.061Z,
            updatedAt: 2024-09-29T14:22:48.061Z,
            title: 'I need to study Next.js more',
            likes: 0,
            published: false,
            authorId: 1
          }
        ],
        profile: { bio: 'I love Prisma!' }
      }
     */
  }

  {
    // # 集計
    console.log('# 集計');

    // ユーザー数をカウント
    const aggregations = await prisma.user.aggregate({
      _count: true,
    });

    console.dir(aggregations, { depth: null });
    /*
      { _count: 3 }
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
