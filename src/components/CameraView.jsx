import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import './CameraView.css';

const CameraView = forwardRef(function CameraView(
  { mode, mirrored, onUploadedMedia },
  ref
) {
  const videoRef = useRef(null);
  const uploadRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [uploadedSrc, setUploadedSrc] = useState(null);
  const [uploadedType, setUploadedType] = useState(null); // 'image' | 'video'
  const [camError, setCamError] = useState(null);

  // Expose video element to parent via ref
  useImperativeHandle(ref, () => ({
    getVideoEl: () => videoRef.current,
  }));

  // Start / stop webcam based on mode
  useEffect(() => {
    if (mode !== 'live') {
      stream?.getTracks().forEach((t) => t.stop());
      setStream(null);
      return;
    }

    let currentStream;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user', width: 1280, height: 720 } })
      .then((s) => {
        currentStream = s;
        setStream(s);
        setCamError(null);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play();
        }
      })
      .catch((err) => {
        setCamError('Camera access denied. Please allow camera permissions and refresh.');
        console.error(err);
      });

    return () => {
      currentStream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // When stream changes, re-attach to video element
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [stream]);

  const handleUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('video/') ? 'video' : 'image';
    setUploadedSrc(url);
    setUploadedType(type);
    onUploadedMedia?.({ url, type });
  }, [onUploadedMedia]);

  const triggerUpload = () => uploadRef.current?.click();

  return (
    <div className="camera-view">
      {/* Live webcam video */}
      <video
        ref={videoRef}
        id="jewel-video"
        className={`camera-feed ${mode === 'live' ? 'visible' : 'hidden'} ${mirrored ? 'mirrored' : ''}`}
        playsInline
        muted
        autoPlay
      />

      {/* Upload image */}
      {mode === 'upload' && uploadedType === 'image' && uploadedSrc && (
        <img
          id="jewel-uploaded-image"
          src={uploadedSrc}
          alt="Uploaded selfie"
          className="camera-feed visible"
        />
      )}

      {/* Upload video */}
      {mode === 'upload' && uploadedType === 'video' && uploadedSrc && (
        <video
          ref={videoRef}
          id="jewel-uploaded-video"
          src={uploadedSrc}
          className={`camera-feed visible ${mirrored ? 'mirrored' : ''}`}
          playsInline
          loop
          autoPlay
          muted
        />
      )}

      {/* Upload prompt when no media yet */}
      {mode === 'upload' && !uploadedSrc && (
        <div className="upload-prompt" onClick={triggerUpload} role="button" tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && triggerUpload()}>
          <div className="upload-icon">📁</div>
          <p className="upload-title">Drop your selfie here</p>
          <p className="upload-sub">or click to browse · JPG, PNG, MP4 supported</p>
          <button id="btn-browse" className="upload-btn">Browse File</button>
        </div>
      )}

      {/* Camera error */}
      {camError && (
        <div className="cam-error">
          <span className="error-icon">⚠️</span>
          <p>{camError}</p>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={uploadRef}
        type="file"
        accept="image/*,video/*"
        className="hidden-input"
        onChange={handleUpload}
        id="file-input"
      />

      {/* Re-upload button */}
      {mode === 'upload' && uploadedSrc && (
        <button
          id="btn-reupload"
          className="reupload-btn"
          onClick={triggerUpload}
          title="Upload different file"
        >
          🔄 Change
        </button>
      )}
    </div>
  );
});

export default CameraView;
