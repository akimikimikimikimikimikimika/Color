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
    },ael=(e,t,l,o)=>e.addEventListener(t,l,o),sc=(e,c)=>sa(e,"class",c),id=i=>document.getElementById(i),apb=e=>ap(document.body,e),html=document.documentElement;

    let clr=n=>(n+10).toString(36).toUpperCase();
    let hsl=(n,l)=>`hsl(${n%18*20},${n<18?80:0}%,${l}%)`;
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

    let status=(o=>{
        var msi=null;
        let msl=["menu-hidden","before-menu-shown","menu-shown","hiding-menu"];
        var ms=0;
        let u=t=>{
            let c=[
                "js",
                t.colorSchemePreferred?"pcs":(t.dark?"dark":"light"),
                (["flower","transforming","drops"])[t.page0Mode],
                t.noCanvas?"colorSpace-background":"colorSpace-canvas",
                t.descShown?"desc-shown":"desc-hidden",
                msl[ms]
            ];
            if (t.standalone) c.push("standalone");
            if (t.browser) c.push(t.browser.toLowerCase());
            if (t.touch) c.push("touch");
            sc(html,c.join(" "));
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
        let mm=s=>window.matchMedia(`(prefers-color-scheme: ${s})`).matches;
        s.colorSchemePreferred=mm("light")||mm("dark");
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
        colorSchemePreferred:false,
        touch:false,
        browser:null,
        standalone:false
    });

    let base=document.createDocumentFragment();

    let pages=[
        {
            artifact:null,
            setup:o=>{
                o.artifact=id("pageViewController").firstElementChild;
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
                        if (c=="S") o.pistil=e;
                        let n=parseInt(c,36)-10;
                        let d=cn(e);
                        if (un<19) sa(e,"fill",`url(#${c})`);
                        sa(e,"role","button");
                        focus(e,()=>{
                            if (status.page0Mode==2&&n==18) sa(e,"fill",hsl(n,(n==un)||(un==19)?70:50));
                            else if (nc.parentNode) rep(fc,nc);
                        },()=>{
                            if (status.page0Mode==2&&n==18) sa(e,"fill",hsl(un<19?un:n,50));
                            else if (fc.parentNode) rep(nc,fc);
                        });
                        if (n<18) {
                            sc(d,"petalDrop");
                            sa(d,"xlink:href","#petalDrop");
                            sa(d,"role","button");
                            sa(d,"fill",hsl((un<19)?un:n,50));
                            focus(d,()=>sa(d,"fill",hsl(n,(n==un)||(un==19)?70:50)),()=>sa(d,"fill",hsl((un<19)?un:n,50)));
                            ap(g,d);
                        }

                        var nc;
                        if (un==19) nc=id(c);
                        else nc=cn(n<18?pet:pis);
                        let fc=cn(nc);
                        let f=fc.firstElementChild,l=fc.lastElementChild;
                        if (un<19) {
                            sc(f);sc(l);
                            sa(fc,"id",c);
                            sa(nc,"id",c);
                        }
                        ap(defs,nc);
                        if (n==18) {
                            o.pistilFocused=fc;
                            o.pistilNormal=nc;
                        }
                        let w=(n==un)||(un==19);
                        sa(f,"stop-color",hsl(n,w?91:85));
                        sa(l,"stop-color",hsl(n,w?70:50));
                    }
                });
            },
            animate:(()=>{
                var t=0,lt=0,d=-1,r=false,o;
                let f=()=>{
                    let ct=performance.now();
                    if (lt) t+=d*(ct-lt);
                    if ((t<=0)&&(d<0)) {
                        t=0;
                        r=false;
                        lt=0;
                        o.frame(o,0);
                        o.exit(o,d);
                    }
                    else if ((t>=300)&&(d>0)) {
                        t=300;
                        r=false;
                        lt=0;
                        o.frame(o,1);
                        o.exit(o,d);
                    }
                    else {
                        o.frame(o,o.ease(t/300));
                        lt=ct;
                        requestAnimationFrame(f);
                    }
                };
                return ob=>{
                    if (!r) {
                        o=ob;
                        d*=-1;
                        o.enter(o,d);
                        r=true;
                        f();
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
            enter:(o,d)=>{
                let g=id("graphic");
                o.focused.forEach(f=>f());
                o.focused.length=0;
                status.page0Mode=1;
                if (d>0) {
                    if (o.pistilFocused.parentNode) rep(o.pistilNormal,o.pistilFocused);
                }
                if (d<0) sa(o.pistil,"fill","url(#S)");
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
                let un=status.color;
                sa(o.pistilNormal.firstElementChild,"stop-color",hsl(un<19?un:18,85-x*35));
            },
            exit:(o,d)=>{
                if (d>0) {
                    let un=status.color;
                    sa(o.petalDrop,"opacity");
                    sa(o.pistil,"fill",hsl(un<19?un:18,50));
                    if (o.pistilFocused.parentNode) rep(o.pistilNormal,o.pistilFocused);
                    status.page0Mode=2;
                }
                if (d<0) {
                    sa(o.pistil,"transform");
                    sa(o.sepal,"transform");
                    sa(o.petal,"transform");
                    sa(o.sepal,"opacity");
                    sa(o.petal,"opacity");
                    sa(o.pistilNormal.firstElementChild,"stop-color",status.color<18?null:hsl(18,85));
                    status.page0Mode=0;
                }
            },
            focused:[],
            sepal:null,
            pistil:null,
            pistilNormal:null,
            pistilFocused:null,
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
                o.artifact=a;
                ["normal","stroke","shadow"].forEach(c=>{
                    let ct=cd();
                    let t=ce("textarea");
                    t.value="TEXT";
                    ael(t,"focus",()=>o.focused=t);
                    ael(t,"blur",()=>{if (o.focused==t) o.focused=null;});
                    sc(t,c);
                    ap(ct,t);
                    ap(p,ct);
                });
            },
            focused:null,
            pageLeft:o=>{
                if (o.focused) {
                    o.focused.blur();
                    o.focused=null;
                }
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
        if (!status.colorSchemePreferred) mb(ap(m,cd(null,null,"CS")),()=>{
            status.dark=!status.dark;
        });
        let mode=()=>{
            let v=pages[status.page];
            v.modeChanged(v);
        };
        mb(ap(m,cd(null,null,"M")),mode);
        mb(ap(m,cd(null,null,"×")),close);
        mb(ap(base,cd(null,"menuButton")),()=>status.menuShown=!status.menuShown);
        ael(window,"keyup",e=>{
            switch (e.key) {
                case "c":case "C":
                    if (!status.colorSchemePreferred) status.dark=!status.dark;break;
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