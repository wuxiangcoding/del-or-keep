const BING_IMAGE_API_URL = "https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8&mkt=en-US";
const BING_BASE_URL = "https://www.bing.com";
const BACKGROUND_REQUEST_TIMEOUT_MS = 2500;

function normalizeImageUrl(imageUrl) {
  if (!imageUrl) {
    return null;
  }

  return new URL(imageUrl, BING_BASE_URL).href;
}

function pickRandomImage(images = []) {
  if (!images.length) {
    return null;
  }

  return images[Math.floor(Math.random() * images.length)];
}

function formatCssUrl(url) {
  return `url("${url.replace(/["\\\n\r\f]/g, "\\$&")}")`;
}

async function fetchBingDailyImage() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), BACKGROUND_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(BING_IMAGE_API_URL, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`Bing image API returned ${response.status}`);
    }

    const payload = await response.json();
    return normalizeImageUrl(pickRandomImage(payload?.images)?.url);
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function applyDailyBackgroundImage(target = document.documentElement) {
  try {
    const imageUrl = await fetchBingDailyImage();

    if (!imageUrl) {
      return null;
    }

    target.style.setProperty("--page-bg-image", formatCssUrl(imageUrl));
    target.dataset.backgroundSource = "bing";
    return imageUrl;
  } catch (error) {
    console.debug("Daily background image unavailable.", error);
    return null;
  }
}
