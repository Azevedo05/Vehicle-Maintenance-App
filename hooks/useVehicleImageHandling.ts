import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useAppAlert } from "@/contexts/AlertContext";

interface ImagePosition {
  xRatio: number;
  yRatio: number;
  scale: number;
}

interface UseVehicleImageHandlingProps {
  initialPhoto?: string;
  initialPhotos?: string[];
  initialPhotoPositions?: Record<string, ImagePosition>;
  initialDetailsPositions?: Record<string, ImagePosition>;
}

export const useVehicleImageHandling = ({
  initialPhoto,
  initialPhotos = [],
  initialPhotoPositions = {},
  initialDetailsPositions = {},
}: UseVehicleImageHandlingProps = {}) => {
  const { t } = useLocalization();
  const { showAlert } = useAppAlert();

  const [photo, setPhoto] = useState<string | undefined>(initialPhoto);
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [photoPositions, setPhotoPositions] = useState<
    Record<string, ImagePosition>
  >(initialPhotoPositions);
  const [detailsPhotoPositions, setDetailsPhotoPositions] = useState<
    Record<string, ImagePosition>
  >(initialDetailsPositions);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  const pickImage = async (source: "camera" | "library") => {
    setShowPhotoOptions(false);
    let permissionResult;

    if (source === "camera") {
      permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    } else {
      permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    if (permissionResult.status !== "granted") {
      showAlert({
        title: t("vehicles.permission_needed"),
        message: t("vehicles.permission_text"),
      });
      return;
    }

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.8,
    };

    let result;
    if (source === "camera") {
      result = await ImagePicker.launchCameraAsync(options);
    } else {
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled) {
      const newUri = result.assets[0].uri;
      setPendingImage(newUri);
      setShowPositionModal(true);
    }
  };

  const handlePositionConfirm = (result: {
    listPosition: ImagePosition;
    detailsPosition: ImagePosition;
  }) => {
    if (pendingImage) {
      setPhotos((prev) => [...prev, pendingImage]);
      setPhotoPositions((prev) => ({
        ...prev,
        [pendingImage]: result.listPosition,
      }));
      setDetailsPhotoPositions((prev) => ({
        ...prev,
        [pendingImage]: result.detailsPosition,
      }));
      if (!photo) {
        setPhoto(pendingImage);
      }
      setPendingImage(null);
      setShowPositionModal(false);
    }
  };

  const handlePositionCancel = () => {
    setPendingImage(null);
    setShowPositionModal(false);
  };

  const removePhoto = (uriToRemove: string) => {
    setPhotos((prev) => prev.filter((p) => p !== uriToRemove));
    if (photo === uriToRemove) {
      const remaining = photos.filter((p) => p !== uriToRemove);
      setPhoto(remaining.length > 0 ? remaining[0] : undefined);
    }

    // Cleanup positions
    setPhotoPositions((prev) => {
      const next = { ...prev };
      delete next[uriToRemove];
      return next;
    });
    setDetailsPhotoPositions((prev) => {
      const next = { ...prev };
      delete next[uriToRemove];
      return next;
    });
  };

  return {
    photo,
    setPhoto,
    photos,
    setPhotos,
    photoPositions,
    detailsPhotoPositions,
    pendingImage,
    showPositionModal,
    setShowPositionModal,
    showPhotoOptions,
    setShowPhotoOptions,
    pickImage,
    handlePositionConfirm,
    handlePositionCancel,
    removePhoto,
  };
};
