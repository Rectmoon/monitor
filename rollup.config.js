import path from 'path'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import flow from 'rollup-plugin-flow-no-whitespace'
import replace from 'rollup-plugin-replace'
import { version } from './package.json'

const banner = `/*!
  * monitor-sdk v${version}
  * (c) ${new Date().getFullYear()} Rectmoon
  * @license MIT
  */`

const resolve = dir => path.resolve(__dirname, './', dir)

const isDev = process.env.NODE_ENV === 'development'
const buildConfig = [
  {
    file: resolve('dist/monitor-sdk.min.js'),
    format: 'umd',
    env: 'production'
  },
  {
    file: resolve('dist/monitor-sdk.common.js'),
    format: 'cjs'
  },
  {
    file: resolve('dist/monitor-sdk.esm.js'),
    format: 'es'
  },
  {
    file: resolve('dist/monitor-sdk.esm.browser.js'),
    format: 'es',
    env: 'development',
    transpile: false
  },
  {
    file: resolve('dist/monitor-sdk.esm.browser.min.js'),
    format: 'es',
    env: 'production',
    transpile: false
  }
]

export default [
  {
    file: resolve('dist/monitor-sdk.js'),
    format: 'umd',
    env: 'development'
  },
  !isDev && [...buildConfig]
]
  .filter(Boolean)
  .map(genConfig)

function genConfig (opts) {
  const config = {
    input: resolve('src/index.js'),
    plugins: [
      flow(),

      nodeResolve(),

      commonjs(),

      replace({
        __VERSION__: version
      })
    ],
    output: {
      file: opts.file,
      format: opts.format,
      banner,
      name: 'MonitorSdk'
    }
  }

  if (opts.env) {
    config.plugins.unshift(
      replace({
        'process.env.NODE_ENV': JSON.stringify(opts.env)
      })
    )
  }

  if (opts.transpile !== false) {
    const babelConfig = {
      exclude: 'node_modules',
      babelHelpers: 'bundled',
      babelrc: false,
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            targets: ['last 1 version', 'not dead', '> 0.2%']
          }
        ]
      ]
    }
    config.plugins.push(babel(babelConfig))
  }

  return config
}
