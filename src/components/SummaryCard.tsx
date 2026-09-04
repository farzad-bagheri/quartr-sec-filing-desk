import type { Summary } from "../types/api";
import { formatDate } from "../utils/format";

type SummaryCardProps = {
  summary: Summary;
  index: number;
};

export function SummaryCard({ summary, index }: SummaryCardProps) {
  const total = Object.values(summary.forms).reduce(
    (sum, count) => sum + count,
    0,
  );
  const max = Math.max(...Object.values(summary.forms), 1);

  return (
    <article className="summary-card">
      <div className="card-top">
        <div>
          <span className="ticker-label">{summary.ticker}</span>
          <h2>{summary.company}</h2>
        </div>
        <span className="company-index">0{index + 1}</span>
      </div>
      <div className="annual">
        <span>Latest 10-K</span>
        <strong>{formatDate(summary.latest10K)}</strong>
      </div>
      <div className="distribution">
        <div className="distribution-head">
          <span>Forms filed</span>
          <b>{total} total</b>
        </div>
        {Object.entries(summary.forms)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([form, count]) => (
            <div className="bar-row" key={form}>
              <span>{form}</span>
              <div>
                <i style={{ width: `${(count / max) * 100}%` }} />
              </div>
              <b>{count}</b>
            </div>
          ))}
      </div>
    </article>
  );
}
