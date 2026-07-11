import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import resolve from '@rollup/plugin-node-resolve'
import url from '@rollup/plugin-url'

import pkg from './package.json'

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
      exports: 'named'
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    postcss({
      modules: false,
      minimize: true
    }),
    url(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled'
    })
  ]
}