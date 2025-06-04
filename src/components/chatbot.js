import { useState } from 'react';
import knowledgeBase from '../data/knowledgeBase.json';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "Halo! Ketikkan gejala yang kamu lihat pada tanaman mangga.", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    const botReply = generateReply(input);

    setMessages(prev => [...prev, userMessage, botReply]);
    setInput("");
  };

  const generateReply = (inputText) => {
    const penyakitMatch = knowledgeBase.penyakit.map(p => {
      const matchedGejala = p.gejala.filter(g =>
        inputText.toLowerCase().includes(g.deskripsi.toLowerCase())
      );
      return { ...p, cocok: matchedGejala.length };
    }).filter(p => p.cocok > 0);

    if (penyakitMatch.length === 0) {
      return { text: "Maaf, saya tidak menemukan penyakit yang cocok dengan deskripsi tersebut.", sender: "bot" };
    }

    penyakitMatch.sort((a, b) => b.cocok - a.cocok);
    const p = penyakitMatch[0];
    return {
      text: `Kemungkinan penyakit: ${p.nama}\nGejala cocok: ${p.cocok} gejala\nSaran pengendalian:\n- ${p.pengendalian.join('\n- ')}`,
      sender: "bot"
    };
  };

  return (
    <div style={styles.chatContainer}>
      <h3 style={styles.title}>🤖 Chatbot Pakar</h3>
      <div style={styles.chatBox}>
        {messages.map((m, i) => (
          <div key={i} style={{ ...styles.message, alignSelf: m.sender === 'bot' ? 'flex-start' : 'flex-end', backgroundColor: m.sender === 'bot' ? '#e0f2f1' : '#c8e6c9' }}>
            {m.text}
          </div>
        ))}
      </div>
      <div style={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={styles.input}
          placeholder="Tulis gejala di sini..."
        />
        <button onClick={handleSend} style={styles.sendButton}>Kirim</button>
      </div>
    </div>
  );
}

const styles = {
  chatContainer: {
    maxWidth: '600px',
    margin: '30px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#fafafa',
  },
  title: {
    marginBottom: '10px',
    textAlign: 'center',
    color: '#00796b',
  },
  chatBox: {
    maxHeight: '300px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '10px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '10px'
  },
  message: {
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '80%',
    whiteSpace: 'pre-wrap',
  },
  inputArea: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  sendButton: {
    padding: '10px 20px',
    backgroundColor: '#00796b',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};
