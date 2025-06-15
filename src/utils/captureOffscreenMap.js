// src/utils/captureOffscreenMap.js
import html2canvas from "html2canvas";

export async function captureOffscreenMap() {
  const mapElement = document.querySelector(".leaflet-container");
  if (!mapElement) {
    console.error("❌ Offscreen map not found.");
    return null;
  }

  // Wait to make sure tiles have rendered
  await new Promise((res) => setTimeout(res, 500));

  const canvas = await html2canvas(mapElement, {
    useCORS: true,
    scale: 2,
  });

  return canvas.toDataURL("image/png");
}