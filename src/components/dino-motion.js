export const DINO_SIZE = 42;

export function patrolSettings(width) {
  const distance = Math.max(0, (Number.isFinite(width) ? width : 0) - DINO_SIZE);
  return { distance, duration: Math.max(8000, distance / 45 * 2000) };
}
