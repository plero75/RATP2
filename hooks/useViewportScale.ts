import { useEffect, useState } from 'react';

/**
 * Calcule un facteur d'échelle pour contenir le tableau de bord sans scroll.
 * Le scale est borné à 1 (pas d'upscale) et réduit si l'écran est plus petit
 * que les dimensions de référence.
 */
export const useViewportScale = (baseWidth: number, baseHeight: number): number => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const computeScale = () => {
      const { innerWidth, innerHeight } = window;
      const widthRatio = innerWidth / baseWidth;
      const heightRatio = innerHeight / baseHeight;
      const nextScale = Math.min(widthRatio, heightRatio, 1);
      setScale(Number(nextScale.toFixed(3)));
    };

    computeScale();
    window.addEventListener('resize', computeScale);
    return () => window.removeEventListener('resize', computeScale);
  }, [baseWidth, baseHeight]);

  return scale;
};
