import React from 'react';

type TogglerProps = {
  isOn: boolean;
  setIsOn?: React.Dispatch<React.SetStateAction<boolean>>;
  as?: 'button' | 'div';
  color?: boolean;
};

export default function Toggler({
  isOn,
  setIsOn,
  as = 'button',
  color = true,
}: TogglerProps) {
  const Tag = as;
  return (
    <Tag
      onClick={setIsOn ? () => setIsOn((prev) => !prev) : undefined}
      className={`h-[19px] w-[32px] relative rounded-full border border-outline ${
        isOn && color ? 'bg-green-800/40' : 'bg-black/20'
      }`}
    >
      <div
        className={`h-[15px] absolute top-[1px] aspect-square rounded-full border border-outline ${
          isOn ? 'right-[2px]' : 'left-[2px]'
        }
        ${isOn && color ? 'bg-primary' : 'bg-on-surface-variant'}
        `}
      />
    </Tag>
  );
}
