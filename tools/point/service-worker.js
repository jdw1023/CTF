importScripts(
	'https://cdnjs.cloudflare.com/ajax/libs/workbox-sw/6.5.2/workbox-sw.min.js'
);

// Evict image cache entries older thirty days:
const imageRoute = new workbox.routing.Route(({ request }) => {
	return request.destination === 'image';
}, new workbox.strategies.CacheFirst({
	cacheName: 'images',
	plugins: [
		new workbox.expiration.ExpirationPlugin({
			maxAgeSeconds: 60 * 60 * 24 * 30,
		})
	]
}));

// Evict the least-used script cache entries when
// the cache has more than 50 entries:
const scriptsRoute = new workbox.routing.Route(({ request }) => {
	return request.destination === 'script';
}, new workbox.strategies.CacheFirst({
	cacheName: 'scripts',
	plugins: [
		new workbox.expiration.ExpirationPlugin({
			maxEntries: 10,
		})
	]
}));

const stylesRoute = new workbox.routing.Route(({ request }) => {
	return request.destination === 'style';
}, new workbox.strategies.CacheFirst({
	cacheName: 'styles',
	plugins: [
		new workbox.expiration.ExpirationPlugin({
			maxEntries: 10,
		})
	]
}));

const documentsRoute = new workbox.routing.Route(({ request }) => {
	return request.destination === 'document';
}, new workbox.strategies.NetworkFirst({
	cacheName: 'documents'
}));

// Register workbox.routing.Routes
workbox.routing.registerRoute(imageRoute);
workbox.routing.registerRoute(scriptsRoute);
workbox.routing.registerRoute(stylesRoute);
workbox.routing.registerRoute(documentsRoute);