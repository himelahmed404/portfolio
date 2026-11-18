/**
 * ASCII Art & Matrix Rasterizer Engine
 * Recreates the 21st.dev "seve" ASCII Canvas2D render pipeline.
 *
 * Pipeline steps:
 * 1. Background drawing (solid, blur, photo, transparent)
 * 2. Grid cell division & average color / luminance sampling + Sobel edge detection
 * 3. Primitive & glyph drawing per renderMode (characters, matrix, dots, pixel, cross, etc.)
 * 4. Color adjustments (brightness, contrast, saturation, grayscale, tint with overlay blend)
 * 5. Post-effects (scanlines, vignette, bloom, chromatic aberration, film grain, glitch, dust)
 * 6. Lights / highlights
 * 7. Masking
 * 8. Animation loops (flicker, wave, pulse, shimmer, ripple)
 */

export interface PfxConfig {
  vignette?: { enabled: boolean; intensity: number };
  scanLines?: { enabled: boolean; intensity: number };
  chromatic?: { enabled: boolean; intensity: number };
  bloom?: { enabled: boolean; intensity: number };
  filmGrain?: { enabled: boolean; intensity: number };
  glitch?: { enabled: boolean; intensity: number };
  pixelate?: { enabled: boolean; intensity: number };
  halftone?: { enabled: boolean; intensity: number };
  filmDust?: { enabled: boolean; intensity: number };
}

export interface AsciiConfig {
  renderMode:
    | "characters"
    | "matrix"
    | "dither"
    | "mosaic"
    | "pixel"
    | "dots"
    | "cross"
    | "diamond"
    | "voxel"
    | "lego"
    | "mixed"
    | "lines"
    | "diagonal"
    | "braille"
    | "disco"
    | "hexdump"
    | "rings"
    | "hearts"
    | "stars"
    | "hexagons"
    | "triangles"
    | "bubbles"
    | "hatch"
    | "contour"
    | "halfblocks";
  bgMode: "solid" | "blur" | "photo" | "transparent";
  bgBlur: number;
  bgOpacity: number;
  cellSize: number;
  coverage: number;
  invert: boolean;
  styleBlend: GlobalCompositeOperation | string;
  charSet: string;
  customChars: string;
  brightness: number;
  contrast: number;
  edgeEmphasis: number;
  density: number;
  toneCurve: Array<{ x: number; y: number }>;
  tint: string;
  tintOpacity: number;
  overlayBlend: "overlay" | "multiply" | "screen" | "source-over" | string;
  saturation: number;
  grayscale: number;
  blurType: "off" | "gaussian" | "box" | "directional";
  blurAmount: number;
  blurAngle: number;
  directionalBothSides: boolean;
  tiltFocus: number;
  tiltPosition: number;
  tiltFeather: number;
  lensFocus: number;
  blurCenterX: number;
  blurCenterY: number;
  progressivePosition: number;
  progressiveReverse: boolean;
  pfx: PfxConfig;
  animated: boolean;
  animStyle: "flicker" | "wave" | "pulse" | "shimmer" | "ripple";
  animSpeed: { enabled: boolean; intensity: number };
  animIntensity: { enabled: boolean; intensity: number };
  lights?: {
    enabled: boolean;
    points: Array<{ x: number; y: number; radius: number; intensity: number }>;
  };
  mask?: {
    enabled: boolean;
    tool?: string;
    brushSize?: number;
    showOverlay?: boolean;
    invert?: boolean;
    dataUrl?: string | null;
    shapes?: unknown[];
  };
}

export const SEVE_ASCII_CONFIG: AsciiConfig = {
  renderMode: "characters",
  bgMode: "solid",
  bgBlur: 12,
  bgOpacity: 95,
  cellSize: 6, // 6px clean binary cells
  coverage: 100,
  invert: false,
  styleBlend: "source-over",
  charSet: "binary",
  customChars: "01",
  brightness: 0,
  contrast: 115,
  edgeEmphasis: 40,
  density: 0,
  toneCurve: [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
  ],
  tint: "#94a3b8", // Tech slate gray matching portfolio ink/slate
  tintOpacity: 85,
  overlayBlend: "overlay",
  saturation: 0,
  grayscale: 100,
  blurType: "off",
  blurAmount: 35,
  blurAngle: 0,
  directionalBothSides: false,
  tiltFocus: 35,
  tiltPosition: 50,
  tiltFeather: 15,
  lensFocus: 40,
  blurCenterX: 50,
  blurCenterY: 50,
  progressivePosition: 55,
  progressiveReverse: false,
  pfx: {
    vignette: { enabled: true, intensity: 35 },
    scanLines: { enabled: true, intensity: 12 },
    chromatic: { enabled: false, intensity: 0 },
    bloom: { enabled: true, intensity: 25 },
    filmGrain: { enabled: true, intensity: 20 },
    glitch: { enabled: false, intensity: 0 },
    pixelate: { enabled: false, intensity: 15 },
    halftone: { enabled: false, intensity: 20 },
    filmDust: { enabled: false, intensity: 20 },
  },
  animated: true,
  animStyle: "flicker",
  animSpeed: { enabled: true, intensity: 100 },
  animIntensity: { enabled: true, intensity: 60 },
  lights: { enabled: false, points: [] },
  mask: {
    enabled: false,
    tool: "freehand",
    brushSize: 30,
    showOverlay: false,
    invert: false,
    dataUrl: null,
    shapes: [],
  },
};

export interface CellSample {
  r: number;
  g: number;
  b: number;
  lum: number;
  edge: number;
  charIndex: number;
}

export interface GridSampleData {
  cols: number;
  rows: number;
  cellSize: number;
  cells: CellSample[];
  width: number;
  height: number;
}

/**
 * Pre-sorted density ramp from darkest (space) to densest (#)
 * based on the user's customChars: "1go4ufd68ıkjnpıf679ım#"
 */
export const DENSITY_RAMP: string[] = [
  " ",
  "ı",
  ".",
  "1",
  "j",
  "n",
  "u",
  "f",
  "o",
  "k",
  "p",
  "d",
  "4",
  "7",
  "6",
  "8",
  "9",
  "g",
  "m",
  "#",
];

export const MATRIX_CODE_CHARS: string[] = [
  "ｦ", "ｱ", "ｳ", "ｴ", "ｵ", "ｶ", "ｷ", "ｹ", "ｺ", "ｻ", "ｼ", "ｽ", "ｾ", "ｿ",
  "ﾀ", "ﾂ", "ﾃ", "ﾅ", "ﾆ", "ﾇ", "ﾈ", "ﾊ", "ﾋ", "ﾎ", "ﾏ", "ﾐ", "ﾑ", "ﾒ",
  "ﾓ", "ﾔ", "ﾕ", "ﾗ", "ﾘ", "ﾜ", "9", "8", "7", "5", "3", "2", "1", "0",
  "X", "Z", "#", "*", "+", ":", "<", ">",
];

/** Parse #hex or rgb string to [r, g, b] */
export function parseColor(color: string): [number, number, number] {
  if (color.startsWith("#")) {
    let hex = color.slice(1);
    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("");
    }
    const num = parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)];
  }
  return [0, 255, 102];
}

/**
 * Overlay blend mode on normalized [0, 1] channel:
 * If base < 0.5: 2 * base * tint
 * Else: 1 - 2 * (1 - base) * (1 - tint)
 */
function blendOverlayChannel(baseNorm: number, tintNorm: number): number {
  return baseNorm < 0.5
    ? 2 * baseNorm * tintNorm
    : 1 - 2 * (1 - baseNorm) * (1 - tintNorm);
}

/**
 * Step 4: Apply color adjustments in exact order:
 * brightness -> contrast -> saturation -> grayscale -> tint (via overlay)
 */
export function adjustColor(
  r: number,
  g: number,
  b: number,
  config: AsciiConfig,
  tintRgb: [number, number, number]
): [number, number, number] {
  let red = r;
  let green = g;
  let blue = b;

  // 1. Brightness (-100 to 100)
  if (config.brightness !== 0) {
    const bOffset = config.brightness * 2.55;
    red += bOffset;
    green += bOffset;
    blue += bOffset;
  }

  // 2. Contrast (-100 to 100+, 100 = neutral, 115 = +15%)
  if (config.contrast !== 100) {
    const factor = config.contrast / 100;
    red = (red - 128) * factor + 128;
    green = (green - 128) * factor + 128;
    blue = (blue - 128) * factor + 128;
  }

  // Clamp
  red = Math.max(0, Math.min(255, red));
  green = Math.max(0, Math.min(255, green));
  blue = Math.max(0, Math.min(255, blue));

  const lum = 0.299 * red + 0.587 * green + 0.114 * blue;

  // 3. Saturation (100 = neutral)
  if (config.saturation !== 100) {
    const sat = config.saturation / 100;
    red = lum + (red - lum) * sat;
    green = lum + (green - lum) * sat;
    blue = lum + (blue - lum) * sat;
  }

  // 4. Grayscale (0 = off, 100 = full)
  if (config.grayscale > 0) {
    const gray = config.grayscale / 100;
    red = red * (1 - gray) + lum * gray;
    green = green * (1 - gray) + lum * gray;
    blue = blue * (1 - gray) + lum * gray;
  }

  // 5. Tint via overlayBlend
  if (config.tintOpacity > 0) {
    const [tr, tg, tb] = tintRgb;
    const tAlpha = config.tintOpacity / 100;

    const redOverlay = blendOverlayChannel(red / 255, tr / 255) * 255;
    const greenOverlay = blendOverlayChannel(green / 255, tg / 255) * 255;
    const blueOverlay = blendOverlayChannel(blue / 255, tb / 255) * 255;

    red = red * (1 - tAlpha) + redOverlay * tAlpha;
    green = green * (1 - tAlpha) + greenOverlay * tAlpha;
    blue = blue * (1 - tAlpha) + blueOverlay * tAlpha;
  }

  return [
    Math.max(0, Math.min(255, Math.round(red))),
    Math.max(0, Math.min(255, Math.round(green))),
    Math.max(0, Math.min(255, Math.round(blue))),
  ];
}

/**
 * Step 2: Divide canvas into grid of cellSize px and sample average color & luminance
 * Includes Sobel edge detection to support edgeEmphasis (step 3)
 */
export function sampleImageToGrid(
  img: HTMLImageElement | HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number,
  config: AsciiConfig
): GridSampleData {
  const cellSize = Math.max(3, config.cellSize || 6);
  const cols = Math.ceil(targetWidth / cellSize);
  const rows = Math.ceil(targetHeight / cellSize);

  // Use an offscreen canvas to scale image with 'object-fit: cover' logic
  const offCanvas = document.createElement("canvas");
  offCanvas.width = cols;
  offCanvas.height = rows;
  const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });

  if (!offCtx) {
    return { cols, rows, cellSize, cells: [], width: targetWidth, height: targetHeight };
  }

  // Calculate cover coordinates
  const imgW = img.width || targetWidth;
  const imgH = img.height || targetHeight;
  const targetAspect = targetWidth / targetHeight;
  const imgAspect = imgW / imgH;

  let sx = 0;
  let sy = 0;
  let sWidth = imgW;
  let sHeight = imgH;

  if (imgAspect > targetAspect) {
    sWidth = imgH * targetAspect;
    sx = (imgW - sWidth) / 2;
  } else {
    sHeight = imgW / targetAspect;
    sy = (imgH - sHeight) / 2;
  }

  offCtx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, cols, rows);
  const imgData = offCtx.getImageData(0, 0, cols, rows);
  const data = imgData.data;

  const tintRgb = parseColor(config.tint || "#00ff66");
  const ramp = DENSITY_RAMP;
  const rampLen = ramp.length;

  // First pass: extract color, luminance, and apply color adjustments
  const tempLums = new Float32Array(cols * rows);
  const tempColors: Array<[number, number, number]> = new Array(cols * rows);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const idx = (y * cols + x) * 4;
      const rawR = data[idx];
      const rawG = data[idx + 1];
      const rawB = data[idx + 2];

      const [adjR, adjG, adjB] = adjustColor(rawR, rawG, rawB, config, tintRgb);
      const lum = 0.299 * adjR + 0.587 * adjG + 0.114 * adjB;

      const cellIdx = y * cols + x;
      tempLums[cellIdx] = lum;
      tempColors[cellIdx] = [adjR, adjG, adjB];
    }
  }

  // Second pass: Sobel edge detection & ramp index assignment
  const cells: CellSample[] = new Array(cols * rows);
  const edgeFactor = (config.edgeEmphasis || 40) / 100;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cellIdx = y * cols + x;
      const lum = tempLums[cellIdx];
      const [r, g, b] = tempColors[cellIdx];

      // Horizontal & vertical gradients for edge emphasis
      const left = tempLums[y * cols + Math.max(0, x - 1)];
      const right = tempLums[y * cols + Math.min(cols - 1, x + 1)];
      const top = tempLums[Math.max(0, y - 1) * cols + x];
      const bottom = tempLums[Math.min(rows - 1, y + 1) * cols + x];

      const dx = Math.abs(right - left);
      const dy = Math.abs(bottom - top);
      const edge = Math.min(255, Math.hypot(dx, dy));

      // Boost luminance or character selection by edge emphasis
      let effLum = lum + edge * edgeFactor * 0.75;
      effLum = Math.max(0, Math.min(255, effLum));

      let norm = effLum / 255;
      if (config.invert) {
        norm = 1 - norm;
      }

      // Map to character density ramp
      let charIndex = Math.floor(norm * (rampLen - 1));
      charIndex = Math.max(0, Math.min(rampLen - 1, charIndex));

      cells[cellIdx] = {
        r,
        g,
        b,
        lum: effLum,
        edge,
        charIndex,
      };
    }
  }

  return {
    cols,
    rows,
    cellSize,
    cells,
    width: targetWidth,
    height: targetHeight,
  };
}

/**
 * Render Pipeline Step 1 - 8:
 * Executes the full Canvas2D rasterizer
 */
export function renderAsciiFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  grid: GridSampleData,
  config: AsciiConfig,
  timeMs: number,
  options?: {
    sourceImg?: HTMLImageElement | null;
    wipeProgress?: number; // 0 to 1 for sweep construction
    isConstructing?: boolean;
  }
): void {
  const { cols, rows, cellSize, cells } = grid;
  if (!cols || !rows || cells.length === 0) return;

  const wipeProgress = options?.wipeProgress ?? 1;
  const pfx = config.pfx || {};

  // 1. Background drawing
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  if (config.bgMode === "solid") {
    const bgOpacity = (config.bgOpacity ?? 90) / 100;
    ctx.fillStyle = `rgba(5, 8, 7, ${bgOpacity})`;
    ctx.fillRect(0, 0, width, height);
  } else if (config.bgMode === "blur" && options?.sourceImg) {
    ctx.filter = `blur(${config.bgBlur || 12}px)`;
    ctx.drawImage(options.sourceImg, 0, 0, width, height);
    ctx.filter = "none";
    ctx.fillStyle = `rgba(5, 8, 7, ${(config.bgOpacity || 90) / 100})`;
    ctx.fillRect(0, 0, width, height);
  } else if (config.bgMode === "photo" && options?.sourceImg) {
    ctx.drawImage(options.sourceImg, 0, 0, width, height);
  }

  // 2. Setup text rendering
  ctx.font = `600 ${cellSize}px "JetBrains Mono", "SF Mono", "Courier New", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Bloom setup (step 5)
  const bloomEnabled = Boolean(pfx.bloom?.enabled);
  const bloomIntensity = (pfx.bloom?.intensity ?? 25) / 100;
  if (bloomEnabled) {
    ctx.shadowColor = config.tint || "rgba(148, 163, 184, 0.4)";
    ctx.shadowBlur = bloomIntensity * 4;
  }

  const animIntensity = (config.animIntensity?.intensity ?? 60) / 100;
  const ramp = DENSITY_RAMP;
  const matrixChars = MATRIX_CODE_CHARS;
  const isBinary = config.charSet === "binary" || config.customChars === "01";

  // 3. Grid Drawing
  // Construct wipe limit (if wiping vertically)
  const maxWipeRow = Math.ceil(rows * wipeProgress);

  for (let y = 0; y < rows; y++) {
    if (wipeProgress < 1 && y > maxWipeRow) continue;

    const cellY = y * cellSize + cellSize / 2;

    for (let x = 0; x < cols; x++) {
      const cellIdx = y * cols + x;
      const cell = cells[cellIdx];
      if (!cell) continue;

      const cellX = x * cellSize + cellSize / 2;

      // Coverage check
      if (config.coverage < 100) {
        const hash = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        if ((Math.abs(hash) % 1) * 100 > config.coverage) continue;
      }

      let displayChar = ramp[cell.charIndex] || " ";
      let cellR = cell.r;
      let cellG = cell.g;
      let cellB = cell.b;

      if (isBinary) {
        if (cell.lum < 24) {
          displayChar = " ";
        } else {
          // Binary 0 or 1
          displayChar = (x * 17 + y * 31) % 2 === 0 ? "1" : "0";

          // Gray color calibration
          const lumNorm = Math.min(1, Math.max(0.2, cell.lum / 210));
          cellR = Math.round(148 * lumNorm);
          cellG = Math.round(163 * lumNorm);
          cellB = Math.round(184 * lumNorm);

          if (cell.lum > 175) {
            cellR = Math.min(235, cellR + 45);
            cellG = Math.min(242, cellG + 45);
            cellB = Math.min(255, cellB + 45);
          }
        }
      }

      // Animation flicker calculation (Step 8)
      if (config.animated && config.animStyle === "flicker" && displayChar.trim()) {
        const flickerSeed = Math.sin(x * 37.1 + y * 91.7 + Math.floor(timeMs / 50)) * 10000;
        const rand = Math.abs(flickerSeed) % 1;

        if (isBinary) {
          if (rand < 0.16 * animIntensity) {
            // Flip binary bit 0 <-> 1
            displayChar = displayChar === "1" ? "0" : "1";
            cellR = Math.min(255, cellR + 30);
            cellG = Math.min(255, cellG + 30);
            cellB = Math.min(255, cellB + 30);
          }
        } else {
          if (rand < 0.12 * animIntensity) {
            const altIdx = Math.floor(rand * matrixChars.length * 7) % matrixChars.length;
            displayChar = matrixChars[altIdx];
            cellR = Math.min(255, cellR + 40);
            cellG = Math.min(255, cellG + 55);
            cellB = Math.min(255, cellB + 40);
          } else if (rand < 0.22 * animIntensity) {
            const dim = 1 - 0.25 * animIntensity;
            cellR *= dim;
            cellG *= dim;
            cellB *= dim;
          }
        }
      }

      // Render mode selection
      switch (config.renderMode) {
        case "dots": {
          const radius = (cellSize / 2) * (cell.lum / 255);
          ctx.fillStyle = `rgb(${cellR}, ${cellG}, ${cellB})`;
          ctx.beginPath();
          ctx.arc(cellX, cellY, Math.max(1, radius), 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        case "pixel":
        case "mosaic": {
          ctx.fillStyle = `rgb(${cellR}, ${cellG}, ${cellB})`;
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
          break;
        }
        case "cross": {
          ctx.strokeStyle = `rgb(${cellR}, ${cellG}, ${cellB})`;
          ctx.lineWidth = 1;
          const len = (cellSize / 2) * (cell.lum / 255);
          ctx.beginPath();
          ctx.moveTo(cellX - len, cellY);
          ctx.lineTo(cellX + len, cellY);
          ctx.moveTo(cellX, cellY - len);
          ctx.lineTo(cellX, cellY + len);
          ctx.stroke();
          break;
        }
        case "diamond": {
          ctx.fillStyle = `rgb(${cellR}, ${cellG}, ${cellB})`;
          const r = (cellSize / 2) * (cell.lum / 255);
          ctx.beginPath();
          ctx.moveTo(cellX, cellY - r);
          ctx.lineTo(cellX + r, cellY);
          ctx.lineTo(cellX, cellY + r);
          ctx.lineTo(cellX - r, cellY);
          ctx.closePath();
          ctx.fill();
          break;
        }
        case "braille": {
          const brailleBase = 0x2800;
          const brailleCode = brailleBase + Math.floor((cell.lum / 255) * 255);
          ctx.fillStyle = `rgb(${cellR}, ${cellG}, ${cellB})`;
          ctx.fillText(String.fromCharCode(brailleCode), cellX, cellY);
          break;
        }
        case "halfblocks": {
          ctx.fillStyle = `rgb(${cellR}, ${cellG}, ${cellB})`;
          ctx.fillText(cell.lum > 128 ? "▀" : "▄", cellX, cellY);
          break;
        }
        case "hexdump": {
          const hex = Math.floor(cell.lum / 16).toString(16).toUpperCase();
          ctx.fillStyle = `rgb(${cellR}, ${cellG}, ${cellB})`;
          ctx.fillText(hex, cellX, cellY);
          break;
        }
        case "matrix": {
          const char = matrixChars[(x * 7 + y + Math.floor(timeMs / 90)) % matrixChars.length];
          ctx.fillStyle = `rgb(${cellR}, ${cellG}, ${cellB})`;
          ctx.fillText(char, cellX, cellY);
          break;
        }
        case "characters":
        default: {
          if (displayChar.trim()) {
            ctx.fillStyle = `rgb(${cellR}, ${cellG}, ${cellB})`;
            ctx.fillText(displayChar, cellX, cellY);
          }
          break;
        }
      }
    }
  }

  ctx.restore();

  // 5. Post-Effects (PFX)
  // Chromatic Aberration
  if (pfx.chromatic?.enabled) {
    const chromIntensity = (pfx.chromatic.intensity / 100) * 2.5;
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.25;
    // Red shifted left
    ctx.fillStyle = "rgba(255, 0, 50, 0.4)";
    ctx.drawImage(ctx.canvas, -chromIntensity, 0);
    // Cyan/Green shifted right
    ctx.fillStyle = "rgba(0, 255, 180, 0.4)";
    ctx.drawImage(ctx.canvas, chromIntensity, 0);
    ctx.restore();
  }

  // Scanlines (Step 5)
  if (pfx.scanLines?.enabled) {
    const scanAlpha = (pfx.scanLines.intensity / 100) * 0.35;
    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${scanAlpha})`;
    for (let y = 0; y < height; y += 3) {
      ctx.fillRect(0, y, width, 1.2);
    }
    ctx.restore();
  }

  // Glitch horizontal slicing (Step 5)
  if (pfx.glitch?.enabled) {
    const glitchIntensity = pfx.glitch.intensity / 100;
    // Occasional horizontal glitch slices
    const glitchChance = 0.28 * glitchIntensity;
    if (Math.sin(timeMs / 140) > 1 - glitchChance) {
      ctx.save();
      const numSlices = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < numSlices; i++) {
        const sliceY = Math.random() * (height - 30);
        const sliceH = 4 + Math.random() * 12;
        const sliceOffset = (Math.random() - 0.5) * 14 * glitchIntensity;
        ctx.drawImage(
          ctx.canvas,
          0,
          sliceY,
          width,
          sliceH,
          sliceOffset,
          sliceY,
          width,
          sliceH
        );
      }
      ctx.restore();
    }
  }

  // Film Grain (Step 5)
  if (pfx.filmGrain?.enabled) {
    const grainAlpha = (pfx.filmGrain.intensity / 100) * 0.12;
    ctx.save();
    ctx.fillStyle = `rgba(255, 255, 255, ${grainAlpha.toFixed(3)})`;
    const count = Math.floor((width * height) / 160);
    for (let i = 0; i < count; i++) {
      const gx = Math.random() * width;
      const gy = Math.random() * height;
      ctx.fillRect(gx, gy, 1, 1);
    }
    ctx.restore();
  }

  // Vignette (Step 5)
  if (pfx.vignette?.enabled) {
    const vigIntensity = (pfx.vignette.intensity / 100) * 0.85;
    ctx.save();
    const radius = Math.hypot(width, height) / 2;
    const grad = ctx.createRadialGradient(
      width / 2,
      height / 2,
      radius * 0.4,
      width / 2,
      height / 2,
      radius
    );
    grad.addColorStop(0, "rgba(0, 0, 0, 0)");
    grad.addColorStop(1, `rgba(0, 0, 0, ${vigIntensity})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
}
