try{if (!CSS.supports("background-color","var(--vivid)")) throw new Error();}catch(e){onload=function(){while (document.body.firstChild) document.body.removeChild(document.body.firstChild);};}
window.main=pkg=>{

	let ce=e=>document.createElement(e),cd=(cls,id,text)=>{
		let e=ce("div");
		sc(e,cls);
		sa(e,"id",id);
		e.textContent=text;
		return e;
	},ap=(p,c)=>p.appendChild(c),ib=(a,c)=>a.parentNode.insertBefore(c,a),rep=(n,o)=>o.parentNode.replaceChild(n,o),rc=e=>e.parentNode.removeChild(e),cn=e=>e.cloneNode(true),ga=(e,k)=>e.getAttribute(k),sa=(e,k,v)=>{
		if (v) e.setAttribute(k,v);
		else e.removeAttribute(k);
		return e;
	},ael=(e,t,l,o)=>e.addEventListener(t,l,o),sc=(e,c)=>sa(e,"class",c),tc=(e,c)=>e.classList.toggle(c),id=i=>document.getElementById(i),apb=e=>ap(document.body,e),html=document.documentElement;

	let hue=n=>`${n%18*20},${n<18?80:0}%`;
	let hmm2hex=(h,m,M)=>{
		var rgb;
		if (h<60) rgb=[1,h/60,0];
		else if (h<120) rgb=[2-h/60,1,0];
		else if (h<180) rgb=[0,1,h/60-2];
		else if (h<240) rgb=[0,4-h/60,1];
		else if (h<300) rgb=[h/60-4,0,1];
		else if (h<360) rgb=[1,0,6-h/60];
		return rgb.reduce((t,v)=>{
			let i=Math.round((v*(M-m)+m)*255);
			var s=i.toString(16).toUpperCase();
			if (s.length==1) s="0"+s;
			return t+s;
		},"#");
	};
	let newton=(()=>{
		let calc=(x,a)=>{
			var v=0;
			for (var n=0;n<a.length;n++) v+=a[n]*(x**n);
			return v;
		};
		let approx=(x,a)=>{
			let f0=a.reverse();
			let f1=f0.map((v,i)=>v*i);
			f1.shift();
			var c=x,p;
			do {
				p=c;
				let p0=calc(p,f0),p1=calc(p,f1);
				if (p0==0) return p;
				else if (p1==0) return null;
				else c=p-(p0**2)/(p1*(p0-calc(p-p0/p1,f0)));
				if (Math.abs(c)==Infinity) return p;
			} while (Math.abs(p-c)>=1e-16);
			return c;
		};
		return (x,...args)=>{
			let v=approx(x,args);
			if (isNaN(v)||(!isFinite(v))) {
				console.log(x);
				console.log(args);
			}
			return v;
		};
	})();

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
		let c=document.title.match(/Color ([A-S])/);
		if (c) s.color=parseInt(c[1],36)-10;
		s.standalone=navigator.standalone||(/standalone=yes/).test(location.search);
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

	let base=document.createDocumentFragment();
	ap(base,cd(null,"statusbar"));

	let pages=[
		{
			artifact:null,
			setup:o=>{
				let e=id("pageViewController").firstElementChild;
				ap(e,cd(null,"flower-bg"));
				o.artifact=e;
				o.sepal=id("sepal");
				o.petal=id("petal");
				o.petalDrop=id("petalDrop");
				o.colors(o);
			},
			modeChanged:o=>o.animate(o),
			colors:o=>{
				var pis,pet;
				let un=status.color;
				let defs=id("defs"),g=id("graphic");
				if (un<19) {
					pis=id("pistilColor");pet=id("petalColor");
					rc(pis);rc(pet);
					sa(id("pistil"),"fill");
					sa(id("petal"),"fill");
				}
				let focus=(n,s,e)=>{
					ael(n,status.touch?"touchstart":"mouseover",ev=>{
						if (status.page0Mode!=1) {
							o.focused.push(e);
							s();
						}
						ev.preventDefault();
					});
					ael(n,status.touch?"touchend":"mouseout",ev=>{
						if (status.page0Mode!=1) {
							let i=o.focused.findIndex(v=>v==e);
							if (i>=0) o.focused.splice(i,1);
							e();
						}
						ev.preventDefault();
					});
				};
				Array.from(g.children).forEach(e=>{
					let c=ga(e,"title");
					if (c) {
						let n=parseInt(c,36)-10;
						if (c=="S") {
							o.pistil=e;
							sa(e,"style",`--hue:${hue(un)};`);
						}
						if (un<19) sa(e,"fill",`url(#${c})`);
						sa(e,"role","button");
						focus(e,()=>{
							let t=(status.page0Mode==2&&n==18)?e:rg;
							if ((un==n)||(un==19)) tc(t,"lighter");
							else {
								tc(t,"vividly");
								sa(t,"style",`--hue:${hue(n)};`);
							}
						},()=>{
							let t=(status.page0Mode==2&&n==18)?e:rg;
							if ((un==n)||(un==19)) tc(t,"lighter");
							else {
								tc(t,"vividly");
								sa(t,"style",`--hue:${hue(un)};`);
							}
						});
						if (n<18) {
							let d=cn(e);
							sc(d,"petalDrop");
							sa(d,"fill");
							sa(d,"xlink:href","#petalDrop");
							sa(d,"role","button");
							if (un==19) sa(d,"style",`--hue:${hue(n)};`);
							focus(d,()=>{
								if ((un==n)||(un==19)) tc(d,"lighter");
								else {
									tc(d,"vividly");
									sa(d,"style",`--hue:${hue(n)};`);
								}
							},()=>{
								if ((un==n)||(un==19)) tc(d,"lighter");
								else {
									tc(d,"vividly");
									sa(d,"style",`--hue:${hue(un)};`);
								}
							});
							ap(g,d);
						}

						var rg;
						if (un==19) rg=id(c);
						else rg=cn(n<18?pet:pis);
						if (un<19) sa(rg,"id",c);
						ap(defs,rg);
						if (n==18) o.pistilTransforming=rg.firstChild;
					}
				});
			},
			animate:(()=>{
				let dur=300;
				var t=0,lt=0,d=-1,r=false,o;
				let f=()=>{
					let ct=performance.now();
					if (lt) t+=d*(ct-lt);
					if ((t<=0)&&(d<0)) {
						t=0;
						r=false;
						lt=0;
						o.frame(o,0);
						setTimeout(()=>o.exit(o,d),0);
					}
					else if ((t>=dur)&&(d>0)) {
						t=dur;
						r=false;
						lt=0;
						o.frame(o,1);
						setTimeout(()=>o.exit(o,d),0);
					}
					else {
						o.frame(o,o.ease(t/dur));
						lt=ct;
						requestAnimationFrame(f);
					}
				};
				return ob=>{
					if (!r) {
						o=ob;
						d*=-1;
						o.enter(o);
						r=true;
						setTimeout(f,0);
					}
					else {
						let ct=performance.now();
						t+=d*(ct-lt);
						lt=ct;
						d*=-1;
					}
				};
			})(),
			ease:(()=>{
				let a=0.42;
				let b=1-3*a;
				return x=>newton(0.5,2*(b**3),9*a*(b**2)-6*(b**2)*x,6*b*x**2-18*a*b*x-27*(a**3),9*a*(x**2)-2*(x**3));
			})(),
			enter:o=>{
				o.focused.forEach(f=>f());
				o.focused.length=0;
				status.page0Mode=1;
			},
			frame:(o,x)=>{
				let t=`scale(${1-0.5*x})`;
				sa(o.pistil,"transform",t);
				sa(o.sepal,"transform",t);
				sa(o.petal,"transform",t);
				sa(o.petalDrop,"cx",672-336*x);
				sa(o.sepal,"opacity",`${1-x}`);
				sa(o.petal,"opacity",`${1-x}`);
				sa(o.petalDrop,"opacity",`${x}`);
				sa(o.pistilTransforming,"stop-color",`hsl(${hue(Math.min(status.color,18))},${(status.vivid?100:50)*x+85*(1-x)}%)`);
			},
			exit:(o,d)=>{
				if (d>0) {
					sa(o.petalDrop,"opacity");
					status.page0Mode=2;
				}
				if (d<0) {
					sa(o.pistil,"transform");
					sa(o.sepal,"transform");
					sa(o.petal,"transform");
					sa(o.sepal,"opacity");
					sa(o.petal,"opacity");
					sa(o.pistilTransforming,"stop-color",null);
					status.page0Mode=0;
				}
			},
			focused:[],
			sepal:null,
			pistil:null,
			pistilTransforming:null,
			petal:null,
			petalDrop:null
		},
		{
			artifact:null,
			canvas:null,
			context:null,
			upper:null,
			lower:null,
			input:null,
			width:0,
			height:0,
			whl:0,
			hl:0,
			ml:0,
			setup:o=>{
				let p=cd("page colorSpace");
				let c=ce("canvas");
				ap(p,c);
				let ct=c.getContext("webgl");
				let u=cd("desc upper",null,o.map[0].name);
				let l=cd("desc lower",null,"#FFFFFF");
				ap(p,u);
				ap(p,l);
				let i=cd("inputView");
				ap(p,i);
				if (!ct) return;
				o.artifact=p;
				o.canvas=c;
				o.context=ct;
				o.upper=u;
				o.lower=l;
				o.input=i;
				o.compile(o);
				o.recognizerSetup(o);
			},
			compile:o=>{
				let ct=o.context;
				let pg=ct.createProgram();
				let s=[
					{
						type:ct.VERTEX_SHADER,
						code:`
							attribute vec2 position;

							void main() {
								gl_Position = vec4(position*2.0-vec2(1.0,1.0),0.0,1.0);
							}
						`
					},
					{
						type:ct.FRAGMENT_SHADER,
						code:pkg.frag
					}
				];
				s.forEach(o=>{
					let s=ct.createShader(o.type);
					ct.shaderSource(s,o.code);
					ct.compileShader(s);
					ct.attachShader(pg,s);
					if (!ct.getShaderParameter(s,ct.COMPILE_STATUS)) {
						console.log("Shader: "+ct.getShaderInfoLog(s));
						return true;
					}
				});
				ct.linkProgram(pg);
				if (!ct.getProgramParameter(pg,ct.LINK_STATUS)) {
					console.log("Program: "+ct.getProgramInfoLog(pg));
					return true;
				}
				ct.useProgram(pg);
				let pb=ct.createBuffer();
				let pl=ct.getAttribLocation(pg,"position");
				let ib=ct.createBuffer();
				ct.bindBuffer(ct.ARRAY_BUFFER,pb);
				ct.enableVertexAttribArray(pl);
				ct.vertexAttribPointer(pl,2,ct.FLOAT,false,0,0);
				ct.bufferData(ct.ARRAY_BUFFER,new Float32Array([0,0,0,1,1,0,1,1]),ct.STATIC_DRAW);
				ct.bindBuffer(ct.ELEMENT_ARRAY_BUFFER,ib);
				ct.bufferData(ct.ELEMENT_ARRAY_BUFFER,new Int16Array([0,1,2,1,2,3]),ct.STATIC_DRAW);
				o.hl=ct.getUniformLocation(pg,"hue");
				o.ml=ct.getUniformLocation(pg,"mode");
				o.whl=ct.getUniformLocation(pg,"frame");
			},
			draw:o=>{
				if (o.map[status.page1Mode].noCanvas) {status.noCanvas=true;return;}
				else status.noCanvas=false;
				let ct=o.context;
				ct.uniform1f(o.hl,status.color*20);
				ct.uniform1i(o.ml,status.page1Mode);
				ct.drawElements(ct.TRIANGLES,6,ct.UNSIGNED_SHORT,0);
			},
			recognizerSetup:o=>{
				let c=e=>{
					let p={x:e.clientX,y:o.height-e.clientY};
					o.mapping(o,p);
				};
				var ed,ir;
				if (status.touch) {
					ir=t=>{
						let p={clientX:0,clientY:0};
						Array.from(ed).forEach(t=>{
							p.clientX+=t.clientX;
							p.clientY+=t.clientY;
						});
						p.clientX/=ed.length;
						p.clientY/=ed.length;
						c(p);
					};
					ael(o.input,"touchstart",e=>{
						status.descShown=true;
						ed=e.targetTouches;
						ir();
					});
					ael(o.input,"touchmove",e=>{
						ed=e.targetTouches;
						ir();
					});
					ael(o.input,"touchend",e=>{
						if (e.targetTouches.length) {
							ed=e.targetTouches;
							ir();
						}
						else status.descShown=false;
					});
					ael(o.input,"touchcancel",e=>{
						status.descShown=false;
					});
				}
				else {
					ir=()=>c(ed);
					ael(o.input,"mouseover",e=>{
						status.descShown=true;
						ed=e;
						ir();
					});
					ael(o.input,"mousemove",e=>{
						ed=e;
						ir();
					});
					ael(o.input,"mouseout",e=>{
						status.descShown=false;
					});
				}
				o.inputRecognize=ir;
			},
			resized:o=>{
				let f=()=>{
					let c=o.canvas;
					let r=c.getBoundingClientRect();
					o.width=r.width;
					o.height=r.height;
					let pr=window.devicePixelRatio;
					let w=o.width*pr;
					let h=o.height*pr;
					c.width=w;
					c.height=h;
					let ct=o.context;
					ct.viewport(0,0,w,h);
					ct.uniform2f(o.whl,w,h);
					o.draw(o);
				};
				f();
				return new Promise(r=>{
					setTimeout(()=>{
						f();
						r();
					},100);
				});
			},
			modeChanged:o=>{
				var m=status.page1Mode;
				m=(m+1)%o.map.length;
				status.page1Mode=m;
				o.draw(o);
				o.upper.textContent=o.map[m].name;
				o.inputRecognize();
			},
			mapping:(o,p)=>{
				var m,M;
				let un=status.color;
				p.x/=o.width;
				p.y/=o.height;
				let c=o.map[status.page1Mode].calc(p,un,{x:o.width,y:o.height});
				o.lower.textContent=hmm2hex.apply(0,c);
			},
			map:pkg.map,
			inputRecognize:null
		},
		{
			artifact:null,
			setup:o=>{
				let a=cd("page");
				let p=ap(a,cd(null,"textarea-series"));
				o.list=p;
				o.artifact=a;
				["normal","stroke","shadow"].forEach(c=>{
					let ct=cd();
					let t=ce("textarea");
					t.value="TEXT";
					ael(t,"focus",()=>o.focused=t);
					ael(t,"blur",()=>{if (o.focused==t) o.focused=null;});
					o.areas.push(t);
					sc(t,c);
					ap(ct,t);
					ap(p,ct);
				});
				o.pageLeft(o);
			},
			areas:[],
			list:null,
			focused:null,
			pageLeft:o=>{
				if (o.focused) {
					o.focused.blur();
					o.focused=null;
				}
				if (pkg.editorColor) pkg.editorColor(o);
			},
			modeChanged:()=>{}
		}
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
			o.setup(o);
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
				if (pv.pageLeft) pv.pageLeft(pv);
				status.page=page;
			}
		});
		ap(document.body,base);
		let r=()=>{
			let rect=p.getBoundingClientRect();
			status.width=rect.width;
			status.height=rect.height;
			p.scrollLeft=rect.width*status.page;
			pages.forEach(o=>{if (o.resized) o.resized(o);});
		};
		r();
		ael(window,"resize",r);
	};

	ael(window,"load",viewDidLoad,{once:true});
	delete window.main;

};