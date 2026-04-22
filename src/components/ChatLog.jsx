import React, { useEffect, useRef } from 'react';

const ChatLog = ({ messages }) => {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-log-wrapper">
      <div className="chat-log-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-bubble ${msg.sender}-msg`}>
            <div className="bubble-content">
              {msg.text}
            </div>
            <div className="bubble-meta">
              {msg.sender === 'ai' ? 'Sam' : 'You'}
            </div>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};

export default ChatLog;
