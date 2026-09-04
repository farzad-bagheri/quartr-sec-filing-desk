import { NavLink, Route, Routes } from "react-router-dom";
import { FilingsPage } from "./FilingsPage";
import { SummaryPage } from "./SummaryPage";

export function AppShell() {
  return (
    <div className="app-shell">
      <aside>
        <div className="brand">
          <span className="brand-mark">Q</span>
          <span>
            quartr<span className="brand-dot">.</span>
          </span>
        </div>
        <p className="eyebrow">SEC research desk</p>
        <nav>
          <NavLink to="/" end>
            <span>▦</span> Filings
          </NavLink>
          <NavLink to="/summary">
            <span>◒</span> Summary
          </NavLink>
        </nav>
        <div className="aside-note">
          <span className="status-dot" /> SEC data live
          <br />
          <small>Updated on request</small>
        </div>
      </aside>
      <main>
        <header>
          <span>PUBLIC COMPANY INTELLIGENCE</span>
          <span className="header-date">04 SEP 2026</span>
        </header>
        <Routes>
          <Route path="/" element={<FilingsPage />} />
          <Route path="/summary" element={<SummaryPage />} />
        </Routes>
      </main>
    </div>
  );
}
