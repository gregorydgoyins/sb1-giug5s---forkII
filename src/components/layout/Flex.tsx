import React from 'react';

interface FlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'col';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around';
  align?: 'start' | 'end' | 'center' | 'stretch';
  gap?: number;
  className?: string;
}

export function Flex({ 
  children, 
  direction = 'row',
  justify = 'start',
  align = 'start',
  gap = 4,
  className = ''
}: FlexProps) {
  const flexClasses = {
    direction: {
      row: 'flex-row',
      col: 'flex-col'
    },
    justify: {
      start: 'justify-start',
      end: 'justify-end',
      center: 'justify-center',
      between: 'justify-between',
      around: 'justify-around'
    },
    align: {
      start: 'items-start',
      end: 'items-end',
      center: 'items-center',
      stretch: 'items-stretch'
    }
  };

  return (
    <div className={`
      flex
      ${flexClasses.direction[direction]}
      ${flexClasses.justify[justify]}
      ${flexClasses.align[align]}
      gap-${gap}
      ${className}
    `}>
      {children}
    </div>
  );
}