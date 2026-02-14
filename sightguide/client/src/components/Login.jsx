import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h2 className="text-4xl font-bold mb-8 text-yellow-400">Guardian Login</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        {error && <p className="text-red-500 text-xl">{error}</p>}
        <div>
          <label className="block text-2xl mb-2 text-yellow-400">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 text-2xl bg-gray-900 border-2 border-yellow-400 rounded text-white"
            placeholder="Enter email"
            required
          />
        </div>
        <div>
          <label className="block text-2xl mb-2 text-yellow-400">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 text-2xl bg-gray-900 border-2 border-yellow-400 rounded text-white"
            placeholder="Enter password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-yellow-400 text-black text-3xl font-bold py-4 rounded hover:bg-yellow-300 transition-colors"
        >
          LOGIN
        </button>
      </form>
      <div className="mt-8">
        <button onClick={() => navigate('/register')} className="text-xl underline text-yellow-400">
          Create New Account
        </button>
      </div>
    </div>
  );
};

export default Login;
