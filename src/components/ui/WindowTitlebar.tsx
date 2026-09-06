import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from '@dnd-kit/core';
import Box from '@mui/material/Box';
import { useColorScheme, useTheme } from '@mui/material/styles';
import type { Ref } from 'react';

const assets = (name: string) => `/images/${name}.png`;

export interface DragHandleProps {
  setActivatorNodeRef?: Ref<HTMLElement>;
  listeners?: DraggableSyntheticListeners;
  attributes?: DraggableAttributes;
  isDragging?: boolean;
}

interface WindowTitlebarProps {
  title: string;
  onMinimize?: () => void;
  dragHandle?: DragHandleProps;
}

export function WindowTitlebar({
  title,
  onMinimize,
  dragHandle,
}: WindowTitlebarProps) {
  const { colorScheme } = useColorScheme();
  const theme = useTheme();
  const isGrey = colorScheme === 'greysteam';

  const minimize = isGrey ? assets('minimize-grey') : assets('minimize');
  const close = isGrey ? assets('close-grey') : assets('close');

  const controlButton = (
    icon: string,
    label: string,
    right: number,
    opts: { onClick?: () => void; disabled?: boolean },
  ) => (
    <button
      type="button"
      aria-label={label}
      aria-disabled={opts.disabled}
      onClick={opts.onClick}
      disabled={opts.disabled}
      style={{
        all: 'unset',
        position: 'absolute',
        top: 0,
        right,
        width: 18,
        height: 18,
        cursor: opts.disabled ? 'default' : 'pointer',
        opacity: opts.disabled ? 0.5 : 1,
        backgroundImage: `url(${icon})`,
        backgroundRepeat: 'no-repeat',
        zIndex: 1,
      }}
    />
  );

  return (
    <Box
      ref={dragHandle?.setActivatorNodeRef}
      {...(dragHandle?.listeners ?? {})}
      {...(dragHandle?.attributes ?? {})}
      sx={{
        position: 'relative',
        mb: '1em',
        width: '100%',
        height: 18,
        lineHeight: '18px',
        textIndent: isGrey ? 10 : 24,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        textTransform: isGrey ? 'none' : 'uppercase',
        fontVariant: isGrey ? 'small-caps' : 'normal',
        fontSize: 12,
        letterSpacing: isGrey ? 'normal' : 2,
        color: 'text.primary',
        fontWeight: 'bold',
        fontFamily: theme.typography.fontFamily,
        backgroundImage: isGrey ? undefined : `url(${assets('steamico')})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top left',
        ...(dragHandle && {
          cursor: dragHandle.isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }),
      }}
    >
      {title}
      {controlButton(minimize, 'Minimize', 20, { onClick: onMinimize })}
      {controlButton(close, 'Close', 0, { disabled: true })}
    </Box>
  );
}
