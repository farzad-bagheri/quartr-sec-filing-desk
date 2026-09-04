import { useEffect, useState, type SubmitEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import type { FilingResponse } from "../types/api";
import { FilingFilters } from "./FilingFilters";
import { FilingsTable } from "./FilingsTable";

export function FilingsPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [ticker, setTicker] = useState(params.get("ticker") ?? "AAPL");
  const [formType, setFormType] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [data, setData] = useState<FilingResponse | null>(null);
  const [error, setError] = useState("");
  const activeTicker = params.get("ticker")?.trim().toUpperCase() || "AAPL";
  const page = Number(params.get("page") ?? 1);

  useEffect(() => {
    void api
      .getFilings(activeTicker, page, formType, order)
      .then(setData)
      .catch((err: Error) => setError(err.message));
  }, [activeTicker, page, formType, order]);
  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/?ticker=${ticker.toUpperCase()}&page=1`);
  };

  return (
    <section className="page">
      <div className="page-intro">
        <div>
          <p className="kicker">FILING LIBRARY / {activeTicker}</p>
          <h1>Filings, without the noise.</h1>
          <p className="lede">
            A focused view into the regulatory record of public companies.
          </p>
        </div>
        <div className="sync-badge">
          <span className="status-dot" /> SEC EDGAR
          <br />
          <small>Source verified</small>
        </div>
      </div>
      <FilingFilters
        ticker={ticker}
        formType={formType}
        order={order}
        onTickerChange={setTicker}
        onFormTypeChange={setFormType}
        onOrderChange={setOrder}
        onSubmit={submit}
      />
      {error ? (
        <div className="error">{error}. Check the ticker and try again.</div>
      ) : (
        <FilingsTable ticker={ticker} page={page} data={data} />
      )}
    </section>
  );
}
