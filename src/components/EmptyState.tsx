interface EmptyStateProps {
  message: string;
  onReset?: () => void;
  resetLabel?: string;
}

export function EmptyState({
  message,
  onReset,
  resetLabel = "Redefinir Filtros",
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <p className="empty-state-text">{message}</p>
      {onReset && (
        <button type="button" onClick={onReset} className="btn-reset">
          {resetLabel}
        </button>
      )}
    </div>
  );
}

