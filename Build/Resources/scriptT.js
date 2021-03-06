window.res("specific",{
	map:(()=>{
		let f=(p,un,rect)=>{
			let x = p.x*2-1;
			let y = p.y*2-1;
			let h = (Math.atan2(y,x)/Math.PI+2)%2*180;
			let r = Math.min(rect.x/2,rect.y/2);
			let d = Math.min(Math.hypot(rect.x/2*x,rect.y/2*y)/r,1);
			return [h,1-d*0.9,1-d*0.1];
		};
		let a=[
			{
				name:"Vivid",
				calc:f,
				noCanvas:true
			},
			{
				name:"Vivid",
				calc:f
			}
		];
		if (!CSS.supports("background-image","conic-gradient(white,white)")) a.shift();
		return a;
	})(),
	frag:(()=>{
		return `
			precision mediump float;
			uniform vec2 frame;
			uniform float hue;
			uniform int mode;

			const float PI = atan(1.0,1.0)*4.0;

			float radius = min(frame.x/2.0,frame.y/2.0);

			vec2 coord() {
				return gl_FragCoord.xy-frame/2.0;
			}

			float arg(vec2 p) {
				if (p.x==0.0) {
					if (p.y==0.0) return 0.0;
					if (p.y>0.0) return 90.0;
					if (p.y<0.0) return 270.0;
				}
				else return mod(atan(p.y,p.x)*180.0/PI+360.0,360.0);
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
				float h = arg(p);
				float d = min(length(p)/radius,1.0);
				if (d==0.0) gl_FragColor = vec4(1.0,1.0,1.0,1.0);
				else {
					float m = 1.0-d*0.9;
					float M = 1.0-d*0.1;
					gl_FragColor = color(h,m,M);
				}
			}
		`;
	})()
});