(()=>{

	let cd=(cls,id)=>{
		let e=document.createElement("div");
		sc(e,cls);
		sa(e,"id",id);
		return e;
	},ap=(p,c)=>p.appendChild(c),rep=(n,o)=>o.parentNode.replaceChild(n,o),rc=e=>e.parentNode.removeChild(e),cn=e=>e.cloneNode(true),sa=(e,k,v)=>{
		if (v) e.setAttribute(k,v);
		else e.removeAttribute(k);
	},ael=(e,t,l,o)=>e.addEventListener(t,l,o),sc=(e,c)=>sa(e,"class",c),id=i=>document.getElementById(i),apb=e=>ap(body(),e),html=document.documentElement,body=()=>document.body;
	let status=new Proxy({
		tone:"vivid",
		buttons:"show",
		touch:false,
		browser:null,
		standalone:false
	},{
		set:(t,p,v)=>{
			t[p]=v;
			let c=[
				"js",
				t.tone,
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

	let tone=(()=>{
		let tl=["vivid","light","dark"],bl=[];
		let c=t=>{
			status.tone=t;
			show();
			return false;
		};
		tl.forEach(t=>{
			let p=cd("button "+t);
			let b=ap(p,cd());
			sa(b,"role","button");
			ael(b,status.touch?"touchend":"mouseup",e=>{
				c(t);
				e.preventDefault();
			});
			bl.push(p);
		});
		let m=to=>{
			let t=tl.find(t=>t[0]==to.toLowerCase());
			if (t) status.tone=t;
			return t;
		};
		ael(html,"keydown",e=>{
			m(e.key);
			e.preventDefault();
		});
		let h=()=>{
			let h=location.hash.replace(/^\#/,"");
			if (h) {
				m(h);
				location.hash="";
			}
		};
		setInterval(h,100);
		h();
		return bl;
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
		show();
		e.preventDefault();
	});

	let fep=()=>{
		let fco=id("focusColor"),pis=id("pistilColor"),pet=id("petalColor"),defs=id("defs"),app=document.title.match(/Color ([A-S])/)[1];
		rc(fco);
		rc(pis);
		rc(pet);
		sa(id("pistil"),"fill");
		sa(id("petal"),"fill");
		let f=n=>{
			let k=(n+10).toString(36).toUpperCase(),h=`${n%18*20},${n<18?80:0}%`;
			let fc=cn(fco);
			let s=cn(n<18?pet:pis);
			let f=fc.firstElementChild,l=fc.lastElementChild;
			let u=id("use"+k);
			sa(fc,"id",k);
			if (n<18) {
				sa(fc,"cx","0%");
				sa(fc,"cy","50%");
				sa(fc,"r","100%");
			}
			else sa(f,"offset","0%");
			if (k==app) {
				sa(f,"id","ownColorZero");
				sa(l,"id","ownColorFull");
			}
			else {
				sa(f,"stop-color",`hsl(${h},85%)`);
				sa(l,"stop-color",`hsl(${h},50%)`);
			}
			sa(s,"id",k);
			ap(defs,s);
			sa(u,"fill",`url(#${k})`);
			sa(u,"role","button");
			ael(u,status.touch?"touchstart":"mouseover",e=>{
				rep(fc,s);
				e.preventDefault();
			});
			ael(u,status.touch?"touchend":"mouseout",e=>{
				rep(s,fc);
				e.preventDefault();
			});
		};
		for (var n=0;n<19;n++) f(n);
	};

	ael(window,"load",()=>{
		tone.forEach(e=>apb(e));
		if (status.standalone) apb(cd(null,"statusbar"));
		fep();
		show();
	},{once:true});

})();