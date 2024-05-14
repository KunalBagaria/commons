"use client";
import { useEffect, useState, ChangeEvent } from 'react';
import { io, Socket } from 'socket.io-client';

interface TypingData {
  username: string;
  text: string;
}

const socket: Socket = io('http://localhost:3001');

const Chat = () => {
  const [message, setMessage] = useState<string>('');
  const [typing, setTyping] = useState<TypingData[]>([]);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    socket.on('typing', (data: TypingData) => {
      setTyping((prevTyping) => ([
        ...prevTyping.filter((typingData) => typingData.username !== data.username),
        data,
      ]));
    });
    return () => {
      socket.off('typing');
    };
  }, []);

  const handleTyping = (e: ChangeEvent<HTMLInputElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    socket.emit('typing', { username, text: newMessage });
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        {typing.map((data) => (
          <div key={data.username}>
            <strong>{data.username}</strong> is typing: {data.text}
          </div>
        ))}
      </div>
      <form>
        <input
          type="text"
          value={message}
          onChange={handleTyping}
          placeholder="Type a message..."
        />
      </form>
    </div>
  );
};

export default Chat;