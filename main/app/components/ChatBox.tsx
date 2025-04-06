"use client";
import { useState } from "react";

export default function ChatBox({ context }: { context: string }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);

  const sendMessage = async () => {
    if (!question.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ context, question }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { role: "assistant", text: data.answer }]);
    setQuestion("");
  };

  return (
    <div className="mt-6 space-y-3">
      <div className="border p-4 rounded h-64 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "text-blue-600" : "text-gray-800"}>
            <strong>{msg.role === "user" ? "You: " : "AI: "}</strong>{msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="border p-2 flex-1"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a follow-up..."
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
