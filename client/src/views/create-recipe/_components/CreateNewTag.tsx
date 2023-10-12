import { useState } from 'react';
import { useForm } from 'react-hook-form';
import LeftNavCard from '../../../components/LeftNavCard';
import LeftNavCardContainer from '../../../components/LeftNavCardContainer';
import newTagFormValidator, {
  NewTagInput,
} from '../../../../../api-server/validators/newTagFormValidator';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '../../../utils/trpc/trpc';
import { Tag } from '../../../../../api-server/db/tags/getAllTags';

const defaultValues = {
  tagName: '',
  tagGroup: '',
};

type CreateNewTagProps = {
  toggleTag: (tag: Tag) => void;
};

export default function CreateNewTag({ toggleTag }: CreateNewTagProps) {
  const { handleSubmit, register, reset } = useForm<NewTagInput>({
    defaultValues,
    resolver: zodResolver(newTagFormValidator),
  });

  const utils = trpc.useContext();

  const newTagMutation = trpc.tags.create.useMutation({
    onSuccess(data) {
      utils.tags.all.invalidate();
      utils.tags.all.refetch();
      // TODO: attach new tag
      reset(defaultValues);
      toggleTag(data);
    },
  });

  function onSubmit(formData: NewTagInput) {
    newTagMutation.mutate(formData);
  }

  return (
    <>
      <LeftNavCardContainer variant='sub-container' title={'Create New Tag'}>
        <LeftNavCard variant='sub-sub-item'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='grid grid-cols-4 gap-y-4 gap-x-2'
          >
            <label className='col-span-1' htmlFor='create-tag-name'>
              Tag Name
            </label>{' '}
            <input
              className='col-span-3'
              type='text'
              id='create-tag-name'
              {...register('tagName')}
            ></input>
            <label className='col-span-1' htmlFor='create-tag-group'>
              Tag Group
            </label>{' '}
            <input
              className='col-span-3'
              type='text'
              id='create-tag-group'
              {...register('tagGroup')}
            ></input>
            <button
              className='col-span-full bg-green-300 border border-gray-400 rounded-md py-2'
              type='submit'
            >
              Create & Attach Tag
            </button>
          </form>
        </LeftNavCard>
      </LeftNavCardContainer>
    </>
  );
}
