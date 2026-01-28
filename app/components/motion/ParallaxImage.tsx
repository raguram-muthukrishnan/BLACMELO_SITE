import {useRef} from 'react';
import {motion, useScroll, useTransform} from 'framer-motion';

type ParallaxImageProps = {
  src: string;
  alt: string;
  className?: string;
  /**
   * How much the image moves (in %). Example: 15 means -15%..15%
   */
  strength?: number;
};

export function ParallaxImage({
  src,
  alt,
  className,
  strength = 15,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${strength}%`, `${strength}%`],
  );

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.img
        src={src}
        alt={alt}
        style={{y, scale: 1.12}}
        className={className ?? 'absolute inset-0 h-[120%] w-full object-cover'}
      />
    </div>
  );
}

