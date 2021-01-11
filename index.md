# Headlong

_Tailwind CSS on the fly without PostCSS_

Tailwind CSS produces thousands of classes most of which will never be used. Changes to the Tailwind configuration might take seconds to take effect, and who has seconds to waste these days? There are [articles](https://nystudio107.com/blog/speeding-up-tailwind-css-builds) describing how to speed up Tailwind build times indicating the problem.

**Headlong** is a runtime version of Tailwind CSS which requires no PostCSS nor purging. Instead of generating all the classes beforehand it adds classes on the fly to the stylesheet whenever they are introduced in the DOM.

This library is not intended to replace the original Tailwind. Yet, there are environments where one cannot use PostCSS or maybe needs to interpolate _the living hell_ out of those class names, or play with configuration.

Natural advantage of this approach is zero extra build time, _all_ classes are available by default, no need to enable responsive or whatever plugin.

Headlong was built entirely using [Ellx](https://ellx.io). Here's [source code](https://ellx.io/matyunya/headlong/index.md) and [demo](https://matyunya-headlong.ellx.app/).

## Demo

<small>Type any utility class name into the input. Click the button to toggle the class on the test div.</small>

{ className = input({ label: "New class name", value: "text-fuchsia-500", size: 4 })}

<div class="text-xs block my-8 font-mono p-2 bg-gray-100 dark:bg-gray-800 items-center shadow-lg">

{ parsed = headlong.parse(className) }

</div>

{ button({ label: "toggle", onClick: toggle, disabled: !parsed })}

<span id="test" class="block ring hover:ring-8 transition duration-500 ring-red-100 p-4 my-8 font-mono hover:italic text-red-500 cursor-pointer hover:bg-light-blue-100 bg-opacity-0 hover:bg-opacity-50 rounded shadow-lg"> I am a Headlong test</span>

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

## Roadmap

- [x] Ring
- [x] Divide
- [x] Camelcased colors ("light-blue" is lightBlue in the default palette)
- [x] "Extend" config section
- [x] Preflight
- [x] Container
- [x] Min/max breakpoints, object, array notation breakpoints
- [ ] `@apply` as a function
- [ ] Combined selectors like ("sm:dark:hover:")
- [ ] Negated values using css `calc` function relying on PostCSS plugin
- [ ] Keyframes customization
- [ ] Proper breakpoints

## Classes

Please refer to Tailwind [documentation](https://tailwindcss.com/docs) for all available classes. Almost all of them work in headlong.

### Placeholder color and opacity

[Docs](https://tailwindcss.com/docs/placeholder-color)

```html
<input
  type="text"
  placeholder="test placeholder"
  class="placeholder-red-500 outline-none placeholder-opacity-50 p-4 bg-red-100 my-8 block"
/>
```

<input type="text" placeholder="test placeholder" class="placeholder-red-500 placeholder-opacity-50 p-4 bg-red-100 my-8 block">

### Space between

[Docs](https://tailwindcss.com/docs/space)

```html
<div class="flex space-x-8 align-center items-center text-lg">
  <div class="w-1/5 h-16 py-4 text-xs bg-purple-300 text-cyan-200 text-center">
    1
  </div>
  <div class="w-1/5 h-16 py-4 text-xs bg-purple-300 text-cyan-200 text-center">
    2
  </div>
  <div class="w-1/5 h-16 py-4 text-xs bg-purple-300 text-cyan-200 text-center">
    3
  </div>
</div>
```

<div class="flex space-x-8 align-center items-center text-lg">
  <div class="w-1/5 h-8 py-4 text-xs bg-purple-300 text-cyan-200 text-center">1</div>
  <div class="w-1/5 h-8 py-4 text-xs bg-purple-300 text-cyan-200 text-center">2</div>
  <div class="w-1/5 h-8 py-4 text-xs bg-purple-300 text-cyan-200 text-center">3</div>
</div>

### Divide

[Docs](https://tailwindcss.com/docs/divide-width)

```html
<div class="grid grid-cols-1 divide-y divide-yellow-500">
  <div class="py-4 w-full text-lg bg-yellow-100 text-yellow-700 text-center">
    1
  </div>
  <div class="py-4 w-full text-lg bg-yellow-100 text-yellow-700 text-center">
    2
  </div>
  <div class="py-4 w-full text-lg bg-yellow-100 text-yellow-700 text-center">
    3
  </div>
</div>
```

<div class="grid grid-cols-1 divide-y divide-yellow-500">
  <div class="py-4 w-full text-lg bg-yellow-100 text-yellow-700 text-center">1</div>
  <div class="py-4 w-full text-lg bg-yellow-100 text-yellow-700 text-center">2</div>
  <div class="py-4 w-full text-lg bg-yellow-100 text-yellow-700 text-center">3</div>
</div>

### Gradients

[Docs](https://tailwindcss.com/docs/gradient-color-stops)

```html
<div
  class="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 w-full h-12"
></div>
<div class="bg-gradient-to-r from-teal-400 to-blue-500 h-12"></div>
<div class="bg-gradient-to-r from-red-500 h-12"></div>
```

<div class="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 w-full h-12"></div>

<div class="bg-gradient-to-r from-teal-400 to-blue-500 h-12"></div>

<div class="bg-gradient-to-r from-red-500 h-12"></div>

### Ring

[Docs](https://tailwindcss.com/docs/ring-width)

```html
<div
  class="rounded-t-xl overflow-hidden bg-gradient-to-r from-blue-50 to-light-blue-100 grid grid-cols-1 sm:grid-cols-4 gap-6 justify-items-center p-8"
>
  <div
    class="focus:outline-none text-sm w-24 py-3 rounded-md font-semibold text-white bg-blue-500 ring ring-blue-200 text-center hover:shadow"
  >
    ring
  </div>
  <div
    class="focus:outline-none text-sm w-24 py-3 rounded-md font-semibold text-white bg-blue-500 ring-4 ring-blue-200 text-center hover:shadow"
  >
    ring
  </div>
</div>
```

<div class="rounded-t-xl overflow-hidden bg-gradient-to-r from-blue-50 to-light-blue-100 grid grid-cols-1 sm:grid-cols-4 gap-6 justify-items-center p-8">
  <div class="focus:outline-none text-sm w-24 py-3 rounded-md font-semibold text-white bg-blue-500 ring ring-blue-200 text-center hover:shadow">
    ring
  </div>
  <div class="focus:outline-none text-sm w-24 py-3 rounded-md font-semibold text-white bg-blue-500 ring-4 hover:ring-8 duration-1000 cursor-pointer transform transition ring-blue-200 text-center hover:shadow">
    ring
  </div>
</div>

<div class="hidden">

{ headlong = init({}, document.getElementById('md')) }

</div>

<style>
  h2, h3 {
    margin: 2rem 0 1rem;
  }
</style>
