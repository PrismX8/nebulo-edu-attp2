const LOCAL_IMAGE_PATH = /^\/api\/upload\/image\/([A-Za-z0-9_-]{8,64})$/;

function attachmentUrl(value) {
  const url = String(value || '').trim();
  if (LOCAL_IMAGE_PATH.test(url)) return url;
  if (!/^https:\/\/[^\s"'<>]{1,2000}$/i.test(url)) return '';
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && !parsed.username && !parsed.password ? url : '';
  } catch { return ''; }
}

function normalizeAttachment(item = {}) {
  const url = attachmentUrl(item?.url);
  return url ? { url, name: String(item?.name || 'Image').trim().slice(0,160),
    type: String(item?.type || 'image').trim().toLowerCase().slice(0,80) } : null;
}

function prepareNativeMediaMessage(body, items) {
  const originalBody = String(body || '').trim();
  const attachments = (Array.isArray(items) ? items : []).map(normalizeAttachment).filter(Boolean).slice(0,4);
  const nativeUrls = new Set(attachments.filter(a => LOCAL_IMAGE_PATH.test(a.url)).map(a => a.url));
  const text = originalBody.replace(/\[img:(\/api\/upload\/image\/[A-Za-z0-9_-]{8,64})\]/g, (_tag,url) => {
    nativeUrls.add(url);
    if (!attachments.some(a => a.url === url) && attachments.length < 4) attachments.push({url,name:'Image',type:'image'});
    return '';
  }).trim();
  return { attachments, nativeUrls: [...nativeUrls],
    // TLK remains text-only. Native media metadata stays on our own server.
    upstreamBody: nativeUrls.size ? (text || 'Image attachment') : originalBody,
    nativeBody: nativeUrls.size ? originalBody : null };
}

module.exports = { LOCAL_IMAGE_PATH, attachmentUrl, normalizeAttachment, prepareNativeMediaMessage };
