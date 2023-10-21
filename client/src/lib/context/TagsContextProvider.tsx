import React, { createContext, useEffect, useState } from 'react';
import type { Tag } from '../../../../api-server/db/tags/getAllTags';
import { trpc } from '../trpc/trpc';
import { NewTagInput } from '../../../../api-server/validators/newTagFormValidator';

export type TagContext = {
  tags: Tag[];
  createTag: (input: NewTagInput) => void;
};

const initialTagContext: TagContext = {
  tags: [],
  createTag: () => null,
};

declare global {
  interface WindowEventMap {
    tagCreated: CustomEvent<Tag>;
  }
}

export const TagContext = createContext(initialTagContext);

export default function TagContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tags, setTags] = useState<Tag[]>([]);
  const utils = trpc.useContext();

  const tagsQuery = trpc.tags.all.useQuery(undefined, {
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (!tagsQuery.isFetching && tagsQuery.isSuccess) {
      setTags(
        tagsQuery.data.sort((a, b) => (a.description < b.description ? -1 : 1))
      );
    }
  }, [tagsQuery.isFetching]);

  const createTagMutation = trpc.tags.create.useMutation({
    onSuccess(data) {
      utils.tags.all.invalidate();
      tagsQuery.refetch();

      // emit 'tagCreated' event so new recipe form can append to selected tags list
      let tagEvent = new CustomEvent<Tag>('tagCreated', { detail: data });
      dispatchEvent(tagEvent);
    },
  });

  function createTag({ tagName, tagGroup }: NewTagInput) {
    createTagMutation.mutate({ tagName, tagGroup });
  }

  return (
    <TagContext.Provider value={{ tags, createTag }}>
      {children}
    </TagContext.Provider>
  );
}
