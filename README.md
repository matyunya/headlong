# Headlong

_Tailwind CSS on the fly without PostCSS_

[README](https://matyunya-headlong.ellx.app/)

Tailwind CSS produces thousands of classes most of which will never be used. Changes to the Tailwind configuration might take seconds to take effect, and who has seconds to waste these days? There are [articles](https://nystudio107.com/blog/speeding-up-tailwind-css-builds) describing how to speed up Tailwind build times indicating the problem.

**Headlong** is a runtime version of Tailwind CSS which requires no PostCSS nor purging. Instead of generating all the classes beforehand it adds classes on the fly to the stylesheet whenever they are introduced in the DOM.

This library is not intended to replace the original Tailwind. Yet, there are environments where one cannot use PostCSS or maybe needs to interpolate class names a lot, or play with configuration.

Natural advantage of this approach is zero extra build time, _all_ classes are available by default, no need to enable responsive or whatever plugin.

Headlong was built entirely using [Ellx](https://ellx.io). Here's [source code](https://ellx.io/matyunya/headlong/index.md) and [demo](https://matyunya-headlong.ellx.app/).

## Installation and usage

```
$ npm install headlong
```

```
import headlong from "headlong";

const {
  unsubscribe,
  parse,
  config,
  apply, // not quite there yet
} = headlong(config, containerEl);

// ...

// stop listening to changes when you're done
unsubscribe();
```

## Changelog

2021/2/20
- Disallow multiple instances of Headlong on the same page
- Add "output" method
- @apply for simple classes
- Combined selectors
- Fix container
- Add :checked variant

## Roadmap

- [x] Ring
- [x] Divide
- [x] Camelcased colors ("light-blue" is lightBlue in the default palette)
- [x] "Extend" config section
- [x] Preflight
- [x] Container
- [x] Min/max breakpoints, object, array notation breakpoints
- [x] `@apply` as a function (apart from combined variants just like in Tailwind 1.x)
- [x] Combined variants like ("sm:dark:hover:")
- [ ] Negated values using css `calc` function relying on PostCSS plugin
- [ ] Keyframes customization
