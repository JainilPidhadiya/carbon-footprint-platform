import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glassmorphism?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = false, glassmorphism = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge(
          clsx(
            'rounded-2xl border transition-all duration-350 overflow-hidden',
            {
              // Standard style
              'bg-white dark:bg-slate-800/80 border-slate-100 dark:border-slate-800 shadow-sm': !glassmorphism,
              // Glassmorphism style
              'bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-white/20 dark:border-slate-800/50 shadow-md': glassmorphism,
              // Hover effect
              'hover:shadow-md hover:translate-y-[-2px] dark:hover:border-slate-700/80': hoverEffect,
            },
            className
          )
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={twMerge('p-5 border-b border-slate-100 dark:border-slate-800/50', className)} {...props}>
    {children}
  </div>
);

CardHeader.displayName = 'CardHeader';

export const CardBody = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={twMerge('p-5', className)} {...props}>
    {children}
  </div>
);

CardBody.displayName = 'CardBody';

export const CardFooter = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={twMerge('p-5 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20', className)} {...props}>
    {children}
  </div>
);

CardFooter.displayName = 'CardFooter';
