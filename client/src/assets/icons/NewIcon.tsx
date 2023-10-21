type NewIconProps = {
  size?: number;
  pathFill?: string;
};

export default function NewIcon({
  size = 24,
  pathFill = 'var(--md-sys-color-on-surface-dark)',
}: NewIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 24 24`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M5 21C4.45 21 3.979 20.804 3.587 20.412C3.195 20.02 2.99934 19.5493 3 19V5C3 4.45 3.196 3.979 3.588 3.587C3.98 3.195 4.45067 2.99934 5 3H11V5H5V19H19V13H21V19C21 19.55 20.804 20.021 20.412 20.413C20.02 20.805 19.5493 21.0007 19 21H5ZM16 11V8H13V6H16V3H18V6H21V8H18V11H16Z'
        fill={pathFill}
      />
    </svg>
  );
}
