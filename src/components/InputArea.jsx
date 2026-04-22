import React, { useState } from 'react';

const InputArea = ({ onSendMessage, onToggleVoice, isListening, isThinking }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !isThinking) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <div className="interaction-hub">
      <form className="input-field-group" onSubmit={handleSubmit}>
        <input
          type="text"
          className="main-text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isListening ? "Listening..." : "Message Sam..."}
          disabled={isThinking}
        />
        <button 
          type="submit" 
          className="send-icon-btn" 
          disabled={!text.trim() || isThinking}
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>

      <div className="voice-trigger-wrapper">
        <button 
          className={`voice-action-btn ${isListening ? 'active' : ''}`}
          onClick={onToggleVoice}
          disabled={isThinking}
        >
          <div className="btn-glow"></div>
          <span className="mic-icon">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path fill="currentColor" d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </span>
          <span className="btn-label">{isListening ? 'STOP' : 'TALK'}</span>
        </button>
      </div>
    </div>
  );
};

export default InputArea;
