import 'rsuite/dist/styles/rsuite-dark.min.css';
import '../public/global.css';
import {GlobalStore} from '../utils/store';

/**
 * @function app
 * @author SoulHarsh007 <harshtheking@hotmail.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Beta
 * @description Custom next.js app
 * @param {import('next/app').AppProps} AppProps - components and pageprops
 * @returns {import('next').NextComponentType<import('next').NextPageContext, any, {}>} components and pageprops
 */
export default function app({Component, pageProps}) {
  return (
    <GlobalStore>
      <Component {...pageProps} />
    </GlobalStore>
  );
}
