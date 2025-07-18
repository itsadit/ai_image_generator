import { useState } from "react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }
    setError("");
    setUrl("");
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const json = await res.json();
      console.log("🎯 Raw backend URL value:", json.url, typeof json.url);

      if (res.ok && json.url) {
        const finalUrl = Array.isArray(json.url) ? json.url[0] : json.url;
        console.log("✅ Final URL:", finalUrl);
        setUrl(finalUrl);
      } else {
        setError(json.error || "Invalid response from server");
      }
    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 900, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Room Interior Image Generator 🏠</h1>
      <input
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
          setError("");
        }}
        placeholder="e.g. peaceful reading corner"
        style={{ width: "100%", padding: 8 }}
        autoFocus
        aria-label="Describe the room or style you want"
      />

      <button
        type="button"
        onClick={generate}
        disabled={loading}
        style={{
          marginTop: 12,
          padding: "8px 20px",
          fontWeight: "bold",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Generating…" : "Generate"}
      </button>

      {loading && <p style={{ color: "#555" }}>This may take 30–60 s on the free tier…</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {url && (
        <img
          src={url}
          alt={`AI generated: ${prompt}`}
          style={{
            width: "100%",
            maxWidth: "800px",
            minHeight: "350px",
            display: "block",
            margin: "16px auto 0",
            borderRadius: 8,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            objectFit: "contain",
            background: "#f7f7f7",
          }}
          onError={(e) => {
            console.error("❌ Image failed to load:", url);
            e.currentTarget.style.display = "none";
            setError("Failed to load image. Try again with a different prompt.");
          }}
        />
      )}
    </main>
  );
}
