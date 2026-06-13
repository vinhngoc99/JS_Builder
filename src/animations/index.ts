import { CanvasElement, ElementAnimation } from '../types';

/**
 * Get the current inline style for an element based on its animation state.
 * 
 * - If it has an entrance animation that hasn't played yet, it should be invisible (opacity: 0).
 * - If the animation is playing, apply the CSS animation property.
 * - If an entrance animation has finished playing, it should remain visible (opacity: 1).
 * - If an exit animation has finished playing, it should remain invisible (opacity: 0).
 */
export function getAnimationCSSStyle(
  element: CanvasElement,
  playedAnimationIds: string[],
  previewAnimationId?: string | null
): React.CSSProperties {
  const animations = element.animations || [];
  if (animations.length === 0) return {};

  // Find the active animation (either the one being previewed, or the last played one)
  let activeAnim: ElementAnimation | null = null;

  if (previewAnimationId) {
    activeAnim = animations.find(a => a.id === previewAnimationId) || null;
  } else {
    // Find the last played animation in order of occurrence
    const played = animations.filter(a => playedAnimationIds.includes(a.id));
    if (played.length > 0) {
      activeAnim = played[played.length - 1];
    }
  }

  // Check if there is an entrance animation that hasn't been triggered yet
  const hasEntrance = animations.some(a => a.type === 'entrance');
  const entrancePlayed = animations
    .filter(a => a.type === 'entrance')
    .every(a => playedAnimationIds.includes(a.id));

  // Default state before entrance is played
  const styles: React.CSSProperties = {};
  if (hasEntrance && !entrancePlayed && !previewAnimationId) {
    styles.opacity = 0;
    styles.pointerEvents = 'none';
  }

  if (activeAnim) {
    const isPlaying = previewAnimationId || playedAnimationIds.includes(activeAnim.id);
    
    if (isPlaying) {
      styles.animationName = activeAnim.effect;
      styles.animationDuration = `${activeAnim.duration}ms`;
      styles.animationTimingFunction = activeAnim.easing || 'ease';
      styles.animationDelay = `${activeAnim.delay}ms`;
      styles.animationFillMode = 'forwards';

      // If it is an emphasis animation, we don't want it to freeze on the last frame forever
      if (activeAnim.type === 'emphasis') {
        styles.animationFillMode = 'none';
      }
    }

    // Post-play static states
    if (!previewAnimationId && playedAnimationIds.includes(activeAnim.id)) {
      if (activeAnim.type === 'exit') {
        styles.opacity = 0;
        styles.pointerEvents = 'none';
      } else if (activeAnim.type === 'entrance') {
        styles.opacity = 1;
      }
    }
  }

  return styles;
}

/**
 * Determine the step sequence of animations on a slide.
 * Group animations that run together (withPrevious/afterPrevious) into sequential steps.
 */
export interface AnimationStep {
  triggerAnimId: string; // The ID of the onClick or first animation that triggers this step
  animations: ElementAnimation[];
}

export function getSlideAnimationSteps(
  slideId: string,
  elements: CanvasElement[]
): AnimationStep[] {
  // Collect all animations on elements belonging to this slide
  const slideAnimations: { anim: ElementAnimation; elementId: string }[] = [];

  elements.forEach(el => {
    // Include the slide element itself or its children
    if (el.id === slideId || el.parentId === slideId) {
      (el.animations || []).forEach(anim => {
        slideAnimations.push({ anim, elementId: el.id });
      });
    }
  });

  // Sort all animations by their sequence order
  slideAnimations.sort((a, b) => (a.anim.order || 0) - (b.anim.order || 0));

  const steps: AnimationStep[] = [];
  let currentStep: AnimationStep | null = null;

  slideAnimations.forEach(({ anim }) => {
    if (anim.trigger === 'onClick' || anim.trigger === 'onEnter' || !currentStep) {
      // Create a new step
      currentStep = {
        triggerAnimId: anim.id,
        animations: [anim],
      };
      steps.push(currentStep);
    } else {
      // Chain to the current step (withPrevious / afterPrevious)
      currentStep.animations.push(anim);
    }
  });

  return steps;
}
