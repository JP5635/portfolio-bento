import React, { useState, useEffect } from 'react';

const MESSAGES_PRESET = [
  { id: 1, type: 'user', text: 'Help me prep for my interview 👋' },
  { id: 2, type: 'typing' },
  { id: 3, type: 'ai',   text: 'Sure! Share the job description.' },
  { id: 4, type: 'user', text: "Applying for ML Engineer at a startup" },
  { id: 5, type: 'typing' },
  { id: 6, type: 'ai',   text: "Generating STAR-format answers for you ✨" },
  { id: 7, type: 'ai',   text: '"What is your biggest strength?" — 17 questions ready' },
];

export default function InterviewEasyCard() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let active = true;
    let timeouts = [];

    const runChatLoop = () => {
      if (!active) return;
      setMessages([]);

      let accumulatedDelay = 300;

      MESSAGES_PRESET.forEach((msg, idx) => {
        const addT = setTimeout(() => {
          if (!active) return;
          setMessages(prev => {
            const filtered = prev.filter(m => m.type !== 'typing');
            return [...filtered, msg];
          });
        }, accumulatedDelay);
        timeouts.push(addT);

        accumulatedDelay += msg.type === 'typing' ? 600 : 900;
      });

      const restartT = setTimeout(() => {
        if (!active) return;
        runChatLoop();
      }, accumulatedDelay + 2000);
      timeouts.push(restartT);
    };

    runChatLoop();

    return () => {
      active = false;
      timeouts.forEach(t => clearTimeout(t));
    };
  }, []);

  return (
    <div id="iv" className="featured-card">
      <div className="featured-thumb">
        <div className="chat-scene" aria-hidden="true">
          {messages.map((msg, idx) => {
            if (msg.type === 'typing') {
              return (
                <div key={`typing-${idx}`} className="typing-dots show">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              );
            }
            return (
              <div key={msg.id || idx} className={`chat-bbl ${msg.type} show`}>
                {msg.text}
              </div>
            );
          })}
        </div>
        <div className="featured-gradient" aria-hidden="true"></div>
      </div>
      <div className="featured-details">
        <span className="featured-meta">AI Agent</span>
        <h3 className="featured-title">Interview Easy</h3>
        <p className="featured-desc">AI Mock Interviewer generating custom STAR-format interview scenarios.</p>
      </div>
    </div>
  );
}
