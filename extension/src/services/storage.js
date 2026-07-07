const STATE_KEY = "delOrKeepState";

const DEFAULT_STATE = {
  version: 1,
  reviewedById: {},
  shownById: {}
};

function cloneDefaultState() {
  return {
    version: DEFAULT_STATE.version,
    reviewedById: {},
    shownById: {}
  };
}

function normalizeState(state) {
  return {
    ...cloneDefaultState(),
    ...state,
    reviewedById: state?.reviewedById ?? {},
    shownById: state?.shownById ?? {}
  };
}

export async function getState() {
  const result = await chrome.storage.local.get(STATE_KEY);
  return normalizeState(result[STATE_KEY]);
}

export async function saveState(state) {
  await chrome.storage.local.set({
    [STATE_KEY]: normalizeState(state)
  });
}

export async function updateState(updater) {
  const currentState = await getState();
  const nextState = await updater(currentState);
  await saveState(nextState);
  return nextState;
}
