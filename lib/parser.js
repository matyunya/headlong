import options from "./options.js";
import simple, { position, display } from "./simple.js";
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
} from "./variants";

const getFns = (config) => [
  position,
  display,
  ...color(config),
  ...simple(config),
];

const getVariants = config => ({
  ...Object.fromEntries(
    Object.keys(config.theme.screens).map(i => [i, responsive(config.theme.screens[i])])
  ),
  dark,
  hover,
  focus,
  active,
  disabled,
  "group-hover": groupHover,
  "group-focus": groupFocus,
});

// dark:sm:bg-red-500 should produce
// @media screen(max-size: 640px) {
//   .mode-dark .dark\:sm\:bg-red-500 {
//     background-color: red;
// }
//}

// dark:sm:hover:bg-red-500 should produce
// @media screen(max-size: 640px) {
//   .mode-dark .dark\:sm\:hover\:bg-red-500:hover {
//     background-color: red;
// }
//}

// so there is order
function parseVariant(className, css, variants) {
  const vars = className
    .split(':')
    .filter(a => variants[a])
    .sort((a, b) => Object.keys(variants).indexOf(b) - Object.keys(variants).indexOf(a));

  return vars.reduce((acc, cur) => variants[cur](process(className), acc, cur), css); // broken
}

// escape
const e = c => c.replace(':', '\\:');

// TODO: refactor out
function process(name) {
  name = name.replace('/', '\\/');

  if (name.includes("placeholder-")) {
    name = e(name) + "::placeholder";
  } else if (name.includes('space-') || /divide-(?!opacity)/.test(name)) {
    name = e(name) + " > * + *";
  } else {
    name = e(name);
  }

  return name;
}

const hasVariant = s => /([^:]+:)+[^:]+(::)?[^:]+/.test(s);

export default function getParse(config) {
  const fns = getFns(config);
  const variants = getVariants(config);

  return className => {
    const classNameNoVariant = className.split(":").pop();
    const css = options[classNameNoVariant] || fns.reduce((acc, cur) => acc || cur(classNameNoVariant), "");

    if (!css) return false;

    return hasVariant(className)
      ? parseVariant(className, css, variants)
      : `.${process(className)} { ${css} }`;
  }
}
