
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stylesCache = new Map();

export async function loadStyle(styleName) {
  // Return cached style if available
  if (stylesCache.has(styleName)) {
    return stylesCache.get(styleName);
  }

  try {
    const stylePath = path.join(__dirname, '..', 'styles', `${styleName}.md`);
    const styleContent = await fs.promises.readFile(stylePath, 'utf-8');
    
    // Cache the style content
    stylesCache.set(styleName, styleContent.trim());
    
    return styleContent.trim();
  } catch (error) {
    console.warn(`Style '${styleName}' not found:`, error.message);
    return '';
  }
}

export function clearStyleCache() {
  stylesCache.clear();
}
