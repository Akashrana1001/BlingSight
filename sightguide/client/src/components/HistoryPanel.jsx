import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { History, Clock } from 'lucide-react';

const HistoryPanel = () => {
  const { user } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user) return;
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`${API_URL}/logs`, config);
        setLogs(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load history');
        setLoading(false);
      }
    };

    fetchLogs();
  }, [user]);

  return (
    <div className="bg-gray-900 p-6 rounded-lg text-white h-full">
      <h2 className="text-3xl font-bold mb-6 text-yellow-400 flex items-center">
        <History className="mr-3" size={32} /> Detection History
      </h2>

      {error && <p className="text-red-500 mb-4 text-xl">{error}</p>}

      {loading ? (
        <p className="text-xl">Loading logs...</p>
      ) : (
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
          {logs.map((log) => (
            <div key={log._id} className="flex justify-between items-center bg-black p-4 rounded border border-gray-700">
              <div>
                <p className="text-2xl font-bold text-yellow-400 capitalize">{log.objectName}</p>
                <div className="flex items-center text-gray-400 text-sm mt-1">
                  <Clock size={16} className="mr-1" />
                  <span>{new Date(log.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div className="bg-gray-800 px-3 py-1 rounded text-yellow-400 font-mono text-sm">
                {(log.confidence * 100).toFixed(0)}%
              </div>
            </div>
          ))}
          {logs.length === 0 && <p className="text-gray-400 text-xl">No history available.</p>}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
