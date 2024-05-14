"use client";
import { useEffect, useState, ChangeEvent, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import debounce from 'lodash.debounce';
import styles from '@/styles/Home.module.css';

interface TypingData {
  username: string;
  text: string;
}

const socket: Socket = io('https://commons.bhawnasaharia.com');

const Chat = () => {
  const [message, setMessage] = useState<string>('');
  const [typing, setTyping] = useState<TypingData[]>([]);
  const [username, setUsername] = useState<string>('');
  const typingRef = useRef<TypingData[]>([]);

  useEffect(() => {
    socket.on('typing', (data: TypingData) => {
      setTyping((prevTyping) => {
        const updatedTyping = [
          ...prevTyping.filter((typingData) => typingData.username !== data.username),
          data,
        ];
        typingRef.current = updatedTyping;
        return updatedTyping;
      });
    });

    return () => {
      socket.off('typing');
    };
  }, []);

  const handleTyping = (e: ChangeEvent<HTMLInputElement>) => {
    if (!username) {
      return;
    }
    const newMessage = e.target.value;
    setMessage(newMessage);

    const typingData: TypingData = { username, text: newMessage };

    // Update typing state immediately for current user
    setTyping((prevTyping) => {
      const updatedTyping = [
        ...prevTyping.filter((typingData) => typingData.username !== username),
        typingData,
      ];
      typingRef.current = updatedTyping;
      return updatedTyping;
    });

    // Emit the typing event
    emitTyping(typingData);
  };

  const emitTyping = debounce((data: TypingData) => {
    socket.emit('typing', data);
  }, 300);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>The Internet Common Room</h1>

      <div className={styles.chatContainer}>
        {typing.map((data) => (
          <div className={styles.chat} key={data.username}>
            <strong>{data.username}</strong>: {data.text}
          </div>
        ))}
      </div>

      <div className={styles.formContainer}>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.usernameInput}
        />
        <input
          type="text"
          value={message}
          onChange={handleTyping}
          placeholder="Type a message..."
          className={styles.messageInput}
        />
      </div>
    </div>
  );
};

export default Chat;