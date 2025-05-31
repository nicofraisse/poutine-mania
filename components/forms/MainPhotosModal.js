import { useCallback, useEffect, useState } from "react";
import { X, Camera } from "react-feather";
import Modal from "react-responsive-modal";
import { Image } from "../Image";
import Button from "../Button";
import axios from "axios";
import toast from "react-hot-toast";
import { getMainPhotos } from "../../lib/restaurantMainPhotos";

export const MainPhotosModal = ({ isOpen, onClose, restaurant, onUpdate }) => {
  const [allPhotos, setAllPhotos] = useState([]);
  const [mainPhotos, setMainPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Initialize main photos from restaurant data
  useEffect(() => {
    console.log("restaurant", restaurant);
    if (restaurant) {
      setMainPhotos(getMainPhotos(restaurant));
    }
  }, [restaurant]);

  // Fetch all photos from reviews when modal opens
  useEffect(() => {
    if (isOpen && restaurant?._id) {
      fetchAllPhotos();
    }
  }, [isOpen, restaurant?._id]);

  const fetchAllPhotos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/restaurants/${restaurant._id}/photos`
      );
      setAllPhotos(response.data.photos);
    } catch (error) {
      toast.error("Error loading photos");
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetMainPhoto = useCallback((photoId, position) => {
    setMainPhotos((prev) => {
      const newMainPhotos = [...prev];

      // Remove photo from current position if it exists
      const existingIndex = newMainPhotos.indexOf(photoId);
      if (existingIndex !== -1) {
        newMainPhotos.splice(existingIndex, 1);
      }

      // Insert at new position
      newMainPhotos.splice(position, 0, photoId);

      // Keep only first 3
      return newMainPhotos.slice(0, 3);
    });
  }, []);

  const handleRemoveMainPhoto = useCallback((position) => {
    setMainPhotos((prev) => {
      const newMainPhotos = [...prev];
      newMainPhotos.splice(position, 1);
      return newMainPhotos;
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post(`/api/restaurants/${restaurant._id}/update`, {
        ...restaurant,
        mainPhotos: mainPhotos,
      });

      toast.success("Main photos updated successfully!");
      onUpdate?.(mainPhotos);
      onClose();
    } catch (error) {
      toast.error("Error updating main photos");
      console.error("Error saving main photos:", error);
    } finally {
      setSaving(false);
    }
  };

  const isMainPhoto = (photoId) => mainPhotos.includes(photoId);
  const getMainPhotoPosition = (photoId) => mainPhotos.indexOf(photoId);

  if (!restaurant) return null;

  console.log("mainPhotos", mainPhotos);

  return (
    <Modal
      classNames={{
        overlay: "customOverlay",
        modal: "customModal mainPhotosModal max-w-4xl w-full",
      }}
      open={isOpen}
      onClose={onClose}
      closeIcon={<X />}
      center
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Edit Main Photos - {restaurant.name}
        </h2>

        {/* Current Main Photos */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">
            Current Main Photos (Max 3)
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[0, 1, 2].map((position) => (
              <div
                key={position}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center min-h-32"
              >
                <div className="text-sm font-medium mb-2">
                  Position {position + 1} {position === 0 && "(Primary)"}
                </div>
                {mainPhotos[position] ? (
                  <div className="relative">
                    <Image
                      src={mainPhotos[position]}
                      alt={`Main photo ${position + 1}`}
                      className="w-full h-24 object-cover rounded"
                      // transformation="c_fill,w_200,h_150"
                    />
                    <button
                      onClick={() => handleRemoveMainPhoto(position)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">Empty</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* All Available Photos */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Camera className="mr-2" size={20} />
            All Photos from Reviews ({allPhotos.length})
          </h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2">Loading photos...</p>
            </div>
          ) : allPhotos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No photos available from reviews yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
              {allPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className={`relative border rounded-lg p-2 ${
                    isMainPhoto(photo.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={photo.id}
                    alt="Restaurant photo"
                    className="w-full h-24 object-cover rounded mb-2"
                  />

                  {/* Position Buttons */}
                  <div className="flex justify-center space-x-1">
                    {[0, 1, 2].map((position) => {
                      const isInThisPosition =
                        getMainPhotoPosition(photo.id) === position;
                      const positionTaken =
                        mainPhotos[position] &&
                        mainPhotos[position] !== photo.id;

                      return (
                        <button
                          key={position}
                          onClick={() => handleSetMainPhoto(photo.id, position)}
                          disabled={positionTaken}
                          className={`w-8 h-8 rounded text-xs font-bold transition-colors ${
                            isInThisPosition
                              ? "bg-blue-500 text-white"
                              : positionTaken
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                          title={
                            isInThisPosition
                              ? `Currently in position ${position + 1}`
                              : positionTaken
                              ? `Position ${position + 1} occupied`
                              : `Set as position ${position + 1}`
                          }
                        >
                          {position + 1}
                        </button>
                      );
                    })}
                  </div>

                  {isMainPhoto(photo.id) && (
                    <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      {getMainPhotoPosition(photo.id) + 1}
                    </div>
                  )}

                  {/* Review info */}
                  <div className="text-xs text-gray-500 mt-1 text-center">
                    By {photo.reviewerName}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 border-t pt-4">
          <Button
            type="button"
            variant="light"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            loading={saving}
            disabled={saving}
            className="bg-teal-500 hover:bg-teal-600"
          >
            Save Main Photos
          </Button>
        </div>
      </div>
    </Modal>
  );
};
