import getConfig from "./lib/config.js";
import getParser, { hasVariant } from "./lib/parser.js";
import keyframes from "./lib/keyframes.js";
import { preflight as preflightStyles, variables } from "./lib/styles.js";
import { theme } from "./lib/selector.js";

const onObserve = (process, filterClasses, append) => mutations => {
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
        let c = [];
        const node = i.addedNodes[0]
        const all = node.getElementsByTagName('*');

        for (var i = -1, l = all.length; ++i < l;) {
            c.push((all[i].classList.value ||'').split(' '));
        }
        return [...c.flat(), ...(node.classList.value || '').split(' ')];
      })
      .flat()
    )
  ]
    .filter(filterClasses)
    .map(process)
    .filter(Boolean)
  ];

  append(styles);
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
    for (const key in userConfig.theme.extend) {
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
}

export function init({
  container = document.querySelector('body'),
  classes: userClasses = new Set(),
  config: userConfig = {},
  preflight = true,
} = {}) {
  if (window && window.$$headlong) return window.$$headlong;

  if (!(userClasses instanceof Set)) {
    throw new Error('Classes must be instance of Set');
  }

  const classes = new Set(userClasses);

  const s = document.createElement('style');
  s.setAttribute('type', 'text/css');
  document.head.appendChild(s);

  const med = document.createElement('style');
  med.setAttribute('type', 'text/css');
  document.head.appendChild(med);

  function appendStyleMedia(css) {
    appendCssToEl(css, med);
  }

  function appendStyle(css) {
    appendCssToEl(css, s);
  }

  function append(styles) {
    appendStyle(styles.filter(s => !s.includes('@media')).join('\n'));
    appendStyleMedia(styles.filter(s => s.includes('@media')).join('\n'));
  }

  const filterClasses = i => Boolean(i) && !classes.has(i) && typeof i === "string";

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
  appendStyle(
    (preflight ? preflightStyles : "")
    + variables(configMerged)
    + keyframes
  );
  append(initialStyles);

  const classObserver = new MutationObserver(onObserve(process, filterClasses, append));
  observeClasses(classObserver, container);

  function output() { // TODO: what output options do we need?
    return {
      classes: new Set(classes),
      styles: `<style>${s.innerText}${med.innerText}</style>`.replace(/\n/, '')
    };
  }

  window.$$headlong = {
    unsubscribe: () => {
      console.log('Headlong generated styles', output());
      classObserver.disconnect();
      window.$$headlong = null;
      return output();
    },
    parse,
    config: configMerged,
    output,
    apply: (selector, classList) => {
      const arr = classList.split(' ');
      const noVariantStyles = arr
        .filter(s => !hasVariant(s))
        .map(c => parse(c, true))
        .filter(Boolean)
        .join('') || '';

      appendStyle(`${selector} { ${noVariantStyles} }`);

      // Facing the same problem with @apply variant:class like Tailwind 1.x.
      // Got to group all uninque variant groups, capture their styles separately,
      // then apply variant groups on selector argument (which can be tricky if we allow arbitrary selector)
      // so keeping it simple for now.

      // apply('#mySelector', 'sm:text-red-500 text-green-500 dark:sm:text-yellow-500')
      // should resolve to
      // #mySelector { --tw-text-opacity: 1; color: rgba(239,68,68, var(--tw-text-opacity)); }
      // @media (min-width: 640px) { #mySelector { --tw-text-opacity: 1; color: rgba(239,68,68, var(--tw-text-opacity)); } }
      // @media (min-width: 640px) { .mode-dark #mySelector { --tw-text-opacity: 1; color: rgba(245,158,11, var(--tw-text-opacity)); } }

      // const variantStyles = arr.filter(hasVariant).map(c => parse(c).replace(c.split(":").pop(), selector));
      // append(variantStyles);

      return `${selector} { ${noVariantStyles} }`;
    }
  };

  return window.$$headlong;
}

export default init;
