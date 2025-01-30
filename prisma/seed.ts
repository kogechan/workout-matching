import { PrismaClient, Role } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
      password: await argon2.hash('alicepass123'),
      role: Role.USER,
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob',
      password: await argon2.hash('bobpass456'),
      role: Role.ADMIN,
    },
  });

  const charlie = await prisma.user.create({
    data: {
      email: 'charlie@example.com',
      name: 'Charlie',
      password: await argon2.hash('charliepass789'),
      role: Role.USER,
    },
  });

  // Create profiles
  await prisma.profile.create({
    data: {
      bio: 'I love Prisma!',
      userId: alice.id,
    },
  });

  await prisma.profile.create({
    data: {
      bio: 'Next.js is awesome!',
      userId: charlie.id,
    },
  });

  await prisma.profile.create({
    data: {
      bio: 'Next.js is awesome!',
      userId: bob.id,
    },
  });

  // Create tags
  const prismaTag = await prisma.tag.create({
    data: { name: 'Prisma' },
  });

  const nextjsTag = await prisma.tag.create({
    data: { name: 'Next.js' },
  });

  const typescriptTag = await prisma.tag.create({
    data: { name: 'TypeScript' },
  });

  // Create posts
  await prisma.post.create({
    data: {
      title: 'I started using Prisma with TypeScript Project!',
      authorId: alice.id,
      tags: { connect: [{ id: prismaTag.id }, { id: typescriptTag.id }] },
    },
  });

  await prisma.post.create({
    data: {
      title: 'I need to study Next.js more',
      authorId: alice.id,
      tags: { connect: [{ id: nextjsTag.id }] },
    },
  });

  await prisma.post.create({
    data: {
      title: 'I cannot wait for Next.js Conference',
      authorId: charlie.id,
      tags: { connect: [{ id: nextjsTag.id }] },
    },
  });

  await prisma.post.create({
    data: {
      title: 'I am planning to use Prisma',
      authorId: charlie.id,
      tags: { connect: [{ id: prismaTag.id }] },
    },
  });

  await prisma.post.create({
    data: {
      title: "I am doing 100 Days' TypeScript Challenge",
      authorId: charlie.id,
      tags: { connect: [{ id: typescriptTag.id }] },
    },
  });

  console.log('Seed data inserted successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
