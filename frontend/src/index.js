export default {
  async fetch(request) {
    return new Response("Hello from VisionX Frontend Worker!", {
      headers: { "Content-Type": "text/plain" },
    });
  },
};