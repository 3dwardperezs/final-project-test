/* empty css                                       */
import { a as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_b09etzCd.mjs';
import { $ as $$Layout } from '../chunks/Layout_D8eZ86Ov.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "404 Error" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="text-center"> <h1 class="text-9xl font-bold text-gray-800">404</h1> <h2 class="text-3xl font-semibold text-gray-700 mt-4">Page Not Found</h2> <p class="text-lg text-gray-600 mt-2">Sorry, the page you are looking for does not exist.</p> <div class="mt-6"> <a href="/" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">Go to Home Page</a> <a href="/ContactPage" class="bg-gray-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-gray-600 transition duration-300">Contact Support</a> </div> </div> ` })}`;
}, "C:/Users/ED/Documents/final-project-test/src/pages/404.astro", void 0);

const $$file = "C:/Users/ED/Documents/final-project-test/src/pages/404.astro";
const $$url = "/final-project-test/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$404,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
