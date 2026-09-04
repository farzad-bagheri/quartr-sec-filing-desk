import { useEffect, useState, type SubmitEvent } from "react";
import { api } from "../api/client";
import type { Summary } from "../types/api";
import { SummaryCard } from "./SummaryCard";

export function SummaryPageLoading() {
  return <div className="loading">Loading portfolio data...</div>;
}

export function SummaryPage() {
  const [tickers, setTickers] = useState("AAPL, SPOT, JPM");
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [error, setError] = useState("");

  const load = async (value = tickers) => {
    try {
      const body = await api.getSummary(value);
      setSummaries(body.summaries);
      setError("");
    } catch {
      setError("Failed to load summary");
    }
  };

  useEffect(() => {
    void api
      .getSummary("AAPL, SPOT, JPM")
      .then((body) => setSummaries(body.summaries))
      .catch((err: Error) => setError(err.message));
  }, []);

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    void load();
  };

  return (
    <section className="page">
      <div className="page-intro">
        <div>
          <p className="kicker">PORTFOLIO VIEW / LAST 12 MONTHS</p>
          <h1>The market, at a glance.</h1>
          <p className="lede">
            Compare filing rhythms and keep the latest annual report within
            reach.
          </p>
        </div>
      </div>
      <form className="summary-controls" onSubmit={submit}>
        <label>
          Companies
          <input
            value={tickers}
            onChange={(event) => setTickers(event.target.value)}
          />
        </label>
        <button className="primary">
          Refresh summary <span>↗</span>
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      <div className="summary-grid">
        {summaries.map((summary, index) => (
          <SummaryCard key={summary.ticker} summary={summary} index={index} />
        ))}
      </div>

      {!summaries.length && !error && <SummaryPageLoading />}
    </section>
  );
}
