import config from "./config.js";

const { screens } = config.theme;

export const responsive = (className, style, variant) => ` @media (max-width: ${screens[variant]}) {
  .${className} { ${style} }
}`;

export const dark = (className, style) => `.mode-dark .${className} { ${style} }`;

export const hover = (className, style) => `.${className}:hover { ${style} }`;

export const focus = (className, style) => `.${className}:focus { ${style} }`;

export const active = (className, style) => `.${className}:active { ${style} }`;

export const groupHover = (className, style) => `.group:hover .${className} { ${style} }`;

export const groupFocus = (className, style) => `.group:focus .${className} { ${style} }`;

export const disabled = (className, style) => `.${className}[disabled] { ${style} }`;
