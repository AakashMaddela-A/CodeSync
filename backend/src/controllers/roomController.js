import Room from '../models/Room.js';
import Message from '../models/Message.js';
import generateRoomId from '../utils/generateRoomId.js';

export const createRoom = async (req, res) => {
  try {
    let roomId;
    let existingRoom;

    do {
      roomId = generateRoomId();
      existingRoom = await Room.findOne({ roomId });
    } while (existingRoom);

    const room = await Room.create({
      roomId,
      owner: req.user._id,
      language: 'javascript',
      participants: [req.user._id],
    });

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      room: {
        roomId: room.roomId,
        language: room.language,
        owner: room.owner,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({ success: false, message: 'Room ID is required' });
    }

    const room = await Room.findOne({ roomId: roomId.toUpperCase() });

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room does not exist' });
    }

    const isParticipant = room.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      room.participants.push(req.user._id);
      await room.save();
    }

    res.status(200).json({
      success: true,
      message: 'Joined room successfully',
      room: {
        roomId: room.roomId,
        language: room.language,
        owner: room.owner,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId.toUpperCase() }).populate(
      'owner',
      'name email'
    );

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const messages = await Message.find({ roomId: room.roomId })
      .sort({ createdAt: 1 })
      .limit(100);

    res.status(200).json({
      success: true,
      room,
      messages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
