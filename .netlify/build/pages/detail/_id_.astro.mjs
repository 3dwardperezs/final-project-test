/* empty css                                          */
import { c as createAstro, a as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_b09etzCd.mjs';
import { $ as $$Layout } from '../../chunks/Layout_D8eZ86Ov.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://3dwardperezs.github.io");
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const response = await fetch("https://api.themoviedb.org/3/movie/" + id + "?api_key=6050d678a0f95f2618b79d83c9dbc3d8&language=en-US");
  const data = await response.json();
  const poster_url = "https://image.tmdb.org/t/p/w500/";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "detail movie" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="flex-max-w-lg w-full overflow-hidden mx-auto p-4"> <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"> <div class="flex flex-col items-left"> <img${addAttribute(poster_url + data.poster_path, "src")} alt="poster" class="img-fluid rounded-start"> </div> <div class="flex flex-col items-left text-white"> <h1><span class="my-2 text-2xl font-bold tracking-tight text-white">${data.title}</span></h1> <h4>${data.tagline}</h4> <h2 class="font-bold">Overview:</h2> <p>${data.overview}</p> <h2 class="font-bold">Release Date:</h2> <p><span class="badge text-bg-secondary">${data.release_date}</span></p> <h2 class="font-bold">Rate:</h2> <h1><span class="badge text-bg-dark">${Math.round(data.vote_average)}⭐</span></h1> </div> </div> </div> ` })}`;
}, "C:/Users/ED/Documents/final-project-test/src/pages/detail/[id].astro", void 0);

const $$file = "C:/Users/ED/Documents/final-project-test/src/pages/detail/[id].astro";
const $$url = "/final-project-test/detail/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$id,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
