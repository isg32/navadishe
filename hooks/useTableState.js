'use client';

import { useMemo, useState } from 'react';

// Client-side search + sort + equality-filter over an already-loaded row
// array. `computed` maps a sortKey starting with "_" to a (row) => value
// getter, for sortable columns that aren't a real field (e.g. a combined
// "contact" column). `searchGetters(row)` returns the strings to match
// free-text search against.
export function useTableState({ rows, defaultSortKey, computed = {}, searchGetters }) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({}); // { fieldName: value }
  const [sortKey, setSortKey] = useState(defaultSortKey);
  const [sortDir, setSortDir] = useState('desc');

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  function setFilter(field, value) {
    setFilters((f) => ({ ...f, [field]: value }));
  }

  const visibleRows = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = rows.filter((row) => {
      for (const [field, value] of Object.entries(filters)) {
        if (value && row[field] !== value) return false;
      }
      if (q) {
        const haystack = searchGetters(row).join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    const dir = sortDir === 'asc' ? 1 : -1;
    return filtered.slice().sort((a, b) => {
      let av = sortKey.startsWith('_') ? computed[sortKey](a) : a[sortKey];
      let bv = sortKey.startsWith('_') ? computed[sortKey](b) : b[sortKey];

      if (sortKey === 'Timestamp') {
        av = av ? new Date(av).getTime() : 0;
        bv = bv ? new Date(bv).getTime() : 0;
        return (av - bv) * dir;
      }
      av = (av || '').toString().toLowerCase();
      bv = (bv || '').toString().toLowerCase();
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    });
  }, [rows, search, filters, sortKey, sortDir]);

  return { search, setSearch, filters, setFilter, sortKey, sortDir, toggleSort, visibleRows };
}
