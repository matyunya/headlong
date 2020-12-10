import colors from "./colors.js";

const singles = ["current", "transparent", "white", "black"];

const colorNames = Object.keys(colors);

const toRgb = hex => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16)
].join(',');

// TODO: respect config keys
const props = [
  ["placeholder", colors, color => `--tw-placeholder-opacity: 1; color: rgba(${color}, var(--tw-placeholder-opacity));`],
  ["text", colors, color => `--tw-text-opacity: 1; color: rgba(${color}, var(--tw-text-opacity));`],
  ["bg", colors, color => `--tw-bg-opacity: 1; background-color: rgba(${color}, var(--tw-bg-opacity));`],
  ["border", colors, color => `--tw-border-opacity: 1; border-color: rgba(${color}, var(--tw-border-opacity));`],
  ["divide", colors, color => `--tw-divide-opacity: 1; border-color: rgba(${color}, var(--tw-divide-opacity));`],
  ["ring", colors, color => `--tw-ring-opacity: 1; --tw-ring-color: rgba(${color}, var(--tw-ring-opacity));`],
  ["ring-offset", colors, (_, hex) => `--tw-ring-offset-color: ${hex}; box-shadow: 0 0 0 var(--ring-offset-width) var(--ring-offset-color), var(--ring-shadow);`],
  ["from", colors, (color, hex) => `--tw-gradient-from: ${hex}; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(${color}, 0));`],
  ["via", colors, (color, hex) => `--tw-gradient-stops: var(--tw-gradient-from), ${hex}, var(--tw-gradient-to, rgba(${color}, 0));`],
  ["to", colors, (_, hex) => `--tw-gradient-to: ${hex};`],
];

const camelize = s => s
  .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0
    ? word.toLowerCase()
    : word.toUpperCase()).replace(/\s+/g, '');

const kebabize = s => s.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

const mainCssProps = {
  placeholder: "color",
  text: "color",
  bg: "background-color",
  border: "border-color",
  divide: "border-color",
  ring: "--tw-ring-color",
  "ring-offset": i => `--tw-ring-offset-color: ${i}; box-shadow: 0 0 0 var(--ring-offset-width) var(--ring-offset-color), var(--ring-shadow);`
};

const regexes = props.reduce((acc, [alias]) => ({
  ...acc,
  [alias]: new RegExp("^" + alias + "-(" + colorNames.map(kebabize).join('|') + ")-(\\d00?)$"), // should use config keys instead of \\d00
}), {});

export default props.map(([alias, options, getStyle]) => name => {
  const single = singles.find(s => `${alias}-${s}` === name);

  if (single) {
    return typeof mainCssProps[alias] === "string"
      ? `${mainCssProps[alias]}: ${options[single]}`
      : mainCssProps[alias](options[single]);
  }

  let [, color, variant] = name.match(regexes[alias]) || [];

  color = color && color.includes('-') ? camelize(color) : color;

  if (!color || !options[color]) return;

  return getStyle(toRgb(options[color][variant]), options[color][variant]);
});
