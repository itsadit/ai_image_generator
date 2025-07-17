import { useState } from "react";

export default function ImageGenerator() {
  const [prompt, setPrompt]   = useState("");
  const [url, setUrl]         = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const generate = async () => {
    if (!prompt.trim()) return setError("Please enter a prompt");
    setError("");
    setUrl("");            // 🔹 clear previous image
    setLoading(true);

    try {
      const res  = await fetch("/api/generate", {          // 🔹 relative path
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const json = await res.json();
      res.ok ? setUrl(json.url) : setError(json.error || "Unknown error");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Room Interior Image Generator 🏠</h1>

      <input
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="e.g. peaceful reading corner"
        style={{ width: "100%", padding: 8 }}
      />

      <button onClick={generate} disabled={loading} style={{ marginTop: 12 }}>
        {loading ? "Generating…" : "Generate"}
      </button>

      {loading && <p style={{ color: "#555" }}>This may take 30‑60 s on the free tier…</p>}
      {error   && <p style={{ color: "crimson" }}>{error}</p>}
      {url     && <img src={url} alt="AI generated room" style={{ width: "100%", marginTop: 16 }} />}
    </main>
  );
}
