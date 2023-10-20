type MinusIconProps = {
  size?: number;
  color?: string;
};

export default function MinusIcon({
  size = 24,
  color = '#C6C8B8',
}: MinusIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M7 13C6.71667 13 6.479 12.904 6.287 12.712C6.095 12.52 5.99934 12.2827 6 12C6 11.7167 6.096 11.479 6.288 11.287C6.48 11.095 6.71734 10.9993 7 11H17C17.2833 11 17.521 11.096 17.713 11.288C17.905 11.48 18.0007 11.7173 18 12C18 12.2833 17.904 12.521 17.712 12.713C17.52 12.905 17.2827 13.0007 17 13H7Z'
        fill={color}
      />
    </svg>
  );
}
