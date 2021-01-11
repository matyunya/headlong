import getConfig from "./lib/config.js";
import getParser from "./lib/parser.js";
import keyframes from "./lib/keyframes.js";
import { preflight, variables } from "./lib/styles.js";
import { theme } from "./lib/selector.js";

const onObserve = (process, filterClasses, appendStyle, appendStyleMedia) => mutations => {
  let styles = [...new Set(
    mutations
      .filter(t => t.type === 'attributes')
      .map(i => (i.target.classList.value || "").split(' '))
      .flat()
      .filter(filterClasses)
  )]
    .map(process)
    .filter(Boolean);

  styles = [...styles, [...new Set(
    mutations
      .filter(f => f.type === 'childList' && f.addedNodes.length && f.addedNodes[0].classList) // only works on a single node
      .map(i => (i.addedNodes[0].classList.value || "").split(' ')).flat().filter(filterClasses))
  ]
    .map(process)
    .filter(Boolean)];

  appendStyle(styles.filter(s => !s.includes('@media')).join('\n'));
  appendStyleMedia(styles.filter(s => s.includes('@media')).join('\n'));
}

const getInitialClasses = (process, filterClasses) => [...new Set(
  [...document.querySelectorAll("*")]
    .map(i => i.classList.value.split(' '))
    .flat()
)]
  .filter(filterClasses)
  .map(process)
  .filter(Boolean);

const observeClasses = (observer, container) => observer.observe(
  container,
  {
    subtree: true,
    attributes: true,
    childList: true,
  }
);

function mergeUserConfig(config, userConfig) {
  if (!userConfig || !userConfig.theme) return config;

  const configTheme = theme(config.theme);

  if (userConfig.theme.extend) {
    for (key in userConfig.theme.extend) {
      config.theme[key] = typeof config.theme[key] === 'function'
        ? {
        ...config.theme[key](configTheme),
        ...userConfig.theme.extend[key],
      } : {
        ...config.theme[key],
        ...userConfig.theme.extend[key],
      };
    }
  }

  return {
    ...config,
    theme: Object.keys(config.theme).reduce((acc, cur) => ({
      ...acc,
      [cur]: userConfig.theme[cur] || config.theme[cur]
    }), {})
  };
}

function appendCssToEl(css, el) {
  if (el.styleSheet) {
    el.styleSheet.cssText = css;
  } else {
    el.appendChild(document.createTextNode(css));
  }
  document.head.appendChild(el);
}

export function init(userConfig, container = document.querySelector('body')) {
  const s = document.createElement('style');
  s.setAttribute('type', 'text/css');

  const med = document.createElement('style');
  med.setAttribute('type', 'text/css');

  function appendStyleMedia(css) {
    appendCssToEl(css, med);
  }

  function appendStyle(css) {
    appendCssToEl(css, s);
  }

  const classes = new Set();
  const filterClasses = i => Boolean(i) && !i.startsWith('svelte-') && !classes.has(i);

  const configMerged = mergeUserConfig(getConfig(), userConfig);
  const parse = getParser(configMerged);

  const process = c => {
    const css = parse(c);
    if (css) classes.add(c);
    return css;
  }

  const classObserver = new MutationObserver(onObserve(process, filterClasses, appendStyle, appendStyleMedia));

  observeClasses(classObserver, container);
  const initialStyles = getInitialClasses(process, filterClasses);

  appendStyle(preflight + variables(configMerged) + initialStyles.filter(s => !s.includes('@media')).join('\n') + keyframes);
  appendStyleMedia(initialStyles.filter(s => s.includes('@media')).join('\n'));

  return {
    unsubscribe: () => classObserver.disconnect(),
    parse,
    config: configMerged,
  };
}

export default init;
