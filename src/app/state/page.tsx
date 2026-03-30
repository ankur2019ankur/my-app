'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import type { State } from '../_type/state';
import styles from './page.module.css';

type StateFromApi = Omit<State, 'id'> & Partial<Pick<State, 'id'>>;

function normalizeStates(items: StateFromApi[]): State[] {
  return items.map((s, idx) => ({
    ...s,
    id: s.id && String(s.id).trim().length > 0 ? String(s.id) : `${idx + 1}-${s.name}`,
  })) as State[];
}

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return '';
  const text = String(value);
  const mustQuote = /[",\n\r]/.test(text);
  const escaped = text.replace(/"/g, '""');
  return mustQuote ? `"${escaped}"` : escaped;
}

function statesToCsv(items: State[]): string {
  const headers = ['Name', 'Capital', 'Temperature', 'Season', 'GDP', 'Population', 'Area'] as const;
  const lines = [
    headers.join(','),
    ...items.map((s) =>
      [
        csvEscape(s.name),
        csvEscape(s.capital),
        csvEscape(s.temperature),
        csvEscape(s.season),
        csvEscape(s.gdp),
        csvEscape(s.population),
        csvEscape(s.area),
      ].join(',')
    ),
  ];

  return `${lines.join('\r\n')}\r\n`;
}

function downloadTextFile(filename: string, contents: string, mimeType: string) {
  const blob = new Blob([contents], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export default function StatePage() {
  const [states, setStates] = useState<State[]>([]);
  const [rawStates, setRawStates] = useState<StateFromApi[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErrorMessage(null);

      try {
        const response = await axios.get<StateFromApi[]>('http://localhost:3001/states', {
          headers: { accept: 'application/json' },
          maxBodyLength: Infinity,
        });

        if (cancelled) return;
        setRawStates(Array.isArray(response.data) ? response.data : []);
        setStates(normalizeStates(Array.isArray(response.data) ? response.data : []));
      } catch (err) {
        if (cancelled) return;
        setErrorMessage(err instanceof Error ? err.message : 'Failed to load states');
        setStates([]);
        setRawStates([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const canExport = !loading && !errorMessage && states.length > 0;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerCopy}>
            <h1 className={styles.title}>States</h1>
            <p className={styles.subtitle}>Fetched from http://localhost:3001/states</p>
          </div>

          <button
            type="button"
            className={styles.exportBtn}
            disabled={!canExport}
            onClick={() => {
              const csv = statesToCsv(states);
              const d = new Date();
              const yyyy = String(d.getFullYear());
              const mm = String(d.getMonth() + 1).padStart(2, '0');
              const dd = String(d.getDate()).padStart(2, '0');
              downloadTextFile(`states-${yyyy}-${mm}-${dd}.csv`, csv, 'text/csv;charset=utf-8;');
            }}
          >
            Export
          </button>
        </div>
      </div>

      {errorMessage ? (
        <div className={`${styles.alert} ${styles.alertError}`}>{errorMessage}</div>
      ) : loading ? (
        <div className={`${styles.alert} ${styles.alertEmpty}`}>Loading…</div>
      ) : states.length === 0 ? (
        <div className={`${styles.alert} ${styles.alertEmpty}`}>No states found.</div>
      ) : (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr className={styles.trHead}>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Capital</th>
                  <th className={styles.th}>Temperature</th>
                  <th className={styles.th}>Season</th>
                  <th className={styles.th}>GDP</th>
                  <th className={styles.th}>Population</th>
                  <th className={styles.th}>Area</th>
                </tr>
              </thead>
              <tbody className={styles.tbody}>
                {states.map((s) => (
                  <tr key={s.id} className={styles.trBody}>
                    <td className={`${styles.td} ${styles.tdStrong}`}>{s.name}</td>
                    <td className={styles.td}>{s.capital}</td>
                    <td className={styles.td}>{s.temperature}</td>
                    <td className={styles.td}>{s.season}</td>
                    <td className={styles.td}>{s.gdp}</td>
                    <td className={styles.td}>{s.population}</td>
                    <td className={styles.td}>{s.area}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}