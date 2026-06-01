import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createRoom } from '../services/roomService.js';
import MainLayout from '../layouts/MainLayout.jsx';
import Button from '../components/Button.jsx';
import Loader from '../components/Loader.jsx';

const CreateRoom = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    setLoading(true);
    try {
      const data = await createRoom();
      toast.success(`Room ${data.room.roomId} created`);
      navigate(`/room/${data.room.roomId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="box" style={{ maxWidth: '400px' }}>
        <h1 className="title mb-2">Create Room</h1>
        <p className="text-muted mb-4">Get a unique room ID to share with others.</p>
        <Button onClick={handleCreate} disabled={loading} className="btn-block">
          {loading ? <Loader size="sm" /> : 'Create Room'}
        </Button>
      </div>
    </MainLayout>
  );
};

export default CreateRoom;
