import options from "./options.js";
import utilities, { position, display, container } from "./utilities.js";
import color from "./color.js";

import {
  dark,
  responsive,
  hover,
  focus,
  active,
  groupHover,
  groupFocus,
  disabled,
  checked,
} from "./variants";

const getFns = (config) => [
  position,
  display,
  container(config),
  ...color(config),
  ...utilities(config),
];

// TODO: user-defined variants
const getVariants = config => ({
  ...Object.fromEntries(
    Object.keys(config.theme.screens).map(i => [i, responsive(config.theme.screens[i])])
  ),
  dark,
  hover,
  focus,
  active,
  disabled,
  checked,
  "group-hover": groupHover,
  "group-focus": groupFocus,
});

function parseVariant(className, css, variants, sanitize) {
  const vars = className
    .split(':')
    .filter(a => variants[a])
    .sort((a, b) => Object.keys(variants).indexOf(b) - Object.keys(variants).indexOf(a));

  const selector = vars.reduce((acc, cur) => variants[cur](acc), sanitize('.' + className)); // TODO: mind the "."

  if (selector.includes('##style##')) return selector.replace('##style##', css);

  return `${selector} { ${css} }`;
}

export const hasVariant = s => /([^:]+:)+[^:]+(::)?[^:]+/.test(s);

// TODO: refactor for more flexible output
export default function getParse(config) {
  const fns = getFns(config);
  const variants = getVariants(config);

  function escape(s) {
    return s.replace(new RegExp(`(${Object.keys(variants).join('|')}):`, 'g'), '$1\\:');
  }

  function sanitize(name) {
    name = name.replace('/', '\\/');

    if (name.includes("placeholder-")) {
      name = escape(name) + "::placeholder";
    } else if (name.includes('space-') || /divide-(?!opacity)/.test(name)) {
      name = escape(name) + " > * + *";
    } else {
      name = escape(name);
    }

    return name;
  }

  return (className, onlyStyles = false) => {
    const classNameNoVariant = className.split(":").pop();
    let css = options[classNameNoVariant] || fns.reduce((acc, cur) => acc || cur(classNameNoVariant), "");

    if (!css) return false;

    if (!css.wrap && !css.endsWith(";")) css += ";";

    if (hasVariant(className)) {
      return parseVariant(className, css, variants, sanitize);
    }

    if (css.wrap) return css.wrap(sanitize(className));

    if (onlyStyles) return css;

    return `.${sanitize(className)} { ${css} }`;
  }
}
