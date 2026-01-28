export default {
  async fetch(request, env, ctx) {
    return new Response("Hello from Soni CMS Worker! The routes are working.", {
      headers: { "content-type": "text/plain" },
    });
  },
};
