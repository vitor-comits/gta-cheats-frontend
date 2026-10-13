interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  totalCount: number;
  filteredCount: number;
  itemLabel?: string;
}

export function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = "Buscar...",
  totalCount,
  filteredCount,
  itemLabel = "itens",
}: SearchBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-controls">
        <label htmlFor="search-input" className="sr-only">
          {placeholder}
        </label>
        <input
          id="search-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="search-input"
        />
        <button
          type="button"
          onClick={onClear}
          disabled={!value}
          className="btn-clear"
        >
          Limpar
        </button>
      </div>
      <div className="filter-meta">
        <span>
          Exibindo {filteredCount} de {totalCount} {itemLabel}
        </span>
        {value.trim() !== "" && (
          <span>Filtro: &ldquo;{value.trim()}&rdquo;</span>
        )}
      </div>
    </div>
  );
}

