export const normalizeUrl = (url) => {
  if (!url) return null;

  let str = url.trim().replace(/\s+/g, "");

  if (/^http:\/\//i.test(str)) {
    str = str.replace(/^http:\/\//i, "https://");
  } else if (!/^https:\/\//i.test(str)) {
    str = `https://${str}`;
  }

  try {
    const normalized = new URL(str);
    normalized.host = normalized.host.toLowerCase();

    if (!normalized.hostname.includes(".")) {
      return null;
    }

    return normalized.href;
  } catch {
    return null;
  }
};
