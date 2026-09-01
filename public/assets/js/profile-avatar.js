(function attachProfileAvatarTools(global) {
  const MAX_SOURCE_BYTES = 5 * 1024 * 1024;
  const OUTPUT_SIZE = 256;
  const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);

  function loadImage(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('The selected image could not be decoded.'));
      };
      image.src = url;
    });
  }

  async function prepareAvatarFile(file) {
    if (!(file instanceof File)) throw new Error('Choose an image first.');
    if (!ACCEPTED_TYPES.has(file.type)) throw new Error('Use a PNG, JPG, WebP, GIF, or AVIF image.');
    if (file.size > MAX_SOURCE_BYTES) throw new Error('Avatar images must be 5 MB or smaller.');

    const image = await loadImage(file);
    const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
    const sourceX = Math.max(0, (image.naturalWidth - sourceSize) / 2);
    const sourceY = Math.max(0, (image.naturalHeight - sourceSize) / 2);
    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) throw new Error('Image processing is unavailable in this browser.');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    let dataUrl = canvas.toDataURL('image/webp', 0.86);
    if (!dataUrl.startsWith('data:image/webp')) dataUrl = canvas.toDataURL('image/jpeg', 0.86);
    if (dataUrl.length > 400_000) throw new Error('The processed avatar is unexpectedly large. Try another image.');
    return dataUrl;
  }

  global.NebuloProfileAvatar = Object.freeze({ prepareAvatarFile });
})(window);
