// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers

const addResourcesToCache = async (resources) => {
	const cache = await caches.open('v1');
	await cache.addAll(resources);
};

const putInCache = async (request, response) => {
	if (request.url.indexOf('chrome-extension') === 0) return;
	const cache = await caches.open('v1');
	await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
	// First try to get the resource from the cache
	const responseFromCache = await caches.match(request);
	if (responseFromCache) {
		return responseFromCache;
	}

	// Next try to use (and cache) the preloaded response, if it's there
	const preloadResponse = await preloadResponsePromise;
	if (preloadResponse) {
		console.info('using preload response', preloadResponse);
		putInCache(request, preloadResponse.clone());
		return preloadResponse;
	}

	// Next try to get the resource from the network
	try {
		const responseFromNetwork = await fetch(request);
		// response may be used only once
		// we need to save clone to put one copy in cache
		// and serve second one
		putInCache(request, responseFromNetwork.clone());
		return responseFromNetwork;
	} catch (error) {
		const fallbackResponse = await caches.match(fallbackUrl);
		if (fallbackResponse) {
			return fallbackResponse;
		}
		// when even the fallback response is not available,
		// there is nothing we can do, but we must always
		// return a Response object
		return new Response('Network error happened', {
			status: 408,
			headers: { 'Content-Type': 'text/plain' },
		});
	}
};

// Enable navigation preload
const enableNavigationPreload = async () => {
	if (self.registration.navigationPreload) {
		// Enable navigation preloads!
		await self.registration.navigationPreload.enable();
	}
};

self.addEventListener('activate', (event) => {
	event.waitUntil(enableNavigationPreload());
});

self.addEventListener('install', (event) => {
	event.waitUntil(
		addResourcesToCache([
			'/',
			'/app.webmanifest',
			'/icon.svg',
			'/service-worker.js',
			'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.slim.min.js',
			'https://unpkg.com/@picocss/pico@latest/css/pico.min.css'
		])
	);
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		cacheFirst({
			request: event.request,
			preloadResponsePromise: event.preloadResponse,
			fallbackUrl: false,
		})
	);
});
