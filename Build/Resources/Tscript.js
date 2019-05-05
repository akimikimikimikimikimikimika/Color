(()=>{

	let cd=(id,cls)=>{
		let e=document.createElement("div");
		sa(e,"id",id);
		sc(e,cls);
		return e;
	},ap=(p,c)=>p.appendChild(c),sa=(e,k,v)=>{
		if (v) e.setAttribute(k,v);
		else e.removeAttribute(k);
	},sc=(e,c)=>sa(e,"class",c),id=i=>document.getElementById(i),ael=(e,t,l,o)=>e.addEventListener(t,l,o),apb=e=>ap(body(),e),html=document.documentElement,body=()=>document.body;
	var loading=true;
	let status=new Proxy({
		mode:"flower",
		flower:true,
		dark:false,
		buttons:"show",
		touch:false,
		browser:null,
		standalone:false
	},{
		set:(t,p,v)=>{
			t[p]=v;
			let c=[
				"js",
				t.mode,
				t.dark?"dark":"light",
				t.buttons
			];
			if (t.standalone) c.push("standalone");
			if (t.browser) c.push(t.browser.toLowerCase());
			if (t.touch) c.push("touch");
			sc(html,c.join(" "));
		}
	});

	(()=>{
		status.standalone=navigator.standalone||(/standalone=yes/).test(location.search);
		if (window.ApplePaySession) status.browser="Safari";
		if (window.chrome) status.browser="Chrome";
		if (window.sidebar) status.browser="Firefox";
		status.touch=cd().ontouchstart===null;
	})();

	let ccc=cd("circleContainer");
	let cc=ap(ccc,cd("circle"));

	(()=>{
		let f=n=>{
			let e=ap(cc,cd(null,n<18?"petal":"pistil"));
			if (n<18) e.style.transform=`rotate(-${n*20}deg)`;
			let h=`${n%18*20},${n<18?80:0}%`;
			let c=ap(e,cd());
			sa(c,"role","button");
			let f=(p,e)=>{
				c.style.backgroundColor=`hsl(${h},${p?70:50}%)`;
				if (e) e.preventDefault();
			};
			ael(c,status.touch?"touchstart":"mouseover",e=>f(1,e));
			ael(c,status.touch?"touchend":"mouseout",e=>f(0,e));
			f(0);
		};
		for (var n=0;n<19;n++) f(n);
	})();

	let fep=()=>{
		let f=k=>{
			let u=id("use"+k),g=id(k);
			let f=g.firstElementChild,l=g.lastElementChild;
			let h=f.getAttribute("stop-color").match(/hsl\(([0-9]+,8?0%),85%\)/)[1];

			(()=>{
				let e=p=>{
					sa(f,"stop-color",`hsl(${h},${p?91:85}%)`);
					sa(l,"stop-color",`hsl(${h},${p?70:50}%)`);
				};
				sa(u,"role","button");
				ael(u,status.touch?"touchstart":"mouseover",()=>e(1));
				ael(u,status.touch?"touchend":"mouseout",()=>e(0));
			})();
		};
		for (var n=0;n<19;n++) f((n+10).toString(36).toUpperCase());
	};

	let bl=cd(null,"button left");
	sa(bl,"role","button");
	let br=cd(null,"button right");
	sa(br,"role","button");

	(()=>{
		var fto=null;
		let t=status.touch?"touchend":"mouseup";
		let d=()=>{
			status.dark=!status.dark;
		};
		let f=()=>{
			if (fto) {
				clearTimeout(fto);
				fto=null;
			}
			if (status.flower) {
				status.mode="toBeCircle";
				fto=setTimeout(()=>{
					status.mode="circle";
					fto=null;
				},500);
			}
			else {
				status.mode="toBeFlower";
				fto=setTimeout(()=>{
					status.mode="flower";
					fto=null;
				},500);
			}
			status.flower=!status.flower;
		};
		ael(ap(bl,cd()),t,e=>{
			d();
			show();
			e.preventDefault();
		});
		ael(ap(br,cd()),t,e=>{
			f();
			show();
			e.preventDefault();
		});
		ael(html,"keydown",e=>{
			switch (e.key) {
				case "d":case "D":d();break;
				case "f":case "F":f();break;
			}
			e.preventDefault();
		});
		let h=()=>{
			let h=location.hash.replace(/^\#/,"");
			if (h) {
				switch (h) {
					case "light":
						if (loading) status.mode="light";
						else if (status.dark) d();
						break;
					case "dark":
						if (loading) status.mode="dark";
						else if (!status.dark) d();
						break;
					case "flower":
						if (loading) status.mode="flower";
						else if (!status.flower) f();
						break;
					case "circle":
						if (loading) status.mode="circle";
						else if (status.flower) f();
						break;
				}
				location.hash="";
			}
		};
		setInterval(h,100);
		h();
	})();

	var wh=null,dh=null;
	let show=()=>{
		if (wh!=null) {
			clearTimeout(wh);
			wh=null;
		}
		if (dh!=null) {
			clearTimeout(dh);
			dh=null;
		}
		status.buttons="show";
		wh=setTimeout(hide,3000);
	};
	let hide=()=>{
		status.buttons="hiding";
		dh=setTimeout(()=>{
			status.buttons="hide";
		},500);
	};
	ael(html,status.touch?"touchstart":"mouseover",e=>{
		show();e.preventDefault();
	});

	ael(window,"load",()=>{
		fep();
		apb(ccc);
		apb(bl);
		apb(br);
		if (status.standalone) apb(cd("statusbar"));
		show();
		loading=false;
	},{once:true});

})();