import { Prisma, PrismaClient, Role } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  {
    // # 1行のデータを追加
    console.log('# 1行のデータを追加');

    await prisma.post.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

    // ユーザーを1件作成
    const createUser = await prisma.user.create({
      data: {
        email: 'alice@example.com',
        name: 'Alice',
        password: await argon2.hash('alicepass123'),
        role: Role.USER,
      },
    });

    console.dir(createUser, { depth: null });
    /*
      {
        id: 1,
        email: 'alice@example.com',
        name: 'Alice',
        password: '$argon2id$v=19$m=65536,t=3,p=4$mivNTThFUgx1SD9bvv5GeQ$v5B7Sc9DD8S/zomt87QdmME7Dd2M30h4PPDsIOTr7Kc',
        role: 'USER'
      }
     */
  }

  {
    // ### 生成された型を利用
    console.log('### 生成された型を利用');

    await prisma.post.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

    // User テーブルへの create にデータ投入する型は Prisma.UserCreateInput を使用します。
    const user: Prisma.UserCreateInput = {
      email: 'bob@example.com',
      name: 'Bob',
      password: await argon2.hash('bobpass123'),
      role: Role.USER,
    };

    // User テーブルへデータを追加
    const createUser = await prisma.user.create({ data: user });

    console.dir(createUser, { depth: null });
    /*
      {
        id: 2,
        email: 'bob@example.com',
        name: 'Bob',
        password: '$argon2id$v=19$m=65536,t=3,p=4$B70j0ZIjOLhv8wwSCBiCmQ$gGliCWmYUJJGw0OXWFZeEWU+TjGi9WX9LIRPrQfdS+4',
        role: 'USER'
      }
     */
  }

  {
    // # 複数行のデータを追加
    console.log('# 複数行のデータを追加');

    await prisma.post.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

    // ユーザーを複数件作成
    const createUsers = await prisma.user.createMany({
      data: [
        {
          email: 'chris@example.io',
          name: 'Chris',
          password: await argon2.hash('chrispass123'),
          role: Role.USER,
        },
        {
          email: 'andrew@example.io',
          name: 'Andrew',
          password: await argon2.hash('andrewpass123'),
          role: Role.ADMIN,
        },
      ],
    });

    console.dir(createUsers, { depth: null });
    /*
      { count: 2 }
     */
  }

  {
    // ### 生成された型を利用
    console.log('### 生成された型を利用');

    await prisma.post.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

    // UserテーブルへcreateManyでデータ投入する型はPrisma.UserCreateInput[] を使用します。
    const users: Prisma.UserCreateInput[] = [
      {
        email: 'taro@example.com',
        name: 'Taro',
        password: await argon2.hash('taropass123'),
        role: Role.USER,
      },
      {
        email: 'hanako@example.com',
        name: 'Hanako',
        password: await argon2.hash('hanakopass123'),
        role: Role.ADMIN,
      },
    ];

    // User テーブルへデータを追加
    const createUsers = await prisma.user.createMany({ data: users });

    console.dir(createUsers, { depth: null });
    /*
      { count: 2 }
     */
  }

  {
    // # 関連テーブルへの書き込み
    console.log('# 関連テーブルへの書き込み');

    await prisma.post.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

    // `posts` や `tags` と指定することで、同時にデータを書き込むことができます。
    const createUser = await prisma.user.create({
      data: {
        email: 'ken@example.com',
        name: 'Ken',
        password: await argon2.hash('kenpass123'),
        role: Role.USER,
        posts: {
          /**
           * create を指定することで更に関連する
           * 別テーブルのPostへ複数行データを書き込むことができます。
           */
          create: [
            {
              title: 'Learn Prisma Client',
              tags: {
                /**
                 * tag を指定することで更に関連する
                 * 別テーブルのTagへ複数行データを書き込むことができます。
                 */
                create: {
                  name: 'Prisma',
                },
              },
            },
            {
              title: 'Practice TypeScript',
              tags: {
                create: {
                  name: 'TypeScript',
                },
              },
            },
          ],
        },
      },
    });

    console.dir(createUser, { depth: null });
    /*
      {
        id: 7,
        email: 'ken@example.com',
        name: 'Ken',
        password: '$argon2id$v=19$m=65536,t=3,p=4$X3RUTPYhN9Kzas6BbGCXaQ$ujwGledimwA6FYGYfg8Qfzfm5DKbZuQzhzBN3bg63u0',
        role: 'USER'
      }
     */
  }

  {
    // ### 複数行書き込みにcreateManyを使用
    console.log('### 複数行書き込みにcreateManyを使用');

    await prisma.post.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

    const createUser = await prisma.user.create({
      data: {
        email: 'ken@example.com',
        name: 'Ken',
        password: await argon2.hash('kenpass123'),
        role: Role.USER,
        posts: {
          // createMany で複数のデータを書き込む。この場合は、data でデータを指定
          createMany: {
            data: [
              {
                title: 'Learn Prisma Client',
              },
              {
                title: 'Practice TypeScript',
              },
            ],
          },
        },
      },
    });

    console.dir(createUser, { depth: null });
    /*
      {
        id: 8,
        email: 'ken@example.com',
        name: 'Ken',
        password: '$argon2id$v=19$m=65536,t=3,p=4$XWCJGpCYcEWFmCTyTmhDWg$p/SwVdizCPLvfYZhx3Hl0GyjBHS/zW5hKc4hLW3nu9M',
        role: 'USER'
      }
     */
  }

  {
    // ### 返却値の操作（include）
    console.log('### 返却値の操作（include）');

    await prisma.post.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

    // `posts` や `tags` と指定することで、同時にデータを書き込むことができます。
    const createUser = await prisma.user.create({
      data: {
        email: 'ken@example.com',
        name: 'Ken',
        password: await argon2.hash('kenpass123'),
        role: Role.USER,
        posts: {
          /**
           * create を指定することで更に関連する
           * 別テーブルのPostへ複数行データを書き込むことができます。
           */
          create: [
            {
              title: 'Learn Prisma Client',
              tags: {
                /**
                 * create を指定することで更に関連する
                 * 別テーブルのTagへ複数行データを書き込むことができます。
                 */
                create: {
                  name: 'Prisma',
                },
              },
            },
            {
              title: 'Practice TypeScript',
              tags: {
                create: {
                  name: 'TypeScript',
                },
              },
            },
          ],
        },
      },
      include: {
        posts: {
          // Include posts
          include: {
            tags: true, // Include tag
          },
        },
      },
    });

    console.dir(createUser, { depth: null });
    /*
      {
        id: 9,
        email: 'ken@example.com',
        name: 'Ken',
        password: '$argon2id$v=19$m=65536,t=3,p=4$E9x8lg0V7DEY7xb8rcNyBw$m8krJzHYO736nUKoc4g/Ek9+xoP9Ncu/akKlOu7CpOk',
        role: 'USER',
        posts: [
          {
            id: 5,
            createdAt: 2024-09-29T13:03:41.262Z,
            updatedAt: 2024-09-29T13:03:41.262Z,
            title: 'Learn Prisma Client',
            likes: 0,
            published: false,
            authorId: 9,
            tags: [ { id: 3, name: 'Prisma' } ]
          },
          {
            id: 6,
            createdAt: 2024-09-29T13:03:41.262Z,
            updatedAt: 2024-09-29T13:03:41.262Z,
            title: 'Practice TypeScript',
            likes: 0,
            published: false,
            authorId: 9,
            tags: [ { id: 4, name: 'TypeScript' } ]
          }
        ]
      }
     */
  }

  {
    // ### 返却値の操作（select）
    console.log('### 返却値の操作（select）');

    await prisma.post.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

    // `posts` や `tags` と指定することで、同時にデータを書き込むことができます。
    const createUser = await prisma.user.create({
      data: {
        email: 'ken@example.com',
        name: 'Ken',
        password: await argon2.hash('kenpass123'),
        role: Role.USER,
        posts: {
          /**
           * create を指定することで更に関連する
           * 別テーブルのPostへ複数行データを書き込むことができます。
           */
          create: [
            {
              title: 'Learn Prisma Client',
              tags: {
                /**
                 * create を指定することで更に関連する
                 * 別テーブルのTagへ複数行データを書き込むことができます。
                 */
                create: {
                  name: 'Prisma',
                },
              },
            },
            {
              title: 'Practice TypeScript',
              tags: {
                create: {
                  name: 'TypeScript',
                },
              },
            },
          ],
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        posts: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            title: true,
            likes: true,
            published: true,
            authorId: true,
            tags: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    console.dir(createUser, { depth: null });
    /*
      {
        id: 10,
        email: 'ken@example.com',
        name: 'Ken',
        password: '$argon2id$v=19$m=65536,t=3,p=4$7ksMSbnMDcVIhOJYV1A57g$sqPVxwCPhwXVByzPLJX9WVcDz5InPnyWq7+3ls67vG0',
        role: 'USER',
        posts: [
          {
            id: 7,
            createdAt: 2024-09-29T13:08:28.026Z,
            updatedAt: 2024-09-29T13:08:28.026Z,
            title: 'Learn Prisma Client',
            likes: 0,
            published: false,
            authorId: 10,
            tags: [ { id: 5, name: 'Prisma' } ]
          },
          {
            id: 8,
            createdAt: 2024-09-29T13:08:28.026Z,
            updatedAt: 2024-09-29T13:08:28.026Z,
            title: 'Practice TypeScript',
            likes: 0,
            published: false,
            authorId: 10,
            tags: [ { id: 6, name: 'TypeScript' } ]
          }
        ]
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
