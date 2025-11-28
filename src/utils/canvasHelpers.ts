export async function resizeImageFile(file: File, maxSide = 2000): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const { width, height } = img;
      let targetW = width, targetH = height;
      if (Math.max(width, height) > maxSide) {
        const ratio = maxSide / Math.max(width, height);
        targetW = Math.round(width * ratio);
        targetH = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, targetW, targetH);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to resize image"));
      }, "image/png", 0.92);
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image load error"));
    };
    img.src = url;
  });
}

export function exportCanvasToPngDataUrl(canvas: any) {
  // export at a higher resolution while preserving aspect ratio
  const dataUrl = canvas.toDataURL({ format: "png", multiplier: 2 });
  return dataUrl;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}