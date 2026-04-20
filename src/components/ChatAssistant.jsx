import React, { useState, useRef, useEffect } from 'react';
import { ORNAMENTS } from '../utils/ornamentData.js';
import './ChatAssistant.css';

export default function ChatAssistant({ onSelectOrnament }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "✦ Welcome to JewelVR! I'm your AI jewelry assistant. How can I help you find the perfect piece today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Mock AI Logic
    setTimeout(() => {
      const query = userMsg.text.toLowerCase();
      let response = "";
      let foundItems = [];

      if (query.includes('gold') || query.includes('jewelry') || query.includes('ornament')) {
        response = "We have a beautiful collection of 22K and 18K gold pieces. Are you looking for earrings or necklaces?";
      } else if (query.includes('earring') || query.includes('jhumka') || query.includes('stud')) {
        foundItems = ORNAMENTS.filter(o => o.category === 'earrings');
        response = "Here are our current gold earrings. Which one would you like to try on?";
      } else if (query.includes('necklace') || query.includes('choker') || query.includes('pearl')) {
        foundItems = ORNAMENTS.filter(o => o.category === 'necklaces');
        response = "Our necklaces range from traditional chokers to elegant pearl strands. Take a look!";
      } else if (query.includes('price') || query.includes('cost') || query.includes('expensive')) {
        response = "Our collection ranges from $890 to $4,500. Do you have a specific budget in mind?";
      } else if (query.includes('cheap') || query.includes('low') || query.includes('under 1000')) {
        foundItems = ORNAMENTS.filter(o => o.price < 1000);
        response = "The Gold Drop earrings ($890) are one of our most popular affordable pieces.";
      } else {
        response = "I'm not sure I understand. You can ask me to show you earrings, necklaces, or search for items under a certain price!";
      }

      const botMsg = { 
        id: Date.now() + 1, 
        text: response, 
        sender: 'bot',
        suggestions: foundItems 
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className={`chat-assistant ${isOpen ? 'open' : ''}`}>
      {/* FAB */}
      <button className="chat-fab" onClick={() => setIsOpen(!isOpen)} aria-label="Open AI Assistant">
        <span className="fab-icon">{isOpen ? '✕' : '✦'}</span>
      </button>

      {/* Chat Window */}
      <div className="chat-window">
        <div className="chat-header">
          <span className="header-icon">✦</span>
          <div className="header-text">
            <h3>Jewel Assistant</h3>
            <p>Always online</p>
          </div>
        </div>

        <div className="chat-messages" ref={scrollRef}>
          {messages.map(m => (
            <div key={m.id} className={`message-row ${m.sender}`}>
              <div className="message-bubble">
                {m.text}
                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="msg-suggestions">
                    {m.suggestions.map(s => (
                      <button key={s.id} onClick={() => onSelectOrnament(s)} className="suggest-btn">
                        Try {s.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message-row bot">
              <div className="message-bubble typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
        </div>

        <div className="chat-input-area">
          <input 
            type="text" 
            placeholder="Ask about jewelry..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="send-btn" onClick={handleSend}>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
