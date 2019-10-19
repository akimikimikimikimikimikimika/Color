importScripts("../Library/SW/SW.js");

let ael=(t,f)=>self.addEventListener(t,f);

let build=[2019,10,19];

let cacheInfo=[
	{
		name:"Color",
		build:build,
		list:[
			"ServiceWorker.js",
			"style.css",
			"styleX.css",
			"styleT.css",
			"script.js",
			"scriptX.js",
			"scriptT.js",
			"silhouette.svg"
		].map((v,i)=>(i?"Resources/":"")+v)
	}
];

for (var un=0;un<20;un++) {
	let c=(un+10).toString(36).toUpperCase();
	cacheInfo.splice(un,0,{
		name:`Color-${c}`,
		build:build,
		list:["","manifest.json","Icon.png","apple-touch-icon.png","Favicon.ico","tileImage.png"].map(v=>`./Color-${c}/${v}`)
	});
}

cacheInfo.forEach(cacheManager);