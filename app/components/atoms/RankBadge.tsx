interface RankBadgeProps {
  rank: number;
  size?: 'sm' | 'md' | 'lg';
}

export function RankBadge({ rank, size = 'md' }: RankBadgeProps) {
  const getRankStyle = (rank: number) => {
    if (rank <= 3) {
      return {
        bg: 'bg-gradient-to-br from-yellow-400 to-amber-500',
        text: 'text-white',
        border: 'border-yellow-300/50',
        shadow: 'shadow-yellow-200/50'
      };
    } else if (rank <= 5) {
      return {
        bg: 'bg-gradient-to-br from-purple-500 to-indigo-600',
        text: 'text-white',
        border: 'border-purple-400/50',
        shadow: 'shadow-purple-200/50'
      };
    } else {
      return {
        bg: 'bg-gradient-to-br from-slate-600 to-gray-700',
        text: 'text-white',
        border: 'border-slate-500/50',
        shadow: 'shadow-slate-200/30'
      };
    }
  };

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };

  const style = getRankStyle(rank);

  return (
    <div className={`
      ${style.bg} ${style.text} ${style.border} 
      ${sizeClasses[size]}
      flex items-center justify-center 
      rounded-xl font-bold border 
      shadow-lg ${style.shadow}
      transition-all duration-200 hover:scale-105
    `}>
      {rank}
    </div>
  );
}