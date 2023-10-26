import React from 'react';

type ModalProps = {
  headline: string;
  caption?: string;
  body: React.ReactNode;
  buttons: React.ReactNode;
};

export default function Modal({
  headline,
  caption,
  body,
  buttons,
}: ModalProps) {
  return (
    <div className='w-screen h-screen z-[1000] bg-black/30 fixed top-0 left-0 flex justify-center items-center backdrop-blur-[4px] text-on-surface'>
      <div className='w-fit min-w-[280px] max-w-[560px] mx-auto bg-surface-container-high max-h-[67vw] h-fit overflow-y-auto rounded-[28px] p-6 shadow-2xl'>
        <div className='caption-wrapper flex flex-col gap-4'>
          <h1 className='text-on-surface headline-small'>{headline}</h1>
          <p className='text-on-surface-variant'>{caption}</p>
          {body}
        </div>
        <div className='button-wrapper w-full flex justify-end items-center gap-2 pt-6'>
          {buttons}
        </div>
      </div>
    </div>
  );
}
