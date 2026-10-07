import { CanvasElement, ElementAnimation } from '../types';


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
