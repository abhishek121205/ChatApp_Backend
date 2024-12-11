import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwtConfig.js';

//signUp controller
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const users = req.db.get('users').value();
    if (users.find(user => user.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
    };

    req.db.get('users').push(newUser).write();

    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '24h' });
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

//login up controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = req.db.get('users').value();
    const user = users.find(user => user.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
    const { password: _, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

//getCurrent controller
export const getCurrentUser = (req, res) => {
  const user = req.db.get('users').find({ id: req.userId }).value();
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
};

//sendMessages controller
export const sendMessages = async (req, res) => {
  try {
    const { senderId, receiverId, text, timestamp } = req.body;

    const newMessage = {
      senderId, receiverId, text, timestamp
    };

    req.db.get('messages').push(newMessage).write();
    res.status(201).json({ success: "message send Successfully" });
  } catch (error) {
    res.json({ error: "Error in sending message" })
  }

}

//getMessages controller
export const getMessages = (req, res) => {
  let { senderId, receiverId } = req.query;
  try {
    const messages = req.db
      .get('messages')
      .filter(
        (msg) =>
          (msg.senderId === senderId && msg.receiverId === receiverId) ||
          (msg.senderId === receiverId && msg.receiverId === senderId)
      )
      .value();
    if (!messages) {
      return res.status(404).json({ error: 'No messages found' });
    }

    res.json({ messages: messages })
  } catch (error) {
    res.json({
      error: error.message || error
    })
  }
}