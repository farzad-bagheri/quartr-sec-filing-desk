export type Filing = {
  accessionNumber: string;
  filingDate: string;
  form: string;
  primaryDocument: string;
  primaryDocDescription: string;
  reportDate: string;
  documentUrl: string;
};

export type Submissions = {
  name: string;
  cik: string;
  tickers: string[];
  filings: {
    recent: {
      accessionNumber: string[];
      filingDate: string[];
      reportDate: string[];
      acceptanceDateTime: string[];
      act: string[];
      form: string[];
      fileNumber: string[];
      filmNumber: string[];
      items: string[];
      core_type: string[];
      size: string[];
      isXBRL: number[];
      isInlineXBRL: number[];
      primaryDocument: string[];
      primaryDocDescription: string[];
    };
  };
};

type TickerRecord = { cik_str: number; ticker: string; title: string };
export type TickerRecordParsed = { cik: string; ticker: string; title: string };
export type TickerMap = Record<string, TickerRecord>;
