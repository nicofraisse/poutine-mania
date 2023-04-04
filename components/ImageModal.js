import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "react-feather";
import Modal from "react-responsive-modal";
import { Image } from "./Image";

export const ImageModal = ({
  isOpen,
  onClose,
  images,
  user,
  restaurant,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handleNext = useCallback(() => {
    if (images) setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images]);

  const handlePrev = useCallback(() => {
    if (images) {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length
      );
    }
  }, [images]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowRight") {
        handleNext();
      } else if (event.key === "ArrowLeft") {
        handlePrev();
      }
    },
    [handleNext, handlePrev]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!images) return null;

  return (
    <Modal
      classNames={{
        overlay: "customOverlay",
        modal: "customModal aspect-3/2 imageModal",
      }}
      open={isOpen}
      onClose={onClose}
      closeIcon={<X />}
      center
    >
      <h2 className="text-center mb-4 px-8">
        Photos de {user} pour {restaurant}
      </h2>
      <div className="relative h-[calc(100%-60px)]">
        <div className="bg-black w-full h-full flex items-center justify-center">
          <Image
            src={images[currentIndex]}
            alt="poutine-user-photo"
            className="mx-auto object-contain max-h-full max-w-full"
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-opacity-50 bg-black p-2 rounded-full"
              onClick={handlePrev}
            >
              <ChevronLeft />
            </button>
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-opacity-50 bg-black p-2 rounded-full"
              onClick={handleNext}
            >
              <ChevronRight />
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};
