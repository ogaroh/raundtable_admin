'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "c56feaee104878d52e96cba5b40fedea",
"index.html": "bfcfe0f4320e6005f925c28340f39d44",
"/": "bfcfe0f4320e6005f925c28340f39d44",
"main.dart.js": "47cc9f7a4fa73f2c4f8ba99b72a0df73",
"flutter.js": "6fef97aeca90b426343ba6c5c9dc5d4a",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "2d85fdeedf15539cfc48a4a386ec4cf5",
"assets/AssetManifest.json": "2bc462be146b58d129c177d2aa2b5e0f",
"assets/NOTICES": "5eb705809c6649d755d731f1ca174b1a",
"assets/FontManifest.json": "a04343ed2f05bdfc4feb138b16121ded",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "57d849d738900cfd590e9adc7e208250",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"assets/AssetManifest.bin": "e84798912b09d14204c18bb4a24b7a4c",
"assets/fonts/MaterialIcons-Regular.otf": "5cc3e9fff0ded154fba7eca398d5d014",
"assets/assets/ui/img_1.png": "607d516e7ab5d9b089697528507b3faa",
"assets/assets/ui/img_2.png": "95a1210cd71b2051933a2e2e81c1c214",
"assets/assets/ui/img_3.png": "e75c59f85d243ff5c0e95061c6023b57",
"assets/assets/ui/img.png": "75c259fd4872b2ace34cf323702ad1f9",
"assets/assets/fonts/Gilroy/Gilroy-Medium.ttf": "6444f14adcdee041b62184f13139a56d",
"assets/assets/fonts/Gilroy/Gilroy-LightItalic.ttf": "a774850a6f3bebd595224064172b5eba",
"assets/assets/fonts/Gilroy/Gilroy-HeavyItalic.ttf": "574db652a041efb7bb8e55c280c797ec",
"assets/assets/fonts/Gilroy/Gilroy-BoldItalic.ttf": "2b56aed03785343b8a9d2ab464f35d61",
"assets/assets/fonts/Gilroy/Gilroy-SemiBoldItalic.ttf": "d9652658411a4e21bfaab0b60df39596",
"assets/assets/fonts/Gilroy/Gilroy-RegularItalic.ttf": "4b9bfe4dcf729744ecbf9415d002abb2",
"assets/assets/fonts/Gilroy/Gilroy-BlackItalic.ttf": "25a0c193cf573450c069971145972e7c",
"assets/assets/fonts/Gilroy/Gilroy-Regular.ttf": "ae5e7255973ffe09b53f07a2805232a8",
"assets/assets/fonts/Gilroy/Gilroy-Black.ttf": "d59719bcf2c0c2e0db325ecf56c1d257",
"assets/assets/fonts/Gilroy/Gilroy-ExtraBold.ttf": "07e6a6cd3cdb9eedaa9aa81fafe1e42a",
"assets/assets/fonts/Gilroy/Gilroy-MediumItalic.ttf": "9bc60a85e3c00995d5e2878f00f9a36e",
"assets/assets/fonts/Gilroy/Gilroy-Light.ttf": "73bfa12b55452a65a0253c511856d6c2",
"assets/assets/fonts/Gilroy/Gilroy-ExtraBoldItalic.ttf": "1ccd0d2f9c282cf2e80d0b455164cd69",
"assets/assets/fonts/Gilroy/Gilroy-SemiBold.ttf": "05bdf30b8aaa10683c19e73dd0c428da",
"assets/assets/fonts/Gilroy/Gilroy-Bold.ttf": "3cf0ee273a0b3f022234b6572c3b78f9",
"assets/assets/fonts/Gilroy/Gilroy-Heavy.ttf": "8d36efeb3349af073647c0c37ec995f1",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
