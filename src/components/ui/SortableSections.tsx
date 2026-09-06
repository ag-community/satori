import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { type ReactNode, useCallback, useState } from 'react';

import { Card } from '@/components/ui/Card';
import { SortableCard } from '@/components/ui/SortableCard';

interface SectionDef {
  title?: string;
  body: ReactNode;
  variant?: 'window' | 'inset';
}

interface SortableSectionsProps {
  sections: Record<string, SectionDef>;
  initialOrder: readonly string[];
}

export function SortableSections({
  sections,
  initialOrder,
}: SortableSectionsProps) {
  const [order, setOrder] = useState<string[]>([...initialOrder]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const handleDragStart = useCallback(({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
  }, []);

  const handleDragEnd = useCallback(({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (over && active.id !== over.id) {
      setOrder((items) =>
        arrayMove(
          items,
          items.indexOf(active.id as string),
          items.indexOf(over.id as string),
        ),
      );
    }
  }, []);

  const handleDragCancel = useCallback(() => setActiveId(null), []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        {order.map((id) => (
          <SortableCard
            key={id}
            id={id}
            title={sections[id].title}
            variant={sections[id].variant}
          >
            {sections[id].body}
          </SortableCard>
        ))}
      </SortableContext>
      <DragOverlay>
        {activeId ? (
          <Card
            title={sections[activeId].title}
            variant={sections[activeId].variant}
          >
            {sections[activeId].body}
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
