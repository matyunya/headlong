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
      .filter(a => {
        return filterClasses(a)
      })
  )]
    .map(process)
    .filter(Boolean);

  styles = [...styles, ...[...new Set(
    mutations
      .filter(f => {
        return f.type === 'childList' && f.addedNodes.length && f.addedNodes[0].classList
      })
      .map(i => {
        let classes = [];
        const node = i.addedNodes[0]
        const all = node.getElementsByTagName('*');

        for (var i = -1, l = all.length; ++i < l;) {
            classes.push((all[i].classList.value ||'').split(' '));
        }
        return [...classes.flat(), ...(node.classList.value || '').split(' ')];
      })
      .flat()
    )
  ]
    .filter(filterClasses)
    .map(process)
    .filter(Boolean)
  ];

  appendStyle(styles.filter(s => !s.includes('@media')).join('\n'));
  appendStyleMedia(styles.filter(s => s.includes('@media')).join('\n'));
}

const getInitialClasses = (process) => [...new Set(
  [...document.querySelectorAll("*")]
    .map(i => i.classList.value.split(' '))
    .flat()
)]
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
  if (!css) return;

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
  const filterClasses = i => Boolean(i) && typeof i === "string" && !i.startsWith('svelte-');

  const configMerged = mergeUserConfig(getConfig(), userConfig);
  const parse = getParser(configMerged);

  const process = c => {
    const css = parse(c);
    if (css) {
      classes.add(c);
    }
    return css;
  }

  const initialStyles = getInitialClasses(process, filterClasses);
  appendStyle(preflight + variables(configMerged) + initialStyles.filter(s => !s.includes('@media')).join('\n') + keyframes);
  appendStyleMedia(initialStyles.filter(s => s.includes('@media')).join('\n'));

  const classObserver = new MutationObserver(onObserve(process, filterClasses, appendStyle, appendStyleMedia));
  observeClasses(classObserver, container);

  return {
    unsubscribe: () => classObserver.disconnect(),
    parse,
    config: configMerged,
  };
}

export default init;
