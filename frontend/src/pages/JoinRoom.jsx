import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { joinRoom } from '../services/roomService.js';
import MainLayout from '../layouts/MainLayout.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import Loader from '../components/Loader.jsx';

const JoinRoom = () => {
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!roomId.trim()) {
      toast.error('Enter a room ID');
      return;
    }
    setLoading(true);
    try {
      const data = await joinRoom(roomId.trim().toUpperCase());
      toast.success(`Joined ${data.room.roomId}`);
      navigate(`/room/${data.room.roomId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Room not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="box" style={{ maxWidth: '400px' }}>
        <h1 className="title mb-2">Join Room</h1>
        <p className="text-muted mb-4">Enter the room ID from your teammate.</p>
        <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Room ID"
            name="roomId"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            placeholder="ABC123"
            required
          />
          <Button type="submit" disabled={loading} className="btn-block">
            {loading ? <Loader size="sm" /> : 'Join Room'}
          </Button>
        </form>
      </div>
    </MainLayout>
  );
};

export default JoinRoom;
