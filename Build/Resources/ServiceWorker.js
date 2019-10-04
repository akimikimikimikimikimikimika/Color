let ael=(t,f)=>self.addEventListener(t,f);

let build="2019.10.4";

let cacheInfo=[
	{
		name:"Color-build"+build,
		list:[
			"ServiceWorker.js",
			"style.css",
			"styleX.css",
			"styleT.css",
			"script.js",
			"scriptX.js",
			"scriptT.js",
			"silhouette.svg"
		].map((v,i)=>"./"+(i?"Resources/":"")+v)
	}
];

for (var un=0;un<20;un++) {
	let c=(un+10).toString(36).toUpperCase();
	cacheInfo.splice(un,0,{
		name:`Color-${c}-build${build}`,
		list:["","manifest.json","Icon.png","apple-touch-icon.png","Favicon.ico","tileImage.png"].map(v=>`./Color-${c}/${v}`)
	});
}

ael("install",e=>{
	e.waitUntil(
		cacheInfo.map(cd=>{
			return caches.open(cd.name).then(c=>{
				return c.addAll(cd.list);
			});
		})
	);
});

ael("activate",e=>{
	e.waitUntil(()=>{
		caches.keys().then(l=>{
			return Promise.all(l.map(n=>{
				if (cacheInfo.find(cd=>cd.name==n)<0) return caches.delete(n);
			}));
		});
	});
});

ael("fetch",e=>{
	e.respondWith(caches.match(e.request).then(res=>{
		if (res) return res;
		let req = e.request.clone();
		return fetch(req).then(res=>{
			if (!res) return res;
			else if (res.status!=200) return res;
			let rc=res.clone();
			let m=req.url.match(/Color-([A-T])/);
			if (m) var un=parseInt(m[1],36);
			else var un=20;
			caches.open(cacheInfo[un].name).then(c=>{
				c.put(e.request,rc);
			});
			return r;
		});
	}))
});