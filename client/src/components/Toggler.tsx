import React from 'react';

type TogglerProps = {
  isOn: boolean;
  setIsOn?: React.Dispatch<React.SetStateAction<boolean>>;
  as?: 'button' | 'div';
};

export default function Toggler({
  isOn,
  setIsOn,
  as = 'button',
}: TogglerProps) {
  const Tag = as;
  return (
    <Tag
      onClick={setIsOn ? () => setIsOn((prev) => !prev) : undefined}
      className='h-[19px] w-[32px] relative rounded-full border border-outline bg-gray-800'
    >
      <div
        className={`h-[15px] absolute top-[1px] aspect-square rounded-full border border-outline ${
          isOn ? 'bg-green-300 right-[2px]' : 'bg-gray-300 left-[2px]'
        }`}
      />
    </Tag>
  );
}
