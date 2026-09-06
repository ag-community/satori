import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ReactNode } from 'react';

import { Card } from '@/components/ui/Card';

interface SortableCardProps {
  id: string;
  title?: string;
  children: ReactNode;
  variant?: 'window' | 'inset';
}

export function SortableCard({
  id,
  title,
  children,
  variant,
}: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <Card
      ref={setNodeRef}
      title={title}
      variant={variant}
      titlebarDragHandle={{
        setActivatorNodeRef,
        listeners,
        attributes,
        isDragging,
      }}
      transform={CSS.Transform.toString(transform)}
      transition={transition}
      opacity={isDragging ? 0.5 : undefined}
    >
      {children}
    </Card>
  );
}
