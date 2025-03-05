
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  iconClassName?: string;
  index?: number;
}

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  className, 
  iconClassName,
  index = 0
}: FeatureCardProps) => {
  return (
    <div 
      className={cn(
        "neo-morphic rounded-2xl p-8 transition-all duration-300 hover:translate-y-[-5px]",
        className
      )}
      style={{ 
        animationDelay: `${0.1 + (index * 0.1)}s`,
      }}
    >
      <div 
        className={cn(
          "w-14 h-14 rounded-xl bg-timbl-100 flex items-center justify-center mb-6",
          iconClassName
        )}
      >
        <Icon className="text-timbl" size={24} />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
