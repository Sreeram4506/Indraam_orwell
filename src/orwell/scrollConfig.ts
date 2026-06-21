export function isMobileViewport() {
  return window.innerWidth <= 768;
}

export type ScrollBounds = {
  bodyVh: number;
  boundary12: number;
  boundary23: number;
  boundary34: number;
  boundary46: number;
  boundary67: number;
  boundary78: number;
  boundary89: number;
  reverseS7: number;
  reverseS8: number;
  reverseS9: number;
};

export function getScrollBounds(mobile = isMobileViewport()): ScrollBounds {
  if (mobile) {
    return {
      bodyVh: 1450,
      boundary12: 0.11,
      boundary23: 0.18,
      boundary34: 0.27,
      boundary46: 0.35,
      boundary67: 0.48,
      boundary78: 0.86,
      boundary89: 0.92,
      reverseS7: 0.43,
      reverseS8: 0.82,
      reverseS9: 0.89,
    };
  }

  return {
    bodyVh: 1650,
    boundary12: 0.11,
    boundary23: 0.27,
    boundary34: 0.33,
    boundary46: 0.44,
    boundary67: 0.66,
    boundary78: 0.9,
    boundary89: 0.94,
    reverseS7: 0.61,
    reverseS8: 0.84,
    reverseS9: 0.91,
  };
}
