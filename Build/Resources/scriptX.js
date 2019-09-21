window.main({
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
	})()
});