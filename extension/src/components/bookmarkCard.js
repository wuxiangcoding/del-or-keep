import { createElement } from "../utils/dom.js";
import { formatBookmarkAge, formatDaysUntilExpiry, formatDuration } from "../utils/time.js";

function getHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function createActionButton({ label, icon, variant, onClick }) {
  return createElement(
    "button",
    {
      className: `action-button action-button--${variant}`,
      attrs: { type: "button" },
      events: { click: onClick }
    },
    [
      icon ? createElement("span", { className: "action-button__icon", text: icon, attrs: { "aria-hidden": "true" } }) : null,
      createElement("span", { text: label })
    ]
  );
}

function createMetaItem(label, value) {
  return createElement("div", { className: "bookmark-meta__item" }, [
    createElement("span", { className: "bookmark-meta__label", text: label }),
    createElement("span", { className: "bookmark-meta__value", text: value })
  ]);
}

function createDeleteConfirmation({ bookmark, onCancelDelete, onConfirmDelete }) {
  return createElement("div", { className: "delete-confirmation", attrs: { role: "alert" } }, [
    createElement("div", { className: "delete-confirmation__copy" }, [
      createElement("p", { className: "delete-confirmation__title", text: "Delete this bookmark?" }),
      createElement("p", {
        text: `${getHostname(bookmark.url)} will be removed from Chrome bookmarks. Undo stays available while you continue.`
      })
    ]),
    createElement("div", { className: "delete-confirmation__actions" }, [
      createActionButton({ label: "Cancel", icon: "↩", variant: "secondary", onClick: onCancelDelete }),
      createActionButton({ label: "Delete bookmark", icon: "⌫", variant: "danger", onClick: onConfirmDelete })
    ])
  ]);
}

export function createBookmarkCard({
  bookmark,
  shown,
  expiryMs,
  minAgeMs,
  confirmDelete = false,
  onOpen,
  onKeep,
  onDelete,
  onCancelDelete,
  onConfirmDelete
}) {
  const minimumAge = minAgeMs ? formatDuration(minAgeMs) : "30 days";

  return createElement("section", { className: "bookmark-card" }, [
    createElement("div", { className: "bookmark-card__top" }, [
      createElement("p", { className: "eyebrow", text: "Review item" }),
      createElement("span", { className: "age-badge", text: `${minimumAge}+` })
    ]),
    createElement("h1", { className: "bookmark-title", text: bookmark.title || "Untitled bookmark" }),
    createElement("a", {
      className: "bookmark-url",
      text: bookmark.url,
      attrs: {
        href: bookmark.url,
        title: bookmark.url,
        "aria-label": `Open ${bookmark.url} in a new tab`
      },
      events: {
        click: (event) => {
          event.preventDefault();
          onOpen();
        }
      }
    }),
    createElement("div", { className: "bookmark-meta" }, [
      createMetaItem("Age", formatBookmarkAge(bookmark.dateAdded)),
      createMetaItem("Seen", `${shown?.shownCount ?? 0} ${shown?.shownCount === 1 ? "time" : "times"}`),
      createMetaItem("Expires", formatDaysUntilExpiry(shown?.firstShownAt, expiryMs).replace("Leaves this queue in ", ""))
    ]),
    confirmDelete
      ? createDeleteConfirmation({ bookmark, onCancelDelete, onConfirmDelete })
      : createElement("div", { className: "action-row" }, [
          createActionButton({ label: "Open", icon: "↗", variant: "primary", onClick: onOpen }),
          createActionButton({ label: "Keep", icon: "✓", variant: "secondary", onClick: onKeep }),
          createActionButton({ label: "Delete", icon: "⌫", variant: "danger", onClick: onDelete })
        ])
  ]);
}
