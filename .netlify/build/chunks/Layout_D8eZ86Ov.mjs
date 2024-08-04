import { a as createComponent, r as renderTemplate, m as maybeRenderHead, c as createAstro, b as addAttribute, e as renderHead, d as renderComponent, f as renderSlot } from './astro/server_b09etzCd.mjs';
/* empty css                               */

const $$Header = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<header class="py8 px4 mx-auto max-w-xl lg:py-16 lg:px-6"> <div class="mx-auto text-center mb-8 lg:mb-16"> <h2 class="mb-4 text-5xl tracking-tight font-extrabold text-white">
My🚀Space
</h2> <p class="font-light text-gray-500 sm:text-xl dark:text-gray-400">
All you need for disconnect
</p> </div> <nav class="flex flex-col items-center justify-between w-full text-center md:flex-row mx-auto"> <button class="buttonHeader " data-href="/">Home</button> <button class="buttonHeader" data-href="/MoviePage">Movies</button> <button class="buttonHeader" data-href="/WeatherDetailsPage">Weather</button> <button class="buttonHeader" data-href="/InteractiveMapPage">Location</button> <button class="buttonHeader" data-href="/TaskManagerPage">Tasks</button> <button class="buttonHeader" data-href="/GithubRepoSearchPage">Repository</button> </nav> </header> `;
}, "C:/Users/ED/Documents/final-project-test/src/components/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer class="bg-gray-800 text-white py-4 mt-8 bottom-0  w-full "> <div class="container mx-auto text-center"> <p>&copy; 2024 My🚀Space. All rights reserved.</p> <div class="mt-2"> <a href="/PrivacyPolicyPage" class="text-red-700 hover:text-white mx-2">Privacy Policy</a> <a href="/TermsOfServicePage" class="text-red-700 hover:text-white mx-2">Terms of Service</a> <a href="/ContactPage" class="text-red-700 hover:text-white mx-2">Contact Us</a> </div> </div> </footer>`;
}, "C:/Users/ED/Documents/final-project-test/src/components/Footer.astro", void 0);

/** @returns {void} */
function noop() {}

function run(fn) {
	return fn();
}

function blank_object() {
	return Object.create(null);
}

/**
 * @param {Function[]} fns
 * @returns {void}
 */
function run_all(fns) {
	fns.forEach(run);
}

/** @returns {boolean} */
function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}

function subscribe(store, ...callbacks) {
	if (store == null) {
		for (const callback of callbacks) {
			callback(undefined);
		}
		return noop;
	}
	const unsub = store.subscribe(...callbacks);
	return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}

let current_component;

/** @returns {void} */
function set_current_component(component) {
	current_component = component;
}

// general each functions:

function ensure_array_like(array_like_or_iterator) {
	return array_like_or_iterator?.length !== undefined
		? array_like_or_iterator
		: Array.from(array_like_or_iterator);
}

const ATTR_REGEX = /[&"]/g;
const CONTENT_REGEX = /[&<]/g;

/**
 * Note: this method is performance sensitive and has been optimized
 * https://github.com/sveltejs/svelte/pull/5701
 * @param {unknown} value
 * @returns {string}
 */
function escape(value, is_attr = false) {
	const str = String(value);
	const pattern = is_attr ? ATTR_REGEX : CONTENT_REGEX;
	pattern.lastIndex = 0;
	let escaped = '';
	let last = 0;
	while (pattern.test(str)) {
		const i = pattern.lastIndex - 1;
		const ch = str[i];
		escaped += str.substring(last, i) + (ch === '&' ? '&amp;' : ch === '"' ? '&quot;' : '&lt;');
		last = i + 1;
	}
	return escaped + str.substring(last);
}

/** @returns {string} */
function each(items, fn) {
	items = ensure_array_like(items);
	let str = '';
	for (let i = 0; i < items.length; i += 1) {
		str += fn(items[i], i);
	}
	return str;
}

let on_destroy;

/** @returns {{ render: (props?: {}, { $$slots, context }?: { $$slots?: {}; context?: Map<any, any>; }) => { html: any; css: { code: string; map: any; }; head: string; }; $$render: (result: any, props: any, bindings: any, slots: any, context: any) => any; }} */
function create_ssr_component(fn) {
	function $$render(result, props, bindings, slots, context) {
		const parent_component = current_component;
		const $$ = {
			on_destroy,
			context: new Map(context || (parent_component ? parent_component.$$.context : [])),
			// these will be immediately discarded
			on_mount: [],
			before_update: [],
			after_update: [],
			callbacks: blank_object()
		};
		set_current_component({ $$ });
		const html = fn(result, props, bindings, slots);
		set_current_component(parent_component);
		return html;
	}
	return {
		render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
			on_destroy = [];
			const result = { title: '', head: '', css: new Set() };
			const html = $$render(result, props, {}, $$slots, context);
			run_all(on_destroy);
			return {
				html,
				css: {
					code: Array.from(result.css)
						.map((css) => css.code)
						.join('\n'),
					map: null // TODO
				},
				head: result.title + result.head
			};
		},
		$$render
	};
}

/** @returns {string} */
function add_attribute(name, value, boolean) {
	if (value == null || (boolean)) return '';
	const assignment = `="${escape(value, true)}"`;
	return ` ${name}${assignment}`;
}

/* C:/Users/ED/Documents/final-project-test/src/components/IconHelp.svelte generated by Svelte v4.2.18 */

const IconHelp = create_ssr_component(($$result, $$props, $$bindings, slots) => {

	return `<div class="icon-container"><a href="/ContactPage" aria-label="Contact Us"${add_attribute("class", 'block' , 0)}><i class="fas fa-question-circle icon"></i></a></div>`;
});

const $$Astro = createAstro("https://3dwardperezs.github.io");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Astro description"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><!-- <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">--><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""><title>${title}</title>${renderHead()}</head> <body class="bg-gray-900 min-h-screen pg-32"> ${renderComponent($$result, "Header", $$Header, {})} <main class="max-w-5xl px-4 m-auto"> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Footer, {})} ${renderComponent($$result, "IconHelp", IconHelp, {})} </body></html><!-- <style is:global>
	html {
		font-family: system-ui, sans-serif;
		background: #13151a;
		background-size: 224px;
		color-scheme: dark light;
	}
	
</style>-->`;
}, "C:/Users/ED/Documents/final-project-test/src/layouts/Layout.astro", void 0);

export { $$Layout as $, add_attribute as a, escape as b, create_ssr_component as c, subscribe as d, each as e, noop as n, safe_not_equal as s };
