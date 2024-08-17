import React, { useState, useRef, useEffect } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // Import Tippy CSS for default styling
import ImageModal from './ImageModal';
import images from '../data/imageData';

const frameColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFD733', '#8C33FF'];

function Gallery() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [positions, setPositions] = useState(images.map(() => ({ x: 0, y: 0 })));
  const [isAligned, setIsAligned] = useState(false);
  const containerRef = useRef(null);
  const cardSize = 200;
  const buttonHeight = 50;

  useEffect(() => {
    if (isAligned) {
      alignImages();
    } else {
      scatterImages();
    }
  }, [isAligned]);

  const alignImages = () => {
    const containerWidth = containerRef.current.clientWidth;
    const imagesPerRow = Math.min(images.length, 3);
    const totalWidth = imagesPerRow * (cardSize + 20);
    const centerX = (containerWidth - totalWidth) / 2;
    const startY = buttonHeight + 20; // Space to prevent overlap with the button

    setPositions(images.map((_, index) => ({
      x: centerX + (index % imagesPerRow) * (cardSize + 20),
      y: startY + Math.floor(index / imagesPerRow) * (cardSize + 20),
    })));
  };

  const scatterImages = () => {
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    setPositions(images.map(() => ({
      x: Math.random() * (containerWidth - cardSize) + cardSize / 2,
      y: Math.random() * (containerHeight - cardSize) + cardSize / 2,
    })));
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleMouseDown = (index, event) => {
    event.preventDefault();

    if (event.button === 2 || event.shiftKey) {
      handleGroupMove(event);
    } else {
      const startX = event.clientX;
      const startY = event.clientY;
      const initialX = positions[index].x;
      const initialY = positions[index].y;

      const handleMouseMove = (moveEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        setPositions((prevPositions) => {
          const newPositions = [...prevPositions];
          newPositions[index] = {
            x: Math.max(0, Math.min(containerRef.current.scrollWidth - cardSize, initialX + dx)),
            y: Math.max(0, Math.min(containerRef.current.scrollHeight - cardSize, initialY + dy)),
          };
          return newPositions;
        });
      };

      const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
  };

  const handleGroupMove = (event) => {
    const startX = event.clientX;
    const startY = event.clientY;
    const initialPositions = [...positions];

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      setPositions(initialPositions.map(position => ({
        x: Math.max(0, Math.min(containerRef.current.scrollWidth - cardSize, position.x + dx)),
        y: Math.max(0, Math.min(containerRef.current.scrollHeight - cardSize, position.y + dy)),
      })));
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const toggleAlignment = () => {
    setIsAligned((prev) => !prev);
  };

  return (
    <div ref={containerRef} className="container mx-auto p-4 relative flex flex-col justify-center items-center" style={{ minHeight: '80vh' }}>
      <h1 className="text-4xl font-bold mb-4 text-center text-white">Gallery</h1>
      <div className="bg-black bg-opacity-80 rounded-lg shadow-lg p-6 max-w-lg w-full mb-6 text-gray-300">
        <p>Double-click an image to view it in a modal.</p>
        <p>Click and drag an image to move it around.</p>
        <p>Right-click or hold Shift to drag and move all images together.</p>
      </div>
      <button
        onClick={toggleAlignment}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none"
        style={{ zIndex: 2 }}
      >
        {isAligned ? 'Scatter Images' : 'Align Images'}
      </button>

      <div className="relative w-full h-full flex justify-center items-center mt-6">
        {images.map((image, index) => (
          <Tippy
            key={`image-${index}`}
            content={<span>Double-click to view image <br /> Click and drag to move</span>}
            placement="top"
            delay={0}
          >
            <div
              onMouseDown={(e) => handleMouseDown(index, e)}
              onDoubleClick={() => openModal(image)}
              className="draggable-image cursor-move"
              style={{
                width: `${cardSize}px`,
                height: `${cardSize}px`,
                backgroundColor: '#000',
                position: 'absolute',
                top: `${positions[index].y}px`,
                left: `${positions[index].x}px`,
                border: `4px solid ${frameColors[index % frameColors.length]}`,
                zIndex: 1,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="aspect-w-1 aspect-h-1 relative">
                <img
                  src={image}
                  alt={`Event ${index}`}
                  className="w-full h-full object-contain rounded"
                />
              </div>
            </div>
          </Tippy>
        ))}
      </div>

      <ImageModal isOpen={isModalOpen} image={selectedImage} onClose={closeModal} />
    </div>
  );
}

export default Gallery;
