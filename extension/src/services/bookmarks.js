function flattenBookmarkTree(nodes, bookmarks = []) {
  for (const node of nodes) {
    if (node.url) {
      bookmarks.push({
        id: node.id,
        parentId: node.parentId ?? null,
        index: typeof node.index === "number" ? node.index : null,
        title: node.title || node.url,
        url: node.url,
        dateAdded: node.dateAdded ?? null
      });
    }

    if (node.children?.length) {
      flattenBookmarkTree(node.children, bookmarks);
    }
  }

  return bookmarks;
}

export async function getAllBookmarks() {
  const tree = await chrome.bookmarks.getTree();
  return flattenBookmarkTree(tree).sort((left, right) => {
    const leftDate = left.dateAdded ?? Number.MAX_SAFE_INTEGER;
    const rightDate = right.dateAdded ?? Number.MAX_SAFE_INTEGER;
    return leftDate - rightDate;
  });
}

export async function removeBookmark(bookmarkId) {
  await chrome.bookmarks.remove(bookmarkId);
}

function removeUndefinedValues(record) {
  return Object.fromEntries(Object.entries(record).filter(([, value]) => value !== undefined && value !== null));
}

export async function createBookmark(bookmark) {
  const baseCreateDetails = {
    title: bookmark.title || bookmark.url,
    url: bookmark.url
  };

  const originalLocationDetails = removeUndefinedValues({
    ...baseCreateDetails,
    parentId: bookmark.parentId,
    index: bookmark.index
  });

  try {
    return await chrome.bookmarks.create(originalLocationDetails);
  } catch (error) {
    if (!bookmark.parentId) {
      throw error;
    }
  }

  const parentOnlyDetails = removeUndefinedValues({
    ...baseCreateDetails,
    parentId: bookmark.parentId
  });

  try {
    return await chrome.bookmarks.create(parentOnlyDetails);
  } catch {
    return chrome.bookmarks.create(baseCreateDetails);
  }
}
