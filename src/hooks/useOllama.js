import { useState, useCallback } from 'react';

const useOllama = (model = 'qwen') => {
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (transcript, history, onChunk) => {
    setIsThinking(true);
    setError(null);

    const systemPrompt = {
      role: 'system',
      content: "You are Sam, a simulated human peer. You are speaking through voice audio to the user. Talk casually using everyday natural language. Keep your answers extremely short, punchy, and highly interactive (1 to 2 sentences max). Never use lists, markdown, emojis, or formal AI robotic constraints. Respond exactly as a normal human friend named Sam would in a direct verbal conversation."
    };

    const messages = [systemPrompt, ...history, { role: 'user', content: transcript }];

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages,
          stream: true
        })
      });

      if (!response.ok) throw new Error(`Server error ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.message && data.message.content) {
              fullResponse += data.message.content;
              onChunk(fullResponse);
            }
          } catch (e) {
            // Partial JSON chunk, ignore
          }
        }
      }

      setIsThinking(false);
      return fullResponse;
    } catch (err) {
      console.error("Ollama query failed:", err);
      setError("Failed to connect to Sam. Ensure Ollama is running.");
      setIsThinking(false);
      throw err;
    }
  }, [model]);

  return { isThinking, sendMessage, error };
};

export default useOllama;
