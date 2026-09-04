export type Filing = {
  accessionNumber: string;
  filingDate: string;
  form: string;
  primaryDocDescription: string;
  documentUrl: string;
};

export type FilingResponse = {
  company: string;
  filings: Filing[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type Summary = {
  ticker: string;
  company: string;
  forms: Record<string, number>;
  latest10K: string | null;
};

export type SummaryResponse = { summaries: Summary[] };
