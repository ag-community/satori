import Paper from '@mui/material/Paper';
import { forwardRef, type ReactNode, useState } from 'react';
import {
  type DragHandleProps,
  WindowTitlebar,
} from '@/components/ui/WindowTitlebar';
import { bevel } from '@/lib/vgui';

interface CardProps {
  title?: string;
  variant?: 'window' | 'inset';
  children: ReactNode;
  className?: string;
  titlebarDragHandle?: DragHandleProps;
  transform?: string;
  transition?: string;
  opacity?: number;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    title,
    variant = 'window',
    children,
    className,
    titlebarDragHandle,
    transform,
    transition,
    opacity,
  },
  ref,
) {
  const inset = variant === 'inset';
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Paper
      ref={ref}
      className={className}
      sx={(theme) => ({
        mb: 2.5,
        px: 1.25,
        py: 1.25,
        transform,
        transition,
        opacity,
        ...(inset
          ? {
              backgroundColor: theme.vars.palette.inset,
              ...bevel(theme, 'sunken'),
            }
          : {
              backgroundColor: theme.vars.palette.surface,
              ...bevel(theme, 'raised'),
            }),
      })}
    >
      {title !== undefined && (
        <WindowTitlebar
          title={title}
          onMinimize={() => setCollapsed((c) => !c)}
          dragHandle={titlebarDragHandle}
        />
      )}
      {!collapsed && children}
    </Paper>
  );
});
