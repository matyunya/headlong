export const list = (prop, options) => new RegExp("^"
  + prop
  + "-("
  + Object.keys(options).map(o => o.replace('.', '\\.'))
    .join('|')
  + ")$"
);

function defaultGetStyle(list, result, propName) {
  if (list[result] === undefined) return;

  return `${propName}: ${list[result]};`;
}

export const match = (name, regex, getStyle = defaultGetStyle, list, className) => {
  if (list && list.DEFAULT && name === className) {
    return typeof getStyle === "function"
      ? getStyle("DEFAULT", list)
      : defaultGetStyle(list, "DEFAULT", getStyle);
  }

  const [, result, ...rest] = name.match(regex) || [];

  if (result === undefined) return;

  if (typeof getStyle === "string") return defaultGetStyle(list, result, getStyle);

  return getStyle(result, list, rest);
}

const configUtils = {
  negative(scale) {
    return Object.keys(scale)
      .filter((key) => scale[key] !== '0')
      .reduce(
        (negativeScale, key) => ({
          ...negativeScale,
          [`-${key}`]: `calc(-${scale[key]})`, // find better way
        }),
        {}
      )
  },
  breakpoints(screens) {
    return Object.keys(screens)
      .filter((key) => typeof screens[key] === 'string')
      .reduce(
        (breakpoints, key) => ({
          ...breakpoints,
          [`screen-${key}`]: screens[key],
        }),
        {}
      )
  },
};

export const theme = configTheme => k => k.split('.').reduce((acc, cur) => acc[cur], configTheme);

export const simpleMatch = configTheme => ([className, cssProp, options, appendix]) =>
  name => {
    if (typeof options === 'function') options = options(theme(configTheme), configUtils);

    const res = match(name, list(className, options), cssProp, options, className);

    if (res === undefined) return;

    if (typeof appendix === 'function') appendix = appendix(name);

    return appendix ? res + appendix : res;
  }
