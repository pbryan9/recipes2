type ButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  border?: 'none';
  disabled?: boolean;
  type?: 'button' | 'submit';
  children: React.ReactNode;
};

export default function Button({
  onClick,
  border = undefined,
  disabled = false,
  type = 'button',
  children,
}: ButtonProps) {
  return (
    <button
      {...{ type, disabled, onClick }}
      className={`col-span-2  text-center rounded-md text-base h-full ${
        border !== 'none' && 'border border-gray-400'
      }`}
    >
      {children}
    </button>
  );
}
