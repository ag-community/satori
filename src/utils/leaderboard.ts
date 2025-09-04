export const getRankColor = (position: number) => {
  if (position === 1) return 'rgba(255, 215, 0, 0.7)';
  if (position === 2) return 'rgba(192, 192, 192, 0.7)';
  if (position === 3) return 'rgba(205, 127, 50, 0.7)';
  return 'transparent';
};
