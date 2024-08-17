import React from 'react';
import { motion } from 'framer-motion';

function ImageModal({ isOpen, image, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <motion.div
        className="bg-white rounded-lg shadow-xl overflow-hidden relative max-w-3xl w-full max-h-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <img src={image} alt="Modal" className="w-full h-auto max-h-full object-contain" />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none"
        >
          ✕
        </button>
      </motion.div>
    </div>
  );
}

export default ImageModal;
