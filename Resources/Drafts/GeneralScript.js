(()=>{
    let cd=(cls,id)=>{let e=document.createElement("div");if (cls) e.className=cls;if (id) e.id=id;return e;},ap=(p,c)=>p.appendChild(c),rep=(n,o)=>o.parentNode.replaceChild(n,o),rc=e=>e.parentNode.removeChild(e),cn=e=>e.cloneNode(true),sa=(e,k,v)=>e.setAttribute(k,v),ra=(e,k)=>e.removeAttribute(k),ael=(e,t,l,o)=>e.addEventListener(t,l,o),sc=(e,c)=>e.className=c,id=i=>document.getElementById(i),apb=e=>ap(body(),e),html=document.documentElement,body=()=>document.body;
    let status=new Proxy({
        tone:"vivid",
        standalone:false
    },{
        set:(o,p,v)=>{
            o[p]=v;
            sc(html,"js "+o.tone+(o.standalone?" standalone":""));
        }
    });
    status.standalone=navigator.standalone||(/standalone=yes/).test(location.search);
    let v=cd("button vivid"),l=cd("button light"),d=cd("button dark");
    let touch=v.ontouchstart===null;
    (()=>{
        let c=t=>{
            status.tone=t;
            show();
            return false;
        };
        ael(ap(v,cd()),"click",()=>c("vivid"));
        ael(ap(l,cd()),"click",()=>c("light"));
        ael(ap(d,cd()),"click",()=>c("dark"));
        ael(html,"keydown",e=>{
            switch (e.key) {
                case "v":
                case "V":
                    status.tone="vivid";
                    break;
                case "l":
                case "L":
                    status.tone="light";
                    break;
                case "d":
                case "D":
                    status.tone="dark";
                    break;
            }
            return false;
        });
        let h=()=>{
            let h=location.hash.replace(/^\#/,"");
            if (h) {
                switch (h) {
                    case "vivid":
                    case "light":
                    case "dark":
                        status.tone=h;
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
    let fep=()=>{
        let fco=id("focusColor"),pis=id("pistilColor"),pet=id("petalColor"),defs=id("defs"),app=document.title.match(/Color ([A-S])/)[1];
        rc(fco);
        rc(pis);
        rc(pet);
        ra(id("pistil"),"fill");
        ra(id("petal"),"fill");
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
            ael(u,touch?"touchstart":"mouseover",()=>{rep(fc,s);return false;});
            ael(u,touch?"touchend":"mouseout",()=>{rep(s,fc);return false;});
        };
        for (var n=0;n<19;n++) f(n);
    };
    ael(window,"load",()=>{
        apb(v),apb(l),apb(d);
        if (status.standalone) apb(cd(null,"statusbar"));
        fep();
        let c=id("flowerContainer");
        ael(c,touch?"touchstart":"mouseover",()=>{show();return false;});
        show();
    },{once:true});
})();