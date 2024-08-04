import { renderers } from './renderers.mjs';
import { manifest } from './manifest_BPlqk0K7.mjs';
import * as serverEntrypointModule from '@astrojs/netlify/ssr-function.js';
import { onRequest } from './_noop-middleware.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/contactpage.astro.mjs');
const _page3 = () => import('./pages/detail/_id_.astro.mjs');
const _page4 = () => import('./pages/githubreposearchpage.astro.mjs');
const _page5 = () => import('./pages/interactivemappage.astro.mjs');
const _page6 = () => import('./pages/moviepage.astro.mjs');
const _page7 = () => import('./pages/privacypolicypage.astro.mjs');
const _page8 = () => import('./pages/results/_search_.astro.mjs');
const _page9 = () => import('./pages/taskmanagerpage.astro.mjs');
const _page10 = () => import('./pages/termsofservicepage.astro.mjs');
const _page11 = () => import('./pages/weatherdetailspage.astro.mjs');
const _page12 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/.pnpm/astro@4.13.1_typescript@5.5.4/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/ContactPage.astro", _page2],
    ["src/pages/detail/[id].astro", _page3],
    ["src/pages/GithubRepoSearchPage.astro", _page4],
    ["src/pages/InteractiveMapPage.astro", _page5],
    ["src/pages/MoviePage.astro", _page6],
    ["src/pages/PrivacyPolicyPage.astro", _page7],
    ["src/pages/results/[search].astro", _page8],
    ["src/pages/TaskManagerPage.astro", _page9],
    ["src/pages/TermsOfServicePage.astro", _page10],
    ["src/pages/WeatherDetailsPage.astro", _page11],
    ["src/pages/index.astro", _page12]
]);
const serverIslandMap = new Map();

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: onRequest
});
const _args = {
    "middlewareSecret": "3e5be3fe-16b6-4b8b-ab3a-d7ad3d67abbc"
};
const _exports = serverEntrypointModule.createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
