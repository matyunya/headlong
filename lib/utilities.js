import { simpleMatch } from "./selector.js";
import keyframes from "./keyframes.js";
import { responsive } from "./variants.js";

export default ({ theme }) => [
  ["text", (i, o) => `font-size: ${o[i][0]}; line-height:  ${o[i][1].lineHeight};`, theme.fontSize],
  ["ring", (i, o) => `--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(${o[i]} + var(--tw-ring-offset-width)) var(--tw-ring-color);`, theme.ringWidth, `box-shadow: var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 transparent);`],
  ["w", "width", theme.width],
  ["h", "height", theme.height],
  ["max-w", "max-width", theme.maxWidth],
  ["max-h", "max-height", theme.maxHeight],
  ["min-w", "min-width", theme.minWidth],
  ["min-h", "min-height", theme.minHeight],
  ["opacity", "opacity", theme.opacity],
  ["outline", "outline", theme.outline],
  ["leading", "line-height", theme.lineHeight],
  ["cursor", "cursor", theme.cursor],
  ["tracking", "letter-spacing", theme.letterSpacing],
  ["font", "font-weight", theme.fontWeight],
  ["z", "z-index", theme.zIndex],
  ["stroke", "stroke-width", theme.strokeWidth],
  ["grid-cols", "grid-template-columns", theme.gridTemplateColumns],
  ["grid-rows", "grid-template-rows", theme.gridTemplateRows],
  ["col", "grid-column", theme.gridColumn],
  ["col-start", "grid-column-start", theme.gridColumnEnd],
  ["col-end", "grid-column-end", theme.gridColumnStart],
  ["row", "grid-row", theme.gridRow],
  ["row-start", "grid-row-start", theme.gridRowEnd],
  ["row-end", "grid-row-end", theme.gridRowStart],
  ["auto-cols", "grid-auto-cols", theme.gridAutoColumns],
  ["auto-rows", "grid-auto-rows", theme.gridAutoRows],
  ["gap", "gap", theme.gap],
  ["gap-x", "column-gap", theme.gap],
  ["gap-y", "row-gap", theme.gap],
  ["shadow", "--tw-shadow", theme.boxShadow, "box-shadow: var(--tw-ring-offset-shadow,0 0 transparent),var(--tw-ring-shadow,0 0 transparent),var(--tw-shadow);"],
  ["list", "list-style-type", theme.listStyleType],
  ["placeholder-opacity", "--tw-placeholder-opacity", theme.placeholderOpacity],
  ["text-opacity", "--tw-text-opacity", theme.textOpacity],
  ["bg-opacity", "--tw-bg-opacity", theme.backgroundOpacity],
  ["border-opacity", "--tw-border-opacity", theme.borderOpacity],
  ["divide-opacity", "--tw-divide-opacity", theme.divideOpacity],
  ["ring-opacity", "--tw-ring-opacity", theme.ringOpacity],
  ["rotate", "--tw-rotate", theme.rotate],
  ["translate-x", "--tw-translate-x", theme.translate],
  ["translate-y", "--tw-translate-y", theme.translate],
  ["skew-x", "--tw-skew-x", theme.skew],
  ["skew-y", "--tw-skew-y", theme.skew],
  ["scale-x", "--tw-scale-x", theme.scale],
  ["scale-y", "--tw-scale-y", theme.scale],
  ["scale", (i, o) => `--tw-scale-x: ${o[i]}; --tw-scale-y: ${o[i]};`, theme.scale],
  ["duration", "transition-duration", theme.transitionDuration],
  ["ease", "transition-timing-function", theme.transitionTimingFunction],
  ["delay", "transition-delay", theme.transitionDelay],
  ["ring-offset", "--tw-ring-offset-width", theme.ringOffsetWidth, "box-shadow: 0 0 0 var(--ring-offset-width) var(--ring-offset-color), var(--ring-theme.)"],
  ["rounded", "border-radius", theme.borderRadius],
  ["rounded-t", (i, o) => `border-top-left-radius: ${o[i]}; border-top-right-radius: ${o[i]};`, theme.borderRadius],
  ["rounded-r", (i, o) => `border-top-right-radius: ${o[i]}; border-bottom-right-radius: ${o[i]};`, theme.borderRadius],
  ["rounded-b", (i, o) => `border-bottom-right-radius: ${o[i]}; border-bottom-left-radius: ${o[i]};`, theme.borderRadius],
  ["rounded-l", (i, o) => `border-top-left-radius: ${o[i]}; border-bottom-left-radius: ${o[i]};`, theme.borderRadius],
  ["rounded-tl", "border-top-left-radius", theme.borderRadius],
  ["rounded-tr", "border-top-right-radius", theme.borderRadius],
  ["rounded-br", "border-bottom-right-radius", theme.borderRadius],
  ["rounded-bl", "border-top-left-radius", theme.borderRadius],
  ["border", "border-width", theme.borderWidth],
  ["border-t", "border-top-width", theme.borderWidth],
  ["border-b", "border-bottom-width", theme.borderWidth],
  ["border-l", "border-left-width", theme.borderWidth],
  ["border-r", "border-right-width", theme.borderWidth],
  ["m", "margin", theme.margin],
  ["ml", "margin-left", theme.margin],
  ["mr", "margin-right", theme.margin],
  ["mb", "margin-bottom", theme.margin],
  ["mt", "margin-top", theme.margin],
  ["my", (i, o) => `margin-top: ${o[i]}; margin-bottom: ${o[i]};`, theme.margin],
  ["mx", (i, o) => `margin-left: ${o[i]}; margin-right: ${o[i]};`, theme.margin],
  ["p", "padding", theme.padding],
  ["pl", "padding-left", theme.padding],
  ["pr", "padding-right", theme.padding],
  ["pb", "padding-bottom", theme.padding],
  ["pt", "padding-top", theme.padding],
  ["py", (i, o) => `padding-top: ${o[i]}; padding-bottom: ${o[i]};`, theme.padding],
  ["px", (i, o) => `padding-left: ${o[i]}; padding-right: ${o[i]};`, theme.padding],
  ["space-y", (i, o) => `--tw-space-y-reverse: 0; margin-top: calc(${o[i]} * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(${o[i]} * var(--tw-space-y-reverse));`, theme.space],
  ["space-x", (i, o) => `--tw-space-x-reverse: 0; margin-left: calc(${o[i]} * calc(1 - var(--tw-space-x-reverse))); margin-right: calc(${o[i]} * var(--tw-space-x-reverse));`, theme.space],
  ["divide-y", (i, o) => `--tw-divide-y-reverse: 0; border-top-width: calc(${o[i]} * calc(1 - var(--tw-divide-y-reverse)));
border-bottom-width: calc(${o[i]} * var(--tw-divide-y-reverse))`, theme.divideWidth],
  ["divide-x", (i, o) => `--tw-divide-x-reverse: 0; border-right-width: calc(${o[i]} * var(--tw-divide-x-reverse)); border-left-width: calc(${o[i]} * calc(1 - var(--tw-divide-x-reverse)));`, theme.divideWidth],
  ["animation", "animation", theme.animation],
].map(simpleMatch(theme));

export const position = (name) => [
  "static",
  "fixed",
  "absolute",
  "relative",
  "sticky",
].includes(name) ? `position: ${name}` : null;

export const display = (name) => [
  "block",
  "inline-block",
  "inline",
  "flex",
  "inline-flex",
  "table",
  "table-caption",
  "table-cell",
  "table-column",
  "table-column-group",
  "table-footer-group",
  "table-header-group",
  "table-row-group",
  "table-row",
  "flow-root",
  "grid",
  "inline-grid",
  "contents",
].includes(name) ? `display: ${name}` : null;


export function container({ theme }) {
  const { container, screens } = theme;

  const centered = container.center ? "margin: 0 auto" : "";
  const padded = size => container.padding && container.padding[size]
    ? "padding: 0 " + container.padding[size]
    : "";

  const contStyles = `.container { max-width: 100%; ${padded("DEFAULT")} }`
    + Object.keys(screens).reduce(
      (acc, size) => acc + responsive(screens[size])(".container").replace('##style##', `max-width: ${screens[size]}; ${padded(size)}`),
      "",
    );

  console.log({ contStyles });

  return name => name === 'container' ? { wrap: () => contStyles } : false;
}
