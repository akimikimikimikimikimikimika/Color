try{if (!CSS.supports("background-color","var(--vivid)")) throw new Error();}catch(e){onload=function(){while (document.body.firstChild) document.body.removeChild(document.body.firstChild);};}
(()=>{
	let getResource=(id,o)=>{
		switch (id) {
			case "flower":
				flower=o;counter++;
				break;
			case "colorSpace":
				colorSpace=o;counter++;
				break;
			case "textField":
				textField=o;counter++;
				break;
			case "motions":
				motions=o;counter++;
				break;
			case "specific":
				pkg=o;counter++;
				break;
		}
		if (counter==5) {
			delete window.res;
			main();
		}
	};
	var counter=0;
	window.res=(id,o)=>getResource(id,o);



	let ce=e=>document.createElement(e),cd=(cls,id,text)=>{
		let e=ce("div");
		sc(e,cls);
		sa(e,"id",id);
		if (text) e.textContent=text;
		return e;
	},ap=(p,c)=>p.appendChild(c),sa=(e,k,v)=>{
		if (v) e.setAttribute(k,v);
		else e.removeAttribute(k);
		return e;
	},ael=(e,t,l,o)=>e.addEventListener(t,l,o),sc=(e,c)=>sa(e,"class",c),id=i=>document.getElementById(i),html=document.documentElement;



    let hue=n=>`${n%18*20},${n<18?80:0}%`;
	let l=["flower","colorSpace","textField","motions"];
	l.forEach(s=>{
		let e=ce("script");
		sa(e,"src",`../Resources/${s}.js`);
		ap(document.head,e);
	});
	var flower,colorSpace,textField,motions,pkg;
	let main=()=>{


		let getColor=()=>{
			let p=getComputedStyle(html).getPropertyValue("--hue");
			let m=p.match(/([0-9]*0)(deg|),(8?0)%/);
			if (m) return m[3]=="0"?18:m[1]/20;
			else return 19;
		};

		let cs=(()=>{
			let mm=s=>window.matchMedia(`(prefers-color-scheme: ${s})`);
			return {
				light:mm("light"),
				dark:mm("dark")
			};
		})();

		let status=(o=>{
			var msi=null;
			let msl=["menu-hidden","before-menu-shown","menu-shown","hiding-menu"];
			var ms=0;
			let u=t=>{
				let c=[
					"js",
					(["light","pcs","dark"])[t.scheme],
					(["flower-page","colorSpace-page","editor-page"])[t.page],
					(["flower","transforming","drops"])[t.page0Mode],
					t.noCanvas?"colorSpace-background":"colorSpace-canvas",
					t.descShown?"desc-shown":"desc-hidden",
					msl[ms]
				];
				if (t.standalone) c.push("standalone");
				if (t.browser) c.push(t.browser.toLowerCase());
				if (t.touch) c.push("touch");
				if (t.vivid) c.push("vivid");
				sc(html,c.join(" "));
				switch (t.scheme) {
					case 0:t.dark=false;break;
					case 2:t.dark=true;break;
					case 1:t.dark=cs.dark.matches;break;
				}
			};
			let s=new Proxy(o,{
				get:(t,p)=>{
					t.color=getColor();
					return t[p];
				},
				set:(t,p,v)=>{
					if ((p=="menuShown")&&(t[p]!=v)) {
						if (msi) clearTimeout(msi);
						ms=v?1:3;
						msi=setTimeout(()=>{
							ms=v*2;
							msi=null;
							u(t);
						},v?0:500);
					}
					t[p]=v;
					u(t);
				}
			});
			s.standalone=navigator.standalone||(/standalone=yes/).test(location.search);
			s.online=(()=>{
				let p=location.protocol;
				return /https/.test(p)||(/http/.test(p)&&location.hostname=="localhost");
			})();
			if (window.ApplePaySession) s.browser="Safari";
			if (window.chrome) s.browser="Chrome";
			if (window.sidebar) s.browser="Firefox";
			s.touch=cd().ontouchstart===null;
			let csp=cs.light.matches||cs.dark.matches;
			s.colorSchemePreferred=csp;
			s.scheme=csp?1:0;
			if (csp) s.dark=cs.dark.matches;
			cs.light.addListener(m=>{if ((s.scheme==1)&&m.matches) s.dark=false;});
			cs.dark.addListener(m=>{if ((s.scheme==1)&&m.matches) s.dark=true;});
			return s;
		})({
			color:19,
			page0Mode:0,
			page1Mode:0,
			noCanvas:false,
			page:0,
			width:0,
			height:0,
			descShown:false,
			menuShown:false,
			dark:false,
			scheme:0,
			vivid:false,
			colorSchemePreferred:false,
			touch:false,
			browser:null,
			standalone:false
		});

		if (status.online) try{
			["../../Library/ServiceWorker.js","../ServiceWorker.js"].forEach(f=>navigator.serviceWorker.register(f).then(r=>r.update()));
		}catch(e){}

		let base=document.createDocumentFragment();
		ap(base,cd(null,"statusbar"));

		let pages=[
			flower(status),
			colorSpace(status,pkg),
			textField(status),
			motions(status)
		];

		(()=>{
			let mb=(d,a,r)=>{
				let eh=(()=>{
					var active=false;
					return [
						e=>{
							active=true;
							e.stopPropagation();
						},
						e=>{
							if (active) active=false;
							e.stopPropagation();
						},
						e=>{
							if (active) a();
							active=false;
							e.stopPropagation();
						}
					];
				})();
				sa(d,"role","button");
				let t=status.touch;
				ael(d,t?"touchstart":"mousedown",eh[0]);
				if (!r) ael(d,t?"touchmove":"mousemove",eh[1]);
				ael(d,t?"touchcancel":"mouseout",eh[1]);
				ael(d,t?"touchend":"mouseup",eh[2]);
				return d;
			};
			let mv=ap(base,cd(null,"menuView"));
			let ms=ap(mv,cd(null,"menuShadow"));
			let m=ap(ap(mv,cd(null,"menuContainer")),cd(null,"menu"));
			let close=()=>status.menuShown=false;
			mb(ms,close);
			let cs=()=>{
				if (status.page) {
					status.scheme=status.dark?0:2;
					status.vivid=false;
				}
				else if (status.page0Mode!=1) {
					var v=status.vivid?1:(status.dark?2:0);
					v=(v+1)%3;
					if (v==1) status.scheme=status.colorSchemePreferred?1:0;
					else status.scheme=v;
					status.vivid=v==1;
				}
			};
			mb(ap(m,cd(null,null,"CS")),cs);
			let mode=()=>{
				let v=pages[status.page];
				v.modeChanged(v);
			};
			mb(ap(m,cd(null,null,"M")),mode);
			mb(ap(m,cd(null,null,"×")),close);
			mb(ap(base,cd(null,"menuButton")),()=>status.menuShown=!status.menuShown);
			ael(window,"keyup",e=>{
				if (!pages[2].focused) switch (e.key) {
					case "s":case "S":
						cs();break;
					case "m":case "M":
						mode();break;
				}
			});
		})();

		let viewDidLoad=()=>{
			let p=id("pageViewController");
			pages.forEach((o,i)=>{
				o.setup();
				if (o.artifact) ap(p,o.artifact);
				else {
					pages.splice(i,1);
					f(pages[i],i);
				}
			});
			ael(p,"scroll",()=>{
				let page=p.scrollLeft/status.width;
				if ((page%1==0)&&(status.page!=page)) {
					let pv=pages[status.page];
					if (pv.pageLeft) pv.pageLeft();
					status.page=page;
				}
			});
			if (pkg.specificStyle) pkg.specificStyle(hue(status.color),id("specific"));
			ap(document.body,base);
			let r=()=>{
				let rect=p.getBoundingClientRect();
				status.width=rect.width;
				status.height=rect.height;
				p.scrollLeft=rect.width*status.page;
				pages.forEach(o=>{if (o.resized) o.resized();});
			};
			r();
			ael(window,"resize",r);
		};

		ael(window,"load",viewDidLoad,{once:true});

	};

})();