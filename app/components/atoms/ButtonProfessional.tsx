import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'premium';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
}

export function ButtonProfessional({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  icon,
  className = '', 
  children, 
  disabled,
  ...props 
}: ButtonProps) {
  const baseClasses = `
    relative font-semibold rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 
    transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed 
    touch-manipulation overflow-hidden group
    ${loading ? 'cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}
  `;
  
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 
      hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800
      dark:from-blue-700 dark:via-blue-800 dark:to-indigo-800 
      dark:hover:from-blue-600 dark:hover:via-blue-700 dark:hover:to-indigo-700
      text-white focus:ring-blue-500 
      shadow-lg hover:shadow-xl shadow-blue-200/30 hover:shadow-blue-300/40
      dark:shadow-blue-900/30 dark:hover:shadow-blue-800/40
    `,
    secondary: `
      bg-slate-100 hover:bg-slate-200 
      dark:bg-slate-800 dark:hover:bg-slate-700 
      text-slate-900 dark:text-slate-100 focus:ring-slate-500
      border border-slate-200 dark:border-slate-700
      hover:border-slate-300 dark:hover:border-slate-600
      shadow-sm hover:shadow-md
    `,
    success: `
      bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700
      hover:from-emerald-700 hover:via-green-700 hover:to-emerald-800
      dark:from-emerald-700 dark:via-green-700 dark:to-emerald-800 
      dark:hover:from-emerald-600 dark:hover:via-green-600 dark:hover:to-emerald-700
      text-white focus:ring-emerald-500 
      shadow-lg hover:shadow-xl shadow-emerald-200/30 hover:shadow-emerald-300/40
      dark:shadow-emerald-900/30 dark:hover:shadow-emerald-800/40
    `,
    danger: `
      bg-gradient-to-r from-red-600 via-rose-600 to-red-700
      hover:from-red-700 hover:via-rose-700 hover:to-red-800
      dark:from-red-700 dark:via-rose-700 dark:to-red-800 
      dark:hover:from-red-600 dark:hover:via-rose-600 dark:hover:to-red-700
      text-white focus:ring-red-500 
      shadow-lg hover:shadow-xl shadow-red-200/30 hover:shadow-red-300/40
      dark:shadow-red-900/30 dark:hover:shadow-red-800/40
    `,
    ghost: `
      bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 
      text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100
      border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500
      focus:ring-slate-500 backdrop-blur-sm
    `,
    premium: `
      bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600
      hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700
      text-black font-bold focus:ring-amber-500
      shadow-lg hover:shadow-xl shadow-amber-200/40 hover:shadow-amber-300/50
    `,
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2.5 text-sm min-h-[40px]',
    md: 'px-6 py-3 text-base min-h-[48px]',
    lg: 'px-8 py-4 text-lg min-h-[56px]',
    xl: 'px-10 py-5 text-xl min-h-[64px]',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {/* 호버 효과용 오버레이 */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300 rounded-2xl" />
      
      {/* 버튼 내용 */}
      <div className="relative flex items-center justify-center space-x-2">
        {loading ? (
          <>
            <div className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
            <span>처리중...</span>
          </>
        ) : (
          <>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span>{children}</span>
          </>
        )}
      </div>
    </button>
  );
}