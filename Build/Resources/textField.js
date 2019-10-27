(()=>{

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
	},ael=(e,t,l,o)=>e.addEventListener(t,l,o),sc=(e,c)=>sa(e,"class",c),tc=(e,c)=>e.classList.toggle(c);

	let lipsum="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

	window.res("textField",(status)=>{

		var textarea;
		var focused=false,mode=0;

		let setup=()=>{
			let a=cd("page textField");
			let t=ap(a,ce("textarea"));
			sa(t,"spellcheck","false");
			sa(t,"autocapitalize","off");
			sa(t,"autocomplete","off");
			t.value=lipsum;
			ael(t,"focus",()=>focused=true);
			ael(t,"blur",()=>{if (focused) focused=false;});
			sc(t,"normal");
			textarea=t;
			o.artifact=a;
			pageLeft();
		};
		let pageLeft=()=>{
			if (focused) textarea.blur();
			if (status.color==19) {
				let f=()=>Math.random()*360+"deg,80%";
				sa(o.artifact,"style",`--bg-hue:${f()};`);
				sa(textarea,"style",`--text-hue:${f()};--selection-hue:${f()};--border-hue:${f()};`);
			}
		};
		let modeChanged=()=>{
			mode=(mode+1)%5;
			sc(textarea,(["normal","stroke","shadow","serif","mono"])[mode]);
		};

		let o={
			artifact:null,
			setup:setup,
			mode:0,
			pageLeft:pageLeft,
			modeChanged:modeChanged
		};
		return o;
	});

})();