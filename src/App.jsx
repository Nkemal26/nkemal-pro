import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import VoiceOrb from './components/VoiceOrb';
import ChatLog from './components/ChatLog';
import InputArea from './components/InputArea';
import useSpeechRecognition from './hooks/useSpeechRecognition';
import useSpeechSynthesis from './hooks/useSpeechSynthesis';
import useOllama from './hooks/useOllama';

const App = () => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Sam core online. Ready for human simulation tests.' }
  ]);
  const [orbState, setOrbState] = useState('idle'); // idle, listening, thinking, speaking

  // Synthesis Hook
  const { isSpeaking, speak, cancel: cancelSpeech } = useSpeechSynthesis();

  // Ollama Hook
  const { isThinking, sendMessage } = useOllama('qwen');

  // Handle AI Response
  const processUserMessage = useCallback(async (text) => {
    if (isThinking) return;

    // Add user message to log
    setMessages(prev => [...prev, { sender: 'user', text }]);
    
    setOrbState('thinking');
    
    // Add empty placeholder for AI response to support streaming updates
    setMessages(prev => [...prev, { sender: 'ai', text: '' }]);

    try {
      // Extract history (excluding the placeholder)
      const history = messages.map(m => ({ 
        role: m.sender === 'ai' ? 'assistant' : 'user', 
        content: m.text 
      }));

      const fullResponse = await sendMessage(text, history, (streamedText) => {
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = { sender: 'ai', text: streamedText };
          return newMsgs;
        });
      });

      // Once streaming is done, speak the text
      setOrbState('speaking');
      speak(fullResponse, () => {
        setOrbState('idle');
      });

    } catch (err) {
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = { sender: 'ai', text: 'Error connecting to Sam. Check your connection.' };
        return newMsgs;
      });
      setOrbState('idle');
    }
  }, [isThinking, messages, sendMessage, speak]);

  // Recognition Hook
  const { isListening, startListening, stopListening } = useSpeechRecognition(processUserMessage);

  // Sync orb state with hooks
  useEffect(() => {
    if (isListening) setOrbState('listening');
    else if (isThinking) setOrbState('thinking');
    else if (isSpeaking) setOrbState('speaking');
    else setOrbState('idle');
  }, [isListening, isThinking, isSpeaking]);

  const handleToggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      cancelSpeech(); // Stop Sam if he's currently talking
      startListening();
    }
  };

  return (
    <div className="app-root">
      <Header />
      
      <VoiceOrb state={orbState} />
      
      <ChatLog messages={messages} />
      
      <InputArea 
        onSendMessage={processUserMessage} 
        onToggleVoice={handleToggleVoice}
        isListening={isListening}
        isThinking={isThinking}
      />
    </div>
  );
};

export default App;
