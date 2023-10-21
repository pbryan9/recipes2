import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type HSL = { h: number; s: number; l: number };

export function hexToHsl(hexValue: string): HSL {
  const r = parseInt(hexValue.substring(1, 3), 16) / 255;
  const g = parseInt(hexValue.substring(3, 5), 16) / 255;
  const b = parseInt(hexValue.substring(5), 16) / 255;

  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);

  const lightness = (min + max) / 2;

  let chroma = max - min;

  let saturation;

  if (lightness === 0 || lightness === 1) {
    saturation = 0;
  } else {
    saturation = chroma / (1 - Math.abs(2 * max - chroma - 1));
  }

  let hue;

  if (max === min) {
    hue = 0;
  } else if (max === r) {
    hue = 60 * (((g - b) / chroma) % 6);
  } else if (max === g) {
    hue = 60 * ((b - r) / chroma + 2);
  } else {
    hue = 60 * ((r - g) / chroma + 4);
  }

  return { h: hue, s: saturation, l: lightness };
}

export function hslToHex({ h, s, l }: HSL) {
  let chroma = (1 - Math.abs(2 * l - 1)) * s;

  let hPrime = h / 60;

  let x = chroma * (1 - Math.abs((hPrime % 2) - 1));

  let baseR;
  let baseG;
  let baseB;

  switch (true) {
    case hPrime < 1:
      [baseR, baseG, baseB] = [chroma, x, 0];
      break;
    case hPrime < 2:
      [baseR, baseG, baseB] = [x, chroma, 0];
      break;
    case hPrime < 3:
      [baseR, baseG, baseB] = [0, chroma, x];
      break;
    case hPrime < 4:
      [baseR, baseG, baseB] = [0, x, chroma];
      break;
    case hPrime < 5:
      [baseR, baseG, baseB] = [x, 0, chroma];
      break;
    case hPrime < 6:
      [baseR, baseG, baseB] = [chroma, 0, x];
      break;
    default:
      throw new Error(`hPrime was somehow ${hPrime}`);
  }

  let m = l - chroma / 2;

  let [r, g, b] = [
    Math.round((baseR + m) * 255).toString(16),
    Math.round((baseG + m) * 255).toString(16),
    Math.round((baseB + m) * 255).toString(16),
  ];

  return '#' + r + g + b;
}

export function hexToRgb(hexCode: string) {
  let r = parseInt(hexCode.substring(1, 3), 16);
  let g = parseInt(hexCode.substring(3, 5), 16);
  let b = parseInt(hexCode.substring(5), 16);

  return { r, g, b };
}

export function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  function convertToHex(dec: number) {
    return ('00' + dec.toString(16)).slice(-2);
  }

  let rVal = convertToHex(r);
  let gVal = convertToHex(g);
  let bVal = convertToHex(b);

  return '#' + rVal + gVal + bVal;
}

export function calculateLabelColor(hexCode: string) {
  const rgb = hexToRgb(hexCode);

  const { r, g, b } = rgb;

  let pLuminance = 0.299 * (r / 255) + 0.587 * (g / 255) + 0.114 * (b / 255);

  let res: string;

  if (pLuminance > 0.5) res = '#000000';
  else res = '#ffffff';

  return res;
}
