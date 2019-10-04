let ael=(t,f)=>self.addEventListener(t,f);

let cacheInfo={
	name:"Color-build2019.10.4",
	list:[
		"style.css",
		"styleX.css",
		"styleT.css",
		"script.js",
		"scriptX.js",
		"scriptT.js",
		"silhouette.svg"
	].map(v=>"./Resources/"+v).concat("./ServiceWorker.js")
};

for (var un=0;un<20;un++) {
	let c=(19-un+10).toString(36).toUpperCase();
	Array.prototype.unshift.apply(cacheInfo.list,["index.html","manifest.json","Icon.png","apple-touch-icon.png","Favicon.ico","tileImage.png"].map(v=>`./Color-${c}/${v}`));
}

ael("install",e=>{
	e.waitUntil(
		caches.open(cacheInfo.name).then(c=>{
			return c.addAll(cacheInfo.list);
		})
	);
});

ael("activate",e=>{
	e.waitUntil(()=>{
		caches.keys().then(l=>{
			return Promise.all(l.map(n=>{
				if (n!=cacheInfo.name) return caches.delete(n);
			}));
		});
	});
});

ael("fetch",e=>{
	e.respondWith(caches.match(e.request).then(r=>{
		if (r) return r;
		let fr = e.request.clone();
		return fetch(fr).then(r=>{
			if (!r) return r;
			else if (r.status!=200) return r;
			let rc=r.clone();
			caches.open(cacheInfo.name).then(c=>{
				c.put(e.request,rc);
			});
			return r;
		});
	}))
});