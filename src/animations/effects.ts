// =============================================================================
// Animation Effects — Google Slides-like built-in effects
// =============================================================================

export interface AnimationEffectDef {
  name: string;
  label: string;
  type: 'entrance' | 'exit' | 'emphasis';
  css: string;  // CSS keyframes
}

// ── Entrance Effects ──

export const ENTRANCE_EFFECTS: AnimationEffectDef[] = [
  {
    name: 'fadeIn',
    label: 'Fade In',
    type: 'entrance',
    css: `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`,
  },
  {
    name: 'slideInLeft',
    label: 'Slide In (Left)',
    type: 'entrance',
    css: `@keyframes slideInLeft { from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: translateX(0); } }`,
  },
  {
    name: 'slideInRight',
    label: 'Slide In (Right)',
    type: 'entrance',
    css: `@keyframes slideInRight { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); } }`,
  },
  {
    name: 'slideInTop',
    label: 'Slide In (Top)',
    type: 'entrance',
    css: `@keyframes slideInTop { from { opacity: 0; transform: translateY(-60px); } to { opacity: 1; transform: translateY(0); } }`,
  },
  {
    name: 'slideInBottom',
    label: 'Slide In (Bottom)',
    type: 'entrance',
    css: `@keyframes slideInBottom { from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); } }`,
  },
  {
    name: 'zoomIn',
    label: 'Zoom In',
    type: 'entrance',
    css: `@keyframes zoomIn { from { opacity: 0; transform: scale(0.3); } to { opacity: 1; transform: scale(1); } }`,
  },
  {
    name: 'bounceIn',
    label: 'Bounce In',
    type: 'entrance',
    css: `@keyframes bounceIn { 0% { opacity: 0; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.05); } 70% { transform: scale(0.95); } 100% { transform: scale(1); } }`,
  },
  {
    name: 'flipInX',
    label: 'Flip In (Horizontal)',
    type: 'entrance',
    css: `@keyframes flipInX { from { opacity: 0; transform: perspective(400px) rotateX(90deg); } to { opacity: 1; transform: perspective(400px) rotateX(0); } }`,
  },
  {
    name: 'flipInY',
    label: 'Flip In (Vertical)',
    type: 'entrance',
    css: `@keyframes flipInY { from { opacity: 0; transform: perspective(400px) rotateY(90deg); } to { opacity: 1; transform: perspective(400px) rotateY(0); } }`,
  },
  {
    name: 'rotateIn',
    label: 'Rotate In',
    type: 'entrance',
    css: `@keyframes rotateIn { from { opacity: 0; transform: rotate(-200deg) scale(0.5); } to { opacity: 1; transform: rotate(0) scale(1); } }`,
  },
];

// ── Exit Effects ──

export const EXIT_EFFECTS: AnimationEffectDef[] = [
  {
    name: 'fadeOut',
    label: 'Fade Out',
    type: 'exit',
    css: `@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }`,
  },
  {
    name: 'slideOutLeft',
    label: 'Slide Out (Left)',
    type: 'exit',
    css: `@keyframes slideOutLeft { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(-60px); } }`,
  },
  {
    name: 'slideOutRight',
    label: 'Slide Out (Right)',
    type: 'exit',
    css: `@keyframes slideOutRight { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(60px); } }`,
  },
  {
    name: 'slideOutTop',
    label: 'Slide Out (Top)',
    type: 'exit',
    css: `@keyframes slideOutTop { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-60px); } }`,
  },
  {
    name: 'slideOutBottom',
    label: 'Slide Out (Bottom)',
    type: 'exit',
    css: `@keyframes slideOutBottom { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(60px); } }`,
  },
  {
    name: 'zoomOut',
    label: 'Zoom Out',
    type: 'exit',
    css: `@keyframes zoomOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.3); } }`,
  },
  {
    name: 'shrinkOut',
    label: 'Shrink Out',
    type: 'exit',
    css: `@keyframes shrinkOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0); } }`,
  },
];

// ── Emphasis Effects ──

export const EMPHASIS_EFFECTS: AnimationEffectDef[] = [
  {
    name: 'pulse',
    label: 'Pulse',
    type: 'emphasis',
    css: `@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.08); } 100% { transform: scale(1); } }`,
  },
  {
    name: 'bounce',
    label: 'Bounce',
    type: 'emphasis',
    css: `@keyframes bounce { 0%, 100% { transform: translateY(0); } 30% { transform: translateY(-16px); } 50% { transform: translateY(-8px); } }`,
  },
  {
    name: 'shake',
    label: 'Shake',
    type: 'emphasis',
    css: `@keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); } 20%, 40%, 60%, 80% { transform: translateX(6px); } }`,
  },
  {
    name: 'spin',
    label: 'Spin',
    type: 'emphasis',
    css: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`,
  },
  {
    name: 'flash',
    label: 'Flash',
    type: 'emphasis',
    css: `@keyframes flash { 0%, 50%, 100% { opacity: 1; } 25%, 75% { opacity: 0; } }`,
  },
  {
    name: 'rubberBand',
    label: 'Rubber Band',
    type: 'emphasis',
    css: `@keyframes rubberBand { 0% { transform: scaleX(1) scaleY(1); } 30% { transform: scaleX(1.25) scaleY(0.75); } 40% { transform: scaleX(0.75) scaleY(1.25); } 50% { transform: scaleX(1.15) scaleY(0.85); } 65% { transform: scaleX(0.95) scaleY(1.05); } 75% { transform: scaleX(1.05) scaleY(0.95); } 100% { transform: scaleX(1) scaleY(1); } }`,
  },
  {
    name: 'wobble',
    label: 'Wobble',
    type: 'emphasis',
    css: `@keyframes wobble { 0% { transform: translateX(0) rotate(0); } 15% { transform: translateX(-8px) rotate(-5deg); } 30% { transform: translateX(6px) rotate(3deg); } 45% { transform: translateX(-5px) rotate(-3deg); } 60% { transform: translateX(3px) rotate(2deg); } 75% { transform: translateX(-2px) rotate(-1deg); } 100% { transform: translateX(0) rotate(0); } }`,
  },
  {
    name: 'heartBeat',
    label: 'Heartbeat',
    type: 'emphasis',
    css: `@keyframes heartBeat { 0% { transform: scale(1); } 14% { transform: scale(1.15); } 28% { transform: scale(1); } 42% { transform: scale(1.15); } 70% { transform: scale(1); } }`,
  },
  {
    name: 'grow',
    label: 'Grow',
    type: 'emphasis',
    css: `@keyframes grow { 0% { transform: scale(1); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }`,
  },
  {
    name: 'shrink',
    label: 'Shrink',
    type: 'emphasis',
    css: `@keyframes shrink { 0% { transform: scale(1); } 50% { transform: scale(0.85); } 100% { transform: scale(1); } }`,
  },
];

// ── All effects combined ──

export const ALL_EFFECTS: AnimationEffectDef[] = [
  ...ENTRANCE_EFFECTS,
  ...EXIT_EFFECTS,
  ...EMPHASIS_EFFECTS,
];

export function getEffectByName(name: string): AnimationEffectDef | undefined {
  return ALL_EFFECTS.find(e => e.name === name);
}

export function getEffectsByType(type: 'entrance' | 'exit' | 'emphasis'): AnimationEffectDef[] {
  return ALL_EFFECTS.filter(e => e.type === type);
}

/**
 * Generate all CSS keyframes for a set of animations.
 */
export function generateAnimationCSS(effectNames: string[]): string {
  const unique = [...new Set(effectNames)];
  return unique
    .map(name => getEffectByName(name)?.css || '')
    .filter(Boolean)
    .join('\n');
}
