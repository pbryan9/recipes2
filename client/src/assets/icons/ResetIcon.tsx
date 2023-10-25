type ResetIconProps = {
  size?: number;
  color?: string;
};

export default function ResetIcon({
  size = 24,
  color = '#C6C8B8',
}: ResetIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M16.325 18.8L15.175 19.95C14.8917 20.2333 14.5417 20.3793 14.125 20.388C13.7083 20.3967 13.35 20.2507 13.05 19.95C12.7667 19.6667 12.625 19.3127 12.625 18.888C12.625 18.4633 12.7667 18.109 13.05 17.825L14.2 16.675C14.1333 16.4917 14.0833 16.3 14.05 16.1C14.0167 15.9 14 15.7 14 15.5C14 14.5333 14.3417 13.7083 15.025 13.025C15.7083 12.3417 16.5333 12 17.5 12C17.65 12 17.8 12.0043 17.95 12.013C18.1 12.0217 18.2417 12.0507 18.375 12.1C18.5583 12.1667 18.671 12.3043 18.713 12.513C18.755 12.7217 18.709 12.8923 18.575 13.025L17.5 14.1C17.3 14.3 17.2 14.5333 17.2 14.8C17.2 15.0667 17.3 15.3 17.5 15.5C17.6833 15.6833 17.9167 15.775 18.2 15.775C18.4833 15.775 18.7167 15.6833 18.9 15.5L19.975 14.425C20.1083 14.2917 20.279 14.2457 20.487 14.287C20.695 14.3283 20.8327 14.441 20.9 14.625C20.95 14.7583 20.9793 14.9 20.988 15.05C20.9967 15.2 21.0007 15.35 21 15.5C21 16.4667 20.6583 17.2917 19.975 17.975C19.2917 18.6583 18.4667 19 17.5 19C17.2833 19 17.079 18.9833 16.887 18.95C16.695 18.9167 16.5077 18.8667 16.325 18.8ZM6.35 19C5.31667 18.1667 4.5 17.1457 3.9 15.937C3.3 14.7283 3 13.416 3 12C3 10.75 3.23767 9.579 3.713 8.487C4.18833 7.395 4.82967 6.445 5.637 5.637C6.44567 4.829 7.39567 4.18767 8.487 3.713C9.57833 3.23833 10.7493 3.00067 12 3C13.85 3 15.5083 3.5 16.975 4.5C18.4417 5.5 19.525 6.79167 20.225 8.375C20.3417 8.64167 20.3417 8.9 20.225 9.15C20.1083 9.4 19.9167 9.575 19.65 9.675C19.4 9.75833 19.1543 9.74167 18.913 9.625C18.6717 9.50833 18.4923 9.325 18.375 9.075C17.825 7.875 16.979 6.896 15.837 6.138C14.695 5.38 13.416 5.00067 12 5C10.05 5 8.39567 5.67933 7.037 7.038C5.67833 8.39667 4.99933 10.0507 5 12C5 13.2 5.271 14.3 5.813 15.3C6.355 16.3 7.084 17.1167 8 17.75V16C8 15.7167 8.096 15.479 8.288 15.287C8.48 15.095 8.71733 14.9993 9 15C9.28333 15 9.521 15.096 9.713 15.288C9.905 15.48 10.0007 15.7173 10 16V20C10 20.2833 9.904 20.521 9.712 20.713C9.52 20.905 9.28267 21.0007 9 21H5C4.71667 21 4.479 20.904 4.287 20.712C4.095 20.52 3.99933 20.2827 4 20C4 19.7167 4.096 19.479 4.288 19.287C4.48 19.095 4.71733 18.9993 5 19H6.35Z'
        fill={color}
      />
    </svg>
  );
}
