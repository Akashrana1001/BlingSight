import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Trash2, Phone, Plus } from 'lucide-react';

const EmergencyPanel = () => {
  const { user } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchContacts = async () => {
    if (!user) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${API_URL}/contacts`, config);
      setContacts(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load contacts');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  const addContact = async (e) => {
    e.preventDefault();
    if (!name || !phone || !user) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.post(`${API_URL}/contacts`, { name, phone }, config);
      setName('');
      setPhone('');
      fetchContacts();
    } catch (err) {
      setError('Failed to add contact');
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Delete this contact?')) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.delete(`${API_URL}/contacts/${id}`, config);
      fetchContacts();
    } catch (err) {
      setError('Failed to delete contact');
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg text-white">
      <h2 className="text-3xl font-bold mb-6 text-yellow-400 flex items-center">
        <Phone className="mr-3" size={32} /> Emergency Contacts
      </h2>

      {error && <p className="text-red-500 mb-4 text-xl">{error}</p>}

      <form onSubmit={addContact} className="mb-8 bg-black p-4 rounded border border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-yellow-400">Add New Guardian</h3>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 bg-gray-800 text-white rounded text-xl border border-gray-600"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-3 bg-gray-800 text-white rounded text-xl border border-gray-600"
          />
          <button
            type="submit"
            className="bg-yellow-400 text-black font-bold py-3 rounded text-xl flex items-center justify-center gap-2 hover:bg-yellow-300"
          >
            <Plus size={24} /> Add Contact
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-xl">Loading contacts...</p>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact._id} className="flex justify-between items-center bg-black p-4 rounded border border-gray-700">
              <div>
                <p className="text-2xl font-bold text-yellow-400">{contact.name}</p>
                <p className="text-xl text-gray-300">{contact.phone}</p>
              </div>
              <button
                onClick={() => deleteContact(contact._id)}
                className="bg-red-600 p-3 rounded hover:bg-red-700 text-white"
                aria-label={`Delete ${contact.name}`}
              >
                <Trash2 size={24} />
              </button>
            </div>
          ))}
          {contacts.length === 0 && <p className="text-gray-400 text-xl">No contacts added yet.</p>}
        </div>
      )}
    </div>
  );
};

export default EmergencyPanel;
