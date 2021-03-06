(()=>{

	let preset=[
		{
			interval:50,
			move:0.1,
			unitLength:300,
			speed:200,
			hueInterval:30
		},
		{
			side:150,
			speed:200
		}
	];

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
	},sc=(e,c)=>sa(e,"class",c);



	window.res("motions",(status)=>{

		var c,ct;
		var mode=0;
		var w,h;
		var procession=false;
		let colorFunc=(()=>{
			return `
				vec4 Color(float h,float s,float l) {
					if (h==360.0) return vec4(l,l,l,1.0);
					else {
						float tM = clamp(l*2.0-0.0,0.0,1.0);
						float tm = clamp(l*2.0-1.0,0.0,1.0);
						float M = ((tM+tm)+(tM-tm)*s)/2.0;
						float m = ((tM+tm)+(tm-tM)*s)/2.0;
						vec3 rgb;
						if (h<60.0) rgb=vec3(1.0,h/60.0,0.0);
						else if (h<120.0) rgb=vec3(2.0-h/60.0,1.0,0.0);
						else if (h<180.0) rgb=vec3(0.0,1.0,h/60.0-2.0);
						else if (h<240.0) rgb=vec3(0.0,4.0-h/60.0,1.0);
						else if (h<300.0) rgb=vec3(h/60.0-4.0,0.0,1.0);
						else if (h<360.0) rgb=vec3(1.0,0.0,6.0-h/60.0);
						return vec4(rgb*(M-m)+vec3(m),1.0);
					}
				}
			`;
		})();

		let views=[
			(()=>{
				var pre,pb,pl,ib,hl;
				var t=0,dir,id;
				let ho=Math.random();
				var k;
				let view={
					vertex:`
						attribute vec3 position;
						uniform float hue;

						varying vec4 clr;

						${colorFunc}

						void main() {
							gl_Position = vec4(position.xy,0.0,1.0);
							clr = Color(clamp(hue,0.0,360.0),0.8,position.z/2.0);
						}
					`,
					fragment:`
						precision mediump float;

						varying vec4 clr;

						void main() {
							gl_FragColor = clr;
						}
					`
				};
				view.setup=()=>{
					let pg=view.program;
					pre=view.preset;
					k=2*Math.PI/pre.unitLength;
					pb=ct.createBuffer();
					ib=ct.createBuffer();
					pl=ct.getAttribLocation(pg,"position");
					hl=ct.getUniformLocation(pg,"hue");
				};
				view.draw=dt=>{
					t+=dt;

					let data=dir.map(o=>{
						let l=[];
						for (var n=-o.size;n<=o.size;n++) {
							let p=n*pre.interval;
							p+=Math.sin(k*(p-t*o.velocity)+o.phase)*pre.unitLength*pre.move;
							l.push([p/o.max,1-Math.abs(n)%2]);
						}
						return l;
					});

					let ps=[];
					data[0].forEach(x=>data[1].forEach(y=>ps.push(x[0],-y[0],(x[1]+y[1])/2)));

					ct.bindBuffer(ct.ARRAY_BUFFER,pb);
					ct.enableVertexAttribArray(pl);
					ct.vertexAttribPointer(pl,3,ct.FLOAT,false,0,0);
					ct.bufferData(ct.ARRAY_BUFFER,new Float32Array(ps),ct.STATIC_DRAW);

					if (status.color==19) ct.uniform1f(hl,(t/pre.hueInterval+ho)%1*360);

					ct.drawElements(ct.TRIANGLES,id.length,ct.UNSIGNED_SHORT,0);
				};
				view.resized=()=>{
					let ang=2*Math.PI*Math.random();
					dir=[
						{
							max:w/2,
							size:Math.ceil(w/2/pre.interval)+1,
							velocity:pre.speed*Math.cos(ang),
							phase:2*Math.PI*Math.random()
						},
						{
							max:h/2,
							size:Math.ceil(h/2/pre.interval)+1,
							velocity:pre.speed*Math.sin(ang),
							phase:2*Math.PI*Math.random()
						}
					];
					let i=[];
					let m=dir.map(o=>o.size*2+1);
					let rf=[[0,0],[0,1],[1,0],[0,1],[1,0],[1,1]];
					for (var x=1;x<m[0];x++) for (var y=1;y<m[1];y++) rf.forEach(r=>{
						let cx=x-r[0],cy=y-r[1];
						i.push(cx*m[1]+cy);
					});
					id=new Int16Array(i);
					ct.bindBuffer(ct.ELEMENT_ARRAY_BUFFER,ib);
					ct.bufferData(ct.ELEMENT_ARRAY_BUFFER,id,ct.STATIC_DRAW);
					if (status.color!=19) ct.uniform1f(hl,status.color*20);
				};
				return view;
			})(),
			(()=>{
				var pre,pb,cb,ib,pl,cl,hl,whl,ltl,sl;
				var wn=0,hn=0,left=0,top=0;
				var v;
				let l=[];
				let view={
					vertex:`
						attribute vec2 position;
						${status.color==19?`
							attribute vec3 color;
						`:`
							attribute vec2 color;
							uniform float hue;
						`}
						uniform vec2 widthHeight;
						uniform vec2 leftTop;
						uniform float side;

						varying vec4 clr;

						${colorFunc}

						void main() {
							gl_Position = vec4(
								(leftTop.x+side*position.x)/(widthHeight.x/2.0),
								-(leftTop.y+side*position.y)/(widthHeight.y/2.0),
								0.0,1.0);
							${status.color==19?`
								clr = vec4(color,1.0);
							`:`
								clr = Color(hue*20.0,hue==18.0 ? 0.0 : color.x,color.y);
							`}
						}
					`,
					fragment:`
						precision mediump float;

						varying vec4 clr;

						void main() {
							gl_FragColor = clr;
						}
					`
				};
				let nc=()=>{
					if (status.color==19) return {r:1-Math.random(),g:1-Math.random(),b:1-Math.random()};
					else return {s:1-Math.random(),l:1-Math.random()};
				};
				let fr=s=>{
					let l=[];
					for (var n=0;n<s;n++) l.push(nc());
					return l;
				};
				let adjust=dt=>{
					left+=v.x*dt;
					top+=v.y*dt;
					let s=pre.side,cw=wn,ch=hn;
					let d={left:0,right:0,top:0,bottom:0};
					if (left>(-w/2)) {
						let n=Math.ceil((left+w/2)/s);
						d.left+=n;
						wn+=n;
						left-=n*s;
					}
					if ((-w/2-left)>=s) {
						let n=Math.floor(-(left+w/2)/s);
						d.left-=n;
						wn-=n;
						left+=n*s;
					}
					if ((left+wn*s)<w/2) {
						let n=Math.ceil((-left-wn*s+w/2)/s);
						d.right+=n;
						wn+=n;
					}
					if ((left+wn*s-w/2)>=s) {
						let n=Math.floor((left+wn*s-w/2)/s);
						d.right-=n;
						wn-=n;
					}
					if (top>(-h/2)) {
						let n=Math.ceil((top+h/2)/s);
						d.top+=n;
						hn+=n;
						top-=n*s;
					}
					if ((-h/2-top)>=s) {
						let n=Math.floor(-(top+h/2)/s);
						d.top-=n;
						hn-=n;
						top+=n*s;
					}
					if ((top+hn*s)<h/2) {
						let n=Math.ceil((-top-hn*s+h/2)/s);
						d.bottom+=n;
						hn+=n;
					}
					if ((top+hn*s-h/2)>=s) {
						let n=Math.floor((top+hn*s-h/2)/s);
						d.bottom-=n;
						hn-=n;
					}
					ct.uniform2f(ltl,left,top);
					if ((d.left!=0)||(d.right!=0)||(d.top!=0)||(d.bottom!=0)) {
						let clr=[];
						for (var n=0;n<d.top;n++) l.unshift(fr(cw));
						for (var n=0;n>d.top;n--) l.shift();
						for (var n=0;n<d.bottom;n++) l.push(fr(cw));
						for (var n=0;n>d.bottom;n--) l.pop();
						l.forEach(r=>{
							for (var n=0;n<d.left;n++) r.unshift(nc());
							for (var n=0;n>d.left;n--) r.shift();
							for (var n=0;n<d.right;n++) r.push(nc());
							for (var n=0;n>d.right;n--) r.pop();
						});
						l.forEach(r=>r.forEach(c=>{
							if (status.color==19) for (var n=0;n<4;n++) clr.push(c.r,c.g,c.b);
							else for (var n=0;n<4;n++) clr.push(c.s,c.l);
						}));
						ct.bindBuffer(ct.ARRAY_BUFFER,cb);
						ct.enableVertexAttribArray(cl);
						ct.vertexAttribPointer(cl,status.color==19?3:2,ct.FLOAT,false,0,0);
						ct.bufferData(ct.ARRAY_BUFFER,new Float32Array(clr),ct.STATIC_DRAW);
					}
					if ((wn!=cw)||(hn!=ch)) {
						let ps=[];
						for (var y=0;y<hn;y++) for (var x=0;x<wn;x++) for (var n=0;n<4;n++) ps.push(x+(n%2),y+(n>1));
						ct.bindBuffer(ct.ARRAY_BUFFER,pb);
						ct.enableVertexAttribArray(pl);
						ct.vertexAttribPointer(pl,2,ct.FLOAT,false,0,0);
						ct.bufferData(ct.ARRAY_BUFFER,new Float32Array(ps),ct.STATIC_DRAW);
					}
					if ((wn*hn)!=(cw*ch)) {
						let idx=[];
						for (var n=0;n<(4*wn*hn);n+=4) idx.push(n,n+1,n+2,n+1,n+2,n+3);
						ct.bindBuffer(ct.ELEMENT_ARRAY_BUFFER,ib);
						ct.bufferData(ct.ELEMENT_ARRAY_BUFFER,new Int16Array(idx),ct.STATIC_DRAW);
					}
				};
				view.setup=()=>{
					let pg=view.program;
					pre=view.preset;
					let arg=Math.random()*2*Math.PI;
					v={x:pre.speed*Math.cos(arg),y:pre.speed*Math.sin(arg)};
					pb=ct.createBuffer();
					cb=ct.createBuffer();
					ib=ct.createBuffer();
					pl=ct.getAttribLocation(pg,"position");
					cl=ct.getAttribLocation(pg,"color");
					if (status.color!=19) hl=ct.getUniformLocation(pg,"hue");
					whl=ct.getUniformLocation(pg,"widthHeight");
					ltl=ct.getUniformLocation(pg,"leftTop");
					sl=ct.getUniformLocation(pg,"side");
				};
				view.draw=dt=>{
					adjust(dt);
					ct.drawElements(ct.TRIANGLES,wn*hn*6,ct.UNSIGNED_SHORT,0);
				};
				view.resized=dt=>{
					adjust(dt);
					if (status.color!=19) ct.uniform1f(hl,status.color);
					ct.uniform1f(sl,pre.side);
					ct.uniform2f(whl,w,h);
				};
				return view;
			})()
		];
		let prepare=()=>{
			views.forEach((v,i)=>{
				let up=v.setup,p=preset[i];
				v.setup=()=>{
					let pg=ct.createProgram();
					let s=[
						{
							type:ct.VERTEX_SHADER,
							code:v.vertex
						},
						{
							type:ct.FRAGMENT_SHADER,
							code:v.fragment
						}
					];
					s.forEach(o=>{
						let s=ct.createShader(o.type);
						ct.shaderSource(s,o.code);
						ct.compileShader(s);
						ct.attachShader(pg,s);
						if (!ct.getShaderParameter(s,ct.COMPILE_STATUS)) {
							console.log("Shader: "+ct.getShaderInfoLog(s));
							return null;
						}
					});
					ct.linkProgram(pg);
					if (!ct.getProgramParameter(pg,ct.LINK_STATUS)) {
						console.log("Program: "+ct.getProgramInfoLog(pg));
						return null;
					}
					v.program=pg;
					v.preset=p;
					up();
					v.setup=null;
				};
			});
			let v=views[mode];
			v.setup();
			ct.useProgram(v.program);
		};
		let runner=()=>{
			let d=()=>{
				if (procession) views[mode].draw(interval());
				requestAnimationFrame(d);
			};
			d();
		};
		let interval=(()=>{
			var t;
			return ()=>{
				var dt=0;
				let n=performance.now();
				if (t) {
					dt=(n-t)/1000;
					if (dt>1/30) dt=0;
				}
				t=n;
				return dt;
			};
		})();
		let resized=r=>{
			let rect=c.getBoundingClientRect();
			let pr=window.devicePixelRatio;
			w=rect.width,h=rect.height;
			c.width=w*pr,c.height=h*pr;
			ct.viewport(0,0,w*pr,h*pr);
			views[mode].resized(interval());
			if (w*h) procession=true;
			if (r) r();
		};



		let o={
			artifact:null,
			setup:()=>{
				let p=cd("page");
				c=ce("canvas");
				ap(p,c);
				ct=c.getContext("webgl");
				if (!ct) return;
				o.artifact=p;
				prepare();
				runner();
			},
			resized:()=>{
				resized();
				return new Promise(r=>setTimeout(resized,100,r));
			},
			modeChanged:()=>{
				procession=false;
				mode=(mode+1)%views.length;
				let v=views[mode];
				if (v.setup) v.setup();
				ct.useProgram(v.program);
				o.resized();
			}
		};
		return o;
	});
})();