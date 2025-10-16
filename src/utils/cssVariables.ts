/**
 * Utility functions for working with CSS variables
 */

import type { CSSVariable } from '@/types/colorEditor';

/**
 * Get all CSS variables from the document root
 */
export function getCSSVariables(): CSSVariable[] {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  const allProps = Array.from(computedStyle);
  
  const cssVars = allProps
    .filter(prop => prop.startsWith('--'))
    .map(name => {
      const value = computedStyle.getPropertyValue(name).trim();
      const category = getCategoryFromName(name);
      const displayName = formatDisplayName(name);
      
      return {
        name,
        value,
        displayName,
        category,
      };
    });
  
  return cssVars;
}

/**
 * Set a CSS variable on the document root
 */
export function setCSSVariable(name: string, value: string): void {
  document.documentElement.style.setProperty(name, value);
}

/**
 * Get a single CSS variable value
 */
export function getCSSVariable(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Reset a CSS variable to its original value
 */
export function resetCSSVariable(name: string): void {
  document.documentElement.style.removeProperty(name);
}

/**
 * Get category from CSS variable name
 */
function getCategoryFromName(name: string): string {
  if (name.includes('background')) return 'backgrounds';
  if (name.includes('foreground') || name.includes('text')) return 'text';
  if (name.includes('border')) return 'borders';
  if (name.includes('primary')) return 'primary';
  if (name.includes('secondary')) return 'secondary';
  if (name.includes('accent')) return 'accent';
  if (name.includes('destructive')) return 'destructive';
  if (name.includes('muted')) return 'muted';
  if (name.includes('card')) return 'card';
  if (name.includes('popover')) return 'popover';
  if (name.includes('input')) return 'input';
  if (name.includes('ring')) return 'ring';
  if (name.includes('radius')) return 'radius';
  if (name.includes('chart')) return 'charts';
  
  return 'other';
}

/**
 * Format CSS variable name for display
 */
function formatDisplayName(name: string): string {
  // Remove -- prefix and replace hyphens with spaces, capitalize words
  return name
    .replace(/^--/, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Export CSS variables to a CSS string
 */
export function exportCSSVariables(variables: CSSVariable[]): string {
  const lines = variables.map(v => `  ${v.name}: ${v.value};`);
  return `:root {\n${lines.join('\n')}\n}`;
}

/**
 * Parse CSS variables from a CSS string
 */
export function parseCSSVariables(css: string): CSSVariable[] {
  const variables: CSSVariable[] = [];
  const matches = css.matchAll(/--[\w-]+:\s*[^;]+;/g);
  
  for (const match of matches) {
    const [declaration] = match;
    const [name, value] = declaration.split(':').map(s => s.trim());
    
    variables.push({
      name,
      value: value.replace(';', ''),
      displayName: formatDisplayName(name),
      category: getCategoryFromName(name),
    });
  }
  
  return variables;
}
