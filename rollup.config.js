import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'
import svgr from '@svgr/rollup'
import { eslint } from "rollup-plugin-eslint"

import pkg from './package.json'

export default {
  input: 'src/index.js',
  output: [{
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    external(),
    postcss({
      modules: true,
      minimize: true,
      use: [
        [
          'less',
          {
            javascriptEnabled: true
          }
        ]
      ]
    }),
    url(),
    svgr(),
    eslint(),
    babel({
      exclude: 'node_modules/**'
    }),
    resolve(),
    commonjs(),
  ]
}