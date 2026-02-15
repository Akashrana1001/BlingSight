import { useState, useEffect, useCallback } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';

const useImageClassifier = () => {
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log("Loading MobileNet classifier...");
        const loadedModel = await mobilenet.load();
        setModel(loadedModel);
        setIsLoading(false);
        console.log("MobileNet classifier loaded.");
      } catch (err) {
        console.error("Failed to load MobileNet classifier", err);
        setError("Failed to load image classifier");
        setIsLoading(false);
      }
    };
    loadModel();
  }, []);

  const classify = useCallback(async (videoElement) => {
    if (!model || !videoElement) return [];
    try {
      const predictions = await model.classify(videoElement);
      // Filter by confidence > 0.3 for relevance
      return predictions.filter(p => p.probability > 0.3);
    } catch (err) {
      console.error("Classification error:", err);
      return [];
    }
  }, [model]);

  return {
    classify,
    isClassifierLoading: isLoading,
    classifierError: error
  };
};

export default useImageClassifier;
