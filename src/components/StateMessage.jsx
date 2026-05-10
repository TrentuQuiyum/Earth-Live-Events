export default function StateMessage({
  title,
  message,
  actionLabel,
  onAction,
  tone = 'neutral',
}) {
  return (
    <section className={`state-message state-message-${tone}`} aria-live="polite">
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {actionLabel && (
        <button type="button" className="button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </section>
  );
}
