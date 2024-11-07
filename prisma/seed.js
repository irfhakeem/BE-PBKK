import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.users.create({
    data: {
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.person.fullName(),
      bio: faker.lorem.sentence(),
      avatar: faker.image.avatar(),
      banner: faker.image.url(),
      loginAttempts: faker.number.int({ min: 0, max: 5 }),
    },
  });

  // Create a tag
  const tag = await prisma.tags.create({
    data: {
      name: faker.lorem.word(),
    },
  });

  // Create a post with authorUsername
  await prisma.posts.create({
    data: {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(),
      caption: faker.lorem.sentence(),
      image: faker.image.url(),
      isPublished: true,
      authorUsername: user.username, // Set authorUsername
      author: {
        connect: {
          id: user.id,
        },
      },
      tags: {
        create: {
          tag: {
            connect: {
              id: tag.id,
            },
          },
        },
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
