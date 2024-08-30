import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const message = await prisma.message.upsert({
    where: { id: 1 },
    update: {},
    create: {
      chat_id: 1,
      nickname: 'nickname',
      message: Buffer.from('test'),
      skey: 1,
      algo: 0,
    },
  });

  console.log({ message });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
