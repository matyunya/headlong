import config from "./lib/config.js";
import getParser from "./lib/parser.js";
import { preflight, variables } from "./lib/styles.js";

let parse = () => { };

const classes = new Set();

const s = document.createElement('style');
s.setAttribute('type', 'text/css');

export function appendStyle(css) {
  if (s.styleSheet) {
    s.styleSheet.cssText = css;
  } else {
    s.appendChild(document.createTextNode(css));
  }
  document.head.appendChild(s);
}

const filterClasses = i => Boolean(i) && !i.startsWith('svelte-') && !classes.has(i);

function process(c) {
  const css = parse(c);
  classes.add(c);

  return css;
}

const onObserve = mutations => {
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

const getInitialClasses = () => [...new Set(
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

// TODO:
// add container

function mergeUserConfig(config, userConfig) {
  //   if (userConfig.theme && userConfig.theme.extend) {
  //     for (key in userConfig.theme.extend) {
  //       config.theme[key] = typeof config.theme[key] === 'function'
  //         ?
  //     }
  //   }
  return {
    ...config,
    ...userConfig,
  };
}

export function init(container = document.querySelector('body'), userConfig = {}) {
  const classObserver = new MutationObserver(onObserve);
  const configMerged = mergeUserConfig(config, userConfig);
  parse = getParser(configMerged);

  observeClasses(classObserver, container);
  const initialStyles = getInitialClasses();

  appendStyle(preflight + variables(configMerged) + initialStyles);

  return {
    unsubscribe: () => classObserver.disconnect(),
    parse,
    config: configMerged,
  };
}

export default init;
