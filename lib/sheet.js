import tinycolor from 'tinycolor2';

export { default as input } from "~ellx-hub/lib/components/Input/index.js";
export { default as button } from "~ellx-hub/lib/components/Button/index.js";

function multiply(rgb1, rgb2) {
  rgb1.b = Math.floor((rgb1.b * rgb2.b) / 255);
  rgb1.g = Math.floor((rgb1.g * rgb2.g) / 255);
  rgb1.r = Math.floor((rgb1.r * rgb2.r) / 255);
  return tinycolor('rgb ' + rgb1.r + ' ' + rgb1.g + ' ' + rgb1.b);
}

const o = (value, name) => ({
  [name]: tinycolor(value).toHexString()
});

const white = tinycolor('#fff');

function generatePalette(hex) {
  const baseDark = multiply(tinycolor(hex).toRgb(), tinycolor(hex).toRgb());
  const baseTriad = tinycolor(hex).tetrad();

  const lightest = o(tinycolor.mix(white, hex, 30), '50');
  return {
    transLight: tinycolor(lightest[50])
      .toRgbString()
      .replace(')', ', 0.2)'),
    trans: tinycolor(lightest[50])
      .toRgbString()
      .replace(')', ', 0.7)'),
    transDark: tinycolor(hex)
      .toRgbString()
      .replace(')', ', 0.15)'),
    ...o(tinycolor.mix(white, hex, 12), '50'),
    ...lightest,
    ...o(tinycolor.mix(white, hex, 50), '200'),
    ...o(tinycolor.mix(white, hex, 70), '300'),
    ...o(tinycolor.mix(white, hex, 85), '400'),
    ...o(tinycolor.mix(white, hex, 100), '500'),
    ...o(tinycolor.mix(baseDark, hex, 87), '600'),
    ...o(tinycolor.mix(baseDark, hex, 70), '700'),
    ...o(tinycolor.mix(baseDark, hex, 54), '800'),
    ...o(tinycolor.mix(baseDark, hex, 25), '900'),
    ...o(
      tinycolor
        .mix(baseDark, baseTriad[4], 15)
        .saturate(80)
        .lighten(65),
      'a100'
    ),
    ...o(
      tinycolor
        .mix(baseDark, baseTriad[4], 15)
        .saturate(80)
        .lighten(55),
      'a200'
    ),
    ...o(
      tinycolor
        .mix(baseDark, baseTriad[4], 15)
        .saturate(100)
        .lighten(45),
      'a400'
    ),
    ...o(
      tinycolor
        .mix(baseDark, baseTriad[4], 15)
        .saturate(100)
        .lighten(40),
      'a700'
    )
  };
}

function buildPalette(colors) {
  return Object.keys(colors).reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: generatePalette(colors[cur])
    }),
    {}
  );
}

const colors = {
  primary: '#237EB3',
  secondary: '#008080',
  error: '#f44336',
  alert: '#ff9800',
  blue: '#2196f3',
  dark: '#212121',
};

export const customConfig = {
  theme: {
    extend: {
      rotate: {
        360: '360deg',
        '-360': '-360deg',
      },
      spacing: {
        72: '18rem',
        84: '21rem',
        96: '24rem',
        128: '32rem',
      },
      height: {
        96: '20rem',
      },
    },
    fontSize: {
      '5xl': '6rem',
      '4xl': '3.75rem',
      '3xl': '3rem',
      '2xl': '2.125rem',
      xl: '1.5rem',
      lg: '1.25rem',
      base: '1rem',
      sm: '0.875rem',
      xs: '0.75rem'
    },
    screens: {
      sm: { max: '639px' },
      md: '641px',
    },
    colors: {
      transparent: 'transparent',

      black: '#000',
      white: '#fff',
      'white-trans': 'rgba(255,255,255,0.35)',
      'white-transLight': 'rgba(255,255,255,0.2)',
      'white-transDark': 'rgba(255,255,255,0.7)',
      'black-trans': 'rgba(0,0,0,0.35)',
      'black-transLight': 'rgba(0,0,0,0.2)',
      'black-transDark': 'rgba(0,0,0,0.7)',

      gray: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#eeeeee',
        300: '#e0e0e0',
        400: '#bdbdbd',
        500: '#9e9e9e',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121',
        trans: 'rgba(250, 250, 250, 0.5)',
        transLight: 'rgba(250, 250, 250, 0.1)',
        transDark: 'rgba(100, 100, 100, 0.2)'
      },

      ...buildPalette(colors)
    }
  },
};
