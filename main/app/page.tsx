"use client";
import { useState } from "react";
import ChatBox from "./components/ChatBox";
import UploadForm from "./components/UploadForm";

type PitchDeckResult = {
  summary: string;
  context: string;
};

export default function Home() {
  const [summary, setSummary] = useState<string | null>(null);
  const [context, setContext] = useState<string | null>(null);

  const handleResult = (data:PitchDeckResult) => {
    setSummary(data.summary);
    setContext(data.context);
  };

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Pitch Deck Evaluator</h1>
      <UploadForm onResult={handleResult} />
      {summary && (
        <>
          <div className="mt-6 p-4 border rounded bg-white shadow">
            <h2 className="text-xl font-semibold mb-2">Extracted Info</h2>
            <pre className="whitespace-pre-wrap">{summary}</pre>
          </div>
          {context && <ChatBox context={context} />}
        </>
      )}
    </main>
  );
}
