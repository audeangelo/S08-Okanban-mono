import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';

export default {
  plugins: [
    handlebars({
      // eslint-disable-next-line no-undef
      partialDirectory: resolve(__dirname, './assets/partials'),
    }),
  ],
};
