import getConfig from "./lib/config.js";
import getParser from "./lib/parser.js";
import keyframes from "./lib/keyframes.js";
import { preflight, variables } from "./lib/styles.js";
import { theme } from "./lib/selector.js";

const onObserve = (process, appendStyle, filterClasses) => mutations => {
  let styles = [...new Set(
    mutations
      .filter(t => t.type === 'attributes')
      .map(i => (i.target.classList.value || "").split(' '))
      .flat()
      .filter(filterClasses)
  )]
    .map(process)
    .filter(Boolean)
    .join('\n');

  styles += [...new Set(
    mutations
      .filter(f => f.type === 'childList' && f.addedNodes.length && f.addedNodes[0].classList) // only works on a single node
      .map(i => (i.addedNodes[0].classList.value || "").split(' ')).flat().filter(filterClasses))
  ]
    .map(process)
    .filter(Boolean)
    .join('\n');

  appendStyle(styles);
}

const getInitialClasses = (process, filterClasses) => [...new Set(
  [...document.querySelectorAll("*")]
    .map(i => i.classList.value.split(' '))
    .flat()
)]
  .filter(filterClasses)
  .map(process)
  .filter(Boolean)
  .join('\n');

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

const s = document.createElement('style');
s.setAttribute('type', 'text/css');

function appendStyle(css) {
  if (!css) return;

  if (s.styleSheet) {
    s.styleSheet.cssText = css;
  } else {
    s.appendChild(document.createTextNode(css));
  }
  document.head.appendChild(s);
}

export function init(userConfig, container = document.querySelector('body')) {
  const classes = new Set();
  const filterClasses = i => Boolean(i) && !i.startsWith('svelte-') && !classes.has(i);

  const configMerged = mergeUserConfig(getConfig(), userConfig);
  const parse = getParser(configMerged);

  const process = c => {
    const css = parse(c);
    if (css) classes.add(c);
    return css;
  }

  const classObserver = new MutationObserver(onObserve(process, appendStyle, filterClasses));

  observeClasses(classObserver, container);
  const initialStyles = getInitialClasses(process, filterClasses);

  appendStyle(preflight + variables(configMerged) + initialStyles + keyframes);

  return {
    unsubscribe: () => classObserver.disconnect(),
    parse,
    config: configMerged,
  };
}

export default init;
