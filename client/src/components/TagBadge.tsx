type TagBadgeProps = {
  onClick?: () => void;
  children: React.ReactNode;
};

export default function TagBadge({
  children = 'TagName',
  onClick,
}: TagBadgeProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-slate-500 rounded-full w-fit flex items-center justify-center px-3 py-1 text-xs ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {children}
    </div>
  );
}
