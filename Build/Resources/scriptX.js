window.res("specific",{
	map:[
		{
			name:"HSL",
			calc:(p,un)=>{
				let s = 1-p.x;
				let l = p.y;
				let tM = l<0.5?l*2:1;
				let tm = l>0.5?(l*2-1):0;
				if (un<18) {
					M=((tM+tm)+(tM-tm)*s)/2.0;
					m=((tM+tm)+(tm-tM)*s)/2.0;
				}
				else m=M=(tm+tM)/2;
				return [un%18*20,m,M];
			}
		},
		{
			name:"HSV",
			calc:(p,un)=>{
				let s = 1-p.x;
				let v = p.y;
				if (un<18) {M=v;m=v*(1-s);}
				else m=M=v*(1-s*0.5);
				return [un%18*20,m,M];
			}
		},
		{
			name:"HWB",
			calc:(p,un)=>{
				let b = p.x;
				let w = p.y;
				let d = (b+w)>1?(b+w):1;
				if (un<18) {M=1-b/d;m=w/d;}
				else m=M=0.5*(1+w/d-b/d);
				return [un%18*20,m,M];
			}
		}
	],
	frag:(()=>{
		return `
			precision mediump float;
			uniform vec2 frame;
			uniform float hue;
			uniform int mode;

			const float PI = atan(1.0,1.0)*4.0;

			vec2 coord() {
				return vec2(gl_FragCoord.x/frame.x,gl_FragCoord.y/frame.y);
			}

			float arg(float x,float y) {
				if (x==0.0) {
					if (y==0.0) return 0.0;
					if (y>0.0) return  1.0;
					if (y<0.0) return -1.0;
				}
				else return atan(y,x)*2.0/PI;
			}

			vec4 color(float h,float m,float M) {
				vec3 rgb;
				if (h<60.0) rgb=vec3(1.0,h/60.0,0.0);
				else if (h<120.0) rgb=vec3(2.0-h/60.0,1.0,0.0);
				else if (h<180.0) rgb=vec3(0.0,1.0,h/60.0-2.0);
				else if (h<240.0) rgb=vec3(0.0,4.0-h/60.0,1.0);
				else if (h<300.0) rgb=vec3(h/60.0-4.0,0.0,1.0);
				else if (h<360.0) rgb=vec3(1.0,0.0,6.0-h/60.0);
				return vec4(rgb*(M-m)+vec3(m),1.0);
			}

			void main() {
				vec2 p = coord();
				vec2 mM;
				if (mode==0) {
					float s = 1.0-p.x;
					float l = p.y;
					float tM = clamp(l*2.0-0.0,0.0,1.0);
					float tm = clamp(l*2.0-1.0,0.0,1.0);
					mM = vec2(
						((tM+tm)+(tm-tM)*s)/2.0,
						((tM+tm)+(tM-tm)*s)/2.0
					);
				}
				if (mode==1) {
					float s = 1.0-p.x;
					float v = p.y;
					mM = vec2(v*(1.0-s),v);
				}
				if (mode==2) {
					float b = p.x;
					float w = p.y;
					float d = clamp(b+w,1.0,2.0);
					mM = vec2(w/d,1.0-b/d);
				}
				if (hue==360.0) {
					float mt=(mM.x+mM.y)/2.0;
					gl_FragColor = color(0.0,mt,mt);
				}
				else gl_FragColor = color(hue,mM.x,mM.y);
			}
		`;
	})(),
	specificStyle:(h,s)=>{
		let cursors=[
			{
				name:"default",
				viewBox:190,
				strokePath:"M 30,30 v -10 h -10 v 10 h 10 M 40,40 v -10 h -10 v 10 h 10 M 50,50 v -10 h -10 v 10 h 10 M 60,60 v -10 h -10 v 10 h 10 M 70,70 v -10 h -10 v 10 h 10 M 80,80 v -10 h -10 v 10 h 10 M 90,90 v -10 h -10 v 10 h 10 M 100,100 v -10 h -10 v 10 h 10 M 110,110 v -10 h -10 v 10 h 10 M 110,110 v 10 h -40 v 20 h 10 v -10 h 40 v -20 h -10 M 10,150 v -130 h 10 v -10 h -10 v -10 h -10 v 170 h 20 v -10 h -10 v -10 M 20,160 h 10 v -10 h -10 v 10 M 30,150 h 10 v -10 h -10 v 10 M 40,130 v 10 h 10 v -10 h -10 M 60,140 h -10 v 20 h 10 v -20 M 80,160 h 10 v -20 h -10 v 20 M 70,160 h -10 v 20 h 10 v -20 M 70,180 v 10 h 20 v -10 h -20 M 90,180 h 10 v -20 h -10 v 20",
				fillPath:"M 110,120 v -10 h -10 v -10 h -10 v -10 h -10 v -10 h -10 v -10 h -10 v -10 h -10 v -10 h -10 v -10 h -10 v -10 h -10 v -10 h -10 v 140 h 10 v -10 h 10 v -10 h 10 v -10 h 10 v 10 h 10 v 20 h 10 v 20 h 20 v -20 h -10 v -20 h -10 v -20 h 40"
			},
			{
				name:"pointer",
				viewBox:220,
				strokePath:"M 10,120 v 10 h 10 v -10 h -10 M 10,100 h 20 v -10 h -30 v 30 h 10 v -20 M 40,20 v 80 h -10 v 10 h 10 v 10 h 10 v -110 h -10 v 10 M 60,0 h -10 v 10 h 20 v -10 h -10 M 90,50 h -10 v -40 h -10 v 90 h 10 v -40 h 20 v -10 h -10 M 120,60 h -20 v 40 h 10 v -30 h 20 v -10 h -10 M 160,90 v 70 h 10 v -70 h -10 M 150,80 v 10 h 10 v -10 h -10 M 140,70 h -10 v 40 h 10 v -30 h 10 v -10 h -10 M 30,130 h -10 v 20 h 10 v -20 M 40,150 h -10 v 20 h 10 v -20 M 50,170 h -10 v 20 h 10 v -20 M 140,200 v 10 h -80 v -20 h -10 v 30 h 100 v -30 h -10 v 10 M 150,170 v 20 h 10 v -30 h -10 v 10",
				fillPath:"M 150,90 v -10 h -10 v 30 h -10 v -40 h -20 v 30 h -10 v -40 h -20 v 40 h -10 v -90 h -20 v 110 h -10 v -10 h -10 v -10 h -20 v 20 h 10 v 10 h 10 v 20 h 10 v 20 h 10 v 20 h 10 v 20 h 80 v -20 h 10 v -30 h 10 v -70 h -10"
			}
		];
		s.innerHTML=`
			:root{
				--hue:${h};
				${cursors.map(c=>{
					let b=new Blob([`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 ${c.viewBox} ${c.viewBox}">
							<path d="${c.strokePath}" fill="hsl(${h},100%)" />
							<path d="${c.fillPath}" fill="hsl(${h},40%)" />
						</svg>
					`],{type:"image/svg+xml",endings:"native"});
					let u=URL.createObjectURL(b);
					return `--${c.name}-cursor-image:url(${u});`;
				}).join("\n")}
			}
		`;
	}
});