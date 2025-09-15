import { Star } from 'lucide-react';

interface FavoriteButtonProps {
  isFavorite?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function FavoriteButton({ isFavorite = false, onClick, size = 'md' }: FavoriteButtonProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        text-gray-400 hover:text-yellow-500
        transition-colors duration-200
        rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800
        p-1
      `}
      aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
    >
      <Star 
        className={`${sizeClasses[size]} ${
          isFavorite ? 'fill-yellow-500 text-yellow-500' : ''
        }`}
      />
    </button>
  );
}