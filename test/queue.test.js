import assert from "node:assert/strict";
import test from "node:test";

const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 6, 6);

let bookmarks;
let storageState;
let nextBookmarkId;
let assignedUrl;
let openedTabUrl;

function createBookmarkNode(overrides) {
  return {
    id: overrides.id,
    parentId: overrides.parentId ?? "1",
    index: overrides.index ?? 0,
    title: overrides.title,
    url: overrides.url,
    dateAdded: overrides.dateAdded
  };
}

function resetMocks() {
  bookmarks = [
    createBookmarkNode({
      id: "old",
      index: 0,
      title: "Old link",
      url: "https://old.example.com",
      dateAdded: NOW - 45 * DAY_MS
    }),
    createBookmarkNode({
      id: "older",
      index: 1,
      title: "Older link",
      url: "https://older.example.com",
      dateAdded: NOW - 40 * DAY_MS
    }),
    createBookmarkNode({
      id: "fresh",
      index: 2,
      title: "Fresh link",
      url: "https://fresh.example.com",
      dateAdded: NOW - 2 * DAY_MS
    })
  ];
  storageState = {};
  nextBookmarkId = 100;
  assignedUrl = null;
  openedTabUrl = null;
}

function installChromeMock() {
  globalThis.window = {
    location: {
      assign(url) {
        assignedUrl = url;
      }
    },
    open(url) {
      assignedUrl = url;
      return {};
    }
  };

  globalThis.chrome = {
    bookmarks: {
      async getTree() {
        return [
          {
            id: "0",
            children: [
              {
                id: "1",
                title: "Bookmarks bar",
                children: bookmarks.map((bookmark, index) => ({
                  ...bookmark,
                  index
                }))
              }
            ]
          }
        ];
      },
      async remove(bookmarkId) {
        const bookmarkIndex = bookmarks.findIndex((bookmark) => bookmark.id === bookmarkId);

        if (bookmarkIndex === -1) {
          throw new Error("Can't find bookmark");
        }

        bookmarks.splice(bookmarkIndex, 1);
      },
      async create(details) {
        const bookmark = createBookmarkNode({
          id: String(nextBookmarkId++),
          parentId: details.parentId ?? "1",
          index: typeof details.index === "number" ? details.index : bookmarks.length,
          title: details.title,
          url: details.url,
          dateAdded: NOW
        });

        bookmarks.splice(bookmark.index, 0, bookmark);
        return bookmark;
      }
    },
    tabs: {
      async create(details) {
        openedTabUrl = details.url;
        return {
          id: 1,
          ...details
        };
      }
    },
    storage: {
      local: {
        async get(key) {
          return { [key]: storageState[key] };
        },
        async set(value) {
          storageState = {
            ...storageState,
            ...value
          };
        }
      }
    }
  };
}

async function importQueueModule() {
  return import(`../extension/src/services/queue.js?test=${Date.now()}-${Math.random()}`);
}

test.beforeEach(() => {
  resetMocks();
  installChromeMock();
});

test("opened bookmarks launch in a new tab without marking the item reviewed", async () => {
  const originalDateNow = Date.now;
  Date.now = () => NOW;

  try {
    const { openBookmark } = await importQueueModule();

    await openBookmark(bookmarks[0]);

    assert.equal(openedTabUrl, "https://old.example.com");
    assert.equal(assignedUrl, null);
    assert.equal(storageState.delOrKeepState, undefined);
  } finally {
    Date.now = originalDateNow;
  }
});

test("only bookmarks older than the review threshold enter the queue", async () => {
  const originalDateNow = Date.now;
  Date.now = () => NOW;

  try {
    const { getNextBookmark, keepBookmark } = await importQueueModule();

    const firstPayload = await getNextBookmark();
    assert.equal(firstPayload.bookmark.id, "old");
    assert.equal(firstPayload.stats.totalCount, 3);
    assert.equal(firstPayload.stats.reviewableCount, 2);
    assert.equal(firstPayload.stats.remainingCount, 2);

    await keepBookmark("old");

    const secondPayload = await getNextBookmark();
    assert.equal(secondPayload.bookmark.id, "older");
    assert.equal(secondPayload.stats.reviewableCount, 2);
    assert.equal(secondPayload.stats.remainingCount, 1);
  } finally {
    Date.now = originalDateNow;
  }
});

test("new tabs rotate to another unreviewed bookmark instead of repeating the same item", async () => {
  const originalDateNow = Date.now;
  let now = NOW;
  Date.now = () => now;

  try {
    const { getNextBookmark } = await importQueueModule();

    const firstPayload = await getNextBookmark();
    assert.equal(firstPayload.bookmark.id, "old");

    now += 1;
    const secondPayload = await getNextBookmark();
    assert.equal(secondPayload.bookmark.id, "older");

    now += 1;
    const thirdPayload = await getNextBookmark();
    assert.equal(thirdPayload.bookmark.id, "old");
  } finally {
    Date.now = originalDateNow;
  }
});

test("deleted bookmarks can be restored to the original folder when possible", async () => {
  const originalDateNow = Date.now;
  Date.now = () => NOW;

  try {
    const { deleteBookmark, getNextBookmark, restoreDeletedBookmark } = await importQueueModule();
    const payload = await getNextBookmark();

    const deletedBookmark = await deleteBookmark(payload.bookmark);
    assert.equal(deletedBookmark.id, "old");
    assert.deepEqual(
      bookmarks.map((bookmark) => bookmark.id),
      ["older", "fresh"]
    );

    const restoredBookmark = await restoreDeletedBookmark(deletedBookmark);
    assert.equal(restoredBookmark.parentId, "1");
    assert.equal(restoredBookmark.title, "Old link");
    assert.equal(restoredBookmark.url, "https://old.example.com");
    assert.deepEqual(
      bookmarks.map((bookmark) => bookmark.title),
      ["Old link", "Older link", "Fresh link"]
    );
  } finally {
    Date.now = originalDateNow;
  }
});
