importScripts("../Library/SW/SW.js");

let ael=(t,f)=>self.addEventListener(t,f);

let cacheInfo=[
	{
		name:"Color",
		build:[2019,10,29],
		list:[
			"style.css",
			"styleX.css",
			"styleT.css",
			"font.css",
			"script.js",
			"scriptX.js",
			"scriptT.js",
			"flower.js",
			"colorSpace.js",
			"textField.js",
			"motions.js",
			"silhouette.svg"
		].map(v=>"Resources/"+v)
	}
];

let build=[2019,10,19];
for (var un=0;un<20;un++) {
	let c=(un+10).toString(36).toUpperCase();
	cacheInfo.splice(un,0,{
		name:`Color-${c}`,
		build:build,
		list:["","manifest.json","Icon.png","apple-touch-icon.png","Favicon.ico","tileImage.png"].map(v=>`./Color-${c}/${v}`)
	});
}

cacheInfo.forEach(cacheManager);