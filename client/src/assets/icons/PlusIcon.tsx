type PlusIconProps = {
  size?: number;
  pathFill?: string;
};

export default function PlusIcon({
  size = 24,
  pathFill = 'var(--md-sys-color-on-surface-dark)',
}: PlusIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M11 13H5V11H11V5H13V11H19V13H13V19H11V13Z' fill={pathFill} />
    </svg>
  );
}
