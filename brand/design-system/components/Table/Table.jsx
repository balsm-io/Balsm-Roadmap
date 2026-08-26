// Balsm DS — Table
//
// Dense data with priority-based column dropping (design.md §9):
// mark a column priority 'low' or 'med' and it leaves the layout as
// the container narrows, so the primary table never needs a
// horizontal scrollbar on touch. Dropped values reappear stacked
// under the row's primary cell — re-laid-out, not lost.
//
// Columns are declared as data, not JSX, so the same definition
// drives the header, the cells, and the responsive behaviour.

export function Table({
  columns = [],
  rows = [],
  rowKey = null,
  density = 'md',
  zebra = false,
  hover = true,
  sticky = false,
  sortBy = null,
  sortDir = 'asc',
  onSort = null,
  onRowClick = null,
  selectedKeys = null,
  empty = 'Nothing here yet.',
  caption = null,
  className = '',
  style,
  ...rest
}) {
  const keyOf = (row, i) =>
    (typeof rowKey === 'function' ? rowKey(row, i) : rowKey ? row[rowKey] : null) ?? i;

  const cls = [
    'b-table',
    density !== 'md' && `b-table--${density}`,
    zebra && 'b-table--zebra',
    hover && 'b-table--hover',
    sticky && 'b-table--sticky',
    className,
  ].filter(Boolean).join(' ');

  // Columns that vanish at narrow widths, restated under the first cell
  const stacked = columns.filter(c => c.priority === 'low' || c.priority === 'med');
  const primary = columns[0];

  const cellCls = col => [
    col.priority === 'low' && 'b-col-low',
    col.priority === 'med' && 'b-col-med',
    col.numeric && 'b-table__num',
    col.mono && 'b-table__code',
    col.className,
  ].filter(Boolean).join(' ') || undefined;

  const render = (col, row, i) =>
    col.render ? col.render(row, i) : row[col.key];

  return (
    <div className="b-table-wrap">
      <table className={cls} style={style} {...rest}>
        {caption && <caption className="b-table__caption">{caption}</caption>}
        <thead>
          <tr>
            {columns.map(col => {
              const active = sortBy === col.key;
              const ariaSort = active ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined;
              return (
                <th
                  key={col.key}
                  className={cellCls(col)}
                  style={col.width ? { width: col.width } : undefined}
                  aria-sort={ariaSort}
                  scope="col"
                >
                  {col.sortable && onSort ? (
                    <button
                      type="button"
                      className="b-table__sort"
                      aria-sort={ariaSort}
                      onClick={() => onSort(col.key, active && sortDir === 'asc' ? 'desc' : 'asc')}
                    >
                      {col.label}
                      <svg className="b-table__sort-icon" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="3,7.5 6,10.5 9,7.5" />
                      </svg>
                    </button>
                  ) : col.label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="b-table__empty">{empty}</td>
            </tr>
          )}
          {rows.map((row, i) => {
            const k = keyOf(row, i);
            const isSel = selectedKeys ? selectedKeys.includes(k) : false;
            return (
              <tr
                key={k}
                className={isSel ? 'is-selected' : undefined}
                onClick={onRowClick ? () => onRowClick(row, i) : undefined}
                style={onRowClick ? { cursor: 'pointer' } : undefined}
              >
                {columns.map((col, ci) => (
                  <td key={col.key} className={cellCls(col)}>
                    {render(col, row, i)}
                    {ci === 0 && stacked.length > 0 && (
                      <span className="b-table__stacked">
                        {stacked.map(sc => `${sc.label}: ${row[sc.key] ?? '—'}`).join(' · ')}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
