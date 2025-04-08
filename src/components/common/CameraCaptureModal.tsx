// components/CameraCaptureModal.tsx
import React, { useState, useCallback, useRef } from "react";
import Webcam from "react-webcam";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/utils/cropImage";
import { createPortal } from "react-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

const CameraCaptureModal: React.FC<Props> = ({ isOpen, onClose, onCapture }) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  };

  const retake = () => {
    setCapturedImage(null);
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedPreview(null);
  };

  const handleCropComplete = useCallback(
    async (_: any, croppedPixels: any) => {
      setCroppedAreaPixels(croppedPixels);
      if (capturedImage) {
        const croppedBlob = await getCroppedImg(capturedImage, croppedPixels);
        const previewUrl = URL.createObjectURL(croppedBlob);
        setCroppedPreview(previewUrl);
      }
    },
    [capturedImage]
  );

  const handleUpload = async () => {
    if (!capturedImage || !croppedAreaPixels) return;

    const croppedBlob = await getCroppedImg(capturedImage, croppedAreaPixels);
    const file = new File([croppedBlob], "captured-image.jpg", { type: "image/jpeg" });

    onCapture(file);
    onClose();
    retake();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-[#1f1f1f] text-white rounded-xl w-full max-w-3xl p-4 md:p-6 max-h-[95vh] overflow-y-auto shadow-xl relative">
        <div className="text-lg font-semibold mb-4">Capture Selfie</div>

        {!capturedImage ? (
          <div className="flex flex-col items-center gap-4">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full rounded-lg aspect-square object-cover max-h-[65vh]"
              videoConstraints={{ facingMode: "user" }}
            />
            <button
              onClick={capture}
              className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-lg text-white w-full max-w-sm"
            >
              Capture
            </button>
          </div>
        ) : (
          <>
            <div className="relative w-full h-[300px] sm:h-[400px] rounded-lg overflow-hidden">
            <Cropper
  image={capturedImage}
  crop={crop}
  zoom={zoom}
  aspect={1}
  cropShape="rect" // or "round" if you want circular preview
  showGrid={true}
  minZoom={1}
  maxZoom={3}
  zoomWithScroll={true}
  restrictPosition={true}
  onCropChange={setCrop}
  onZoomChange={setZoom}
  onCropComplete={handleCropComplete}
  style={{
    containerStyle: {
      borderRadius: "0.75rem",
      background: "#1f1f1f",
    },
    cropAreaStyle: {
      border: "2px solid white",
    },
  }}
/>

            </div>
  {/* Zoom slider */}
  <div className="mt-4">
              <label className="block text-sm text-white/80 mb-1">Zoom</label>
              <input
                type="range"
                min={1}
                max={2.5}//here only the slider and the zoom is updating...
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>


            {croppedPreview && (
              <div className="mt-4 text-center">
                <div className="mb-2 text-sm text-gray-300">Cropped Preview</div>
                <img
                  src={croppedPreview}
                  alt="Cropped Preview"
                  className="rounded-md max-w-full h-auto max-h-52 border border-white/20 mx-auto"
                />
              </div>

              
            )}

            <div className="mt-6 flex flex-col sm:flex-row justify-between gap-3">
              <button
                onClick={retake}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg w-full"
              >
                Retake
              </button>
              <button
                onClick={handleUpload}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full"
              >
                Upload
              </button>
            </div>
          </>
        )}

        <button
          onClick={() => {
            onClose();
            retake();
          }}
          className="absolute top-3 right-4 text-white text-2xl hover:text-red-400"
        >
          &times;
        </button>
      </div>
    </div>,
    document.body
  );
};

export default CameraCaptureModal;
