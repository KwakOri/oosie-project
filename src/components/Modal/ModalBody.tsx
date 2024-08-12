import { AnimatePresence, motion } from 'framer-motion';
import { PropsWithChildren } from 'react';

interface ModalBodyProps {
  isVisible: boolean;
}

const ModalBody = ({ isVisible, children }: PropsWithChildren<ModalBodyProps>) => {
  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 350,
              damping: 20,
              duration: 0.3,
            }}
          >
            <div className="p-4 w-80 border-primary-100 border-2 bg-white/5 rounded-3xl modal-shadow">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalBody;
