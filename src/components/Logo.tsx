import { Eye } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo = ({ size = 'md', showText = true }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-lg bg-gradient-to-br from-primary to-signal-bullish flex items-center justify-center shadow-glow`}>
          <Eye className={size === 'lg' ? 'h-6 w-6' : size === 'md' ? 'h-4 w-4' : 'h-3 w-3'} strokeWidth={2.5} />
        </div>
        <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-signal-bullish animate-pulse" />
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-bold tracking-tight`}>
          Pick<span className="text-primary">Spy</span>
        </span>
      )}
    </div>
  );
};
