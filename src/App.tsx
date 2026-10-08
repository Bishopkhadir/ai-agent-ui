import { useState, useEffect, useRef, type FormEvent } from 'react';
import axios from 'axios';
import './App.css';

const API = 'https://ai-agent-api-6v1a.onrender.com';

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
    <div className="chat-app d-flex flex-column vh-100">
      <header className="bg-dark text-center py-3 border-bottom border-secondary">
        <h1 className="h4 text-info mb-0">🤖 AI Agent</h1>
        <p className="small text-secondary mb-0">Powered by Groq + Llama</p>
      </header>

      <div className="messages flex-grow-1 overflow-auto p-3 d-flex flex-column gap-2">
        {messages.length === 0 && (
          <div className="text-center text-secondary mt-5">
            <p>Ask me anything!</p>
            <p className="small">Try: "What time is it?" or "What's 156 × 34?"</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`d-flex ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
          >
            <div
              className={`p-2 px-3 rounded-4 ${
                msg.role === 'user'
                  ? 'bg-info text-dark'
                  : 'bg-secondary text-light'
              }`}
              style={{ maxWidth: '85%', wordWrap: 'break-word' }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="d-flex justify-content-start">
            <div className="p-2 px-3 rounded-4 bg-secondary text-light fst-italic">
              Thinking...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={sendMessage}
        className="d-flex gap-2 p-3 bg-dark border-top border-secondary"
      >
        <input
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={loading}
        />
        <button
          type="submit"
          className="btn btn-info text-dark fw-bold"
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default App;