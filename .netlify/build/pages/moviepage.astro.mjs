/* empty css                                       */
import { a as createComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, d as renderComponent } from '../chunks/astro/server_b09etzCd.mjs';
import { $ as $$Layout } from '../chunks/Layout_D8eZ86Ov.mjs';
import { S as SearchMovie } from '../chunks/SearchMovie_BN88cS3f.mjs';
export { renderers } from '../renderers.mjs';

const $$Movies = createComponent(async ($$result, $$props, $$slots) => {
  const response = await fetch("https://api.themoviedb.org/3/movie/popular?api_key=6050d678a0f95f2618b79d83c9dbc3d8&language=en-US&page=1");
  const data = await response.json();
  const detail = "/detail/";
  const poster_url = "https://image.tmdb.org/t/p/w500/";
  return renderTemplate`<!-- Movies Format -->${maybeRenderHead()}<div class="grid gap-8 sm:grid-cols-3 lg:grid-col-3"> ${/* Iterating the movies */
  data.results.map((item) => renderTemplate`<a${addAttribute(detail + item.id, "href")} class="rounded-lg border shadow-md bg-gray-800 border-gray-700 hover:scale-105 hover:bg-gray-700 hover:border-gray-500 transition flex flex-col"> <picture class="flex justify-center p-4"> <img class="mb-5 rounded-lg"${addAttribute(poster_url + item.poster_path, "src")} alt="poster"> </picture> <header class="p-4 flex-grow"> <h2 class="my-2 text-2xl font-bold tracking-tight text-white"> ${item.title} </h2> <p class="mb-4 font-light text-gray-400"> ${item.overview} </p> </header> </a>`)} </div>`;
}, "C:/Users/ED/Documents/final-project-test/src/components/Movies.astro", void 0);

const $$MoviePage = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Movies" }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "SearchMovie", SearchMovie, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@components/SearchMovie.svelte", "client:component-export": "default" })}  ${renderComponent($$result2, "Movies", $$Movies, {})} ` })}`;
}, "C:/Users/ED/Documents/final-project-test/src/pages/MoviePage.astro", void 0);

const $$file = "C:/Users/ED/Documents/final-project-test/src/pages/MoviePage.astro";
const $$url = "/final-project-test/MoviePage";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$MoviePage,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
