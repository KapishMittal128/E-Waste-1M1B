import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Upload, AlertCircle, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaptureImage: (dataUrl: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCaptureImage
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isStartingCamera, setIsStartingCamera] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  // mediaDevices stream attachment
  const startCamera = async () => {
    setIsStartingCamera(true);
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera permission was denied. Please allow camera access or upload a photo from your gallery.'
          : 'Unable to start camera. You can still upload a photo directly.'
      );
    } finally {
      setIsStartingCamera(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      stopCamera();
      onCaptureImage(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        stopCamera();
        onCaptureImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">AI E-Waste Scanner</h3>
              <p className="text-[11px] text-zinc-400">Position the electronic item inside the frame</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative flex-1 bg-black min-h-[320px] max-h-[460px] flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center max-w-xs space-y-4">
              <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto text-zinc-300">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">{cameraError}</p>
              <Button
                variant="primary"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 text-xs"
              >
                <Upload className="w-4 h-4 mr-1.5" />
                Upload Photo from Gallery
              </Button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-8 border-2 border-white/20 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-t-2 border-l-2 border-white -mt-1 -ml-1 rounded-tl-lg" />
                  <div className="w-6 h-6 border-t-2 border-r-2 border-white -mt-1 -mr-1 rounded-tr-lg" />
                </div>

                <div className="scanner-laser-mono" />

                <div className="flex justify-between">
                  <div className="w-6 h-6 border-b-2 border-l-2 border-white -mb-1 -ml-1 rounded-bl-lg" />
                  <div className="w-6 h-6 border-b-2 border-r-2 border-white -mb-1 -mr-1 rounded-br-lg" />
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center pointer-events-none">
                <Badge variant="outline" className="px-3 py-1 bg-black/80 backdrop-blur-md border-white/20 text-[11px] text-zinc-200">
                  <Zap className="w-3 h-3 text-white" />
                  Ready for AI Material & Hazard Detection
                </Badge>
              </div>
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="p-5 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between gap-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 text-xs"
          >
            <Upload className="w-4 h-4 mr-1.5" />
            Upload File
          </Button>

          {!cameraError && (
            <button
              onClick={handleCapture}
              disabled={isStartingCamera}
              className="w-16 h-16 rounded-full bg-white p-1.5 shadow-2xl shadow-white/20 active:scale-95 transition-transform flex items-center justify-center group"
            >
              <div className="w-full h-full rounded-full border-2 border-black flex items-center justify-center bg-zinc-100">
                <div className="w-4 h-4 rounded-full bg-black" />
              </div>
            </button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={switchCamera}
            disabled={!!cameraError}
            className="flex-1 text-xs"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Flip Cam
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

      </div>
    </div>
  );
};
