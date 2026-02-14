import { useState, useEffect, useRef, useCallback } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

const useObjectDetection = (videoRef, canvasRef) => {
  const [model, setModel] = useState(null);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);

  // Load Model
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log("Loading model...");
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        setIsLoading(false);
        console.log("Model loaded.");
      } catch (err) {
        console.error("Failed to load model", err);
        setError("Failed to load object detection model");
        setIsLoading(false);
      }
    };
    loadModel();
  }, []);

  const detect = useCallback(async () => {
    if (!model || !videoRef.current || videoRef.current.readyState !== 4) return;

    const video = videoRef.current;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // Set canvas dimensions to match video
    if (canvasRef.current) {
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
    }

    try {
      const predictions = await model.detect(video);

      const filteredPredictions = predictions.filter(
        (prediction) => prediction.score > 0.6
      );

      setDetectedObjects(filteredPredictions);

      // Draw bounding boxes
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, videoWidth, videoHeight);

        filteredPredictions.forEach((prediction) => {
          const [x, y, width, height] = prediction.bbox;

          // Draw Box
          ctx.strokeStyle = "#fbbf24"; // yellow
          ctx.lineWidth = 4;
          ctx.strokeRect(x, y, width, height);

          // Draw Label Background
          ctx.fillStyle = "#fbbf24";
          const text = `${prediction.class} (${Math.round(prediction.score * 100)}%)`;
          const textWidth = ctx.measureText(text).width;
          const textHeight = 24; // approx
          ctx.fillRect(x, y > 20 ? y - textHeight : y, textWidth + 10, textHeight);

          // Draw Text
          ctx.fillStyle = "#000000";
          ctx.font = "18px Arial";
          ctx.fillText(
            text,
            x + 5,
            y > 20 ? y - 5 : y + 18
          );
        });
      }
    } catch (err) {
      console.error("Detection error:", err);
    }
  }, [model, videoRef, canvasRef]);

  // Detection Loop
  useEffect(() => {
    let intervalId;
    if (isDetecting && model) {
      detect(); // Run once immediately
      intervalId = setInterval(detect, 3000);
    }
    return () => clearInterval(intervalId);
  }, [isDetecting, model, detect]);

  const startDetection = useCallback(() => setIsDetecting(true), []);
  const stopDetection = useCallback(() => setIsDetecting(false), []);

  return {
    detectedObjects,
    isLoading,
    error,
    startDetection,
    stopDetection,
    isDetecting
  };
};

export default useObjectDetection;
