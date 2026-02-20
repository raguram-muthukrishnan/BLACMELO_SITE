/**
 * Scroll Area Component
 * Based on Base UI Scroll Area
 * Provides custom, cross-browser scroll styling
 */

import * as React from 'react';
import {ScrollArea as ScrollAreaPrimitive} from '@base-ui/react/scroll-area';
import {cn} from '~/lib/utils';

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({className, children, ...props}, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn('relative h-full w-full', className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport
      className="h-full w-full rounded-[inherit] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{overflow: 'scroll'}}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = 'ScrollArea';

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Scrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar>
>(({className, orientation = 'vertical', ...props}, ref) => (
  <ScrollAreaPrimitive.Scrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex touch-none select-none transition-colors',
      orientation === 'vertical' &&
        'h-full w-2.5 border-l border-l-transparent p-[1px]',
      orientation === 'horizontal' &&
        'h-2.5 flex-col border-t border-t-transparent p-[1px]',
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-zinc-300 hover:bg-zinc-400" />
  </ScrollAreaPrimitive.Scrollbar>
));
ScrollBar.displayName = 'ScrollBar';

export {ScrollArea, ScrollBar};
