type FullScreenIconProps = {
  size?: number;
  color?: string;
};

export default function FullScreenIcon({
  size = 24,
  color = '#C6C8B8',
}: FullScreenIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M5 19H7C7.28334 19 7.521 19.096 7.713 19.288C7.905 19.48 8.00067 19.7173 8 20C8 20.2833 7.904 20.521 7.712 20.713C7.52 20.905 7.28267 21.0007 7 21H4C3.71667 21 3.479 20.904 3.287 20.712C3.095 20.52 2.99934 20.2827 3 20V17C3 16.7167 3.096 16.479 3.288 16.287C3.48 16.095 3.71734 15.9993 4 16C4.28334 16 4.521 16.096 4.713 16.288C4.905 16.48 5.00067 16.7173 5 17V19ZM19 19V17C19 16.7167 19.096 16.479 19.288 16.287C19.48 16.095 19.7173 15.9993 20 16C20.2833 16 20.521 16.096 20.713 16.288C20.905 16.48 21.0007 16.7173 21 17V20C21 20.2833 20.904 20.521 20.712 20.713C20.52 20.905 20.2827 21.0007 20 21H17C16.7167 21 16.479 20.904 16.287 20.712C16.095 20.52 15.9993 20.2827 16 20C16 19.7167 16.096 19.479 16.288 19.287C16.48 19.095 16.7173 18.9993 17 19H19ZM5 5V7C5 7.28334 4.904 7.521 4.712 7.713C4.52 7.905 4.28267 8.00067 4 8C3.71667 8 3.479 7.904 3.287 7.712C3.095 7.52 2.99934 7.28267 3 7V4C3 3.71667 3.096 3.479 3.288 3.287C3.48 3.095 3.71734 2.99934 4 3H7C7.28334 3 7.521 3.096 7.713 3.288C7.905 3.48 8.00067 3.71734 8 4C8 4.28334 7.904 4.521 7.712 4.713C7.52 4.905 7.28267 5.00067 7 5H5ZM19 5H17C16.7167 5 16.479 4.904 16.287 4.712C16.095 4.52 15.9993 4.28267 16 4C16 3.71667 16.096 3.479 16.288 3.287C16.48 3.095 16.7173 2.99934 17 3H20C20.2833 3 20.521 3.096 20.713 3.288C20.905 3.48 21.0007 3.71734 21 4V7C21 7.28334 20.904 7.521 20.712 7.713C20.52 7.905 20.2827 8.00067 20 8C19.7167 8 19.479 7.904 19.287 7.712C19.095 7.52 18.9993 7.28267 19 7V5Z'
        fill={color}
      />
    </svg>
  );
}
