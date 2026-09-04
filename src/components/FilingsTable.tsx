import { useNavigate } from "react-router-dom";
import type { FilingResponse } from "../types/api";
import { formatDate } from "../utils/format";

type FilingsTableProps = {
  ticker: string;
  page: number;
  data: FilingResponse | null;
};

export function FilingsTable({ ticker, page, data }: FilingsTableProps) {
  const navigate = useNavigate();
  const total = data?.pagination.total ?? 0;

  return (
    <div className="table-wrap">
      <div className="table-meta">
        <span>{data ? `${total} filings found` : "Loading filings..."}</span>
        <span>
          Showing {total ? (page - 1) * 12 + 1 : 0}–{Math.min(page * 12, total)}
        </span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Filing date</th>
            <th>Form</th>
            <th>Report description</th>
            <th>Document</th>
          </tr>
        </thead>
        <tbody>
          {data?.filings.map((filing) => (
            <tr key={filing.accessionNumber}>
              <td className="date">{formatDate(filing.filingDate)}</td>
              <td>
                <span className="form-pill">{filing.form}</span>
              </td>
              <td>
                <strong>{filing.primaryDocDescription || "SEC filing"}</strong>
                <small>{filing.accessionNumber}</small>
              </td>
              <td>
                <a
                  href={filing.documentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="open-link"
                >
                  Open <span>↗</span>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data && data.filings.length === 0 && (
        <div className="empty">No filings match those filters.</div>
      )}
      <div className="pagination">
        <button
          disabled={page <= 1}
          onClick={() => navigate(`/?ticker=${ticker}&page=${page - 1}`)}
        >
          ← Previous
        </button>
        <span>
          Page <b>{page}</b> of <b>{data?.pagination.totalPages ?? 1}</b>
        </span>
        <button
          disabled={!data || page >= data.pagination.totalPages}
          onClick={() => navigate(`/?ticker=${ticker}&page=${page + 1}`)}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
