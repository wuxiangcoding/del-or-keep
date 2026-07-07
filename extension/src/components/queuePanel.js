import { createElement } from "../utils/dom.js";
import { formatDuration } from "../utils/time.js";

function createMetric(label, value) {
  return createElement("div", { className: "queue-metric" }, [
    createElement("span", { className: "queue-metric__value", text: value }),
    createElement("span", { className: "queue-metric__label", text: label })
  ]);
}

export function createQueuePanel(queueData = {}) {
  const { stats, minAgeMs } = queueData ?? {};
  const minimumAge = minAgeMs ? formatDuration(minAgeMs) : "30 days";

  return createElement("aside", { className: "queue-panel", attrs: { "aria-label": "Review queue summary" } }, [
    createElement("div", { className: "queue-panel__section queue-panel__section--summary" }, [
      createElement("p", { className: "panel-label", text: "Queue" }),
      createElement("div", { className: "metric-grid" }, [
        createMetric("left", String(stats?.remainingCount ?? "—")),
        createMetric("old links", String(stats?.reviewableCount ?? "—")),
        createMetric("reviewed", String(stats?.reviewedCount ?? "—")),
        createMetric("total saved", String(stats?.totalCount ?? "—"))
      ])
    ]),
    createElement("div", { className: "queue-panel__section" }, [
      createElement("p", { className: "panel-label", text: "Scope" }),
      createElement("p", { className: "panel-copy", text: `Only bookmarks saved at least ${minimumAge} ago enter this queue.` })
    ]),
    createElement("div", { className: "queue-panel__section" }, [
      createElement("p", { className: "panel-label", text: "Delete safety" }),
      createElement("p", { className: "panel-copy", text: "Delete asks for confirmation first, then keeps undo in the corner while you continue." })
    ])
  ]);
}
