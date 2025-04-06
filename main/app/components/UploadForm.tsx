"use client";
import { useState } from "react";

type PitchDeckResult = {
  summary: string;
  context: string;
};

export default function UploadForm({ onResult }: { onResult: (result:PitchDeckResult) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    onResult(data);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <input type="file" accept=".pdf,.ppt,.pptx" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleUpload}
        disabled={!file || loading}
      >
        {loading ? "Processing..." : "Upload & Analyze"}
      </button>
    </div>
  );
}
