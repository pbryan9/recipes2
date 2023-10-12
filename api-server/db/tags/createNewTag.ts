import type { NewTagInput } from '../../validators/newTagFormValidator';
import prisma from '../prismaSingleton';

export default async function createNewTag({ tagName, tagGroup }: NewTagInput) {
  const newTag = await prisma.tag.create({
    data: {
      description: tagName,
      tagGroup: tagGroup === '' ? undefined : tagGroup,
    },
  });

  return newTag;
}
