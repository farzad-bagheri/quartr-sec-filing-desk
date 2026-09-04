import { useState, type SubmitEvent } from "react";
import { CUSTOM_FORM_TYPE, FILING_FORM_TYPES } from "../constants/filings";

type FilingFiltersProps = {
  ticker: string;
  formType: string;
  order: "asc" | "desc";
  onTickerChange: (ticker: string) => void;
  onFormTypeChange: (formType: string) => void;
  onOrderChange: (order: "asc" | "desc") => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
};

export function FilingFilters({
  ticker,
  formType,
  order,
  onTickerChange,
  onFormTypeChange,
  onOrderChange,
  onSubmit,
}: FilingFiltersProps) {
  const isPreset = FILING_FORM_TYPES.includes(
    formType as (typeof FILING_FORM_TYPES)[number],
  );
  const [customSelected, setCustomSelected] = useState(
    Boolean(formType && !isPreset),
  );
  const selectValue = customSelected ? CUSTOM_FORM_TYPE : formType;

  return (
    <form className="search-row" onSubmit={onSubmit}>
      <label className="ticker-input">
        <span>⌕</span>
        <input
          value={ticker}
          onChange={(event) => onTickerChange(event.target.value.toUpperCase())}
          placeholder="Enter ticker"
          aria-label="Company ticker"
        />
        <button aria-label="Search">Search</button>
      </label>
      <label>
        Form type
        <select
          value={selectValue}
          onChange={(event) => {
            const value = event.target.value;
            if (value === CUSTOM_FORM_TYPE) {
              setCustomSelected(true);
              if (isPreset) onFormTypeChange("");
              return;
            }
            setCustomSelected(false);
            onFormTypeChange(value);
          }}
        >
          <option value="">All forms</option>
          {FILING_FORM_TYPES.map((type) => (
            <option key={type}>{type}</option>
          ))}
          <option value={CUSTOM_FORM_TYPE}>Custom...</option>
        </select>
        {selectValue === CUSTOM_FORM_TYPE && (
          <input
            value={formType}
            onChange={(event) =>
              onFormTypeChange(event.target.value.toUpperCase())
            }
            placeholder="e.g. 13-F"
            aria-label="Custom form type"
          />
        )}
      </label>
      <label>
        Sort order
        <select
          value={order}
          onChange={(event) =>
            onOrderChange(event.target.value as "asc" | "desc")
          }
        >
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
      </label>
    </form>
  );
}
