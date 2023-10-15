type HamburgerIconProps = {
  size?: number;
  pathFill?: string;
};

export default function HamburgerIcon({
  size = 24,
  pathFill = 'var(--md-sys-color-on-surface-dark)',
}: HamburgerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M3.75 6H20.25M3.75 12H20.25M3.75 18H20.25'
        stroke={pathFill}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
