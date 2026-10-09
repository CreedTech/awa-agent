import { Icon } from "@/components/ui/icon";

interface LoadErrorProps {
  title: string;
  message?: string;
  onRetry: () => void;
  retrying?: boolean;
}

export function LoadError({ title, message = "Check your connection and try again. Your search settings are kept.", onRetry, retrying }: LoadErrorProps) {
  return (
    <div className="aw-state" role="alert">
      <Icon name="alert" size={22} />
      <div>
        <h3>{title}</h3>
        <p>{message}</p>
      </div>
      <button type="button" className="aw-btn aw-btn-ink aw-btn-sm" onClick={onRetry} disabled={retrying}>
        <Icon name="refresh" size={16} /> {retrying ? "Trying again..." : "Try again"}
      </button>
    </div>
  );
}
