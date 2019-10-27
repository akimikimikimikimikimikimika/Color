(()=>{
	let ce=e=>document.createElement(e),cd=(cls,id,text)=>{
		let e=ce("div");
		sc(e,cls);
		sa(e,"id",id);
		if (text) e.textContent=text;
		return e;
	},ap=(p,c)=>p.appendChild(c),rc=e=>e.parentNode.removeChild(e),cn=e=>e.cloneNode(true),ga=(e,k)=>e.getAttribute(k),sa=(e,k,v)=>{
		if (v) e.setAttribute(k,v);
		else e.removeAttribute(k);
		return e;
	},ael=(e,t,l,o)=>e.addEventListener(t,l,o),sc=(e,c)=>sa(e,"class",c),tc=(e,c)=>e.classList.toggle(c),id=i=>document.getElementById(i);

    let hue=n=>`${n%18*20},${n<18?80:0}%`;

    let solveThree=(()=>{
        let SQRT3=Math.sqrt(3);
        let two=(a,b,c)=>{
            let v1=-b/(2*a);
            let v2=(b**2)/(4*a**2)-c/a;
            if (v2>0) {
                let r=Math.sqrt(v2);
                return [{x:v1+r,y:0},{x:v1-r,y:0}];
            }
            if (v2<0) {
                let r=Math.sqrt(-v2);
                return [{x:v1,y:+r},{x:v1,y:-r}];
            }
            if (v2==0) return [{x:v1,y:0}];
        };
        let three=(a,b,c,d)=>{
            let nb=b/a,nc=c/a,nd=d/a;
            var l=two(1,2*nb**3-9*nb*nc+27*nd,(nb**2-3*nc)**3);
            if (l[0].y==0) {
                l=[l[0],l[1]?l[1]:l[0]];
                l=l.map(v=>Math.cbrt(v.x));
                return [
                    {x:(-nb+l[0]+l[1])/3,y:0},
                    {x:(-nb*2-l[0]-l[1])/6,y:(l[0]-l[1])*SQRT3/6},
                    {x:(-nb*2-l[0]-l[1])/6,y:(l[1]-l[0])*SQRT3/6}
                ];
            }
            else {
                let r=Math.cbrt(Math.hypot(l[0].y,l[0].x)),t=Math.atan2(l[0].y,l[0].x)/3;
                let x=r*Math.cos(t),y=r*Math.sin(t);
                return [
                    {x:(-nb+x*2)/3,y:0},
                    {x:(-nb-x-SQRT3*y)/3,y:0},
                    {x:(-nb-x+SQRT3*y)/3,y:0}
                ];
            }
        };
        return (a,b,c,d)=>three(a,b,c,d).filter(v=>v.y==0).map(v=>v.x);
    })();



    window.res("flower",(status)=>{

        var pistil,petal,petalDrop,sepal,pistilTransforming;
        var focused=[];

        let colors=()=>{
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
                        focused.push(e);
                        s();
                    }
                    ev.preventDefault();
                });
                ael(n,status.touch?"touchend":"mouseout",ev=>{
                    if (status.page0Mode!=1) {
                        let i=focused.findIndex(v=>v==e);
                        if (i>=0) focused.splice(i,1);
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
                        pistil=e;
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
                            sa(t,"style");
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
                                sa(d,"style");
                            }
                        });
                        ap(g,d);
                    }

                    var rg;
                    if (un==19) rg=id(c);
                    else rg=cn(n<18?pet:pis);
                    if (un<19) sa(rg,"id",c);
                    ap(defs,rg);
                    if (n==18) pistilTransforming=rg.firstChild;
                }
            });
        };
        let animate=(()=>{
            let dur=300;
            var t=0,lt=0,d=-1,r=false;
            let f=()=>{
                let ct=performance.now();
                if (lt) t+=d*(ct-lt);
                if ((t<=0)&&(d<0)) {
                    t=0;
                    r=false;
                    lt=0;
                    frame(0);
                    setTimeout(()=>exit(d),0);
                }
                else if ((t>=dur)&&(d>0)) {
                    t=dur;
                    r=false;
                    lt=0;
                    frame(1);
                    setTimeout(()=>exit(d),0);
                }
                else {
                    frame(ease(t/dur));
                    lt=ct;
                    requestAnimationFrame(f);
                }
            };
            return ()=>{
                if (!r) {
                    d*=-1;
                    enter();
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
        })();
        let enter=()=>{
            focused.forEach(f=>f());
            focused.length=0;
            status.page0Mode=1;
        };
        let frame=x=>{
            let t=`scale(${1-0.5*x})`;
            sa(pistil,"transform",t);
            sa(sepal,"transform",t);
            sa(petal,"transform",t);
            sa(petalDrop,"cx",672-336*x);
            sa(sepal,"opacity",`${1-x}`);
            sa(petal,"opacity",`${1-x}`);
            sa(petalDrop,"opacity",`${x}`);
            sa(pistilTransforming,"stop-color",`hsl(${hue(Math.min(status.color,18))},${(status.vivid?100:50)*x+85*(1-x)}%)`);
        };
        let exit=d=>{
            if (d>0) {
                sa(petalDrop,"opacity");
                status.page0Mode=2;
            }
            if (d<0) {
                sa(pistil,"transform");
                sa(sepal,"transform");
                sa(petal,"transform");
                sa(sepal,"opacity");
                sa(petal,"opacity");
                sa(pistilTransforming,"stop-color",null);
                status.page0Mode=0;
            }
        };
        let ease=(()=>{
            let a=0.42;
            let b=1-3*a;
            var p=0;
            return x=>{
                let s=solveThree(2*(b**3),9*a*(b**2)-6*(b**2)*x,6*b*x**2-18*a*b*x-27*(a**3),9*a*(x**2)-2*(x**3));
                let c=s.find(v=>(v>=0)||(v<=1));
                if (c!=undefined) {p=c;return c;}
                else return p;
            };
        })();

        let o={
            artifact:null,
            setup:()=>{
                let e=id("pageViewController").firstElementChild;
                ap(e,cd(null,"flower-bg"));
                o.artifact=e;
                sepal=id("sepal");
                petal=id("petal");
                petalDrop=id("petalDrop");
                colors();
            },
            modeChanged:()=>animate(),
        };
        return o;
    });

})();
