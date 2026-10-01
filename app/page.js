"use client";

import { useState } from "react";

const MAX_CHARS = 10000;
const MIN_CHARS = 50;

export default function Home() {
  const [text, setText] = useState("");
  const [length, setLength] = useState("medium");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const chars = text.length;
  const tooShort = text.trim().length < MIN_CHARS;
  const tooLong = chars > MAX_CHARS;

  async function handleSummarise() {
    setError("");
    setSummary("");
    setCopied(false);

    if (!text.trim()) {
      setError("Please paste some text first.");
      return;
    }

    if (tooShort) {
      setError(`Please enter at least ${MIN_CHARS} characters.`);
      return;
    }

    if (tooLong) {
      setError(`Text cannot exceed ${MAX_CHARS} characters.`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          length,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Unable to generate summary.");
      }

      const data = await response.json();

      if (!data.summary) {
        throw new Error("The AI did not return a summary.");
      }

      setSummary(data.summary);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!summary) return;

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Unable to copy the summary.");
    }
  }

  function handleClear() {
    setText("");
    setSummary("");
    setError("");
    setCopied(false);
  }

  return (
    <main className="app">
      <header className="header">
        <div className="brand">
          <div className="logo">✦</div>

          <div>
            <h1>SmartSummarizer AI</h1>
            <p>Turn long text into clear, concise summaries.</p>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-badge">AI POWERED</div>

        <h2>Summarize smarter.</h2>

        <p>
          Paste an article, document, or any long text and let AI create
          a useful summary in seconds.
        </p>
      </section>

      <section className="workspace">
        {/* INPUT CARD */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3>Your text</h3>
              <p>Paste the content you want to summarize.</p>
            </div>

            <span className="counter">
              {chars.toLocaleString()} / {MAX_CHARS.toLocaleString()}
            </span>
          </div>

          <textarea
            className="text-input"
            placeholder="Paste your article, document, notes, or any long text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={MAX_CHARS}
          />

          <div className="controls">
            <div>
              <label>Summary length</label>

              <div className="options">
                <button
                  type="button"
                  className={length === "short" ? "option active" : "option"}
                  onClick={() => setLength("short")}
                >
                  Short
                </button>

                <button
                  type="button"
                  className={length === "medium" ? "option active" : "option"}
                  onClick={() => setLength("medium")}
                >
                  Medium
                </button>

                <button
                  type="button"
                  className={length === "detailed" ? "option active" : "option"}
                  onClick={() => setLength("detailed")}
                >
                  Detailed
                </button>
              </div>
            </div>

            <div className="actions">
              <button
                type="button"
                className="clear-btn"
                onClick={handleClear}
              >
                Clear
              </button>

              <button
                type="button"
                className="generate-btn"
                onClick={handleSummarise}
                disabled={loading}
              >
                {loading ? "Generating..." : "✦ Generate Summary"}
              </button>
            </div>
          </div>

          {error && (
            <div className="error">
              <span>⚠</span>
              {error}
            </div>
          )}
        </div>

        {/* OUTPUT CARD */}
        <div className="card output-card">
          <div className="card-header">
            <div>
              <h3>AI Summary</h3>
              <p>Your generated summary will appear here.</p>
            </div>

            {summary && (
              <button
                type="button"
                className="copy-btn"
                onClick={handleCopy}
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            )}
          </div>

          <div className="summary-area">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>

                <h4>Generating your summary...</h4>

                <p>
                  The AI is reading your text and creating a concise
                  summary.
                </p>
              </div>
            ) : summary ? (
              <div className="summary-text">
                {summary}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">✦</div>

                <h4>Your summary will appear here</h4>

                <p>
                  Paste your text on the left and click
                  <strong> Generate Summary</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer>
        <p>
          SmartSummarizer AI • AI-powered text summarization
        </p>
      </footer>
    </main>
  );
}