import { Check, X } from "lucide-react";

const FriendRequestCard = ({ request, onRespond }) => (
  <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
    <div>
      <p className="text-sm font-medium">{request.requester.name}</p>
      <p className="text-xs text-ink-muted">{request.requester.email}</p>
    </div>
    <div className="flex gap-1.5">
      <button
        onClick={() => onRespond(request._id, "accept")}
        aria-label="Accept"
        className="flex h-7 w-7 items-center justify-center rounded-full border border-accent-emerald text-accent-emerald transition hover:bg-accent-emerald/10"
      >
        <Check size={13} />
      </button>
      <button
        onClick={() => onRespond(request._id, "decline")}
        aria-label="Decline"
        className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-ink-muted transition hover:border-red-400/50 hover:text-red-400"
      >
        <X size={13} />
      </button>
    </div>
  </div>
);

export default FriendRequestCard;
