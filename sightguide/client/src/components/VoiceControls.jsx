import { Mic, MicOff } from 'lucide-react';

const VoiceControls = ({ isListening, toggleListening }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 border-t-2 border-yellow-400 flex flex-col items-center">
      <button
        onClick={toggleListening}
        className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-colors ${
          isListening ? 'bg-red-600 animate-pulse' : 'bg-yellow-400'
        }`}
        aria-label={isListening ? "Stop Listening" : "Start Voice Commands"}
      >
        {isListening ? <MicOff size={48} color="white" /> : <Mic size={48} color="black" />}
      </button>

      <div className="text-center">
        <p className="text-yellow-400 font-bold text-xl mb-2">Voice Commands:</p>
        <div className="flex gap-4 text-white text-lg">
          <span>"Identify"</span>
          <span>"Help"</span>
          <span>"History"</span>
        </div>
      </div>
    </div>
  );
};

export default VoiceControls;
