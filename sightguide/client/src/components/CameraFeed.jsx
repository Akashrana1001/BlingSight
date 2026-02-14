import { useRef, useEffect, useState, useContext, useCallback } from 'react';
import useObjectDetection from '../hooks/useObjectDetection';
import useSpeech from '../hooks/useSpeech';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import VoiceControls from './VoiceControls';
import { CloudOff } from 'lucide-react';

const DANGEROUS_OBJECTS = ['car', 'bus', 'bicycle', 'knife', 'motorcycle', 'truck'];

const CameraFeed = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { user } = useContext(AuthContext);
  const {
    detectedObjects,
    isLoading: isModelLoading,
    error: modelError,
    startDetection,
    stopDetection,
    isDetecting
  } = useObjectDetection(videoRef, canvasRef);

  const {
    speak,
    startListening,
    stopListening,
    isListening,
    transcript,
    setTranscript
  } = useSpeech();

  const [lastAnnounced, setLastAnnounced] = useState({});
  const lastAnnouncedRef = useRef({}); // Use ref for synchronous updates inside intervals/effects

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Log detection to backend
  const logDetection = async (objectName, confidence) => {
    if (!user) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      await axios.post(`${API_URL}/logs`, { objectName, confidence }, config);
    } catch (err) {
      console.error("Failed to log detection", err);
    }
  };

  // Process Detections
  useEffect(() => {
    if (!isDetecting || detectedObjects.length === 0) return;

    const now = Date.now();
    const newAnnouncements = { ...lastAnnouncedRef.current };

    detectedObjects.forEach((obj) => {
      const { class: objectName, score } = obj;
      const lastTime = newAnnouncements[objectName] || 0;

      // Smart Filtering: 10 seconds cooldown
      if (now - lastTime > 10000) {
        // Check Danger
        if (DANGEROUS_OBJECTS.includes(objectName)) {
          speak(`Warning! ${objectName} detected`, true);
          if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
        } else {
          speak(`${objectName} detected`);
        }

        // Update tracking
        newAnnouncements[objectName] = now;

        // Log to DB
        logDetection(objectName, score);
      }
    });

    lastAnnouncedRef.current = newAnnouncements;
    setLastAnnounced(newAnnouncements);

  }, [detectedObjects, isDetecting, speak, user]);

  // Handle Voice Commands
  useEffect(() => {
    if (!transcript) return;

    console.log("Command received:", transcript);

    if (transcript.includes('identify')) {
      if (detectedObjects.length > 0) {
        const names = detectedObjects.map(obj => obj.class).join(', ');
        speak(`I see: ${names}`);
      } else {
        speak("I don't see anything right now.");
      }
    } else if (transcript.includes('help')) {
      speak("Say identify to list objects. Say history to hear last detections. Dangerous objects will trigger an alert.");
    } else if (transcript.includes('history')) {
      // Fetch last 3 logs locally or from API?
      // Let's fetch from API for accuracy
      fetchLastLogs();
    }

    setTranscript(''); // Clear command
  }, [transcript, detectedObjects, speak, fetchLastLogs]);

  const fetchLastLogs = useCallback(async () => {
    if (!user) {
      speak("Please login to view history.");
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${API_URL}/logs`, config);
      const recent = data.slice(0, 3).map(l => l.objectName).join(', ');
      if (recent) {
        speak(`Last detections were: ${recent}`);
      } else {
        speak("No recent history found.");
      }
    } catch (err) {
      speak("Could not fetch history.");
    }
  }, [user, speak, API_URL]);

  // Start Detection on Mount
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            startDetection();
          };
        }
      } catch (err) {
        console.error("Camera error", err);
        speak("Camera access denied or unavailable.");
      }
    };

    if (!isModelLoading && !modelError) {
      startCamera();
    }

    // Offline / Error Handling
    if (modelError) {
       speak("Camera active but detection unavailable");
    }

  }, [isModelLoading, modelError, startDetection, speak]);

  return (
    <div className="relative min-h-screen bg-black flex flex-col">
      {/* Camera Feed */}
      <div className="relative flex-grow bg-black flex items-center justify-center overflow-hidden">
        {isModelLoading && (
           <div className="absolute z-20 text-yellow-400 text-2xl font-bold animate-pulse">
             Loading AI Model...
           </div>
        )}

        {modelError && (
          <div className="absolute z-20 bg-red-900/80 p-6 rounded text-white text-center">
            <CloudOff size={48} className="mx-auto mb-2" />
            <p className="text-xl">Detection Unavailable</p>
            <p className="text-sm">{modelError}</p>
          </div>
        )}

        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-10"
        />
      </div>

      {/* Voice Controls */}
      <div className="z-30 pb-32"> {/* Padding for fixed controls */}
        {/* Detection Status Overlay */}
        {detectedObjects.length > 0 && (
          <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2 z-20">
             {detectedObjects.map((obj, idx) => (
               <span key={idx} className={`px-3 py-1 rounded text-lg font-bold ${
                 DANGEROUS_OBJECTS.includes(obj.class)
                   ? 'bg-red-600 text-white animate-pulse'
                   : 'bg-yellow-400 text-black'
               }`}>
                 {obj.class}
               </span>
             ))}
          </div>
        )}
      </div>

      <VoiceControls
        isListening={isListening}
        toggleListening={isListening ? stopListening : startListening}
      />
    </div>
  );
};

export default CameraFeed;
