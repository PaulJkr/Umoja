import React, { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Button } from "../../components/ui/button";
import { Slider } from "../../components/ui/slider";
import { getCroppedImg } from "../../utils/cropImage";
import { UploadCloud } from "lucide-react";
import toast from "react-hot-toast";

interface AvatarUploaderProps {
  onCropped: (croppedFile: File) => void;
  existingImage?: string;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  onCropped,
  existingImage,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(
    existingImage || null
  );

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
    }
  };

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      if (!imageSrc || !croppedAreaPixels) return;
      const { file, url } = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(url);
      onCropped(file);
      toast.success("Avatar cropped successfully!");
    } catch (e) {
      toast.error("Failed to crop image");
    }
  };

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]);
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-gray-700">Profile Photo</label>

      {croppedImage && (
        <img
          src={croppedImage}
          alt="Cropped"
          className="w-24 h-24 rounded-full object-cover border"
        />
      )}

      <input type="file" accept="image/*" onChange={onSelectFile} />

      {imageSrc && (
        <div className="relative w-full h-64 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}

      {imageSrc && (
        <>
          <div className="pt-2">
            <label className="text-sm">Zoom</label>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={handleZoomChange}
            />
          </div>
          <Button onClick={handleCrop} className="mt-2">
            <UploadCloud className="mr-2" />
            Crop & Use Avatar
          </Button>
        </>
      )}
    </div>
  );
};
