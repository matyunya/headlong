// TODO: print and other media
function responsiveRuleString(rule) {
  if (typeof rule === 'string') {
    return `(min-width: ${rule})`;
  }

  if (Array.isArray(rule)) {
    return rule.map(responsiveRule).join(',');
  }

  const rules = [];
  if (rule.max) {
    rules.push(`(max-width: ${rule.max})`);
  }
  if (rules.min) {
    rules.push(`(min-width: ${rule.max})`);
  }

  return rules.join('and');
}

const stylePlaceholder = `{ ##style## }`;
export const responsive = rule => (selector, css) => ` @media ${responsiveRuleString(rule)} {
  ${selector} ${css ? `{ ${css} }` : stylePlaceholder}
}`;

// TODO: append dot to className before passing here
export const dark = (selector) => `.mode-dark ${selector}`;

export const hover = (selector) => `${selector}:hover`;

export const focus = (selector) => `${selector}:focus`;

export const active = (selector) => `${selector}:active`;

export const checked = (selector) => `${selector}:checked`;

export const groupHover = (selector) => `.group:hover ${selector}`;

export const groupFocus = (selector) => `.group:focus ${selector}`;

export const disabled = (selector) => `${selector}[disabled]`;
