import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
// import replace from '@rollup/plugin-replace';
import typescript from 'rollup-plugin-typescript2';
// import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const extensions = ['.ts', '.tsx'];

const noDeclarationFiles = { compilerOptions: { declaration: false } };

const makeExternalPredicate = (externalArr) => {
  if (externalArr.length === 0) {
    return () => false;
  }
  const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`);
  return (id) => pattern.test(id);
};

export default [
  // CommonJS
  {
    input: 'src/index.ts',
    output: { file: pkg.main, format: 'cjs', indent: false },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ]),
    plugins: [
      nodeResolve({
        extensions,
      }),

      typescript({ tsconfig: `./tsconfig.json` }),
      babel({
        include: [`src/**`],
        extensions,
        babelHelpers: 'runtime',
      }),
    ],
  },

  // ES
  {
    input: 'src/index.ts',
    output: { file: pkg.module, format: 'es', indent: false },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ]),
    plugins: [
      nodeResolve({
        extensions,
      }),
      typescript({ tsconfig: `./tsconfig.json`, tsconfigOverride: noDeclarationFiles }),
      babel({
        include: [`src/**`],
        extensions,
        babelHelpers: 'runtime',
      }),
    ],
  },
];
