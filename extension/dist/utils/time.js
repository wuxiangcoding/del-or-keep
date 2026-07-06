export const DAY_MS = 24 * 60 * 60 * 1000;

export function getNow() {
  return Date.now();
}

export function isOlderThan(timestamp, durationMs, now = getNow()) {
  return typeof timestamp === "number" && now - timestamp > durationMs;
}

export function formatBookmarkAge(dateAdded, now = getNow()) {
  if (!dateAdded) {
    return "Saved a while ago";
  }

  const ageMs = Math.max(0, now - dateAdded);
  const days = Math.floor(ageMs / DAY_MS);

  if (days < 1) {
    return "Saved today";
  }

  if (days < 30) {
    return `Saved ${days} ${days === 1 ? "day" : "days"} ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `Saved ${months} ${months === 1 ? "month" : "months"} ago`;
  }

  const years = Math.floor(months / 12);
  return `Saved ${years} ${years === 1 ? "year" : "years"} ago`;
}

export function formatDuration(durationMs) {
  const days = Math.max(1, Math.round(durationMs / DAY_MS));

  if (days <= 60) {
    return `${days} ${days === 1 ? "day" : "days"}`;
  }

  const months = Math.round(days / 30);
  if (months < 12) {
    return `${months} ${months === 1 ? "month" : "months"}`;
  }

  const years = Math.round(months / 12);
  return `${years} ${years === 1 ? "year" : "years"}`;
}

export function formatDaysUntilExpiry(firstShownAt, durationMs, now = getNow()) {
  if (!firstShownAt) {
    return "Leaves this queue in 7 days if ignored";
  }

  const remainingMs = Math.max(0, firstShownAt + durationMs - now);
  const remainingDays = Math.max(1, Math.ceil(remainingMs / DAY_MS));
  return `Leaves this queue in ${remainingDays} ${remainingDays === 1 ? "day" : "days"} if ignored`;
}
