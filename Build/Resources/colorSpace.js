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
	},ael=(e,t,l,o)=>e.addEventListener(t,l,o),sc=(e,c)=>sa(e,"class",c);



	window.res("colorSpace",(status,pkg)=>{

		let map=pkg.map,frag=pkg.frag;
		var w,h;
		var c,ct,up,lw,input,pg;
		var hl,ml,whl;
		var inputRecognize;
		var status;

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
		let setup=()=>{
			let p=cd("page colorSpace");
			c=ce("canvas");
			ap(p,c);
			ct=c.getContext("webgl");
			if (!ct) return;
			up=cd("desc upper",null,map[0].name);
			lw=cd("desc lower",null,"#FFFFFF");
			ap(p,up);
			ap(p,lw);
			input=cd("inputView");
			ap(p,input);
			compile();
			recognizerSetup();
			return p;
		};
		let compile=()=>{
			pg=ct.createProgram();
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
					code:frag
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
			hl=ct.getUniformLocation(pg,"hue");
			ml=ct.getUniformLocation(pg,"mode");
			whl=ct.getUniformLocation(pg,"frame");
		};
		let recognizerSetup=()=>{
			let c=e=>{
				let p={x:e.clientX,y:h-e.clientY};
				mapping(p);
			};
			var ed,ir;
			if (status.touch) {
				ir=()=>{
					let p={clientX:0,clientY:0};
					Array.from(ed).forEach(t=>{
						p.clientX+=t.clientX;
						p.clientY+=t.clientY;
					});
					p.clientX/=ed.length;
					p.clientY/=ed.length;
					c(p);
				};
				ael(input,"touchstart",e=>{
					status.descShown=true;
					ed=e.targetTouches;
					ir();
				});
				ael(input,"touchmove",e=>{
					ed=e.targetTouches;
					ir();
				});
				ael(input,"touchend",e=>{
					if (e.targetTouches.length) {
						ed=e.targetTouches;
						ir();
					}
					else status.descShown=false;
				});
				ael(input,"touchcancel",e=>{
					status.descShown=false;
				});
			}
			else {
				ir=()=>c(ed);
				ael(input,"mouseover",e=>{
					status.descShown=true;
					ed=e;
					ir();
				});
				ael(input,"mousemove",e=>{
					ed=e;
					ir();
				});
				ael(input,"mouseout",e=>{
					status.descShown=false;
				});
			}
			inputRecognize=ir;
		};
		let mapping=p=>{
			let un=status.color;
			p.x/=w;
			p.y/=h;
			let c=map[status.page1Mode].calc(p,un,{x:w,y:h});
			lw.textContent=hmm2hex.apply(0,c);
		};
		let draw=()=>{
			if (map[status.page1Mode].noCanvas) {status.noCanvas=true;return;}
			else status.noCanvas=false;
			ct.uniform1f(hl,status.color*20);
			ct.uniform1i(ml,status.page1Mode);
			ct.drawElements(ct.TRIANGLES,6,ct.UNSIGNED_SHORT,0);
		};
		let resized=()=>{
			let r=c.getBoundingClientRect();
			w=r.width,h=r.height;
			let pr=window.devicePixelRatio;
			c.width=w*pr;
			c.height=h*pr;
			ct.viewport(0,0,w*pr,h*pr);
			ct.uniform2f(whl,w*pr,h*pr);
			draw();
		};

		let o={
			artifact:null,
			width:0,
			height:0,
			setup:()=>o.artifact=setup(),
			draw:draw,
			resized:()=>{
				resized();
				return new Promise(r=>{
					setTimeout(()=>{
						resized();
						r();
					},100);
				});
			},
			modeChanged:()=>{
				var m=status.page1Mode;
				m=(m+1)%map.length;
				status.page1Mode=m;
				draw();
				up.textContent=map[m].name;
				inputRecognize();
			},
			map:pkg.map
		};
		return o;
	});

})();