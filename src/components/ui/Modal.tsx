import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  fullscreen?: boolean;
  showCloseButton?: boolean;
  overlayClickClose?: boolean;
  size?: "fullscreen" | "large" | "medium" | "small"; // New prop for sizes
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  fullscreen = false,
  showCloseButton = true,
  overlayClickClose = true,
  size = "medium", // Default size
}) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && overlayClickClose) {
      onClose();
    }
  };

  const getSizeClasses = () => {
    if (fullscreen) return "h-full w-full m-4"; // Maintain existing fullscreen logic

    switch (size) {
      case "large":
        return "w-[80vw] h-[80vh]";
      case "medium":
        return "w-[60vw] h-[70vh]";
      case "small":
        return "w-[40vw] h-[50vh]";
      default:
        return "max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto"; // Existing default
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`bg-white rounded-xl shadow-xl p-6 relative ${getSizeClasses()}`}
          >
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
              >
                &times;
              </button>
            )}

            {title && (
              <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
            )}

            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
