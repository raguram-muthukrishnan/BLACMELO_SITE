import {motion, type MotionProps} from 'framer-motion';

type RevealProps = MotionProps & {
  children: React.ReactNode;
  className?: string;
};

export function Reveal({children, className, ...rest}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{opacity: 0, y: 50}}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 0.8, ease: [0.21, 1, 0.36, 1]}}
      viewport={{once: true, amount: 0.35}}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

