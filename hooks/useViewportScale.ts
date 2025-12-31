import { RefObject, useEffect, useState } from 'react';

/**
 * Calcule dynamiquement un facteur d'échelle pour qu'un conteneur tienne dans la fenêtre
 * sans scroll, en se basant sur sa taille rendue (offsetWidth/offsetHeight) afin
 * d'ignorer les zones internes scrollables.
 * Le scale est borné à 1 (pas d'upscale) et se met à jour sur resize ou mutation.
 */
export const useViewportScale = (containerRef: RefObject<HTMLElement>, padding: number = 0): number => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const computeScale = () => {
      const container = containerRef.current;
      if (!container) return;

      const { innerWidth, innerHeight } = window;
      const contentWidth = container.offsetWidth + padding * 2;
      const contentHeight = container.offsetHeight + padding * 2;
      if (contentWidth === 0 || contentHeight === 0) return;
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
