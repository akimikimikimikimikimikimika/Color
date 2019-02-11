(()=>{
    let cd=(id,cls)=>{let e=document.createElement("div");if (id) e.id=id;if (cls) e.className=cls;return e;},ap=(p,c)=>p.appendChild(c),sa=(e,k,v)=>e.setAttribute(k,v),sc=(e,c)=>e.className=c,id=i=>document.getElementById(i),ael=(e,t,l,o)=>e.addEventListener(t,l,o),apb=e=>ap(body(),e),html=document.documentElement,body=()=>document.body;
    var loading=true;
    let status=new Proxy({
        mode:"flower",
        standalone:false
    },{
        set:(o,p,v)=>{
            o[p]=v;
            sc(html,"js "+o.mode+(o.standalone?" standalone":""));
        }
    });
    status.standalone=navigator.standalone||(/standalone=yes/).test(location.search);
    let ccc=cd("circleContainer");
    let cc=ap(ccc,cd("circle"));
    let touch=ccc.ontouchstart===null;
    let f=n=>{
        let e=ap(cc,cd(null,n<18?"petal":"pistil"));
        if (n<18) e.style.transform=`rotate(-${n*20}deg)`;
        let h=`${n%18*20},${n<18?80:0}%`;
        let c=ap(e,cd());
        (()=>{
            let f=p=>{c.style.backgroundColor=`hsl(${h},${p?70:50}%)`;};
            ael(c,touch?"touchstart":"mouseover",()=>f(1));
            ael(c,touch?"touchend":"mouseout",()=>f(0));
            f(0);
        })();
    };
    for (var n=0;n<19;n++) f(n);
    let fep=()=>{
        let f=k=>{
            let u=id("use"+k),g=id(k);
            let f=g.firstElementChild,l=g.lastElementChild;
            let h=f.getAttribute("stop-color").match(/hsl\(([0-9]+,8?0%),85%\)/)[1];
            (()=>{
                let e=p=>{
                    sa(f,"stop-color",`hsl(${h},${p?91:85}%)`);
                    sa(l,"stop-color",`hsl(${h},${p?70:50}%)`);
                };
                ael(u,touch?"touchstart":"mouseover",()=>e(1));
                ael(u,touch?"touchend":"mouseout",()=>e(0));
            })();
        };
        for (var n=0;n<19;n++) f((n+10).toString(36).toUpperCase());
    };
    let cg=cd(null,"button change");
    (()=>{
        var flower=true,fto=null;
        let f=()=>{
            if (fto) {
                clearTimeout(fto);
                fto=null;
            }
            if (flower) {
                status.mode="toBeCircle";
                fto=setTimeout(()=>{
                    status.mode="circle";
                    fto=null;
                },500);
            }
            else {
                status.mode="toBeFlower";
                fto=setTimeout(()=>{
                    status.mode="flower";
                    fto=null;
                },500);
            }
            flower=!flower;
        };
        ael(ap(cg,cd()),"click",()=>{
            f();
            show();
            return false;
        });
        ael(html,"keydown",e=>{
            switch (e.key) {
                case "m":
                case "M":
                    f();
                    break;
                case "f":
                case "F":
                    if (!flower) f();
                    break;
                case "c":
                case "C":
                    if (flower) f();
                    break;
            }
            return false;
        });
        let h=()=>{
            let h=location.hash.replace(/^\#/,"");
            if (h) {
                switch (h) {
                    case "flower":
                        if (loading) status.mode="flower";
                        else if (!flower) f();
                        break;
                    case "circle":
                        if (loading) status.mode="circle";
                        else if (flower) f();
                        break;
                }
                location.hash="";
            }
        };
        setInterval(h,100);
        h();
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
        sc(body(),"show");
        wh=setTimeout(hide,3000);
    };
    let hide=()=>{
        sc(body(),"hiding");
        dh=setTimeout(()=>{sc(body(),"hide");},500);
    };
    ael(window,"load",()=>{
        fep();
        apb(ccc);
        apb(cg);
        if (status.standalone) apb(cd("statusbar"));
        let c=id("flowerContainer");
        let t=touch?"ontouchstart":"onmouseover";
        let f=()=>{
            show();
            return false;
        };
        c[t]=ccc[t]=()=>f();
        show();
        loading=false;
        onload=null;
    },{once:true});
})();