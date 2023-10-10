import { Prisma } from '@prisma/client';
import prisma from '../prismaSingleton';

export default async function getAllTags() {
  const allTags = await prisma.tag.findMany();

  return allTags;
}

export type Tag = Prisma.TagGetPayload<{}>;
