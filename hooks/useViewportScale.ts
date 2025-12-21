import { RefObject, useEffect, useState } from 'react';

/**
 * Calcule dynamiquement un facteur d'échelle pour qu'un conteneur tienne dans la fenêtre
 * sans scroll, en se basant sur sa taille réelle (scrollWidth/scrollHeight).
 * Le scale est borné à 1 (pas d'upscale) et se met à jour sur resize ou mutation.
 */
export const useViewportScale = (containerRef: RefObject<HTMLElement>, padding: number = 0): number => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const computeScale = () => {
      const container = containerRef.current;
      if (!container) return;

      const { innerWidth, innerHeight } = window;
      const contentWidth = container.scrollWidth + padding * 2;
      const contentHeight = container.scrollHeight + padding * 2;
      const widthRatio = innerWidth / contentWidth;
      const heightRatio = innerHeight / contentHeight;
      const nextScale = Math.min(widthRatio, heightRatio, 1);

      setScale(Number(nextScale.toFixed(3)));
    };

    computeScale();

    const resizeObserver = new ResizeObserver(computeScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', computeScale);

    return () => {
      window.removeEventListener('resize', computeScale);
      resizeObserver.disconnect();
    };
  }, [containerRef, padding]);

  return scale;
};
