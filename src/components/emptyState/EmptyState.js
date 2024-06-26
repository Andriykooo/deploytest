import { EmptyStateIcon } from "@/icons/EmptyStateIcon";
import "./EmptyState.css";

export const EmptyState = ({ message }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-image">
        <EmptyStateIcon />
      </div>
      <div className="empty-state-massage">{message}</div>
    </div>
  );
};
