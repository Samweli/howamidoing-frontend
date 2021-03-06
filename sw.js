const staticAssets = [
    './',
    './css/app.css',
    './libs/bootstrap/dist/css/bootstrap.css',
    './libs/jquery/dist/jquery.js',
    './libs/bootstrap/dist/js/bootstrap.js',
    './js/app.js',
    './fallback.json'
];

self.addEventListener('install', async event => {

    const cache = await caches.open('app-static');

    cache.addAll(staticAssets);


});

self.addEventListener('fetch', event => {

    const req = event.request;
    const url = new URL(req.url);

    if (url.origin === location.origin) {
        if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;

        event.respondWith(cacheFirst(req));

    } else {
        event.respondWith(networkFirst(req));
    }

});

async function cacheFirst(req) {
    // check if have response request
    const cachedResponse = await caches.match(req);
    return cachedResponse || fetch(req);


}

async function networkFirst(req) {

    const cache = await caches.open('app-dynamic');
    try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch (e) {
        const cachedResponse = await cache.match(req);
        return cachedResponse || await caches.match('./fallback.json');

    }

}