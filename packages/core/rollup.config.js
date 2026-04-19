import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.mjs',
      format: 'esm'
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs'
    }
  ],
  plugins: [
    terser({
      compress: {
        passes: 2
      },
      mangle: {
        toplevel: true
      }
    })
  ]
};
