type RecipePotIconProps = {
  size?: number;
  pathFill?: string;
};

export default function RecipePotIcon({
  size = 24,
  pathFill = 'var(--md-sys-color-on-surface-dark)',
}: RecipePotIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M14.6 8.99998L18 3.09998L19.7 4.09998L16.9 8.99998H14.6ZM16.3 9.99998H21V12H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V12H3V9.99998H16.3ZM17 12H7V19H17V12Z'
        fill={pathFill}
      />
    </svg>
  );
}
