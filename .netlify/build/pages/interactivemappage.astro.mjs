/* empty css                                       */
import { a as createComponent, r as renderTemplate, d as renderComponent } from '../chunks/astro/server_b09etzCd.mjs';
import { $ as $$Layout } from '../chunks/Layout_D8eZ86Ov.mjs';
export { renderers } from '../renderers.mjs';

const $$InteractiveMapPage = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Interactive Map" }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "InteractiveMapTest", null, { "client:only": true, "client:component-hydration": "only", "client:component-path": "@components/InteractiveMap.svelte", "client:component-export": "default" })} ` })}`;
}, "C:/Users/ED/Documents/final-project-test/src/pages/InteractiveMapPage.astro", void 0);

const $$file = "C:/Users/ED/Documents/final-project-test/src/pages/InteractiveMapPage.astro";
const $$url = "/final-project-test/InteractiveMapPage";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
     __proto__: null,
     default: $$InteractiveMapPage,
     file: $$file,
     url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
