import { createBookmark, getAllBookmarks, removeBookmark } from "./bookmarks.js";
import { getState, saveState, updateState } from "./storage.js";
import { DAY_MS, getNow, isOlderThan } from "../utils/time.js";

export const REVIEW_MIN_AGE_MS = 30 * DAY_MS;
const EXPIRY_MS = 7 * DAY_MS;

function isReviewableBookmark(bookmark, now) {
  if (typeof bookmark.dateAdded !== "number") {
    return true;
  }

  return isOlderThan(bookmark.dateAdded, REVIEW_MIN_AGE_MS, now);
}

function markReviewed(state, bookmarkId, status, now) {
  return {
    ...state,
    reviewedById: {
      ...state.reviewedById,
      [bookmarkId]: {
        status,
        reviewedAt: now
      }
    }
  };
}

function markShown(state, bookmarkId, now) {
  const previousShown = state.shownById[bookmarkId];

  return {
    ...state,
    shownById: {
      ...state.shownById,
      [bookmarkId]: {
        firstShownAt: previousShown?.firstShownAt ?? now,
        lastShownAt: now,
        shownCount: (previousShown?.shownCount ?? 0) + 1
      }
    }
  };
}

function expireIgnoredBookmarks(state, bookmarkIds, now) {
  let nextState = state;

  for (const bookmarkId of bookmarkIds) {
    if (nextState.reviewedById[bookmarkId]) {
      continue;
    }

    const shown = nextState.shownById[bookmarkId];
    if (shown && isOlderThan(shown.firstShownAt, EXPIRY_MS, now)) {
      nextState = markReviewed(nextState, bookmarkId, "expired", now);
    }
  }

  return nextState;
}

function createStats(allBookmarks, reviewableBookmarks, state) {
  const reviewedCount = reviewableBookmarks.filter((bookmark) => state.reviewedById[bookmark.id]).length;
  const expiredCount = reviewableBookmarks.filter((bookmark) => state.reviewedById[bookmark.id]?.status === "expired").length;

  return {
    totalCount: allBookmarks.length,
    reviewableCount: reviewableBookmarks.length,
    reviewedCount,
    remainingCount: reviewableBookmarks.length - reviewedCount,
    expiredCount
  };
}

function pickRandomBookmark(bookmarks) {
  if (!bookmarks.length) {
    return null;
  }

  return bookmarks[Math.floor(Math.random() * bookmarks.length)];
}

function getNextReviewableBookmark(reviewableBookmarks, state) {
  const candidates = reviewableBookmarks.filter((bookmark) => !state.reviewedById[bookmark.id]);
  const unshownCandidates = candidates.filter((bookmark) => !state.shownById[bookmark.id]);

  if (unshownCandidates.length) {
    return pickRandomBookmark(unshownCandidates);
  }

  if (candidates.length < 2) {
    return candidates[0] ?? null;
  }

  const latestShownAt = Math.max(...candidates.map((bookmark) => state.shownById[bookmark.id]?.lastShownAt ?? 0));
  const notJustShownCandidates = candidates.filter((bookmark) => (state.shownById[bookmark.id]?.lastShownAt ?? 0) < latestShownAt);

  return pickRandomBookmark(notJustShownCandidates.length ? notJustShownCandidates : candidates);
}

export async function getNextBookmark() {
  const now = getNow();
  const bookmarks = await getAllBookmarks();
  const reviewableBookmarks = bookmarks.filter((bookmark) => isReviewableBookmark(bookmark, now));
  const bookmarkIds = reviewableBookmarks.map((bookmark) => bookmark.id);
  let state = await getState();

  state = expireIgnoredBookmarks(state, bookmarkIds, now);
  const stats = createStats(bookmarks, reviewableBookmarks, state);

  const nextBookmark = getNextReviewableBookmark(reviewableBookmarks, state);

  if (!nextBookmark) {
    await saveState(state);
    return {
      bookmark: null,
      state,
      stats,
      expiryMs: EXPIRY_MS,
      minAgeMs: REVIEW_MIN_AGE_MS
    };
  }

  state = markShown(state, nextBookmark.id, now);
  await saveState(state);

  return {
    bookmark: nextBookmark,
    state,
    shown: state.shownById[nextBookmark.id],
    stats,
    expiryMs: EXPIRY_MS,
    minAgeMs: REVIEW_MIN_AGE_MS
  };
}

export async function openBookmark(bookmark) {
  await openUrlInNewTab(bookmark.url);
}

export async function keepBookmark(bookmarkId) {
  await reviewBookmark(bookmarkId, "kept");
}

export async function deleteBookmark(bookmark) {
  const bookmarkId = typeof bookmark === "string" ? bookmark : bookmark.id;

  try {
    await removeBookmark(bookmarkId);
  } catch (error) {
    const message = String(error?.message ?? error);
    const alreadyGone = message.includes("Can't find bookmark") || message.includes("not found");

    if (!alreadyGone) {
      throw error;
    }
  }

  await reviewBookmark(bookmarkId, "deleted");
  return bookmark;
}

export async function restoreDeletedBookmark(bookmark) {
  const restoredBookmark = await createBookmark(bookmark);
  const now = getNow();

  await updateState((state) => {
    const stateWithOriginalRecord = markReviewed(state, bookmark.id, "restored", now);
    return markReviewed(stateWithOriginalRecord, restoredBookmark.id, "restored", now);
  });

  return restoredBookmark;
}

async function reviewBookmark(bookmarkId, status) {
  const now = getNow();

  await updateState((state) => markReviewed(state, bookmarkId, status, now));
}

async function openUrlInNewTab(url) {
  if (globalThis.chrome?.tabs?.create) {
    try {
      await chrome.tabs.create({ url, active: true });
      return;
    } catch (error) {
      console.warn("Unable to open bookmark with chrome.tabs.create.", error);
    }
  }

  const openedWindow = globalThis.window?.open?.(url, "_blank", "noopener,noreferrer");

  if (!openedWindow) {
    globalThis.window?.location?.assign(url);
  }
}
