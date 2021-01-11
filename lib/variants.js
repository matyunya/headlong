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
export const responsive = rule => (className, style) => ` @media ${responsiveRuleString(rule)} {
  .${className} { ${style} }
}`;

export const dark = (className, style) => `.mode-dark .${className} { ${style} }`;

export const hover = (className, style) => `.${className}:hover { ${style} }`;

export const focus = (className, style) => `.${className}:focus { ${style} }`;

export const active = (className, style) => `.${className}:active { ${style} }`;

export const groupHover = (className, style) => `.group:hover .${className} { ${style} }`;

export const groupFocus = (className, style) => `.group:focus .${className} { ${style} }`;

export const disabled = (className, style) => `.${className}[disabled] { ${style} }`;
