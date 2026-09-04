import { Filing } from "../gateway/sec/sec.types.js";

export const filterFilings = (
  filings: Filing[],
  order: "asc" | "desc",
  formType?: string,
) => {
  return filings
    .filter((filing) => !formType || filing.form === formType)
    .sort((a, b) =>
      order === "asc"
        ? a.filingDate.localeCompare(b.filingDate)
        : b.filingDate.localeCompare(a.filingDate),
    );
};

export const getTotalPages = (totalItems: number, limit: number) => {
  return Math.max(Math.ceil(totalItems / limit), 1);
};
