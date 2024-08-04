/* empty css                                       */
import { a as createComponent, r as renderTemplate, e as renderHead, d as renderComponent } from '../chunks/astro/server_b09etzCd.mjs';
import { $ as $$Layout } from '../chunks/Layout_D8eZ86Ov.mjs';
/* empty css                                       */
export { renderers } from '../renderers.mjs';

const $$Contact = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Contact Us</title>${renderHead()}</head> <!-- Contact format --> <body class="bg-gray-100 flex items-center justify-center min-h-screen"> <div class="container max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg"> <h2 class="text-3xl font-semibold text-gray-800 mb-6 text-center">Contact Us</h2> <form id="contactForm" class="space-y-4"> <div> <label for="name" class="block text-sm font-medium text-gray-700">Name</label> <input type="text" id="name" name="name" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required> </div> <div> <label for="email" class="block text-sm font-medium text-gray-700">Email</label> <input type="email" id="email" name="email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required> </div> <div> <label for="message" class="block text-sm font-medium text-gray-700">Message</label> <textarea id="message" name="message" rows="4" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required></textarea> </div> <div class="text-center"> <button type="submit" class="w-full bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300">Send Message</button> </div> </form> </div> <!-- Toast Notification --> <div id="toast" class="toast">Thanks for your email</div>  </body> </html>`;
}, "C:/Users/ED/Documents/final-project-test/src/components/Contact.astro", void 0);

const $$ContactPage = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Contact" }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Contact", $$Contact, {})} ` })}`;
}, "C:/Users/ED/Documents/final-project-test/src/pages/ContactPage.astro", void 0);

const $$file = "C:/Users/ED/Documents/final-project-test/src/pages/ContactPage.astro";
const $$url = "/final-project-test/ContactPage";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$ContactPage,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
