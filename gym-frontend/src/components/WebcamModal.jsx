import React, { useRef, useEffect, useState, useCallback } from 'react';

// Target: ~350KB base64 JPEG — captured at 800x800 @ quality 0.95
const CAPTURE_SIZE = 800;
const JPEG_QUALITY = 0.95;

const WebcamModal = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [captured, setCaptured] = useState(null);
  const [error, setError] = useState(null);
  const [camReady, setCamReady] = useState(false);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCamReady(false);
  }, []);

  useEffect(() => {
    if (!isOpen) { stopStream(); setCaptured(null); setError(null); return; }
    navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: 'user' } })
      .then(stream => {
        streamRef.current = stream;
        if (videoRef.current) { videoRef.current.srcObject = stream; }
        setCamReady(true);
      })
      .catch(() => setError('Could not access webcam. Please allow camera permission.'));
    return () => stopStream();
  }, [isOpen, stopStream]);

  const handleCapture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext('2d');
    canvas.width = CAPTURE_SIZE;
    canvas.height = CAPTURE_SIZE;
    // Center-crop: draw from middle of video into square canvas
    const size = Math.min(video.videoWidth, video.videoHeight);
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;
    ctx.drawImage(video, sx, sy, size, size, 0, 0, CAPTURE_SIZE, CAPTURE_SIZE);
    const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
    setCaptured(dataUrl);
    stopStream();
  };

  const handleRetake = () => {
    setCaptured(null);
    navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: 'user' } })
      .then(stream => {
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCamReady(true);
      })
      .catch(() => setError('Could not access webcam.'));
  };

  const handleSave = () => {
    if (captured) { onCapture(captured); onClose(); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-white font-black text-lg">📷 Take Photo</h3>
            <p className="text-slate-500 text-xs mt-0.5">Center the face in frame, then capture.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Viewfinder */}
        <div className="p-5 flex flex-col items-center gap-4">
          {error ? (
            <div className="w-full text-center py-10 text-rose-400 text-sm bg-rose-500/10 rounded-2xl border border-rose-500/20 px-4">
              <span className="text-3xl block mb-3">🚫</span>
              {error}
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-primary/30 shadow-lg shadow-primary/10"
              style={{ width: 280, height: 280 }}>
              {/* Video live feed */}
              {!captured && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
              )}
              {/* Captured snapshot */}
              {captured && (
                <img src={captured} alt="Captured" className="absolute inset-0 w-full h-full object-cover" />
              )}
              {/* Face guide overlay */}
              {!captured && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-44 h-44 rounded-full border-2 border-primary/50 border-dashed" />
                </div>
              )}
            </div>
          )}

          {/* Hidden canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Actions */}
          {!error && (
            <div className="flex gap-3 w-full">
              {!captured ? (
                <button
                  onClick={handleCapture}
                  disabled={!camReady}
                  className="flex-1 py-3 bg-primary hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Capture
                </button>
              ) : (
                <>
                  <button onClick={handleRetake} className="flex-1 py-3 bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold rounded-2xl transition-all active:scale-95 text-sm">
                    Retake
                  </button>
                  <button onClick={handleSave} className="flex-1 py-3 bg-primary hover:bg-blue-500 text-white font-bold rounded-2xl transition-all active:scale-95 text-sm">
                    ✓ Save Photo
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebcamModal;
