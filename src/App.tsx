import { useState, useEffect, useRef, type FormEvent } from 'react';
import axios from 'axios';
import './App.css';

const API = 'https://ai-agent-api-6v1a.onrender.com/';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${API}/chat`, { messages: updated });
      setMessages([...updated, { role: 'assistant', content: res.data.reply }]);
    } catch {
      setMessages([
        ...updated,
        { role: 'assistant', content: '⚠️ Something went wrong. Try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-app">
      <header>
        <h1>🤖 AI Agent</h1>
        <p>Powered by Groq + Llama</p>
      </header>

      <div className="messages">
        {messages.length === 0 && (
          <div className="empty">
            <p>Ask me anything!</p>
            <p className="hint">Try: "What time is it?" or "What's 156 × 34?"</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className="bubble">{msg.content}</div>
          </div>
        ))}

        {loading && (
          <div className="message assistant">
            <div className="bubble typing">Thinking...</div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default App;