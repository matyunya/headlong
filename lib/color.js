import { theme } from "./selector";

const singles = ["current", "transparent", "white", "black"];

const toRgb = hex => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16)
].join(',');

const props = [
  ["placeholder", "placeholderColor", color => `--tw-placeholder-opacity: 1; color: rgba(${color}, var(--tw-placeholder-opacity));`],
  ["text", "textColor", color => `--tw-text-opacity: 1; color: rgba(${color}, var(--tw-text-opacity));`],
  ["bg", "backgroundColor", color => `--tw-bg-opacity: 1; background-color: rgba(${color}, var(--tw-bg-opacity));`],
  ["border", "borderColor", color => `--tw-border-opacity: 1; border-color: rgba(${color}, var(--tw-border-opacity));`],
  ["divide", "divideColor", color => `--tw-divide-opacity: 1; border-color: rgba(${color}, var(--tw-divide-opacity));`],
  ["ring", "ringColor", color => `--tw-ring-opacity: 1; --tw-ring-color: rgba(${color}, var(--tw-ring-opacity));`],
  ["ring-offset", "ringOffsetColor", (_, hex) => `--tw-ring-offset-color: ${hex}; box-shadow: 0 0 0 var(--ring-offset-width) var(--ring-offset-color), var(--ring-shadow);`],
  ["from", "gradientColorStops", (color, hex) => `--tw-gradient-from: ${hex}; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(${color}, 0));`],
  ["via", "gradientColorStops", (color, hex) => `--tw-gradient-stops: var(--tw-gradient-from), ${hex}, var(--tw-gradient-to, rgba(${color}, 0));`],
  ["to", "gradientColorStops", (_, hex) => `--tw-gradient-to: ${hex};`],
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

export default config => {
  console.log(
    props.map(([,key]) => [key, config.theme[key]])
  );

  const regexes = props.reduce((acc, [alias, key]) => ({
    ...acc,
    [alias]: new RegExp("^" + alias + "-(" + Object.keys(config.theme[key](theme)).map(kebabize).join('|') + ")-(\\d00?)$"),
  }), {});

  return props.map(([alias, key, getStyle]) => name => {
    const single = singles.find(s => `${alias}-${s}` === name);
    const palette = config.theme[key](theme);

    if (single) {
      return typeof mainCssProps[alias] === "string"
        ? `${mainCssProps[alias]}: ${palette[single]}`
        : mainCssProps[alias](palette[single]);
    }

    let [, color, variant] = name.match(regexes[alias]) || [];

    color = color && color.includes('-') ? camelize(color) : color;

    if (!color || !palette[color]) return;

    return getStyle(toRgb(palette[color][variant]), palette[color][variant]);
  });
}
