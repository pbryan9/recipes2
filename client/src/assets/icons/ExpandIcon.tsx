type ExpandIconProps = {
  size?: number;
  pathFill?: string;
};

export default function ExpandIcon({
  size = 24,
  pathFill = 'var(--md-sys-color-on-surface-dark)',
}: ExpandIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M12 19.1501L15.875 15.2751C16.075 15.0751 16.3083 14.9751 16.575 14.9751C16.8416 14.9751 17.075 15.0751 17.275 15.2751C17.475 15.4751 17.575 15.7128 17.575 15.9881C17.575 16.2634 17.475 16.5008 17.275 16.7001L13.425 20.5751C13.0416 20.9584 12.5666 21.1501 12 21.1501C11.4333 21.1501 10.9583 20.9584 10.575 20.5751L6.69996 16.7001C6.49996 16.5001 6.40396 16.2624 6.41196 15.9871C6.41996 15.7118 6.52429 15.4744 6.72496 15.2751C6.92496 15.0751 7.16263 14.9751 7.43796 14.9751C7.71329 14.9751 7.95063 15.0751 8.14996 15.2751L12 19.1501ZM12 4.8501L8.14996 8.7001C7.94996 8.9001 7.71663 8.9961 7.44996 8.9881C7.18329 8.9801 6.94996 8.8841 6.74996 8.7001C6.54996 8.5001 6.44563 8.26276 6.43696 7.9881C6.42829 7.71343 6.52429 7.47576 6.72496 7.2751L10.575 3.4251C10.9583 3.04176 11.4333 2.8501 12 2.8501C12.5666 2.8501 13.0416 3.04176 13.425 3.4251L17.275 7.2751C17.475 7.4751 17.571 7.71276 17.563 7.9881C17.555 8.26343 17.4506 8.50076 17.25 8.7001C17.05 8.88343 16.8166 8.97943 16.55 8.9881C16.2833 8.99676 16.05 8.90076 15.85 8.7001L12 4.8501Z'
        fill={pathFill}
      />
    </svg>
  );
}