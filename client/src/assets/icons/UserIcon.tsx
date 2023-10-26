type UserIconProps = {
  size?: number;
  color?: string;
};

export default function UserIcon({
  size = 24,
  color = '#C6C8B8',
}: UserIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M5 17.85C5.9 16.9667 6.946 16.271 8.138 15.763C9.33 15.255 10.6173 15.0007 12 15C13.3833 15 14.671 15.2543 15.863 15.763C17.055 16.2717 18.1007 16.9673 19 17.85V5H5V17.85ZM12 13C12.9667 13 13.7917 12.6583 14.475 11.975C15.1583 11.2917 15.5 10.4667 15.5 9.5C15.5 8.53334 15.1583 7.70834 14.475 7.025C13.7917 6.34167 12.9667 6 12 6C11.0333 6 10.2083 6.34167 9.525 7.025C8.84167 7.70834 8.5 8.53334 8.5 9.5C8.5 10.4667 8.84167 11.2917 9.525 11.975C10.2083 12.6583 11.0333 13 12 13ZM5 21C4.45 21 3.979 20.804 3.587 20.412C3.195 20.02 2.99934 19.5493 3 19V5C3 4.45 3.196 3.979 3.588 3.587C3.98 3.195 4.45067 2.99934 5 3H19C19.55 3 20.021 3.196 20.413 3.588C20.805 3.98 21.0007 4.45067 21 5V19C21 19.55 20.804 20.021 20.412 20.413C20.02 20.805 19.5493 21.0007 19 21H5ZM7 19H17V18.75C16.3 18.1667 15.525 17.729 14.675 17.437C13.825 17.145 12.9333 16.9993 12 17C11.0667 17 10.175 17.146 9.325 17.438C8.475 17.73 7.7 18.1673 7 18.75V19ZM12 11C11.5833 11 11.229 10.854 10.937 10.562C10.645 10.27 10.4993 9.916 10.5 9.5C10.5 9.08334 10.646 8.729 10.938 8.437C11.23 8.145 11.584 7.99934 12 8C12.4167 8 12.771 8.146 13.063 8.438C13.355 8.73 13.5007 9.084 13.5 9.5C13.5 9.91667 13.354 10.271 13.062 10.563C12.77 10.855 12.416 11.0007 12 11Z'
        fill={color}
      />
    </svg>
  );
}
