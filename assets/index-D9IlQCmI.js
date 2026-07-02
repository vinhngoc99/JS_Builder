import{n as e}from"./rolldown-runtime-Bh1tDfsg.js";import{A as t,B as n,C as r,D as i,E as a,F as o,G as s,H as c,I as l,K as u,L as d,M as f,N as p,O as m,P as h,R as g,S as _,T as v,U as y,V as b,W as x,_ as S,a as ee,b as C,c as w,d as T,f as E,g as te,h as D,i as O,j as ne,k,l as re,m as A,n as ie,o as j,p as M,q as N,r as P,s as ae,t as F,u as oe,v as se,w as ce,x as le,y as ue,z as I}from"./icons-D_4dnivi.js";import{i as de,n as fe,r as pe,t as L}from"./vendor-Ctc1P1FD.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var R=e(N(),1),z=pe(),B={type:`none`,color:`transparent`},V={type:`solid`,color:`var(--bg-node)`},me={type:`solid`,color:`#4caf50`},he={width:0,color:`var(--border-color)`,style:`solid`,radius:0,cap:`round`,join:`round`},ge={enabled:!0,color:`rgba(0,0,0,0.3)`,blur:8,offsetX:0,offsetY:4,spread:0},H={content:``,fontFamily:`'Google Sans Text'`,fontSize:16,fontWeight:400,fontStyle:`normal`,textDecoration:`none`,color:`var(--text-primary)`,align:`center`,verticalAlign:`middle`,lineHeight:1.5,letterSpacing:0,padding:{top:10,right:14,bottom:10,left:14}},_e={type:`alert`,target:`Button clicked!`,link:`#`},ve={node:{width:220,height:250},text:{width:150,height:60},button:{width:120,height:40},image:{width:480,height:270},video:{width:280,height:157},shape:{width:100,height:100},icon:{width:60,height:60}},ye={width:2,color:`#6c6d80`,style:`solid`,lineType:`curve`},be={start:`none`,end:`arrow`,size:6},xe=e=>({...ye,color:e.stroke?.color||e.color||ye.color,width:e.stroke?.width??ye.width,style:e.stroke?.style||ye.style,lineType:e.stroke?.lineType||ye.lineType}),Se=e=>({...be,start:e.arrow?.start||e.startArrow||`none`,end:e.arrow?.end||e.endArrow||`none`,size:e.arrow?.size??be.size}),U=(e,t)=>{if(e===`dashed`)return`${t*4} ${t*2}`;if(e===`dotted`)return`${t} ${t*2}`};function Ce(e){return!!e&&!!e.fill&&typeof e.fill==`object`&&`type`in e.fill}function W(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function we(e,t){return W(e,`name`)?e.name??``:W(e,`title`)?e.title??``:t}function Te(e,t){return!e||typeof e!=`object`?{...t}:{...t,...e,type:e.type||t.type,color:e.color??t.color}}function Ee(e,t={}){return{...he,...e&&typeof e==`object`?e:{},width:e?.width??t.borderWidth??he.width,color:e?.color??t.borderColor??he.color,radius:e?.radius??t.borderRadius??he.radius}}function De(e){return{...ge,...e&&typeof e==`object`?e:{}}}function G(e,t=``){return e===null||e===!1?null:typeof e==`string`?{...H,content:e||t}:e&&typeof e==`object`?{...H,...e,content:e.content??t,padding:{...H.padding,...e.padding||{}}}:t?{...H,content:t}:null}function Oe(e,t={}){return{type:e?.type||t.actionType||`alert`,target:e?.target??t.actionTarget??``,link:e?.link??t.link??`#`}}function K(e){return e.type===`node`?{type:`solid`,color:e.backgroundColor||`var(--bg-node)`}:e.type===`button`?{type:`solid`,color:e.backgroundColor||`#4caf50`}:e.backgroundColor&&e.backgroundColor!==`transparent`?{type:`solid`,color:e.backgroundColor}:{...B}}function ke(e){return e.type===`text`?{...H,content:e.text||``,fontFamily:e.fontFamily||`'Google Sans Text'`,fontSize:e.fontSize||16,color:e.color||`var(--text-primary)`,align:e.textAlign||`center`}:e.type===`button`?{...H,content:e.text||`Action`,fontFamily:e.fontFamily||`'Google Sans Text'`,fontSize:e.fontSize||16,fontWeight:700,color:e.color||`#ffffff`,align:e.textAlign||`center`}:e.type===`shape`?{...H,content:e.text||``,fontFamily:e.fontFamily||`'Google Sans Text'`,fontSize:e.fontSize||14,color:e.color||`var(--text-primary)`,align:e.textAlign||`center`}:e.type===`node`?{...H,content:``,fontFamily:e.fontFamily||`'Google Sans Text'`,fontSize:e.fontSize||14,color:e.color||`var(--text-primary)`}:null}function q(e){let t={...e,id:e.id,type:e.type,name:we(e,`${e.type||`Element`} ${e.id?.substring?.(0,6)||``}`),x:e.x??0,y:e.y??0,width:e.width??100,height:e.height??100,rotation:e.rotation??0,scaleX:e.scaleX??1,scaleY:e.scaleY??1,opacity:e.opacity??1,visible:e.visible??e.isHidden!==!0,locked:e.locked??e.isLocked===!0,zIndex:e.zIndex??0,fill:Te(e.fill,B),stroke:Ee(e.stroke,e),shadow:De(e.shadow),text:G(e.text),parentId:e.parentId??null,groupId:e.groupId??null,interactive:e.interactive??e.enableExpandButton===!0,pinned:e.pinned??e.isPinned===!0,disabled:e.disabled??e.isDisabled===!0,isSlide:e.isSlide!==!1,fillParent:e.fillParent===!0,animations:Array.isArray(e.animations)?e.animations:[],aspectRatioLocked:e.aspectRatioLocked===!0};return t.type===`button`&&(t.action=Oe(e.action,e),t.text=G(e.text,`Action`)),t.type===`image`&&(t.src=e.src||``,t.alt=e.alt||``,t.objectFit=e.objectFit||`cover`,t.objectPosition=e.objectPosition||`50% 50%`),t.type===`video`&&(t.src=e.src||``),t.type===`shape`&&(t.shapeType=e.shapeType||`rectangle`,t.text=G(e.text,``)),t.type===`node`&&(t.text=G(e.text,``)),t.type===`icon`&&(t.iconName=e.iconName||`home`,t.iconColor=e.iconColor||e.color||`var(--text-primary)`),t}function Ae(e){if(Ce(e))return q(e);let t={id:e.id,type:e.type,name:we(e,`${e.type||`Element`} ${e.id?.substring?.(0,6)||``}`),x:e.x??0,y:e.y??0,width:e.width??100,height:e.height??100,rotation:e.rotation??0,scaleX:e.scaleX??1,scaleY:e.scaleY??1,opacity:e.opacity??1,visible:e.visible??e.isHidden!==!0,locked:e.locked??e.isLocked===!0,zIndex:e.zIndex??0,fill:K(e),stroke:Ee(e.stroke,e),shadow:De(e.shadow),text:ke(e),parentId:e.parentId??null,groupId:e.groupId??null,interactive:e.interactive??e.enableExpandButton===!0,pinned:e.pinned??e.isPinned===!0,disabled:e.disabled??e.isDisabled===!0,isSlide:e.isSlide!==!1,fillParent:e.fillParent===!0,animations:Array.isArray(e.animations)?e.animations:[],aspectRatioLocked:e.aspectRatioLocked===!0};switch(e.type){case`button`:return{...t,type:`button`,action:Oe(e.action,e)};case`image`:return{...t,type:`image`,src:e.src||``,alt:e.alt||``,objectFit:e.objectFit||`cover`,objectPosition:e.objectPosition||`50% 50%`};case`video`:return{...t,type:`video`,src:e.src||``};case`shape`:return{...t,type:`shape`,shapeType:e.shapeType||`rectangle`};case`node`:return{...t,type:`node`};case`icon`:return{...t,type:`icon`,iconName:e.iconName||`home`,iconColor:e.iconColor||e.color||`var(--text-primary)`};default:return{...t,type:`text`}}}function je(e=[]){return(e||[]).filter(Boolean).map(Ae)}function Me(e=[]){return(e||[]).filter(Boolean).map(e=>({...e,stroke:e.stroke?{...ye,...e.stroke}:e.stroke,arrow:e.arrow?{...be,...e.arrow}:e.arrow}))}function Ne(e=[]){return(e||[]).filter(Boolean).map(e=>({id:e.id||`default`,name:e.name||`Variant`,...e,elements:je(e.elements||[]),connections:Me(e.connections||[]),brushStrokes:e.brushStrokes||[],guides:e.guides||[]}))}var J=e=>e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`),Pe=(e,t)=>{let n;return((...r)=>{clearTimeout(n),n=setTimeout(()=>e(...r),t)})},Fe=(e,t,n)=>{let r=(t.x-n.x)**2+(t.y-n.y)**2;if(r===0)return Math.hypot(e.x-t.x,e.y-t.y);let i=((e.x-t.x)*(n.x-t.x)+(e.y-t.y)*(n.y-t.y))/r;i=Math.max(0,Math.min(1,i));let a=t.x+i*(n.x-t.x),o=t.y+i*(n.y-t.y);return Math.hypot(e.x-a,e.y-o)},Ie={variants:`js-builder-variants`,elements:`js-builder-elements`,connections:`js-builder-connections`,brush:`js-builder-brush`,guides:`js-builder-guides`,activeVariant:`js-builder-active-variant`,theme:`js-builder-theme`,snap:`js-builder-snap`,blur:`js-builder-blur`},Y=new class{KEYS=Ie;read(e,t){try{let n=localStorage.getItem(e);return n?JSON.parse(n):t}catch(n){return console.warn(`Failed to parse localStorage key "${e}", using fallback.`,n),t}}write(e,t){localStorage.setItem(e,JSON.stringify(t))}getString(e){return localStorage.getItem(e)}writeString(e,t){localStorage.setItem(e,t)}activeVariantId(){return localStorage.getItem(this.KEYS.activeVariant)||`default`}parsedVariants(){let e=localStorage.getItem(this.KEYS.variants);if(!e)return null;try{return JSON.parse(e)}catch(e){return console.warn(`Failed to parse variants, using fallback`,e),null}}activeVariantField(e,t,n){let r=this.activeVariantId(),i=localStorage.getItem(this.KEYS.variants);if(i)try{let t=JSON.parse(i).find(e=>e.id===r);if(t)return t[e]}catch{}return this.read(t,n)}saveElements=Pe(e=>{this.write(this.KEYS.elements,e)},500);saveConnections=Pe(e=>{this.write(this.KEYS.connections,e)},500);saveBrush=Pe(e=>{this.write(this.KEYS.brush,e)},500);saveVariants=Pe(e=>{this.write(this.KEYS.variants,e)},500);saveGuides(e){this.write(this.KEYS.guides,e)}saveTheme(e){this.writeString(this.KEYS.theme,e)}saveSnap(e){this.writeString(this.KEYS.snap,String(e))}saveBlur(e){this.writeString(this.KEYS.blur,String(e))}saveActiveVariantId(e){this.writeString(this.KEYS.activeVariant,e)}},Le={getElementCanvasBounds(e,t){let n=[e],r=e.parentId;for(;r;){let e=t.find(e=>e.id===r);if(!e)break;n.unshift(e),r=e.parentId}let i=n[0],a={x:i.x,y:i.y,width:i.width,height:i.height};for(let e of n.slice(1))a=e.fillParent?{x:a.x+16,y:a.y+45+16,width:Math.max(1,a.width-32),height:Math.max(1,a.height-45-32)}:{x:a.x+16+e.x,y:a.y+45+16+e.y,width:e.width,height:e.height};return a},findBrushAttachmentElementId(e,t){for(let n=t.length-1;n>=0;n--){let r=t[n];if(r.visible===!1)continue;let i=this.getElementCanvasBounds(r,t);if(e.some(e=>e.x>=i.x&&e.x<=i.x+i.width&&e.y>=i.y&&e.y<=i.y+i.height))return r.id}return null}},Re={home:`<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />`,settings:`<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />`,user:`<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />`,mail:`<rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />`,phone:`<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />`,search:`<circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />`,calendar:`<path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />`,lock:`<rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />`,unlock:`<rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" />`,check:`<polyline points="20 6 9 17 4 12" />`,x:`<path d="M18 6 6 18" /><path d="m6 6 12 12" />`,info:`<circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />`,help:`<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" />`,"alert-triangle":`<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />`,star:`<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />`,heart:`<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />`,trash:`<path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />`,edit:`<path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />`,share:`<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />`,play:`<polygon points="6 3 20 12 6 21 6 3" />`,pause:`<rect x="14" y="4" width="4" height="16" rx="1" /><rect x="6" y="4" width="4" height="16" rx="1" />`,image:`<rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.08-3.09a2 2 0 0 0-2.83 0L11 16" />`,video:`<path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" />`,"arrow-right":`<path d="M5 12h14" /><path d="m12 5 7 7-7 7" />`,"arrow-left":`<path d="M19 12H5" /><path d="m12 19-7-7 7-7" />`,"arrow-up":`<path d="m5 12 7-7 7 7" /><path d="M12 19V5" />`,"arrow-down":`<path d="M12 5v14" /><path d="m19 12-7 7-7-7" />`,plus:`<path d="M5 12h14" /><path d="M12 5v14" />`,minus:`<path d="M5 12h14" />`,folder:`<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />`,file:`<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" />`,globe:`<circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />`,database:`<ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />`,cloud:`<path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.42 0-.83.07-1.21.2A7 7 0 0 0 1.95 13c0 2.2 1.7 4 3.9 4H17.5Z" />`,download:`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />`,upload:`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />`,bell:`<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />`,gift:`<rect width="18" height="5" x="3" y="11" rx="1" /><path d="M12 22V11" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z" /><path d="M4 16v6h16v-6" />`,"map-pin":`<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />`,smile:`<circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />`,"user-check":`<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" />`,users:`<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />`,"user-plus":`<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="16" y1="11" x2="22" y2="11" />`,"user-minus":`<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="16" y1="11" x2="22" y2="11" />`,book:`<path d="M4 19.5v-15a2.5 2.5 0 0 1 2.5-2.5H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z" /><path d="M6 6h10" /><path d="M6 10h10" />`,"book-open":`<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />`,bookmark:`<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />`,eye:`<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />`,"eye-off":`<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" />`,compass:`<circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />`,list:`<line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />`,key:`<path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />`,sliders:`<line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="2" y1="14" x2="6" y2="14" /><line x1="10" y1="8" x2="14" y2="8" /><line x1="18" y1="16" x2="22" y2="16" />`,monitor:`<rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />`,"thumbs-up":`<path d="M7 22V11.302c.002-.396.124-.782.35-1.1L12.3 3.5a1 1 0 0 1 1.7.7V9h5a2 2 0 0 1 2 2v2a3.89 3.89 0 0 1-1.3 2.8L15 21a2 2 0 0 1-2 1H7Z" /><rect width="4" height="11" x="3" y="11" rx="1" />`,"thumbs-down":`<path d="M17 2v10.698c-.002.396-.124.782-.35 1.1L11.7 20.5a1 1 0 0 1-1.7-.7V15H5a2 2 0 0 1-2-2v-2a3.89 3.89 0 0 1 1.3-2.8L9 3a2 2 0 0 1 2-1h6Z" /><rect width="4" height="11" x="17" y="2" rx="1" />`,briefcase:`<rect width="20" height="14" x="2" y="7" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />`,camera:`<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" />`,"shopping-cart":`<circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />`,"credit-card":`<rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />`,trophy:`<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" /><path d="M12 2a6 6 0 0 0-6 6v3.5c0 3 2.5 5.5 6 5.5s6-2.5 6-5.5V8a6 6 0 0 0-6-6z" />`,activity:`<path d="M22 12h-4l-3 9L9 3l-3 9H2" />`,award:`<circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />`,battery:`<rect width="16" height="10" x="2" y="7" rx="2" ry="2" /><line x1="22" y1="11" x2="22" y2="13" />`,"bookmark-check":`<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /><polyline points="9 10 11 12 15 8" />`,"check-circle":`<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />`,clipboard:`<rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />`,cpu:`<rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 1v3" /><path d="M15 1v3" /><path d="M9 20v3" /><path d="M15 20v3" /><path d="M20 9h3" /><path d="M20 15h3" /><path d="M1 9h3" /><path d="M1 15h3" />`,"download-cloud":`<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 12v9" /><polyline points="8 17 12 21 16 17" />`,"upload-cloud":`<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 12v9" /><polyline points="16 16 12 12 8 16" />`,"external-link":`<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />`,feather:`<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /><line x1="16" y1="8" x2="2" y2="22" /><line x1="17.5" y1="15" x2="9" y2="15" />`,"file-text":`<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />`,flag:`<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" />`,"folder-open":`<path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.69.9H18a2 2 0 0 1 2 2v2" />`,"hard-drive":`<rect width="20" height="8" x="2" y="12" rx="2" /><path d="M2 12h20" /><path d="M5 16h.01" /><path d="M9 16h.01" />`,"image-off":`<line x1="2" y1="2" x2="22" y2="22" /><path d="M21 21H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14" /><path d="m10 10 3.08-3.09a2 2 0 0 1 2.83 0L21 12v6" /><circle cx="16" cy="5" r="2" />`,inbox:`<polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />`,link:`<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />`,music:`<path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />`,package:`<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />`,paperclip:`<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />`,"pie-chart":`<path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" />`,power:`<path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><line x1="12" y1="2" x2="12" y2="12" />`,send:`<line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />`,shield:`<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />`,terminal:`<polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />`,tool:`<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />`,wifi:`<path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" />`,anchor:`<line x1="12" y1="5" x2="12" y2="22" /><path d="M12 22a7 7 0 0 0 7-7h-2a5 5 0 0 1-10 0H5a7 7 0 0 0 7 7z" /><circle cx="12" cy="5" r="3" />`,clock:`<circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />`,coffee:`<path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />`,code:`<polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />`,tag:`<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />`,tv:`<rect width="20" height="15" x="2" y="7" rx="2" ry="2" /><polyline points="17 2 12 7 7 2" />`,archive:`<polyline points="21 8 21 21 3 21 3 8" /><rect width="22" height="5" x="1" y="3" rx="1" /><line x1="10" y1="12" x2="14" y2="12" />`,award_trophy:`<circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />`,bookmark_minus:`<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /><line x1="9" y1="10" x2="15" y2="10" />`,bookmark_plus:`<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /><line x1="12" y1="7" x2="12" y2="13" /><line x1="9" y1="10" x2="15" y2="10" />`,briefcase_medical:`<path d="M14 2H10a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4V4a2 2 0 0 0-2-2z" /><path d="M12 9v6" /><path d="M9 12h6" />`,brush:`<path d="m12 22 1-1c1.4-1.4 2.4-3.2 3-5.2l.5-1.8M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />`,calculator:`<rect width="16" height="20" x="4" y="2" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="16" y1="14" x2="16" y2="18" /><path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M12 18h.01" /><path d="M8 18h.01" />`,chrome:`<circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="21.17" y1="8" x2="12" y2="8" /><line x1="3.95" y1="6.06" x2="8.54" y2="14" /><line x1="10.88" y1="21.94" x2="15.46" y2="14" />`,disc:`<circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="2" />`,dribbble:`<circle cx="12" cy="12" r="10" /><path d="M19.13 5.09A9 9 0 0 1 15 12c-2.31-2.93-3.69-5.11-4-5.5-.32-.38-.9-1.2-1.39-1.5M4.9 19.1A9 9 0 0 1 12 15c2.31 2.93 3.69 5.11 4 5.5" /><path d="M12 2a10 10 0 0 0-6.88 2.77c.39.3 1 .82 1.38 1.23.31.39 1.69 2.57 4 5.5 4.14-6.9 1.5-12.27 1.5-12.27zm0 20a10 10 0 0 0 6.88-2.77c-.39-.3-1-.82-1.38-1.23-.31-.39-1.69-2.57-4-5.5-4.14 6.9-1.5 12.27-1.5 12.27z" />`,droplet:`<path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z" />`,eye_closed:`<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><path d="m5 15-2 2m4-4-3 3m14-3 3 3m-4-4 2 2" />`,fast_forward:`<polygon points="13 19 22 12 13 5 13 19" /><polygon points="2 19 11 12 2 5 2 19" />`,file_audio:`<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><circle cx="9" cy="16" r="2" /><path d="M11 16V10h4v2" />`,file_code:`<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="m8 13-2 2 2 2" /><path d="m12 17 2-2-2-2" />`,file_image:`<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><circle cx="9" cy="9" r="1.5" /><polygon points="18 16 14 12 11 15 9 13 5 17" />`,file_video:`<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="m14 13-4 3v-6z" />`,film:`<rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="17" x2="22" y2="17" /><line x1="17" y1="7" x2="22" y2="7" />`,fingerprint:`<path d="M2 12a10 10 0 0 1 13.7-9.3" /><path d="M5 18a8 8 0 0 1 12.3-6.5" /><path d="M8 22a6 6 0 0 1 9.9-4.7" /><path d="M12 12a2 2 0 1 1 4 0v2" /><path d="M14 12V8a4 4 0 0 0-8 0v4" /><path d="M18 12V6a6 6 0 0 0-12 0v6" />`,flashlight:`<path d="M18 6H6" /><path d="M16 12H8" /><path d="M12 2v4" /><path d="M15 12h-6l-2 7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1z" />`,flask:`<path d="M6 2h12" /><path d="M9 2v6L3 19a2 2 0 0 0 2 3h14a2 2 0 0 0 2-3L15 8V2" /><line x1="6" y1="16" x2="18" y2="16" />`,frown:`<circle cx="12" cy="12" r="10" /><path d="M16 16s-1.5-2-4-2-4 2-4 2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />`,gamepad:`<rect width="20" height="12" x="2" y="6" rx="2" /><line x1="6" y1="12" x2="10" y2="12" /><line x1="8" y1="10" x2="8" y2="14" /><line x1="15" y1="13" x2="15.01" y2="13" /><line x1="18" y1="11" x2="18.01" y2="11" />`,headphones:`<path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />`,history:`<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" />`,infinity:`<path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4z" />`,laptop:`<rect width="18" height="12" x="3" y="4" rx="2" ry="2" /><line x1="2" y1="20" x2="22" y2="20" /><line x1="12" y1="16" x2="12" y2="20" />`,layers:`<polygon points="12 2 2 7 12 12 22 7 12 2" /><polygon points="2 17 12 22 22 17 2 17" /><polygon points="2 12 12 17 22 12 2 12" />`,library:`<path d="m16 6 4 14" /><path d="M12 6v14" /><path d="M8 8v12" /><path d="M4 4v16" />`,lightbulb:`<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" />`,mic:`<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v1a7 7 0 0 1-14 0v-1" /><line x1="12" y1="19" x2="12" y2="22" />`,palette:`<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.32185 19.4633 5.32185 20.2111 4.85857 20.6744C4.39528 21.1377 3.64756 21.1377 3.18427 20.6744C1.1963 18.6864 0 15.9355 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C11.4477 24 11 23.5523 11 23C11 22.4477 11.4477 22 12 22Z" /><circle cx="7.5" cy="10.5" r="1.5" /><circle cx="11.5" cy="7.5" r="1.5" /><circle cx="16.5" cy="9.5" r="1.5" /><circle cx="15.5" cy="14.5" r="1.5" />`,puzzle:`<path d="M19.439 12.316a3.24 3.24 0 0 0-1.954-2.8 3.24 3.24 0 0 0 .5-1.7v-.03a3.24 3.24 0 0 0-3.238-3.24h-.03a3.24 3.24 0 0 0-1.7.5 3.24 3.24 0 0 0-2.8-1.954V3.03A3.24 3.24 0 0 0 6.979-.21v.03a3.24 3.24 0 0 0-3.238 3.24v.03a3.24 3.24 0 0 0 .5 1.7 3.24 3.24 0 0 0-1.954 2.8v4.356A3.24 3.24 0 0 0 .521 14.72a3.24 3.24 0 0 0 3.238 3.238h4.356a3.24 3.24 0 0 0 2.8 1.954 3.24 3.24 0 0 0 1.7-.5 3.24 3.24 0 0 0 1.7.5 3.24 3.24 0 0 0 2.8-1.954v-4.356a3.24 3.24 0 0 0 2.286-2.286Z" />`},ze=e=>Re[e]||Re.home;function Be(e){return new Proxy(e,{get(e,t){if(typeof t!=`string`)return e[t];if(t===`text`){let t=e.text;return t==null?``:typeof t==`string`?t:t.content||``}if(t in e)return e[t];if(t===`backgroundColor`)return e.fill?.type===`none`?`transparent`:e.fill?.color||`transparent`;if(t===`borderWidth`)return e.stroke?.width??0;if(t===`borderColor`)return e.stroke?.color||`transparent`;if(t===`borderRadius`)return e.stroke?.radius??0;if(t===`lineHeight`)return e.text?.lineHeight??1.5;if(t===`letterSpacing`)return e.text?.letterSpacing??0;if(t===`text`&&e.text!==null&&typeof e.text==`object`)return e.text;if(t===`color`)return e.text?.color||`var(--text-primary)`;if(t===`fontSize`)return e.text?.fontSize||16;if(t===`fontFamily`)return e.text?.fontFamily||`'Google Sans Text'`;if(t===`textAlign`)return e.text?.align||`center`;if(t===`isHidden`)return!e.visible;if(t===`isLocked`)return e.locked;if(t===`isDisabled`)return e.disabled;if(t===`isPinned`)return e.pinned;if(t===`enableExpandButton`)return e.interactive;if(t===`title`)return e.name||``;if(t===`actionType`&&e.type===`button`)return e.action?.type||`alert`;if(t===`actionTarget`&&e.type===`button`)return e.action?.target||``;if(t===`link`&&e.type===`button`)return e.action?.link||`#`;if(t===`src`&&(e.type===`image`||e.type===`video`))return e.src||``;if(t===`alt`&&e.type===`image`)return e.alt||``;if(t===`objectFit`&&e.type===`image`)return e.objectFit||`cover`;if(t===`objectPosition`&&e.type===`image`)return e.objectPosition||`50% 50%`;if(t===`shapeType`&&e.type===`shape`)return e.shapeType||`rectangle`;if(t===`iconName`&&e.type===`icon`)return e.iconName||`home`},set(e,t,n){return typeof t!=`string`||t in e?(e[t]=n,!0):t===`backgroundColor`?(e.fill={...e.fill,type:n===`transparent`?`none`:`solid`,color:n},!0):t===`borderWidth`?(e.stroke={...e.stroke,width:n},!0):t===`borderColor`?(e.stroke={...e.stroke,color:n},!0):t===`borderRadius`?(e.stroke={...e.stroke,radius:n},!0):t===`lineHeight`&&e.text?(e.text={...e.text,lineHeight:n},!0):t===`letterSpacing`&&e.text?(e.text={...e.text,letterSpacing:n},!0):t===`color`&&e.text?(e.text={...e.text,color:n},!0):t===`fontSize`&&e.text?(e.text={...e.text,fontSize:n},!0):t===`fontFamily`&&e.text?(e.text={...e.text,fontFamily:n},!0):t===`textAlign`&&e.text?(e.text={...e.text,align:n},!0):t===`isHidden`?(e.visible=!n,!0):t===`isLocked`?(e.locked=n,!0):t===`isDisabled`?(e.disabled=n,!0):t===`isPinned`?(e.pinned=n,!0):t===`enableExpandButton`?(e.interactive=n,!0):t===`title`?(e.name=n,!0):(e[t]=n,!0)}})}var Ve=[{name:`fadeIn`,label:`Fade In`,type:`entrance`,css:`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`},{name:`slideInLeft`,label:`Slide In (Left)`,type:`entrance`,css:`@keyframes slideInLeft { from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: translateX(0); } }`},{name:`slideInRight`,label:`Slide In (Right)`,type:`entrance`,css:`@keyframes slideInRight { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); } }`},{name:`slideInTop`,label:`Slide In (Top)`,type:`entrance`,css:`@keyframes slideInTop { from { opacity: 0; transform: translateY(-60px); } to { opacity: 1; transform: translateY(0); } }`},{name:`slideInBottom`,label:`Slide In (Bottom)`,type:`entrance`,css:`@keyframes slideInBottom { from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); } }`},{name:`zoomIn`,label:`Zoom In`,type:`entrance`,css:`@keyframes zoomIn { from { opacity: 0; transform: scale(0.3); } to { opacity: 1; transform: scale(1); } }`},{name:`bounceIn`,label:`Bounce In`,type:`entrance`,css:`@keyframes bounceIn { 0% { opacity: 0; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.05); } 70% { transform: scale(0.95); } 100% { transform: scale(1); } }`},{name:`flipInX`,label:`Flip In (Horizontal)`,type:`entrance`,css:`@keyframes flipInX { from { opacity: 0; transform: perspective(400px) rotateX(90deg); } to { opacity: 1; transform: perspective(400px) rotateX(0); } }`},{name:`flipInY`,label:`Flip In (Vertical)`,type:`entrance`,css:`@keyframes flipInY { from { opacity: 0; transform: perspective(400px) rotateY(90deg); } to { opacity: 1; transform: perspective(400px) rotateY(0); } }`},{name:`rotateIn`,label:`Rotate In`,type:`entrance`,css:`@keyframes rotateIn { from { opacity: 0; transform: rotate(-200deg) scale(0.5); } to { opacity: 1; transform: rotate(0) scale(1); } }`}],He=[{name:`fadeOut`,label:`Fade Out`,type:`exit`,css:`@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }`},{name:`slideOutLeft`,label:`Slide Out (Left)`,type:`exit`,css:`@keyframes slideOutLeft { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(-60px); } }`},{name:`slideOutRight`,label:`Slide Out (Right)`,type:`exit`,css:`@keyframes slideOutRight { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(60px); } }`},{name:`slideOutTop`,label:`Slide Out (Top)`,type:`exit`,css:`@keyframes slideOutTop { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-60px); } }`},{name:`slideOutBottom`,label:`Slide Out (Bottom)`,type:`exit`,css:`@keyframes slideOutBottom { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(60px); } }`},{name:`zoomOut`,label:`Zoom Out`,type:`exit`,css:`@keyframes zoomOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.3); } }`},{name:`shrinkOut`,label:`Shrink Out`,type:`exit`,css:`@keyframes shrinkOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0); } }`}],Ue=[{name:`pulse`,label:`Pulse`,type:`emphasis`,css:`@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.08); } 100% { transform: scale(1); } }`},{name:`bounce`,label:`Bounce`,type:`emphasis`,css:`@keyframes bounce { 0%, 100% { transform: translateY(0); } 30% { transform: translateY(-16px); } 50% { transform: translateY(-8px); } }`},{name:`shake`,label:`Shake`,type:`emphasis`,css:`@keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); } 20%, 40%, 60%, 80% { transform: translateX(6px); } }`},{name:`spin`,label:`Spin`,type:`emphasis`,css:`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`},{name:`flash`,label:`Flash`,type:`emphasis`,css:`@keyframes flash { 0%, 50%, 100% { opacity: 1; } 25%, 75% { opacity: 0; } }`},{name:`rubberBand`,label:`Rubber Band`,type:`emphasis`,css:`@keyframes rubberBand { 0% { transform: scaleX(1) scaleY(1); } 30% { transform: scaleX(1.25) scaleY(0.75); } 40% { transform: scaleX(0.75) scaleY(1.25); } 50% { transform: scaleX(1.15) scaleY(0.85); } 65% { transform: scaleX(0.95) scaleY(1.05); } 75% { transform: scaleX(1.05) scaleY(0.95); } 100% { transform: scaleX(1) scaleY(1); } }`},{name:`wobble`,label:`Wobble`,type:`emphasis`,css:`@keyframes wobble { 0% { transform: translateX(0) rotate(0); } 15% { transform: translateX(-8px) rotate(-5deg); } 30% { transform: translateX(6px) rotate(3deg); } 45% { transform: translateX(-5px) rotate(-3deg); } 60% { transform: translateX(3px) rotate(2deg); } 75% { transform: translateX(-2px) rotate(-1deg); } 100% { transform: translateX(0) rotate(0); } }`},{name:`heartBeat`,label:`Heartbeat`,type:`emphasis`,css:`@keyframes heartBeat { 0% { transform: scale(1); } 14% { transform: scale(1.15); } 28% { transform: scale(1); } 42% { transform: scale(1.15); } 70% { transform: scale(1); } }`},{name:`grow`,label:`Grow`,type:`emphasis`,css:`@keyframes grow { 0% { transform: scale(1); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }`},{name:`shrink`,label:`Shrink`,type:`emphasis`,css:`@keyframes shrink { 0% { transform: scale(1); } 50% { transform: scale(0.85); } 100% { transform: scale(1); } }`}],We=[...Ve,...He,...Ue],Ge=e=>!e||e===`#e0e0e0`||e===`var(--text-primary)`?`var(--text-primary)`:e,X=e=>!e||e===`#3a3c50`||e===`var(--border-color)`?`var(--border-color)`:e,Ke=(e,t)=>e===`node`&&(!t||t===`#242533`||t===`var(--bg-node)`)?`var(--bg-node)`:t||`transparent`;function qe(e){let{variants:t,activeVariantId:n,elements:r,connections:i,brushStrokes:a,guides:o,theme:s}=e,c=We.map(e=>e.css).join(`
`),l=e=>e?e.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,``).replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,``).replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,``).replace(/on\w+\s*=\s*(['"])(.*?)\1/gi,``):``,u=new Set,d={id:n,name:t.find(e=>e.id===n)?.name||`Variant 1`,elements:r,connections:i,brushStrokes:a,guides:o},f=t.map(e=>e.id===n?d:e);f.forEach(e=>{e.elements.forEach(e=>{let t=e.text?.fontFamily;if(t){let e=t.replace(/['"]/g,``).trim();e&&u.add(e)}}),e.connections.forEach(e=>{if(e.fontFamily){let t=e.fontFamily.replace(/['"]/g,``).trim();t&&u.add(t)}})});let p=new Set([`sans-serif`,`serif`,`monospace`,`arial`,`georgia`,`verdana`,`times new roman`,`courier new`,`trebuchet ms`,`impact`,`comic sans ms`]),m={"Lexend Deca":`Lexend+Deca:wght@100..900`,"Comic Neue":`Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700`,"Open Sans":`Open+Sans:ital,wght@0,300..800;1,300..800`,Roboto:`Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900`},h=[];u.forEach(e=>{if(p.has(e.toLowerCase())||e===`Google Sans Display`||e===`Google Sans Text`||e===`Google Sans Flex`)return;let t=m[e]||`${e.replace(/\s+/g,`+`)}:wght@300;400;500;700`;h.push(t)});let g=``;h.length>0&&(g=`<link href="https://fonts.googleapis.com/css2?${h.map(e=>`family=${e}`).join(`&`)}&display=swap" rel="stylesheet">`);let _={triangle:`50,0 100,100 0,100`,rightTriangle:`0,0 100,100 0,100`,diamond:`50,0 100,50 50,100 0,50`,pentagon:`50,0 100,38 82,100 18,100 0,38`,hexagon:`50,0 100,25 100,75 50,100 0,75 0,25`,parallelogram:`25,0 100,0 75,100 0,100`,trapezoid:`20,0 80,0 100,100 0,100`,star:`50,0 63,38 100,38 69,59 82,100 50,75 18,100 31,59 0,38 37,38`,arrowRight:`0,30 60,30 60,10 100,50 60,90 60,70 0,70`,arrowLeft:`100,30 40,30 40,10 0,50 40,90 40,70 100,70`,arrowUp:`30,100 30,40 10,40 50,0 90,40 70,40 70,100`,arrowDown:`30,0 30,60 10,60 50,100 90,60 70,60 70,0`},v=e=>{if(!e||e.type===`none`)return`background: transparent;`;if(e.type===`solid`)return`background: ${e.color||`transparent`};`;if(e.type===`gradient`&&e.gradient){let{type:t,stops:n,angle:r}=e.gradient,i=[...n].sort((e,t)=>e.offset-t.offset).map(e=>`${e.color} ${e.offset*100}%`).join(`, `);return t===`radial`?`background: radial-gradient(circle, ${i});`:`background: linear-gradient(${r}deg, ${i});`}return`background: transparent;`},y=(e,t,n)=>{if(!e||e.type===`none`)return{defs:``,fillValue:`transparent`};if(e.type!==`gradient`||!e.gradient)return{defs:``,fillValue:n||e.color||`transparent`};let r=[...e.gradient.stops].sort((e,t)=>e.offset-t.offset).map(e=>`<stop offset="${Math.round(e.offset*100)}%" stop-color="${J(e.color)}" />`).join(``),i=`svg-fill-${t}`;if(e.gradient.type===`radial`)return{defs:`<defs><radialGradient id="${i}">${r}</radialGradient></defs>`,fillValue:`url(#${i})`};let a=e.gradient.angle*Math.PI/180,o=Math.cos(a),s=Math.sin(a);return{defs:`<defs><linearGradient id="${i}" x1="${50-o*50}%" y1="${50-s*50}%" x2="${50+o*50}%" y2="${50+s*50}%">${r}</linearGradient></defs>`,fillValue:`url(#${i})`}},b=e=>{let t=e?.radius??0,n=t>0?`border-radius: ${t}px;`:``;return!e||e.width===0?`border: none; ${n}`:`border-width: ${e.width}px; border-style: ${e.style||`solid`}; border-color: ${e.color||`var(--border-color)`}; ${n}`},x=e=>!e||!e.enabled?`box-shadow: none;`:`box-shadow: ${e.offsetX}px ${e.offsetY}px ${e.blur}px ${e.spread||0}px ${e.color};`,S=e=>!e||!e.enabled?`filter: none;`:`filter: drop-shadow(${e.offsetX}px ${e.offsetY}px ${e.blur}px ${e.color});`,ee=e=>e===`dashed`?`8 4`:e===`dotted`?`2 2`:`none`,C=(e,t,n)=>{let r=new Map;t.forEach(e=>{r.has(e.fromId)||r.set(e.fromId,[]),r.get(e.fromId).push(e)});let i=new Set,a=new Set,o=new Set,s=new Map(e.map(e=>[e.id,e]));e.forEach(e=>{e.interactive&&(r.get(e.id)||[]).forEach(e=>{o.add(e.toId),a.add(e.id)})});let c=new Set;o.forEach(e=>c.add(e));let u=Array.from(o);for(;u.length>0;){let e=u.shift(),t=s.get(e);t&&t.pinned||(i.add(e),t&&!t.interactive&&(r.get(e)||[]).forEach(e=>{a.add(e.id),c.has(e.toId)||(c.add(e.toId),u.push(e.toId))}))}let d=(n,r=!1)=>{let a=Be(n),o=a,s=r&&o.fillParent,c=i.has(a.id),u=`pointer-events: auto;`;c?u=`opacity: 0; pointer-events: none;`:a.isDisabled&&(u=`filter: grayscale(1) contrast(0.5); opacity: 0.6;`,a.type!==`button`&&(u+=` pointer-events: none;`));let f=a.isHidden?`opacity: 0; pointer-events: none;`:``,p=a.type!==`shape`&&a.type!==`icon`?x(n.shadow):``,m=[`node`,`text`,`button`,`image`,`video`].includes(a.type)?`border-radius: ${n.stroke?.radius??(a.type===`node`?10:a.type===`button`?6:0)}px;`:``,h=s?`position: absolute; left: 0; top: 0; width: 100%; height: 100%; color: var(--text-primary); --element-transform: rotate(0deg); transform: var(--element-transform); transform-origin: center center; z-index: ${a.zIndex??(a.type===`node`?1:2)}; opacity: ${a.opacity??1}; ${p} ${m} transition: opacity 0.4s ease; ${u}`:`position: absolute; left: ${a.x}px; top: ${a.y}px; width: ${a.width}px; height: ${a.height}px; color: var(--text-primary); --element-transform: rotate(${a.rotation||0}deg); transform: var(--element-transform); transform-origin: center center; z-index: ${a.zIndex??(a.type===`node`?1:2)}; opacity: ${a.opacity??1}; ${p} ${m} transition: opacity 0.4s ease; ${u}`,g=``;if(a.enableExpandButton){let e=t.filter(e=>e.fromId===a.id);if(e.length>0){let t={top:[],right:[],bottom:[],left:[]};e.forEach(e=>{let n=e.fromPort||`bottom`;t[n]&&t[n].push(e)});let n={top:`▲`,bottom:`▼`,left:`◀`,right:`▶`};for(let[e,r]of Object.entries(t)){if(r.length===0)continue;let t=r.map(e=>e.toId).join(`,`),i=r.map(e=>e.interactiveBtnText||(e.label?`YES`:``)).filter(Boolean),o=i.length>0?J(i.join(` / `)):n[e],s=`<button class="conn-btn" data-targets="`+t+`" onclick="event.stopPropagation(); toggleMultipleTargets(this, '`+t+`', '`+a.id+`')">`+o+`</button>`;g+=`<div class="conn-btn-group `+e+`">`+s+`</div>`}}}let C=a.enableExpandButton?`onclick="toggleNodeArrows(event, '${a.id}')"`:``;if(a.type===`node`){let t=e.filter(e=>e.parentId===a.id).map(e=>d(e,!0)).join(`
`),i=J(a.title||``),o=`color: ${Ge(a.color)};`;return`<div id="el-wrapper-${a.id}" ${C} class="${r?``:`draggable-element`} is-node ${a.isDisabled?`disabled`:``} ${c?`is-hidden`:``}" data-id="${a.id}" style="${h} overflow: visible; cursor: grab;"><div style="width: 100%; height: 100%; ${v(n.fill)} font-family: ${a.fontFamily}; ${b(n.stroke)} display: flex; flex-direction: column; overflow: hidden; transition: opacity 0.3s; ${f}"><div style="padding: 12px 16px; background-color: var(--panel-header-bg); font-size: 14px; font-weight: 600; border-bottom: 1px solid var(--border-color); pointer-events: none; ${o}">${i}</div><div style="position: relative; flex: 1; padding: 16px; overflow: hidden;">${t}</div></div>${g}</div>`}let w=``;switch(a.type){case`text`:{let e=l(a.text),t=n.text?.verticalAlign===`top`?`flex-start`:n.text?.verticalAlign===`bottom`?`flex-end`:`center`;w=`<div id="el-${a.id}" style="width: 100%; height: 100%; color: ${Ge(a.color)}; font-size: ${a.fontSize}px; font-family: ${a.fontFamily}; ${v(n.fill)} ${b(n.stroke)} display: flex; align-items: ${t}; justify-content: center; padding: ${n.text?.padding?.top??10}px ${n.text?.padding?.right??14}px ${n.text?.padding?.bottom??10}px ${n.text?.padding?.left??14}px; font-weight: ${n.text?.fontWeight??400}; font-style: ${n.text?.fontStyle??`normal`}; text-decoration: ${n.text?.textDecoration??`none`}; letter-spacing: ${n.text?.letterSpacing??0}px; line-height: ${n.text?.lineHeight??1.5}; box-sizing: border-box; overflow: hidden; pointer-events: none;"><div style="width: 100%; text-align: ${a.textAlign||`center`}; word-break: break-word; line-height: ${n.text?.lineHeight??1.5}; letter-spacing: ${n.text?.letterSpacing??0}px;">${e}</div></div>`;break}case`button`:{let e=l(a.text),t=``,r=a.actionType,i=a.actionTarget,s=`if(window.blockClick){window.blockClick=false;event?.preventDefault();return;}`;r===`alert`?t=`onclick="${s} event.stopPropagation(); showNotification('${J(i).replace(/'/g,`\\'`)}')"`:r===`link`?t=`href="${J(a.link)}" target="_blank" rel="noopener noreferrer" onclick="${s} event.stopPropagation();"`:r===`toggleDisabled`?t=`onclick="${s} event.stopPropagation(); toggleDisabled('${J(i).replace(/'/g,`\\'`)}')"`:r===`toggleVisibility`?t=`onclick="${s} event.stopPropagation(); toggleVisibility('${J(i).replace(/'/g,`\\'`)}')"`:r===`triggerFlow`?t=`onclick="${s} event.stopPropagation(); triggerFlow('${J(i).replace(/'/g,`\\'`)}')"`:r===`nextSlide`?t=`onclick="${s} event.stopPropagation(); nextSlide()"`:r===`prevSlide`?t=`onclick="${s} event.stopPropagation(); prevSlide()"`:r===`goToSlide`&&(t=`onclick="${s} event.stopPropagation(); goToSlideById('${J(i).replace(/'/g,`\\'`)}')"`);let c=r===`link`?`a`:`button`,u=r!==`link`&&a.isDisabled?`disabled`:``,d=n.text?.verticalAlign===`top`?`flex-start`:n.text?.verticalAlign===`bottom`?`flex-end`:`center`;w=`<${c} id="el-${a.id}" ${t} ${u} class="${a.isDisabled?`disabled`:``}" style="width: 100%; height: 100%; font-family: ${a.fontFamily}; ${v(n.fill)} ${b(n.stroke)} color: ${Ge(a.color)}; cursor: pointer; display: flex; align-items: ${d}; justify-content: center; text-decoration: none; font-weight: ${n.text?.fontWeight??700}; font-style: ${n.text?.fontStyle??`normal`}; text-decoration: ${n.text?.textDecoration??`none`}; font-size: ${o.fontSize||16}px; padding: ${n.text?.padding?.top??8}px ${n.text?.padding?.right??14}px ${n.text?.padding?.bottom??8}px ${n.text?.padding?.left??14}px; line-height: ${n.text?.lineHeight??1.5}; letter-spacing: ${n.text?.letterSpacing??0}px; box-sizing: border-box;"><div style="width: 100%; text-align: ${a.textAlign||`center`}; word-break: break-word; line-height: ${n.text?.lineHeight??1.5}; letter-spacing: ${n.text?.letterSpacing??0}px;">${e}</div></${c}>`;break}case`image`:{let e=o.title?J(o.title):``,t=(()=>{if(!a.src||!a.src.includes(`lh3.googleusercontent.com`))return a.src;let e=a.imageQuality;if(e===void 0)return a.src;let t=a.src.replace(/=s\d+$/,``);return e===100?`${t}=s0`:`${t}=s${Math.round(40*e)}`})(),r=J(a.alt);w=`<div style="width: 100%; height: 100%; display: flex; flex-direction: column; overflow: hidden;">${e?`<div style="padding: 6px 12px; background-color: var(--panel-header-bg); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; font-size: ${o.fontSize||11}px; font-weight: 700; color: var(--text-secondary); width: 100%; text-transform: uppercase; letter-spacing: 0.5px; flex-shrink: 0;">${e}</div>`:``}<div style="flex: 1; position: relative; overflow: hidden;"><img id="el-${a.id}" src="${J(t)}" alt="${r}" style="width: 100%; height: 100%; object-fit: ${a.objectFit}; object-position: ${o.objectPosition||`50% 50%`}; ${b(n.stroke)} box-sizing: border-box; pointer-events: none;" draggable="false" loading="lazy" decoding="async" /></div></div>`;break}case`video`:{let e=o.title?J(o.title):``,t=J(a.src);w=`<div style="width: 100%; height: 100%; display: flex; flex-direction: column; overflow: hidden;">${e?`<div style="padding: 6px 12px; background-color: var(--panel-header-bg); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; font-size: ${o.fontSize||11}px; font-weight: 700; color: var(--text-secondary); width: 100%; text-transform: uppercase; letter-spacing: 0.5px; flex-shrink: 0;">${e}</div>`:``}<div style="flex: 1; position: relative; overflow: hidden;"><iframe id="el-${a.id}" src="${t}" style="width: 100%; height: 100%; ${b(n.stroke)} box-sizing: border-box;" frameborder="0" allowfullscreen sandbox="allow-scripts allow-same-origin"></iframe></div></div>`;break}case`icon`:{let e=ze(a.iconName||`home`),t=S(n.shadow);w=`<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;"><svg viewBox="0 0 24 24" width="100%" height="100%" stroke="${a.iconColor||a.color||`var(--text-primary)`}" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block; ${t}">${e}</svg></div>`;break}case`shape`:{let e=!!a.text,t=n.text?.verticalAlign===`top`?`flex-start`:n.text?.verticalAlign===`bottom`?`flex-end`:`center`,r=e?`<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: ${t}; justify-content: center; pointer-events: none; padding: ${n.text?.padding?.top??8}px ${n.text?.padding?.right??8}px ${n.text?.padding?.bottom??8}px ${n.text?.padding?.left??8}px; box-sizing: border-box; overflow: hidden;"><div style="width: 100%; color: ${Ge(a.color)}; font-size: ${a.fontSize||14}px; font-family: ${a.fontFamily||`sans-serif`}; text-align: ${a.textAlign||`center`}; word-break: break-word; font-weight: ${n.text?.fontWeight??400}; font-style: ${n.text?.fontStyle??`normal`}; text-decoration: ${n.text?.textDecoration??`none`}; line-height: ${n.text?.lineHeight??1.5}; letter-spacing: ${n.text?.letterSpacing??0}px;">${l(a.text)}</div></div>`:``;if(a.shapeType===`rectangle`)w=`<div id="el-${a.id}" style="position: relative; width: 100%; height: 100%; ${v(n.fill)} ${b(n.stroke)} pointer-events: none;">${r}</div>`;else if(a.shapeType===`ellipse`)w=`<div id="el-${a.id}" style="position: relative; width: 100%; height: 100%; ${v(n.fill)} ${b(n.stroke)} border-radius: 50%; pointer-events: none;">${r}</div>`;else if(a.shapeType===`line`)w=`<div style="position: relative; width: 100%; height: 100%; pointer-events: none;"><svg id="el-${a.id}" width="100%" height="100%" style="overflow: visible; pointer-events: none; ${S(n.shadow)}"><line x1="0" y1="0" x2="${a.width}" y2="${a.height}" stroke="${n.stroke?.color||X(a.borderColor)}" stroke-width="${n.stroke?.width??a.borderWidth}" stroke-dasharray="${ee(n.stroke?.style)}" /></svg>${r}</div>`;else if(a.shapeType===`arrow`){let e=`arrowhead-${a.id}`;w=`<div style="position: relative; width: 100%; height: 100%; pointer-events: none;"><svg id="el-${a.id}" width="100%" height="100%" style="overflow: visible; pointer-events: none; ${S(n.shadow)}"><defs><marker id="${e}" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="${n.stroke?.color||X(a.borderColor)}" /></marker></defs><line x1="0" y1="0" x2="${a.width}" y2="${a.height}" stroke="${n.stroke?.color||X(a.borderColor)}" stroke-width="${n.stroke?.width??a.borderWidth}" stroke-dasharray="${ee(n.stroke?.style)}" marker-end="url(#${e})" /></svg>${r}</div>`}else if(a.shapeType===`elbow`){let e=a.width/2,t=`M 0 0 L ${e} 0 L ${e} ${a.height} L ${a.width} ${a.height}`;w=`<div style="position: relative; width: 100%; height: 100%; pointer-events: none;"><svg id="el-${a.id}" width="100%" height="100%" style="overflow: visible; pointer-events: none; ${S(n.shadow)}"><path d="${t}" fill="none" stroke="${n.stroke?.color||X(a.borderColor)}" stroke-width="${n.stroke?.width??a.borderWidth}" stroke-dasharray="${ee(n.stroke?.style)}" /></svg>${r}</div>`}else{let e=_[a.shapeType]||_.triangle,t=y(n.fill,a.id,a.backgroundColor);w=`<div style="position: relative; width: 100%; height: 100%; pointer-events: none;"><svg id="el-${a.id}" width="100%" height="100%" preserveAspectRatio="none" style="overflow: visible; pointer-events: none; ${S(n.shadow)}">${t.defs}<polygon points="${e}" fill="${t.fillValue}" stroke="${n.stroke?.color||X(a.borderColor)}" stroke-width="${n.stroke?.width??a.borderWidth}" stroke-dasharray="${ee(n.stroke?.style)}" vector-effect="non-scaling-stroke" /></svg>${r}</div>`}break}}return w=`<div style="width: 100%; height: 100%; transition: opacity 0.3s; ${f}">${w}</div>`,`<div id="el-wrapper-${a.id}" ${C} class="${r?``:`draggable-element`} ${a.type===`button`?`is-button`:``} ${a.isDisabled?`disabled`:``} ${c?`is-hidden`:``}" data-id="${a.id}" style="${h} cursor: grab; overflow: visible;">${w}${g}</div>`},f=t.map(t=>{let n=e.find(e=>e.id===t.fromId),r=e.find(e=>e.id===t.toId),i=a.has(t.id)||n&&!n.visible||r&&!r.visible,o=t.label?J(t.label):``,s=t.fontFamily?` font-family="${t.fontFamily.replace(/"/g,`&quot;`)}"`:``,c=t.fontSize||14,l=xe(t),u=Se(t),d=t.color||`var(--text-primary)`,f=l.color,p=l.width,m=U(l.style,l.width),h=`arrow-start-${t.id}`,g=`arrow-end-${t.id}`,_=u.start===`none`?``:`marker-start="url(#${h})"`,v=u.end===`none`?``:`marker-end="url(#${g})"`,y=m?`stroke-dasharray="${m}"`:``,b=(e,t,n)=>{if(e===`circle`)return`<marker id="${t}" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="${u.size}" markerHeight="${u.size}" orient="${n}"><circle cx="5" cy="5" r="3.2" fill="${f}" /></marker>`;if(e===`diamond`)return`<marker id="${t}" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="${u.size}" markerHeight="${u.size}" orient="${n}"><path d="M 5 0.8 L 9.2 5 L 5 9.2 L 0.8 5 Z" fill="${f}" /></marker>`;let r=e===`triangle`?`M 1 1 L 9 5 L 1 9 Z`:`M 0 1.5 L 10 5 L 0 8.5 Z`;return`<marker id="${t}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="${u.size}" markerHeight="${u.size}" orient="${n}"><path d="${r}" fill="${f}" /></marker>`},x=`<defs>${u.start===`none`?``:b(u.start,h,`auto-start-reverse`)}${u.end===`none`?``:b(u.end,g,`auto`)}</defs>`,S=o?t.labelAlignment===`follow`?t.reverseLabelDirection?`<path id="conn-text-${t.id}" fill="none" stroke="none" pointer-events="none" /><text fill="${d}" font-size="${c}"${s} dy="-5" pointer-events="none" font-weight="bold"><textPath href="#conn-text-${t.id}" startOffset="50%" text-anchor="middle">${o}</textPath></text>`:`<text fill="${d}" font-size="${c}"${s} dy="-5" pointer-events="none" font-weight="bold"><textPath href="#conn-${t.id}" startOffset="50%" text-anchor="middle">${o}</textPath></text>`:`<foreignObject id="conn-label-${t.id}" x="0" y="0" width="400" height="40" pointer-events="none"><div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; pointer-events: none;"><span style="background: var(--bg-canvas); padding: 3px 10px; border-radius: 100px; font-size: ${c}px; color: ${d}; font-weight: bold; white-space: nowrap; border: 1px solid var(--border-color); box-shadow: 0 2px 8px rgba(0,0,0,0.15);${t.fontFamily?` font-family: ${t.fontFamily};`:``}">${o}</span></div></foreignObject>`:``;return`<g id="conn-group-${t.id}" class="connection-group ${i?`is-hidden`:``}" data-id="${t.id}" data-from="${t.fromId}" data-to="${t.toId}" data-label="${J(t.label||``)}" data-align="${t.labelAlignment||`horizontal`}" style="cursor: pointer; transition: opacity 0.4s ease; opacity: 0;">${x}<path id="conn-${t.id}" fill="none" stroke="${f}" stroke-width="${p}" stroke-linecap="round" stroke-linejoin="round" ${y} data-line-type="${l.lineType}" ${_} ${v} /><path id="conn-pulse-${t.id}" class="flow-pulse-path" fill="none" stroke="${f}" stroke-width="${Math.max(2,p)}" stroke-linecap="round" /><path id="conn-hit-${t.id}" stroke="transparent" stroke-width="${Math.max(20,p+16)}" fill="none" />${S}</g>`}).join(`
`),p=n.map(e=>{let t=e.attachedNodeId&&(i.has(e.attachedNodeId)||s.get(e.attachedNodeId)?.visible===!1)?`style="opacity: 0; pointer-events: none; transition: opacity 0.4s ease;"`:`style="transition: opacity 0.4s ease;"`,n=e.points.map(e=>`${e.x},${e.y}`).join(` `);return`<path d="${e.points.map((e,t)=>`${t===0?`M`:`L`} ${e.x} ${e.y}`).join(` `)}" data-pts="${n}" fill="none" stroke="${e.color}" stroke-width="${e.width}" stroke-linecap="round" stroke-linejoin="round" pointer-events="none" ${e.attachedNodeId?`data-attached-node-id="${e.attachedNodeId}"`:``} ${t} />`}).join(`
`);return{rootElements:e.filter(e=>!e.parentId).map(e=>d(e)).join(`
`),svgPaths:f,brushPaths:p,hiddenNodes:Array.from(i),hiddenConnections:Array.from(a)}},w=f.map(e=>{let t=C(e.elements,e.connections,e.brushStrokes);return{id:e.id,name:e.name,rootElements:t.rootElements,svgPaths:t.svgPaths,brushPaths:t.brushPaths,elements:e.elements,connections:e.connections,brushStrokes:e.brushStrokes,guides:e.guides,hiddenNodes:t.hiddenNodes,hiddenConnections:t.hiddenConnections}}),T=w.find(e=>e.id===n)||w[0],E=e=>JSON.stringify(e).replace(/</g,`\\u003c`).replace(/>/g,`\\u003e`).replace(/&/g,`\\u0026`).replace(/\u2028/g,`\\u2028`).replace(/\u2029/g,`\\u2029`);return`<!doctype html>
      <html>
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${g}
      <link href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        @font-face {
          font-family: 'Google Sans Display';
          src: url('https://fonts.gstatic.com/s/productsans/v5/HYvgU2fE2nRJvZ5JFAumwegdm0LZdjqr5-oayXSOefg.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Google Sans Text';
          src: url('https://fonts.gstatic.com/s/productsans/v5/HYvgU2fE2nRJvZ5JFAumwegdm0LZdjqr5-oayXSOefg.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Google Sans Flex';
          src: url('https://fonts.gstatic.com/s/productsans/v5/HYvgU2fE2nRJvZ5JFAumwegdm0LZdjqr5-oayXSOefg.woff2') format('woff2');
        }
        :root {
          --bg-canvas: #17181f;
          --bg-panel: rgba(22, 23, 33, 0.6);
          --bg-toolbar: #242533;
          --bg-node: #242533;
          --text-primary: #ffffff;
          --text-secondary: #8c8d9c;
          --border-color: #3a3c50;
          --input-bg: rgba(10, 11, 16, 0.6);
          --input-focus-bg: rgba(15, 16, 23, 0.8);
          --grid-dot: #3a3c50;
          --btn-bg: #3a3c50;
          --btn-hover-bg: #4a4c62;
          --panel-header-bg: #1a1b26;
        }
        body.light-theme {
          --bg-canvas: #f8f9fa;
          --bg-panel: rgba(255, 255, 255, 0.85);
          --bg-toolbar: #ffffff;
          --bg-node: #ffffff;
          --text-primary: #1f2937;
          --text-secondary: #4b5563;
          --border-color: #e5e7eb;
          --input-bg: #f9fafb;
          --input-focus-bg: #ffffff;
          --grid-dot: #cccccc;
          --btn-bg: #e5e7eb;
          --btn-hover-bg: #d1d5db;
          --panel-header-bg: #f3f4f6;
        }
        body { margin: 0; padding: 0; overflow: hidden; background: var(--bg-canvas); font-family: 'Google Sans Text', sans-serif; color: var(--text-primary); transition: background 0.3s, color 0.3s; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 3px; transition: background 0.2s; }
        ::-webkit-scrollbar-thumb:hover { background: var(--text-secondary); }
        * { scrollbar-width: thin; scrollbar-color: var(--border-color) transparent; }
        .variant-dropdown-container {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 10000;
          font-family: inherit;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        body.presentation-mode .variant-dropdown-container {
          opacity: 0;
          pointer-events: none;
          transform: translateY(-20px);
        }
        .variant-dropdown-trigger {
          background: var(--bg-toolbar);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 10px 18px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .variant-dropdown-trigger:hover {
          background: var(--btn-hover-bg);
          border-color: var(--text-secondary);
        }
        .dropdown-chevron {
          transition: transform 0.25s ease;
        }
        .variant-dropdown-container.open .dropdown-chevron {
          transform: rotate(180deg);
        }
        .variant-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          background: var(--bg-toolbar);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 180px;
          box-shadow: 0 12px 32px rgba(0,0,0,0.4);
          opacity: 0;
          transform: translateY(-10px) scale(0.95);
          pointer-events: none;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: top left;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .variant-dropdown-container.open .variant-dropdown-menu {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }
        .variant-menu-item {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .variant-menu-item:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }
        body.light-theme .variant-menu-item:hover {
          background: rgba(0, 0, 0, 0.05);
        }
        .variant-menu-item.active {
          background: #3f51b5;
          color: #ffffff;
          font-weight: 600;
        }
        body.presentation-mode #interactive-content { transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1); }
        .draggable-element { transition: transform 0.05s linear; }
        .notification-toast { position: fixed; top: 76px; right: 20px; max-width: min(420px, calc(100vw - 40px)); background: var(--bg-toolbar); color: var(--text-primary); padding: 14px 20px; border-radius: 10px; box-shadow: 0 12px 32px rgba(0,0,0,0.6); z-index: 10000; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform: translateX(120%); opacity: 0; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px; pointer-events: none; }
        .notification-toast.show { transform: translateX(0); opacity: 1; }
        .zoom-controls { position: fixed; bottom: 20px; right: 20px; background: var(--bg-toolbar); padding: 4px; padding-left: 12px; border-radius: 20px; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px; color: var(--text-primary); z-index: 1000; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
        .html-context-menu { position: fixed; display: none; min-width: 140px; padding: 6px; background: var(--bg-toolbar); border: 1px solid var(--border-color); border-radius: 8px; box-shadow: 0 12px 32px rgba(0,0,0,0.55); z-index: 10001; }
        .html-context-menu.open { display: block; }
        .html-context-menu button { width: 100%; display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: transparent; border: none; border-radius: 6px; color: var(--text-primary); font-size: 12px; font-weight: 600; cursor: pointer; text-align: left; }
        .html-context-menu button:hover { background: rgba(92,107,192,0.2); }
        .runtime-text-selected { outline: 1px solid #4caf50; outline-offset: 2px; }
        .runtime-text-content[contenteditable="true"] { outline: 1px solid #4caf50; background: rgba(0,0,0,0.18); cursor: text; pointer-events: auto; }
        .html-context-menu button.danger { color: #ef5350; }
        .html-context-menu button.danger:hover { background: rgba(239,83,80,0.14); }
        .btn-fit { background: #3f51b5; border: none; color: white; padding: 6px 14px; border-radius: 16px; cursor: pointer; font-size: 11px; font-weight: 700; transition: all 0.2s; white-space: nowrap; box-shadow: 0 4px 12px rgba(63, 81, 181, 0.3); }
        .btn-fit:hover { background: #4c5fd7; transform: scale(1.05); }
        .brush-toolbar { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; background: var(--bg-toolbar); padding: 10px; borderRadius: 12px; border: 1px solid var(--border-color); z-index: 1000; box-shadow: 0 8px 24px rgba(0,0,0,0.5); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease; }
        .brush-toolbar.hidden-toolbar { transform: translateX(-50%) translateY(-100px); opacity: 0; pointer-events: none; }
        .btn-tool { background: var(--btn-bg); border: none; color: var(--text-primary); width: 38px; height: 38px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .btn-tool:hover { background: var(--btn-hover-bg); }
        .btn-tool svg { width: 18px; height: 18px; }
        .btn-tool.primary { background: #4caf50; box-shadow: 0 0 12px rgba(76, 175, 80, 0.4); color: white; }
        .color-picker-btn { width: 38px; height: 38px; border: none; border-radius: 8px; padding: 0; cursor: pointer; overflow: hidden; background: none; }
        .notification-icon { background: #4caf50; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .theme-toggle-btn {
          position: fixed;
          top: 12px;
          right: 12px;
          background: var(--bg-toolbar);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          z-index: 10000;
          transition: all 0.2s;
        }
        .theme-toggle-btn:hover {
          transform: scale(1.08);
          background: var(--btn-hover-bg);
        }
        .conn-btn-group {
          position: absolute;
          display: flex;
          gap: 4px;
          z-index: 100;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .show-btns .conn-btn-group { opacity: 1 !important; pointer-events: auto !important; }
        .conn-btn-group.top {
          top: -26px;
          left: 50%;
          transform: translateX(-50%) scale(var(--conn-btn-scale, 1));
          transform-origin: bottom center;
          flex-direction: row;
        }
        .conn-btn-group.bottom {
          bottom: -26px;
          left: 50%;
          transform: translateX(-50%) scale(var(--conn-btn-scale, 1));
          transform-origin: top center;
          flex-direction: row;
        }
        .conn-btn-group.left {
          left: -26px;
          top: 50%;
          transform: translateY(-50%) scale(var(--conn-btn-scale, 1));
          transform-origin: right center;
          flex-direction: column;
        }
        .conn-btn-group.right {
          right: -26px;
          top: 50%;
          transform: translateY(-50%) scale(var(--conn-btn-scale, 1));
          transform-origin: left center;
          flex-direction: column;
        }
        .conn-btn { 
          background: #3f51b5; 
          color: #fff; 
          border: 1.5px solid #1e1f2e; 
          padding: 4px 8px; 
          border-radius: 5px; 
          font-size: 10px; 
          font-weight: 700; 
          cursor: pointer; 
          box-shadow: 0 2px 6px rgba(0,0,0,0.4); 
          transition: transform 0.15s ease, background-color 0.15s ease; 
          white-space: nowrap; 
          line-height: 1.2; 
        }
        .conn-btn:hover { background: #5c6bc0; transform: scale(1.08); }
        .conn-btn.active { background: #f44336; }
        .conn-btn.clicked-hidden { display: none !important; }
        .flow-reveal { animation: flowIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .flow-hide { animation: flowOut 0.25s cubic-bezier(0.4, 0, 0.6, 1) forwards; }
        @keyframes flowIn { from { opacity: 0; transform: var(--element-transform, rotate(0deg)) scale(0.85) translateY(12px); } to { opacity: 1; transform: var(--element-transform, rotate(0deg)) scale(1) translateY(0); } }
        @keyframes flowOut { from { opacity: 1; transform: var(--element-transform, rotate(0deg)) scale(1) translateY(0); } to { opacity: 0; transform: var(--element-transform, rotate(0deg)) scale(0.85) translateY(12px); } }
        .connection-group { transition: opacity 0.3s ease; }
        .is-hidden { opacity: 0 !important; pointer-events: none !important; }
        .wire-draw path:first-child { stroke-dasharray: var(--wire-len); stroke-dashoffset: var(--wire-len); animation: wireDraw 0.3s ease-out forwards; }
        .wire-undraw path:first-child { stroke-dasharray: var(--wire-len); stroke-dashoffset: 0; animation: wireUndraw 0.2s ease-in forwards; }
        @keyframes wireDraw { to { stroke-dashoffset: 0; } }
        @keyframes wireUndraw { to { stroke-dashoffset: var(--wire-len); } }
        #interactive-container.space-down, #interactive-container.space-down * { cursor: grab !important; }
        #interactive-container.panning, #interactive-container.panning * { cursor: grabbing !important; }
        #interactive-container.brush-mode, #interactive-container.brush-mode * { cursor: none !important; }
        .laser-cursor-none, .laser-cursor-none * {
          cursor: none !important;
        }
        .laser-pointer {
          width: 14px;
          height: 14px;
          background: radial-gradient(circle, #ffffff 20%, #ff1744 60%, rgba(255, 23, 68, 0) 100%);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 8px #ff1744, 0 0 16px #ff1744, 0 0 32px #ff1744;
          position: fixed;
          pointer-events: none;
          z-index: 100001;
          display: none;
        }
        .brush-custom-cursor {
          position: fixed;
          pointer-events: none;
          z-index: 100002;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brush-custom-cursor-circle {
          border: 1px solid #ffffff;
          border-radius: 50%;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          box-shadow: 0 0 0 1px #000000;
        }
        .flow-pulse-path {
          stroke-dasharray: 6 18;
          animation: flowPulse 1.2s linear infinite;
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }
        .flow-active .flow-pulse-path {
          opacity: 0.8;
        }
        @keyframes flowPulse {
          to {
            stroke-dashoffset: -24;
          }
        }
        #reset-layout:hover { background: #ff2a76 !important; transform: scale(1.05); }
        ${c}
      </style>
      </head>
      <body>      <button class="theme-toggle-btn" id="autoplay-btn" onclick="toggleAutoplay()" title="Auto Play Flow" style="right: 92px; display: flex; align-items: center; justify-content: center; background: #4caf50;">
        <svg class="play-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
        <svg class="pause-icon" style="display:none;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/></svg>
      </button>
      <button class="theme-toggle-btn" id="autoplay-settings-btn" onclick="toggleAutoplaySettings()" title="Autoplay Settings" style="right: 132px; display: flex; align-items: center; justify-content: center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      </button>
 
      <!-- Autoplay Settings Panel -->
      <div id="autoplay-settings-panel" style="display: none; position: fixed; top: 50px; right: 132px; background: var(--bg-toolbar); border: 1px solid var(--border-color); border-radius: 12px; padding: 12px; width: 220px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); z-index: 10000; font-family: inherit; font-size: 13px; color: var(--text-primary);">
        <div style="margin-bottom: 10px; font-weight: bold; border-bottom: 1px solid var(--border-color); padding-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
          <span>Autoplay Settings</span>
          <button onclick="toggleAutoplaySettings()" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 14px; font-weight: bold; padding: 0;">&times;</button>
        </div>
        <div style="margin-bottom: 10px;">
          <label style="display: block; margin-bottom: 4px; font-weight: 600;">Reveal Mode</label>
          <div style="display: flex; gap: 8px;">
            <button id="mode-step-btn" onclick="setAutoplayMode('step')" style="flex: 1; padding: 6px; font-size: 11px; background: #3f51b5; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Step-by-Step</button>
            <button id="mode-instant-btn" onclick="setAutoplayMode('instant')" style="flex: 1; padding: 6px; font-size: 11px; background: var(--btn-bg); color: var(--text-primary); border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Instant (All)</button>
          </div>
        </div>
        <div id="delay-settings-container" style="margin-bottom: 4px;">
          <label style="display: block; margin-bottom: 4px; font-weight: 600;">Step Delay (seconds)</label>
          <input type="number" id="autoplay-delay-input" min="0.1" max="10.0" step="0.1" value="1.5" style="width: 100%; box-sizing: border-box; padding: 6px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-primary); outline: none; font-size: 13px;" />
        </div>
      </div>
      <button class="theme-toggle-btn" id="present-btn" onclick="startPresentation()" title="Present Slideshow" style="right: 52px; display: flex; align-items: center; justify-content: center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </button>
      <button class="theme-toggle-btn" id="theme-toggle-btn" onclick="toggleTheme()" title="Toggle Theme">
        <svg class="sun-icon" style="display:none;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
        <svg class="moon-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
      </button>
      <!-- Variant Selector -->
      ${w.length>1?`
      <div class="variant-dropdown-container" id="variant-dropdown-container">
        <button class="variant-dropdown-trigger" onclick="toggleVariantDropdown(event)">
          <span id="active-variant-name">${J(t.find(e=>e.id===n)?.name||`Variant 1`)}</span>
          <svg class="dropdown-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="variant-dropdown-menu" id="variant-dropdown-menu">
          ${w.map(e=>`
            <button class="variant-menu-item ${e.id===n?`active`:``}" data-id="${e.id}" onclick="switchVariant('${e.id}'); toggleVariantDropdown(event)">
              ${J(e.name)}
            </button>
          `).join(``)}
        </div>
      </div>
      `:``}

      <!-- Variant Templates -->
      ${w.map(e=>`
        <template id="template-elements-${e.id}">${e.rootElements}</template>
        <template id="template-connections-${e.id}">${e.svgPaths}</template>
        <template id="template-brush-${e.id}">${e.brushPaths}</template>
      `).join(`
`)}

      <div id="interactive-container" oncontextmenu="return false;" style="position: relative; width: 100vw; height: 100vh; overflow: hidden; user-select: none; background-color: var(--bg-canvas); background-image: radial-gradient(circle, var(--grid-dot) 1px, transparent 1px);">
        <div id="interactive-content" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; transform-origin: 0 0;">
          <svg style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; overflow: visible;">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#6c6d80" />
              </marker>
            </defs>
            <g id="connections-layer">${T.svgPaths}</g>
          </svg>
          <div id="elements-layer">${T.rootElements}</div>
           <svg id="canvas-svg-top" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1000; overflow: visible;"><g id="edit-brush-layer" pointer-events="none">${T.brushPaths}</g><g id="brush-layer"></g></svg>
        </div>
      </div>
      <div id="html-context-menu" class="html-context-menu">
        <button id="ctx-add-text" type="button">Add Text</button>
        <button id="ctx-delete-text" class="danger" type="button" style="display:none;">Delete Text</button>
      </div>
      <div class="brush-toolbar hidden-toolbar">
        <button id="brush-toggle" class="btn-tool" title="Brush (B)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg></button>
        <button id="eraser-toggle" class="btn-tool" title="Eraser (E)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.9-9.9c1-1 2.5-1 3.4 0l4.3 4.3c1 1 1 2.5 0 3.4L10.5 21c-1 1-2.5 1-3.4 0Z"/><path d="m11 6 4 4"/></svg></button>
        <button id="brush-clear" class="btn-tool" title="Clear (X)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
        <div style="width:1px; background:#3a3c50; margin:0 5px"></div>
        <button id="undo-btn" class="btn-tool" title="Undo (Ctrl/⌘+Z)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>
        <button id="redo-btn" class="btn-tool" title="Redo (Ctrl/⌘+Y)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg></button>
        <div style="width:1px; background:#3a3c50; margin:0 5px"></div>
        <div style="display:flex; align-items:center; gap:6px; padding:0 4px;">
          <span style="font-size:11px; color:var(--text-secondary); user-select:none;">Size:</span>
          <input type="range" id="brush-width-slider" min="1" max="100" value="4" style="width:60px; cursor:pointer;" title="Brush Width">
          <span id="brush-width-val" style="font-size:11px; color:var(--text-secondary); min-width:14px; text-align:right;">4</span>
        </div>
        <div style="width:1px; background:#3a3c50; margin:0 5px"></div>
        <div class="color-picker-btn"><input type="color" id="brush-color" value="#4caf50" style="width:150%;height:150%;margin:-25%;border:none;cursor:pointer;background:none;"></div>
        <div style="width:1px; background:#3a3c50; margin:0 5px"></div>
        <div style="display:flex; align-items:center; gap:6px; padding:0 4px;" title="Text color">
          <span style="font-size:11px; color:var(--text-secondary); user-select:none;">Text:</span>
          <div class="color-picker-btn"><input type="color" id="runtime-text-color" value="#e0e0e0" style="width:150%;height:150%;margin:-25%;border:none;cursor:pointer;background:none;"></div>
        </div>
        <div style="width:1px; background:#3a3c50; margin:0 5px"></div>
        <button id="brush-hide" class="btn-tool" title="Hide Toolbar (H)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg></button>
      </div>
      <button id="brush-show-btn" class="btn-tool" style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1001; display: flex; background: var(--bg-toolbar); border: 1px solid var(--border-color); border-radius: 50%; width: 32px; height: 32px; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(0,0,0,0.5); cursor: pointer; color: var(--text-primary);" title="Show Toolbar (H)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div id="presentation-bar" style="display: none; position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--bg-toolbar); border: 1px solid var(--border-color); border-radius: 24px; padding: 8px 24px; align-items: center; gap: 20px; z-index: 10000; box-shadow: 0 12px 32px rgba(0,0,0,0.6); color: var(--text-primary);">
        <button class="conn-btn" id="prev-slide-btn" onclick="prevSlide()" tabindex="-1" style="border-radius: 12px; padding: 6px 12px; border: none; font-size: 13px; cursor: pointer; color: #fff;">&larr; Prev</button>
        <select id="slide-select" onchange="goToSlide(parseInt(this.value))" tabindex="-1" style="background: var(--input-bg); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 4px 8px; font-size: 13px; font-weight: 600; cursor: pointer; outline: none;"></select>
        <button class="conn-btn" id="next-slide-btn" onclick="nextSlide()" tabindex="-1" style="border-radius: 12px; padding: 6px 12px; border: none; font-size: 13px; cursor: pointer; color: #fff;">Next &rarr;</button>
        <div style="width: 1px; background: var(--border-color); height: 20px;"></div>
        <button class="conn-btn" id="notes-toggle-btn" onclick="toggleSpeakerNotes()" tabindex="-1" style="border-radius: 12px; padding: 6px 12px; border: none; font-size: 13px; cursor: pointer; color: #fff;">Notes</button>
        <button class="conn-btn" onclick="exitPresentation()" tabindex="-1" style="background: #ef5350; border-radius: 12px; padding: 6px 16px; border: none; font-size: 13px; cursor: pointer; color: #fff; font-weight: 600;">Exit</button>
      </div>
      <div id="speaker-notes-panel" style="display: none; position: fixed; right: 24px; bottom: 88px; width: min(360px, calc(100vw - 48px)); max-height: min(260px, calc(100vh - 140px)); overflow: auto; background: var(--bg-toolbar); border: 1px solid var(--border-color); border-radius: 12px; box-shadow: 0 12px 32px rgba(0,0,0,0.55); z-index: 10000; color: var(--text-primary);">
        <div style="padding: 10px 12px; border-bottom: 1px solid var(--border-color); font-size: 12px; font-weight: 700; display: flex; justify-content: space-between; align-items: center;"><span>Speaker Notes</span><button onclick="toggleSpeakerNotes(false)" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 16px;">&times;</button></div>
        <pre id="speaker-notes-text" style="white-space: pre-wrap; margin: 0; padding: 12px; font-family: inherit; font-size: 13px; line-height: 1.45; color: var(--text-secondary);"></pre>
      </div>
      <div class="zoom-controls"><span id="zoom-percent" style="font-weight:700; min-width: 36px; text-align: center; font-size: 12px;">100%</span><button class="btn-fit" id="zoom-fit" style="margin-right: 5px;" title="Fit in view (Ctrl/⌘+0)">Fit</button><button class="btn-fit" id="reset-layout" style="background: #e91e63; box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);">Reset</button></div>
      <div id="notification-toast" class="notification-toast"><div class="notification-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span id="notification-text"></span></div>
      
      <!-- Exported Laser Pointer Elements -->
      <div id="laser-pointer-el" class="laser-pointer"></div>
      <svg id="laser-trail-svg" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 100000; overflow: visible; display: none;"></svg>

      <!-- Exported Custom Brush Cursor Element -->
      <div id="brush-cursor-el" class="brush-custom-cursor" style="display: none; left: -100px; top: -100px;">
        <div id="brush-cursor-circle" class="brush-custom-cursor-circle"></div>
      </div>
      <script>
        (function() {
          window.toggleVariantDropdown = (event) => {
            if (event) event.stopPropagation();
            const container = document.getElementById('variant-dropdown-container');
            if (container) {
              container.classList.toggle('open');
            }
          };
          document.addEventListener('click', (e) => {
            const container = document.getElementById('variant-dropdown-container');
            if (container && !container.contains(e.target)) {
              container.classList.remove('open');
            }
          });

          window.toggleTheme = () => {
            const isLight = document.body.classList.toggle('light-theme');
            try {
              localStorage.setItem('theme', isLight ? 'light' : 'dark');
            } catch (e) {}
            updateThemeIcons(isLight);
            updateDefaultRuntimeTextColors();
          };
          function updateThemeIcons(isLight) {
            const sunIcon = document.querySelector('.sun-icon');
            const moonIcon = document.querySelector('.moon-icon');
            if (sunIcon) sunIcon.style.display = isLight ? 'block' : 'none';
            if (moonIcon) moonIcon.style.display = isLight ? 'none' : 'block';
          }
          let savedTheme = '${s}';
          try {
            savedTheme = localStorage.getItem('theme') || '${s}';
          } catch (e) {}
          if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            updateThemeIcons(true);
          } else {
            updateThemeIcons(false);
          }

          const container = document.getElementById('interactive-container');
          const content = document.getElementById('interactive-content');
          const brushLayer = document.getElementById('brush-layer');
          const variantsData = ${E(w.reduce((e,t)=>(e[t.id]={elements:t.elements,connections:t.connections,hiddenNodes:t.hiddenNodes,hiddenConnections:t.hiddenConnections},e),{}))};
          let activeVariantId = '${n}';
          let elements = ${E(T.elements)};
          let connections = ${E(T.connections)};
          let originalElements = JSON.parse(JSON.stringify(elements));
          let originalEditBrushHTML = document.getElementById('edit-brush-layer') ? document.getElementById('edit-brush-layer').innerHTML : '';
          let hiddenNodes = ${E(T.hiddenNodes)};
          let hiddenConnections = ${E(T.hiddenConnections)};
          let scale = 1, pan = { x: 0, y: 0 }, isBrushMode = false, isSpaceDown = false, isPanning = false, currentStroke = null, activeDrag = null, startDrag = { x: 0, y: 0, ex: 0, ey: 0 }, startPan = { x: 0, y: 0, px: 0, py: 0 }, brushTool = 'draw', isErasing = false, lastEraserPos = null, isAutoplayActive = false, autoplayInterval = null, autoplayMode = 'step', lastRightClickReset = { id: null, time: 0 }, userInteracted = false, activeRuntimeTextId = null, contextMenuRuntimeTextId = null, nextRuntimeTextColor = getDefaultRuntimeTextColor(), nextRuntimeTextUsesThemeColor = true;
          let isLaserActive = false, laserPos = { x: -100, y: -100 }, laserTrail = [];

          const brushCursorEl = document.getElementById('brush-cursor-el');
          const brushCursorCircle = document.getElementById('brush-cursor-circle');

          function updateBrushCursor(e) {
            if (!brushCursorEl) return;
            if (isBrushMode && !isSpaceDown) {
              brushCursorEl.style.display = 'flex';
              if (e) {
                brushCursorEl.style.left = e.clientX + 'px';
                brushCursorEl.style.top = e.clientY + 'px';
              }
              const currentWidth = parseFloat(document.getElementById('brush-width-slider')?.value || '4');
              const size = currentWidth * scale;
              if (brushCursorCircle) {
                brushCursorCircle.style.width = size + 'px';
                brushCursorCircle.style.height = size + 'px';
              }
            } else {
              brushCursorEl.style.display = 'none';
            }
          }

          function getDistanceToSegment(p, a, b) {
            const l2 = Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
            if (l2 === 0) return Math.hypot(p.x - a.x, p.y - a.y);
            let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2;
            t = Math.max(0, Math.min(1, t));
            const projX = a.x + t * (b.x - a.x);
            const projY = a.y + t * (b.y - a.y);
            return Math.hypot(p.x - projX, p.y - projY);
          }

          function getElementCanvasBounds(el) {
            if (el && el.parentId) {
              const parent = elements.find(parentEl => parentEl.id === el.parentId);
              if (parent) {
                const parentBounds = getElementCanvasBounds(parent);
                if (el.fillParent) {
                  return {
                    x: parentBounds.x + 16,
                    y: parentBounds.y + 45 + 16,
                    width: Math.max(1, parentBounds.width - 32),
                    height: Math.max(1, parentBounds.height - 45 - 32)
                  };
                }
                return {
                  x: parentBounds.x + 16 + el.x,
                  y: parentBounds.y + 45 + 16 + el.y,
                  width: el.width,
                  height: el.height
                };
              }
            }
            return { x: el.x, y: el.y, width: el.width, height: el.height };
          }

          function getDescendantElementIds(parentId) {
            const ids = [];
            const queue = [parentId];
            while (queue.length) {
              const currentId = queue.shift();
              elements.forEach(el => {
                if (el.parentId === currentId) {
                  ids.push(el.id);
                  queue.push(el.id);
                }
              });
            }
            return ids;
          }

          function translateAttachedBrushPaths(id, dx, dy) {
            const targetIds = [id, ...getDescendantElementIds(id)];
            targetIds.forEach(targetId => {
              document.querySelectorAll('path[data-attached-node-id="' + targetId + '"]').forEach(path => {
                translateBrushPath(path, dx, dy);
              });
            });
          }

          function brushPtsToD(ptsStr) {
            const pts = (ptsStr || '').trim().split(/\\s+/).filter(Boolean);
            if (!pts.length) return '';
            return pts.map((pt, idx) => {
              const coords = pt.split(',');
              return (idx === 0 ? 'M ' : 'L ') + coords[0] + ' ' + coords[1];
            }).join(' ');
          }

          function translateBrushPath(path, dx, dy) {
            const ptsSource = path.dataset.pts || path.getAttribute('data-pts') || '';
            if (ptsSource) {
              const updatedPts = ptsSource.trim().split(/\\s+/).map(pt => {
                const coords = pt.split(',');
                const px = parseFloat(coords[0]);
                const py = parseFloat(coords[1]);
                if (!Number.isFinite(px) || !Number.isFinite(py)) return null;
                return (px + dx) + ',' + (py + dy);
              }).filter(Boolean).join(' ');
              if (updatedPts) {
                path.dataset.pts = updatedPts;
                path.setAttribute('data-pts', updatedPts);
                path.setAttribute('d', brushPtsToD(updatedPts));
              }
              return;
            }

            const dAttr = path.getAttribute('d') || '';
            const updatedD = dAttr.replace(/([ML])\\s*(-?\\d+(?:\\.\\d+)?)\\s*,?\\s*(-?\\d+(?:\\.\\d+)?)/gi, function(_, cmd, xVal, yVal) {
              const px = parseFloat(xVal);
              const py = parseFloat(yVal);
              if (!Number.isFinite(px) || !Number.isFinite(py)) return '';
              return cmd.toUpperCase() + ' ' + (px + dx) + ' ' + (py + dy);
            });
            if (updatedD.trim()) {
              path.setAttribute('d', updatedD);
            }
          }

          function eraseBrushStrokesAt(currentPos, lastPos, radius) {
            const paths = Array.from(document.querySelectorAll('#edit-brush-layer path, #brush-layer path'));
            paths.forEach(path => {
              const ptsStr = path.dataset.pts || path.getAttribute('data-pts') || path.getAttribute('d')?.replace(/[ML]/g, '').trim();
              if (!ptsStr) return;
              
              const pts = ptsStr.split(/[,\\s]+/).map(parseFloat);
              const points = [];
              for (let i = 0; i < pts.length; i += 2) {
                if (!isNaN(pts[i]) && !isNaN(pts[i+1])) {
                  points.push({ x: pts[i], y: pts[i+1] });
                }
              }

              let changed = false;
              let currentPoints = [];
              const newSubPaths = [];
              const strokeWidth = parseFloat(path.getAttribute('stroke-width') || '4');

              points.forEach(p => {
                const dist = lastPos 
                  ? getDistanceToSegment(p, lastPos, currentPos)
                  : Math.hypot(p.x - currentPos.x, p.y - currentPos.y);
                
                const threshold = radius + strokeWidth / 2;
                if (dist <= threshold) {
                  if (currentPoints.length > 1) {
                    newSubPaths.push(currentPoints);
                  }
                  currentPoints = [];
                  changed = true;
                } else {
                  currentPoints.push(p);
                }
              });

              if (currentPoints.length > 1) {
                newSubPaths.push(currentPoints);
              }

              if (changed) {
                const parent = path.parentNode;
                newSubPaths.forEach(subPts => {
                  const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                  newPath.setAttribute('fill', 'none');
                  newPath.setAttribute('stroke', path.getAttribute('stroke'));
                  newPath.setAttribute('stroke-width', path.getAttribute('stroke-width'));
                  newPath.setAttribute('stroke-linecap', 'round');
                  newPath.setAttribute('stroke-linejoin', 'round');
                  const dVal = subPts.map((pt, idx) => (idx === 0 ? 'M ' : 'L ') + pt.x + ' ' + pt.y).join(' ');
                  newPath.setAttribute('d', dVal);
                  newPath.dataset.pts = subPts.map(pt => pt.x + ',' + pt.y).join(' ');
                  newPath.setAttribute('data-pts', newPath.dataset.pts);
                  
                  const attachedNodeId = path.dataset.attachedNodeId || path.getAttribute('data-attached-node-id');
                  if (attachedNodeId) {
                    newPath.setAttribute('data-attached-node-id', attachedNodeId);
                    newPath.dataset.attachedNodeId = attachedNodeId;
                    newPath.style.transition = 'opacity 0.4s ease';
                    newPath.style.opacity = path.style.opacity;
                  }
                  parent.appendChild(newPath);
                });
                path.remove();
              }
            });
          }
          
          let history = [], redoStack = [];
          function saveHistory() { history.push(brushLayer.innerHTML); redoStack = []; if(history.length > 50) history.shift(); }
          function undo() { if(!history.length) return; redoStack.push(brushLayer.innerHTML); const last = history.pop(); brushLayer.innerHTML = last; showNotification('Undo'); }
          function redo() { if(!redoStack.length) return; history.push(brushLayer.innerHTML); const next = redoStack.pop(); brushLayer.innerHTML = next; showNotification('Redo'); }

          function updateAllElements() {
            elements.forEach(el => {
              const wrapper = document.getElementById('el-wrapper-' + el.id);
              if(wrapper) {
                const isFillParent = el.parentId && el.fillParent;
                wrapper.style.left = isFillParent ? '0px' : el.x + 'px';
                wrapper.style.top = isFillParent ? '0px' : el.y + 'px';
              }
            });
          }

          function resetElementPosition(id) {
            const current = elements.find(el => el.id === id);
            const original = originalElements.find(el => el.id === id);
            const wrapper = document.getElementById('el-wrapper-' + id);
            if (!current || !original || !wrapper) return false;

            const dx = original.x - current.x;
            const dy = original.y - current.y;
            current.x = original.x;
            current.y = original.y;
            wrapper.style.left = original.x + 'px';
            wrapper.style.top = original.y + 'px';

            if (dx !== 0 || dy !== 0) {
              translateAttachedBrushPaths(id, dx, dy);
            }

            updateConnections();
            showNotification('Element position reset');
            return true;
          }

          window.showNotification = function(msg) {
            const toast = document.getElementById('notification-toast');
            document.getElementById('notification-text').innerText = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
          };

          const htmlContextMenu = document.getElementById('html-context-menu');
          let contextMenuCanvasPos = null;

          function hideHtmlContextMenu() {
            if (htmlContextMenu) htmlContextMenu.classList.remove('open');
            contextMenuCanvasPos = null;
            contextMenuRuntimeTextId = null;
          }

          function showHtmlContextMenu(clientX, clientY, canvasX, canvasY, runtimeTextId) {
            if (!htmlContextMenu) return;
            contextMenuCanvasPos = { x: canvasX, y: canvasY };
            contextMenuRuntimeTextId = runtimeTextId || null;
            const deleteTextBtn = document.getElementById('ctx-delete-text');
            if (deleteTextBtn) deleteTextBtn.style.display = contextMenuRuntimeTextId ? 'flex' : 'none';
            htmlContextMenu.classList.add('open');
            const menuRect = htmlContextMenu.getBoundingClientRect();
            const left = Math.min(clientX, window.innerWidth - menuRect.width - 8);
            const top = Math.min(clientY, window.innerHeight - menuRect.height - 8);
            htmlContextMenu.style.left = Math.max(8, left) + 'px';
            htmlContextMenu.style.top = Math.max(8, top) + 'px';
          }

          function cssColorToHex(color) {
            if (!color) return '#ffffff';
            if (color[0] === '#') {
              if (color.length === 4) return '#' + color.slice(1).split('').map(ch => ch + ch).join('');
              return color.slice(0, 7);
            }
            const match = String(color).match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/);
            if (!match) return getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#ffffff';
            return '#' + [match[1], match[2], match[3]].map(value => {
              return Math.max(0, Math.min(255, parseInt(value, 10))).toString(16).padStart(2, '0');
            }).join('');
          }

          function getDefaultRuntimeTextColor() {
            return document.body.classList.contains('light-theme') ? '#111827' : '#ffffff';
          }

          function syncRuntimeTextColorInput(color) {
            const input = document.getElementById('runtime-text-color');
            if (input) input.value = cssColorToHex(color);
          }

          function selectRuntimeTextElement(id) {
            activeRuntimeTextId = id;
            document.querySelectorAll('.runtime-text-selected').forEach(el => el.classList.remove('runtime-text-selected'));
            const wrapper = document.getElementById('el-wrapper-' + id);
            const elData = elements.find(el => el.id === id);
            if (wrapper) wrapper.classList.add('runtime-text-selected');
            if (elData && elData.text) syncRuntimeTextColorInput(elData.text.color);
          }

          function clearRuntimeTextSelection() {
            activeRuntimeTextId = null;
            document.querySelectorAll('.runtime-text-selected').forEach(el => el.classList.remove('runtime-text-selected'));
            syncRuntimeTextColorInput(nextRuntimeTextColor);
          }

          function applyRuntimeTextColor(color) {
            nextRuntimeTextColor = color;
            nextRuntimeTextUsesThemeColor = false;
            if (!activeRuntimeTextId) return;
            const elData = elements.find(el => el.id === activeRuntimeTextId);
            const wrapper = document.getElementById('el-wrapper-' + activeRuntimeTextId);
            const text = wrapper ? wrapper.querySelector('.runtime-text-content') : null;
            if (elData && elData.text) {
              elData.text.color = color;
              elData.runtimeTextUsesThemeColor = false;
              const original = originalElements.find(el => el.id === elData.id);
              if (original) {
                original.text = JSON.parse(JSON.stringify(elData.text));
                original.runtimeTextUsesThemeColor = false;
              }
            }
            if (text) text.style.color = color;
          }

          function updateDefaultRuntimeTextColors() {
            const defaultColor = getDefaultRuntimeTextColor();
            nextRuntimeTextColor = defaultColor;
            nextRuntimeTextUsesThemeColor = true;
            elements.forEach(el => {
              if (el.type !== 'text' || !el.text || !el.id?.startsWith('runtime-text-')) return;
              if (el.runtimeTextUsesThemeColor === false) return;
              el.text.color = defaultColor;
              const wrapper = document.getElementById('el-wrapper-' + el.id);
              const text = wrapper ? wrapper.querySelector('.runtime-text-content') : null;
              if (text) text.style.color = defaultColor;
              const original = originalElements.find(item => item.id === el.id);
              if (original) {
                original.text = JSON.parse(JSON.stringify(el.text));
                original.runtimeTextUsesThemeColor = true;
              }
            });
            syncRuntimeTextColorInput(activeRuntimeTextId ? (elements.find(el => el.id === activeRuntimeTextId)?.text?.color || defaultColor) : defaultColor);
          }

          function deleteRuntimeTextElement(id) {
            if (!id) return;
            const wrapper = document.getElementById('el-wrapper-' + id);
            if (wrapper) wrapper.remove();
            elements = elements.filter(el => el.id !== id);
            originalElements = originalElements.filter(el => el.id !== id);
            document.querySelectorAll('path[data-attached-node-id="' + id + '"]').forEach(path => path.remove());
            if (activeRuntimeTextId === id) clearRuntimeTextSelection();
            showNotification('Text deleted');
          }

          function autoSizeRuntimeTextElement(elData, wrapper, shell, text) {
            if (!elData || !wrapper || !shell || !text) return;
            const padding = elData.text.padding || { top: 10, right: 14, bottom: 10, left: 14 };
            const border = elData.stroke?.width ?? 0;
            const minHeight = 64;
            const measuredWidth = Math.max(180, Number(elData.width) || 180);
            wrapper.style.width = measuredWidth + 'px';
            const neededHeight = Math.ceil(Math.max(minHeight, text.scrollHeight + padding.top + padding.bottom + border * 2 + 4));
            wrapper.style.height = neededHeight + 'px';
            elData.width = measuredWidth;
            elData.height = neededHeight;
            shell.style.height = '100%';
          }
          syncRuntimeTextColorInput(nextRuntimeTextColor);

          function createRuntimeTextElement(x, y) {
            const maxZ = elements.reduce((value, el) => Math.max(value, Number(el.zIndex || 0)), 0);
            const elData = {
              id: 'runtime-text-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7),
              type: 'text',
              name: '',
              x,
              y,
              width: 180,
              height: 64,
              rotation: 0,
              opacity: 1,
              visible: true,
              disabled: false,
              pinned: false,
              parentId: null,
              zIndex: maxZ + 1,
              fill: { type: 'none', color: 'transparent' },
              stroke: { width: 1, color: 'var(--border-color)', style: 'solid', radius: 4 },
              shadow: { enabled: true, color: 'rgba(0,0,0,0.3)', blur: 8, offsetX: 0, offsetY: 4, spread: 0 },
              runtimeTextUsesThemeColor: nextRuntimeTextUsesThemeColor,
              text: {
                content: 'Workflow Text',
                fontSize: 16,
                fontFamily: "'Lexend Deca', 'Google Sans Text', sans-serif",
                fontWeight: 400,
                fontStyle: 'normal',
                textDecoration: 'none',
                color: nextRuntimeTextColor || getDefaultRuntimeTextColor(),
                align: 'center',
                verticalAlign: 'middle',
                lineHeight: 1.5,
                letterSpacing: 0,
                padding: { top: 10, right: 14, bottom: 10, left: 14 }
              }
            };
            elements.push(elData);
            originalElements.push(JSON.parse(JSON.stringify(elData)));
            appendRuntimeTextElement(elData);
            selectRuntimeTextElement(elData.id);
            showNotification('Text added');
          }

          function appendRuntimeTextElement(elData) {
            const layer = document.getElementById('elements-layer');
            if (!layer) return;

            const wrapper = document.createElement('div');
            wrapper.id = 'el-wrapper-' + elData.id;
            wrapper.className = 'draggable-element';
            wrapper.dataset.id = elData.id;
            wrapper.style.position = 'absolute';
            wrapper.style.left = elData.x + 'px';
            wrapper.style.top = elData.y + 'px';
            wrapper.style.width = elData.width + 'px';
            wrapper.style.height = elData.height + 'px';
            wrapper.style.color = 'var(--text-primary)';
            wrapper.style.transform = 'rotate(0deg)';
            wrapper.style.transformOrigin = 'center center';
            wrapper.style.zIndex = String(elData.zIndex || 2);
            wrapper.style.opacity = '1';
            wrapper.style.borderRadius = (elData.stroke?.radius ?? 4) + 'px';
            wrapper.style.boxShadow = elData.shadow?.enabled ? (elData.shadow.offsetX + 'px ' + elData.shadow.offsetY + 'px ' + elData.shadow.blur + 'px ' + (elData.shadow.spread || 0) + 'px ' + elData.shadow.color) : '';
            wrapper.style.cursor = 'grab';
            wrapper.style.overflow = 'visible';

            const shell = document.createElement('div');
            shell.style.width = '100%';
            shell.style.height = '100%';
            shell.style.background = elData.fill?.type === 'solid' ? (elData.fill.color || 'transparent') : 'transparent';
            shell.style.border = (elData.stroke?.width ?? 1) + 'px ' + (elData.stroke?.style || 'solid') + ' ' + (elData.stroke?.color || 'var(--border-color)');
            shell.style.borderRadius = (elData.stroke?.radius ?? 4) + 'px';
            shell.style.display = 'flex';
            shell.style.alignItems = elData.text.verticalAlign === 'top' ? 'flex-start' : elData.text.verticalAlign === 'bottom' ? 'flex-end' : 'center';
            shell.style.justifyContent = 'center';
            shell.style.padding = elData.text.padding.top + 'px ' + elData.text.padding.right + 'px ' + elData.text.padding.bottom + 'px ' + elData.text.padding.left + 'px';
            shell.style.boxSizing = 'border-box';
            shell.style.overflow = 'hidden';
            shell.style.pointerEvents = 'none';

            const text = document.createElement('div');
            text.className = 'runtime-text-content';
            text.dataset.runtimeTextContent = 'true';
            text.textContent = elData.text.content;
            text.style.width = '100%';
            text.style.textAlign = elData.text.align || 'center';
            text.style.wordBreak = 'break-word';
            text.style.fontSize = elData.text.fontSize + 'px';
            text.style.fontFamily = elData.text.fontFamily;
            text.style.fontWeight = String(elData.text.fontWeight);
            text.style.fontStyle = elData.text.fontStyle || 'normal';
            text.style.textDecoration = elData.text.textDecoration || 'none';
            text.style.lineHeight = String(elData.text.lineHeight);
            text.style.letterSpacing = elData.text.letterSpacing + 'px';
            text.style.color = elData.text.color;
            text.style.borderRadius = '4px';
            text.style.overflow = 'visible';

            shell.appendChild(text);
            wrapper.appendChild(shell);
            layer.appendChild(wrapper);
            autoSizeRuntimeTextElement(elData, wrapper, shell, text);

            wrapper.addEventListener('pointerdown', event => {
              selectRuntimeTextElement(elData.id);
            }, true);

            wrapper.addEventListener('dblclick', event => {
              event.stopPropagation();
              selectRuntimeTextElement(elData.id);
              text.contentEditable = 'true';
              shell.style.pointerEvents = 'auto';
              text.focus();
              const range = document.createRange();
              range.selectNodeContents(text);
              const selection = window.getSelection();
              if (selection) {
                selection.removeAllRanges();
                selection.addRange(range);
              }
            });

            text.addEventListener('blur', () => {
              text.contentEditable = 'false';
              shell.style.pointerEvents = 'none';
              elData.text.content = text.textContent || '';
              autoSizeRuntimeTextElement(elData, wrapper, shell, text);
              const original = originalElements.find(el => el.id === elData.id);
              if (original) {
                original.text = JSON.parse(JSON.stringify(elData.text));
                original.width = elData.width;
                original.height = elData.height;
              }
            });
            text.addEventListener('input', () => {
              elData.text.content = text.textContent || '';
              autoSizeRuntimeTextElement(elData, wrapper, shell, text);
            });
            text.addEventListener('keydown', event => {
              if (event.key === 'Escape') {
                text.blur();
              }
            });
          }

          document.getElementById('ctx-add-text')?.addEventListener('click', event => {
            event.stopPropagation();
            if (contextMenuCanvasPos) {
              createRuntimeTextElement(contextMenuCanvasPos.x, contextMenuCanvasPos.y);
            }
            hideHtmlContextMenu();
          });
          document.getElementById('ctx-delete-text')?.addEventListener('click', event => {
            event.stopPropagation();
            const id = contextMenuRuntimeTextId || activeRuntimeTextId;
            if (id) deleteRuntimeTextElement(id);
            hideHtmlContextMenu();
          });

          document.addEventListener('pointerdown', event => {
            if (event.button !== 2 && htmlContextMenu && !htmlContextMenu.contains(event.target)) {
              hideHtmlContextMenu();
            }
          }, true);

          function updateBrushToolClasses() {
            document.getElementById('brush-toggle').classList.toggle('primary', isBrushMode && brushTool === 'draw');
            const eraserBtn = document.getElementById('eraser-toggle');
            if (eraserBtn) eraserBtn.classList.toggle('primary', isBrushMode && brushTool === 'erase');
            container.classList.toggle('brush-mode', isBrushMode);
            updateBrushCursor();
          }

          const toggleBrush = () => {
            if (isBrushMode && brushTool === 'draw') {
              isBrushMode = false;
            } else {
              isBrushMode = true;
              brushTool = 'draw';
            }
            updateBrushToolClasses();
            showNotification(isBrushMode ? 'Brush mode enabled' : 'Brush mode disabled');
          };

          const toggleEraser = () => {
            if (isBrushMode && brushTool === 'erase') {
              isBrushMode = false;
            } else {
              isBrushMode = true;
              brushTool = 'erase';
            }
            updateBrushToolClasses();
            showNotification(isBrushMode ? 'Eraser mode enabled' : 'Eraser mode disabled');
          };

          const clearBrush = () => { saveHistory(); brushLayer.innerHTML = ''; showNotification('Drawings cleared'); };
          
          const toggleToolbarVisibility = () => {
            const toolbar = document.querySelector('.brush-toolbar');
            const showBtn = document.getElementById('brush-show-btn');
            if (toolbar && showBtn) {
              const isHidden = toolbar.classList.toggle('hidden-toolbar');
              showBtn.style.display = isHidden ? 'flex' : 'none';
              showNotification(isHidden ? 'Toolbar hidden (Press H to show)' : 'Toolbar shown');
            }
          };

          document.getElementById('brush-toggle').onclick = toggleBrush;
          const eraserToggle = document.getElementById('eraser-toggle');
          if (eraserToggle) eraserToggle.onclick = toggleEraser;
          document.getElementById('brush-clear').onclick = clearBrush;
          document.getElementById('undo-btn').onclick = undo;
          document.getElementById('redo-btn').onclick = redo;
          document.getElementById('brush-hide').onclick = toggleToolbarVisibility;
          document.getElementById('brush-show-btn').onclick = toggleToolbarVisibility;
          const runtimeTextColor = document.getElementById('runtime-text-color');
          if (runtimeTextColor) {
            runtimeTextColor.oninput = () => applyRuntimeTextColor(runtimeTextColor.value);
          }

          const resetBtn = document.getElementById('reset-layout');
          if (resetBtn) {
            resetBtn.onclick = () => {
              stopAutoplay();
              elements = JSON.parse(JSON.stringify(originalElements));
              updateAllElements();
              resetVisibilities();
              updateConnections();
              if (document.getElementById('edit-brush-layer')) {
                document.getElementById('edit-brush-layer').innerHTML = originalEditBrushHTML;
              }
              brushLayer.innerHTML = '';
              document.getElementById('zoom-fit').click();
              showNotification('Positions and state reset');
              setTimeout(animateInitialConnections, 200);
            };
          }
          
          const widthSlider = document.getElementById('brush-width-slider');
          const widthVal = document.getElementById('brush-width-val');
          if (widthSlider && widthVal) {
            widthSlider.oninput = () => {
              widthVal.innerText = widthSlider.value;
              updateBrushCursor();
            };
          }

          window.toggleAutoplay = () => {
            if (isAutoplayActive) {
              stopAutoplay();
            } else {
              startAutoplay();
            }
          };

          window.toggleAutoplaySettings = () => {
            const panel = document.getElementById('autoplay-settings-panel');
            if (panel) {
              const isHidden = panel.style.display === 'none';
              panel.style.display = isHidden ? 'block' : 'none';
            }
          };

          window.setAutoplayMode = (mode) => {
            autoplayMode = mode;
            const stepBtn = document.getElementById('mode-step-btn');
            const instBtn = document.getElementById('mode-instant-btn');
            const delayCont = document.getElementById('delay-settings-container');
            
            if (stepBtn && instBtn) {
              if (mode === 'step') {
                stepBtn.style.background = '#3f51b5';
                stepBtn.style.color = '#fff';
                instBtn.style.background = 'var(--btn-bg)';
                instBtn.style.color = 'var(--text-primary)';
                if (delayCont) delayCont.style.display = 'block';
              } else {
                instBtn.style.background = '#3f51b5';
                instBtn.style.color = '#fff';
                stepBtn.style.background = 'var(--btn-bg)';
                stepBtn.style.color = 'var(--text-primary)';
                if (delayCont) delayCont.style.display = 'none';
              }
            }
          };

          function startAutoplay() {
            if (isAutoplayActive) return;

            userInteracted = false;

            if (autoplayMode === 'instant') {
              playInstant();
              showNotification('Revealing all steps smoothly...');
              return;
            }

            isAutoplayActive = true;
            updateAutoplayUI();
            playNextStep();
          }

          function stopAutoplay() {
            isAutoplayActive = false;
            if (autoplayInterval) {
              clearTimeout(autoplayInterval);
              autoplayInterval = null;
            }
            updateAutoplayUI();
          }

          function isAutoplayOwnerVisible(owner) {
            if (!owner) return false;
            if (owner.classList.contains('is-hidden') || owner.classList.contains('disabled')) return false;
            if (owner.closest('.is-hidden')) return false;
            const style = window.getComputedStyle(owner);
            return style.display !== 'none' && style.visibility !== 'hidden' && style.pointerEvents !== 'none';
          }

          function getAvailableAutoplayButtons() {
            return Array.from(document.querySelectorAll('.conn-btn-group .conn-btn:not(.active):not(.clicked-hidden)'))
              .filter(btn => {
                if (btn.disabled) return false;
                const owner = btn.closest('[id^="el-wrapper-"]');
                return isAutoplayOwnerVisible(owner);
              });
          }

          function resetAndRestartAutoplay() {
            if (userInteracted) return;
            elements = JSON.parse(JSON.stringify(originalElements));
            updateAllElements();
            resetVisibilities();
            updateConnections();
            if (document.getElementById('edit-brush-layer')) {
              document.getElementById('edit-brush-layer').innerHTML = originalEditBrushHTML;
            }
            brushLayer.innerHTML = '';
            setTimeout(() => {
              if (userInteracted) return;
              animateInitialConnections();
              setTimeout(() => {
                if (userInteracted) return;
                startAutoplay();
              }, 500);
            }, 200);
          }

          async function playInstant() {
            isAutoplayActive = true;
            updateAutoplayUI();

            let clickedAny = true;
            let iterations = 0;
            while (clickedAny && iterations < 500 && isAutoplayActive) {
              const availableBtns = getAvailableAutoplayButtons();

              if (availableBtns.length > 0) {
                availableBtns.forEach(btn => btn.click());
                iterations++;
                await new Promise(resolve => setTimeout(resolve, 150));
              } else {
                clickedAny = false;
              }
            }
            stopAutoplay();
            if (!userInteracted) {
              autoplayInterval = setTimeout(resetAndRestartAutoplay, 2000);
            }
          }

          function playNextStep() {
            if (!isAutoplayActive) return;

            const availableBtns = getAvailableAutoplayButtons();

            if (availableBtns.length > 0) {
              const btn = availableBtns[0];
              btn.click();
              
              const delayInput = document.getElementById('autoplay-delay-input');
              const val = delayInput ? parseFloat(delayInput.value) : 1.5;
              const delayMs = isNaN(val) || val <= 0 ? 1500 : val * 1000;
              
              autoplayInterval = setTimeout(playNextStep, delayMs);
            } else {
              stopAutoplay();
              if (!userInteracted) {
                autoplayInterval = setTimeout(resetAndRestartAutoplay, 2000);
              }
            }
          }

          function updateAutoplayUI() {
            const btn = document.getElementById('autoplay-btn');
            if (btn) {
              const playIcon = btn.querySelector('.play-icon');
              const pauseIcon = btn.querySelector('.pause-icon');
              if (isAutoplayActive) {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
                btn.style.background = '#ff9800';
              } else {
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                btn.style.background = '#4caf50';
              }
            }
          }

          let slides = [];
          let currentSlideIndex = 0;
          let isPresenting = false;
          let playedAnimationIds = [];

          function getSlideAnimationSteps(slideId) {
            const slideAnimations = [];
            elements.forEach(el => {
              if (el.id === slideId || el.parentId === slideId) {
                (el.animations || []).forEach(anim => {
                  slideAnimations.push({ anim, elementId: el.id });
                });
              }
            });
            slideAnimations.sort((a, b) => (a.anim.order || 0) - (b.anim.order || 0));

            const steps = [];
            let currentStep = null;
            slideAnimations.forEach(({ anim }) => {
              if (anim.trigger === 'onClick' || anim.trigger === 'onEnter' || !currentStep) {
                currentStep = {
                  triggerAnimId: anim.id,
                  animations: [anim]
                };
                steps.push(currentStep);
              } else {
                currentStep.animations.push(anim);
              }
            });
            return steps;
          }

          function getAnimationCSSStyle(element, playedAnimationIds) {
            const animations = element.animations || [];
            if (animations.length === 0) return {};

            let activeAnim = null;
            const played = animations.filter(a => playedAnimationIds.includes(a.id));
            if (played.length > 0) {
              activeAnim = played[played.length - 1];
            }

            const hasEntrance = animations.some(a => a.type === 'entrance');
            const entrancePlayed = animations
              .filter(a => a.type === 'entrance')
              .every(a => playedAnimationIds.includes(a.id));

            const styles = {};
            if (hasEntrance && !entrancePlayed) {
              styles.opacity = '0';
              styles.pointerEvents = 'none';
            } else {
              styles.opacity = '1';
              styles.pointerEvents = 'auto';
            }

            if (activeAnim) {
              const isPlaying = playedAnimationIds.includes(activeAnim.id);
              
              if (isPlaying) {
                styles.animationName = activeAnim.effect;
                styles.animationDuration = activeAnim.duration + 'ms';
                styles.animationTimingFunction = activeAnim.easing || 'ease';
                styles.animationDelay = activeAnim.delay + 'ms';
                styles.animationFillMode = 'forwards';

                if (activeAnim.type === 'emphasis') {
                  styles.animationFillMode = 'none';
                }
              }

              if (playedAnimationIds.includes(activeAnim.id)) {
                if (activeAnim.type === 'exit') {
                  styles.opacity = '0';
                  styles.pointerEvents = 'none';
                } else if (activeAnim.type === 'entrance') {
                  styles.opacity = '1';
                }
              }
            }

            return styles;
          }

          function updateAnimationStyles() {
            if (!isPresenting) {
              elements.forEach(el => {
                const wrapper = document.getElementById('el-wrapper-' + el.id);
                if (!wrapper) return;
                wrapper.style.animationName = '';
                wrapper.style.animationDuration = '';
                wrapper.style.animationTimingFunction = '';
                wrapper.style.animationDelay = '';
                wrapper.style.animationFillMode = '';
                wrapper.style.opacity = '';
                wrapper.style.pointerEvents = '';
              });
              return;
            }

            elements.forEach(el => {
              const wrapper = document.getElementById('el-wrapper-' + el.id);
              if (!wrapper) return;
              const styles = getAnimationCSSStyle(el, playedAnimationIds);
              
              wrapper.style.animationName = '';
              wrapper.style.animationDuration = '';
              wrapper.style.animationTimingFunction = '';
              wrapper.style.animationDelay = '';
              wrapper.style.animationFillMode = '';
              
              Object.keys(styles).forEach(key => {
                wrapper.style[key] = styles[key];
              });
            });
          }

          function hasRemainingAnimationStep(slide) {
            if (!slide) return false;
            return getSlideAnimationSteps(slide.id).some(step =>
              !step.animations.every(anim => playedAnimationIds.includes(anim.id))
            );
          }

          function updateSpeakerNotes() {
            const currentSlide = slides[currentSlideIndex];
            const notesPanel = document.getElementById('speaker-notes-panel');
            const notesText = document.getElementById('speaker-notes-text');
            const notesToggle = document.getElementById('notes-toggle-btn');
            const notes = currentSlide && currentSlide.speakerNotes ? currentSlide.speakerNotes : '';
            if (notesText) notesText.textContent = notes || 'No notes for this slide.';
            if (notesToggle) notesToggle.style.opacity = notes ? '1' : '0.55';
            if (notesPanel && notesPanel.style.display !== 'none' && !notes) {
              notesPanel.style.display = 'none';
            }
          }

          window.toggleSpeakerNotes = function(force) {
            const panel = document.getElementById('speaker-notes-panel');
            if (!panel) return;
            updateSpeakerNotes();
            const shouldShow = typeof force === 'boolean' ? force : panel.style.display === 'none';
            panel.style.display = shouldShow ? 'block' : 'none';
          };

          function updatePresentationControls() {
            const currentSlide = slides[currentSlideIndex];
            const prevBtn = document.getElementById('prev-slide-btn');
            const nextBtn = document.getElementById('next-slide-btn');
            const selectEl = document.getElementById('slide-select');
            const prevDisabled = currentSlideIndex === 0;
            const nextDisabled = currentSlideIndex >= slides.length - 1 && !hasRemainingAnimationStep(currentSlide);

            if (prevBtn) {
              prevBtn.disabled = prevDisabled;
              prevBtn.style.opacity = prevDisabled ? '0.4' : '1';
            }
            if (nextBtn) {
              nextBtn.disabled = nextDisabled;
              nextBtn.style.opacity = nextDisabled ? '0.4' : '1';
            }
            if (selectEl) {
              selectEl.value = currentSlideIndex + '';
            }
            updateSpeakerNotes();
          }

          window.startPresentation = () => {
            slides = elements.filter(el => el.type === 'node' && el.isSlide !== false).sort((a, b) => a.x - b.x);
            if (slides.length === 0) {
              showNotification('No Node Containers found to present.');
              return;
            }
            isPresenting = true;
             document.getElementById('presentation-bar').style.display = 'flex';
             document.getElementById('present-btn').style.display = 'none';
             document.getElementById('theme-toggle-btn').style.display = 'none';
             document.getElementById('autoplay-btn').style.display = 'none';
             document.getElementById('autoplay-settings-btn').style.display = 'none';
             document.getElementById('autoplay-settings-panel').style.display = 'none';
            document.querySelector('.brush-toolbar').style.display = 'none';
            const showBtn = document.getElementById('brush-show-btn');
            if (showBtn) showBtn.style.display = 'none';
            document.querySelector('.zoom-controls').style.display = 'none';
            
            document.body.classList.add('presentation-mode');
            
            const selectEl = document.getElementById('slide-select');
            if (selectEl) {
              selectEl.innerHTML = slides.map((s, idx) => '<option value="' + idx + '">Slide ' + (idx + 1) + ': ' + (s.title || 'Slide ' + (idx + 1)) + '</option>').join('');
            }
            
            goToSlide(0);
          };

          window.exitPresentation = () => {
            isPresenting = false;
            playedAnimationIds = [];
            updateAnimationStyles();
             document.getElementById('presentation-bar').style.display = 'none';
             document.getElementById('present-btn').style.display = 'flex';
             document.getElementById('theme-toggle-btn').style.display = 'flex';
             document.getElementById('autoplay-btn').style.display = 'flex';
             document.getElementById('autoplay-settings-btn').style.display = 'flex';
            const notesPanel = document.getElementById('speaker-notes-panel');
            if (notesPanel) notesPanel.style.display = 'none';
            const toolbar = document.querySelector('.brush-toolbar');
            const showBtn = document.getElementById('brush-show-btn');
            const isHidden = toolbar.classList.contains('hidden-toolbar');
            if (toolbar) toolbar.style.display = '';
            if (showBtn) showBtn.style.display = isHidden ? 'flex' : 'none';
            document.querySelector('.zoom-controls').style.display = 'flex';
            
            document.body.classList.remove('presentation-mode');
            
            document.getElementById('zoom-fit').click();
          };

          window.switchVariant = (variantId) => {
            if (variantId === activeVariantId) return;

            stopAutoplay();

            document.querySelectorAll('.variant-menu-item').forEach(item => {
              item.classList.toggle('active', item.getAttribute('data-id') === variantId);
            });
            const activeNameSpan = document.getElementById('active-variant-name');
            if (activeNameSpan) {
              const activeItem = document.querySelector('.variant-menu-item[data-id="' + variantId + '"]');
              if (activeItem) {
                activeNameSpan.innerText = activeItem.innerText.trim();
              }
            }

            const elementsLayer = document.getElementById('elements-layer');
            const connectionsLayer = document.getElementById('connections-layer');
            const editBrushLayer = document.getElementById('edit-brush-layer');
            const brushLayer = document.getElementById('brush-layer');

            const newElementsTemplate = document.getElementById('template-elements-' + variantId);
            const newConnectionsTemplate = document.getElementById('template-connections-' + variantId);
            const newBrushTemplate = document.getElementById('template-brush-' + variantId);

            if (elementsLayer && newElementsTemplate) {
              elementsLayer.innerHTML = newElementsTemplate.innerHTML;
            }
            if (connectionsLayer && newConnectionsTemplate) {
              connectionsLayer.innerHTML = newConnectionsTemplate.innerHTML;
            }
            if (editBrushLayer && newBrushTemplate) {
              editBrushLayer.innerHTML = newBrushTemplate.innerHTML;
            }
            if (brushLayer) {
              brushLayer.innerHTML = '';
            }

            activeVariantId = variantId;
            const data = variantsData[variantId];
            if (data) {
              elements = JSON.parse(JSON.stringify(data.elements));
              connections = JSON.parse(JSON.stringify(data.connections));
              originalElements = JSON.parse(JSON.stringify(data.elements));
              hiddenNodes = data.hiddenNodes;
              hiddenConnections = data.hiddenConnections;
              originalEditBrushHTML = editBrushLayer ? editBrushLayer.innerHTML : '';
            }

            isPresenting = false;
            document.body.classList.remove('presentation-mode');
            const presBar = document.getElementById('presentation-bar');
            if (presBar) presBar.style.display = 'none';
            const notesPanel = document.getElementById('speaker-notes-panel');
            if (notesPanel) notesPanel.style.display = 'none';
            playedAnimationIds = [];
            currentSlideIndex = 0;
            slides = [];
            history = [];
            redoStack = [];

            document.getElementById('present-btn').style.display = 'flex';
            document.getElementById('theme-toggle-btn').style.display = 'flex';
            document.getElementById('autoplay-btn').style.display = 'flex';
            document.getElementById('autoplay-settings-btn').style.display = 'flex';
            const toolbar = document.querySelector('.brush-toolbar');
            const showBtn = document.getElementById('brush-show-btn');
            if (toolbar) {
              const isHidden = toolbar.classList.contains('hidden-toolbar');
              toolbar.style.display = '';
              if (showBtn) showBtn.style.display = isHidden ? 'flex' : 'none';
            }
            const zoomCtrls = document.querySelector('.zoom-controls');
            if (zoomCtrls) zoomCtrls.style.display = 'flex';

            updateTransform();
            updateConnections();

            setTimeout(() => {
              if (document.getElementById('zoom-fit')) {
                document.getElementById('zoom-fit').click();
              }
            }, 50);
            setTimeout(() => {
              resetVisibilities();
              animateInitialConnections();
              startPropagationAnimation();
            }, 500);

            showNotification('Switched variant');
          };

          window.goToSlide = (index) => {
            if (slides.length === 0) return;
            const prevIndex = currentSlideIndex;
            currentSlideIndex = Math.max(0, Math.min(index, slides.length - 1));
            
            const slide = slides[currentSlideIndex];
            
            const targetAnimations = [];
            const autoPlayIds = [];
            elements.forEach(el => {
              if (el.id === slide.id || el.parentId === slide.id) {
                (el.animations || []).forEach(anim => {
                  targetAnimations.push(anim.id);
                  if (anim.trigger === 'onEnter') {
                    autoPlayIds.push(anim.id);
                  }
                });
              }
            });

            const newPlayedIds = playedAnimationIds.filter(id => !targetAnimations.includes(id));
            if (currentSlideIndex < prevIndex) {
              playedAnimationIds = [...newPlayedIds, ...targetAnimations];
            } else {
              playedAnimationIds = [...newPlayedIds, ...autoPlayIds];
            }

            updateAnimationStyles();

            const slideEl = document.getElementById('el-wrapper-' + slide.id);
            if (slideEl && slideEl.classList.contains('is-hidden')) {
              revealCascade(slide.id);
            }
            const padding = 60;
            const availW = window.innerWidth - padding * 2;
            const availH = window.innerHeight - padding * 2;
            
            const scaleX = availW / slide.width;
            const scaleY = availH / slide.height;
            const targetScale = Math.min(scaleX, scaleY, 2.0);
            
            const targetPanX = window.innerWidth / 2 - (slide.x + slide.width / 2) * targetScale;
            const targetPanY = window.innerHeight / 2 - (slide.y + slide.height / 2) * targetScale;
            
            scale = targetScale;
            pan = { x: targetPanX, y: targetPanY };
            updateTransform();
            
            updatePresentationControls();
          };

          window.nextSlide = () => {
            if (slides.length === 0) {
              slides = elements.filter(el => el.type === 'node' && el.isSlide !== false).sort((a, b) => a.x - b.x);
            }
            if (slides.length === 0) return;
            if (!isPresenting) {
              startPresentation();
              return;
            }
            
            const currentSlide = slides[currentSlideIndex];
            if (!currentSlide) return;

            const slideSteps = getSlideAnimationSteps(currentSlide.id);
            const nextStep = slideSteps.find(step => 
              !step.animations.every(anim => playedAnimationIds.includes(anim.id))
            );

            if (nextStep) {
              const nextAnimIds = nextStep.animations.map(a => a.id);
              playedAnimationIds = [...playedAnimationIds, ...nextAnimIds];
              updateAnimationStyles();
              updatePresentationControls();
            } else {
              if (currentSlideIndex < slides.length - 1) {
                goToSlide(currentSlideIndex + 1);
              }
            }
          };

          window.prevSlide = () => {
            if (slides.length === 0) {
              slides = elements.filter(el => el.type === 'node' && el.isSlide !== false).sort((a, b) => a.x - b.x);
            }
            if (slides.length === 0) return;
            if (!isPresenting) {
              startPresentation();
              return;
            }
            if (currentSlideIndex > 0) goToSlide(currentSlideIndex - 1);
          };

          window.onkeydown = e => {
            const target = e.target;
            const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.contentEditable === 'true';

            if (!isInput && e.key.toLowerCase() === 'l') {
              e.preventDefault();
              isLaserActive = !isLaserActive;
              updateLaserState();
              return;
            }

            if (isPresenting) {
              if (e.key === 'ArrowRight' || e.key === ' ' || e.code === 'Space' || e.key === 'Enter') {
                e.preventDefault();
                nextSlide();
              } else if (e.key === 'ArrowLeft' || ((e.key === ' ' || e.code === 'Space') && e.shiftKey)) {
                e.preventDefault();
                prevSlide();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                exitPresentation();
              }
              return;
            }
            if (!isInput && (e.key === 'Delete' || e.key === 'Backspace') && activeRuntimeTextId) {
              e.preventDefault();
              deleteRuntimeTextElement(activeRuntimeTextId);
              return;
            }
            if (e.code === 'Space' && !isInput) { e.preventDefault(); isSpaceDown = true; container.classList.add('space-down'); updateBrushCursor(); }
            if (e.key.toLowerCase() === 'b' && !isInput) {
              e.preventDefault();
              if (isBrushMode && brushTool === 'draw') {
                isBrushMode = false;
              } else {
                isBrushMode = true;
                brushTool = 'draw';
              }
              updateBrushToolClasses();
              showNotification(isBrushMode ? 'Brush mode enabled' : 'Brush mode disabled');
            }
            if (e.key.toLowerCase() === 'e' && !isInput) {
              e.preventDefault();
              if (isBrushMode && brushTool === 'erase') {
                isBrushMode = false;
              } else {
                isBrushMode = true;
                brushTool = 'erase';
              }
              updateBrushToolClasses();
              showNotification(isBrushMode ? 'Eraser mode enabled' : 'Eraser mode disabled');
            }
            if (e.key.toLowerCase() === 'x' && !isInput) clearBrush();
            // Ctrl + 0 shortcut for fit in view
            if ((e.ctrlKey || e.metaKey) && e.key === '0') {
              e.preventDefault();
              const zoomFitBtn = document.getElementById('zoom-fit');
              if (zoomFitBtn) zoomFitBtn.click();
              return;
            }

            if (!isInput && e.key.toLowerCase() === 'h' && !isInput) { e.preventDefault(); toggleToolbarVisibility(); }
            if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z' && !isInput) { e.preventDefault(); undo(); }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y' && !isInput) { e.preventDefault(); redo(); }
            if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+') && !isInput) {
              e.preventDefault();
              const slider = document.getElementById('brush-width-slider');
              if (slider) {
                slider.value = Math.min(100, parseInt(slider.value) + 5) + '';
                document.getElementById('brush-width-val').innerText = slider.value;
                updateBrushCursor();
              }
            }
            if ((e.ctrlKey || e.metaKey) && e.key === '-' && !isInput) {
              e.preventDefault();
              const slider = document.getElementById('brush-width-slider');
              if (slider) {
                slider.value = Math.max(1, parseInt(slider.value) - 5) + '';
                document.getElementById('brush-width-val').innerText = slider.value;
                updateBrushCursor();
              }
            }
          };
          window.onkeyup = e => { if (e.code === 'Space') { isSpaceDown = false; isPanning = false; container.classList.remove('space-down', 'panning'); updateBrushCursor(); }};

          // Laser pointer and trail logic inside exported HTML
          const laserEl = document.getElementById('laser-pointer-el');
          const trailSvg = document.getElementById('laser-trail-svg');
          let lastMoveTime = Date.now();

          function updateLaserState() {
            if (isLaserActive) {
              laserEl.style.display = 'block';
              trailSvg.style.display = 'block';
              container.classList.add('laser-cursor-none');
            } else {
              laserEl.style.display = 'none';
              trailSvg.style.display = 'none';
              container.classList.remove('laser-cursor-none');
              laserTrail = [];
              trailSvg.innerHTML = '';
            }
          }

          window.addEventListener('pointermove', e => {
            if (!isLaserActive) return;
            laserPos = { x: e.clientX, y: e.clientY };
            laserEl.style.left = laserPos.x + 'px';
            laserEl.style.top = laserPos.y + 'px';
            
            laserTrail.push({ x: e.clientX, y: e.clientY });
            if (laserTrail.length > 20) {
              laserTrail.shift();
            }
            lastMoveTime = Date.now();
            renderTrail();
          });

          function renderTrail() {
            if (laserTrail.length === 0) {
              trailSvg.innerHTML = '';
              return;
            }
            let html = '';
            for (let i = 1; i < laserTrail.length; i++) {
              const p1 = laserTrail[i - 1];
              const p2 = laserTrail[i];
              const ratio = i / laserTrail.length;
              const opacity = ratio * 0.8;
              const strokeWidth = ratio * 8 + 2;
              html += '<line x1="' + p1.x + '" y1="' + p1.y + '" x2="' + p2.x + '" y2="' + p2.y + '" stroke="#ff1744" stroke-width="' + strokeWidth + '" opacity="' + opacity + '" stroke-linecap="round" style="filter: drop-shadow(0 0 4px #ff1744);" />';
            }
            trailSvg.innerHTML = html;
          }

          function decayTrail() {
            if (isLaserActive && Date.now() - lastMoveTime > 80) {
              if (laserTrail.length > 0) {
                laserTrail.shift();
                renderTrail();
              }
            }
            setTimeout(() => requestAnimationFrame(decayTrail), 16);
          }
          requestAnimationFrame(decayTrail);

          function animateWire(connGroup, show) {
            const path = connGroup.querySelector('path');
            if (!path) return;
            const len = path.getTotalLength ? path.getTotalLength() : 500;
            connGroup.style.setProperty('--wire-len', len + '');
            connGroup.classList.remove('wire-draw', 'wire-undraw');
            void connGroup.offsetWidth; // force reflow
            if (show) {
              connGroup.classList.remove('is-hidden');
              connGroup.style.opacity = '1';
              connGroup.classList.add('wire-draw');
              connGroup.addEventListener('animationend', function h() {
                connGroup.removeEventListener('animationend', h);
                connGroup.classList.remove('wire-draw');
              }, {once: true});
            } else {
              connGroup.style.opacity = '0';
              connGroup.classList.add('wire-undraw');
              connGroup.addEventListener('animationend', function h() {
                connGroup.removeEventListener('animationend', h);
                connGroup.classList.add('is-hidden');
              }, {once: true});
            }
          }





          window.toggleNodeArrows = function(event, id) {
            if (event) event.stopPropagation();
            const el = document.getElementById('el-wrapper-' + id);
            if (!el) return;
            const isShowingNow = el.classList.toggle('show-btns');
            if (isShowingNow) {
              // Show all buttons again (clear any temporary hide class) when reopening
              el.querySelectorAll('.conn-btn').forEach(btn => {
                btn.classList.remove('clicked-hidden');
              });
            }
          };

          function revealCascade(id) {
            const el = document.getElementById('el-wrapper-' + id);
            if (!el) return;

            el.classList.remove('is-hidden', 'flow-hide');
            el.style.pointerEvents = 'auto';
            el.classList.add('flow-reveal');

            document.querySelectorAll('path[data-attached-node-id="' + id + '"]').forEach(path => {
              path.style.opacity = '1';
              path.style.pointerEvents = 'auto';
            });

            const elData = elements.find(e => e.id === id);
            if (elData && (elData.interactive || elData.enableExpandButton)) {
              return;
            }

            document.querySelectorAll('.connection-group').forEach(cg => {
              if (cg.dataset.from === id) {
                animateWire(cg, true);
                revealCascade(cg.dataset.to);
              }
            });
          }

          window.toggleMultipleTargets = function(btn, targetIdsStr, fromId) {
            const targetIds = targetIdsStr.split(',');
            const isShowing = btn.classList.toggle('active');
            
            targetIds.forEach(targetId => {
              let connGroup = null;
              document.querySelectorAll('.connection-group').forEach(cg => {
                if (cg.dataset.from === fromId && cg.dataset.to === targetId) {
                  connGroup = cg;
                }
              });

              if (isShowing) {
                if (connGroup) animateWire(connGroup, true);
                revealCascade(targetId);
              } else {
                if (connGroup) animateWire(connGroup, false);
                hideCascade(targetId);
              }
            });

            if (isShowing) {
              btn.classList.add('clicked-hidden');
            } else {
              btn.classList.remove('clicked-hidden');
            }
          };

          function hideCascade(id) {
            const el = document.getElementById('el-wrapper-' + id);
            if (!el) return;
            const elData = elements.find(e => e.id === id);
            if (elData && (elData.pinned || elData.isPinned)) return;

            el.classList.remove('flow-reveal');
            el.classList.add('flow-hide');
            el.style.pointerEvents = 'none';

            document.querySelectorAll('path[data-attached-node-id="' + id + '"]').forEach(path => {
              path.style.opacity = '0';
              path.style.pointerEvents = 'none';
            });
            
            el.addEventListener('animationend', function h() {
              el.removeEventListener('animationend', h);
              el.classList.add('is-hidden');
              el.classList.remove('flow-hide');
              el.classList.remove('show-btns');
              el.querySelectorAll('.conn-btn-group').forEach(bg => {
                bg.style.opacity = '0';
                bg.style.pointerEvents = 'none';
              });
              el.querySelectorAll('.conn-btn').forEach(cb => {
                cb.classList.remove('active', 'clicked-hidden');
              });
            }, {once: true});

            document.querySelectorAll('.connection-group').forEach(cg => {
              if (cg.dataset.from === id) {
                if (cg.style.opacity !== '0') animateWire(cg, false);
                hideCascade(cg.dataset.to);
              }
            });
          }

          window.toggleDisabled = function(id) {
            const el = document.getElementById('el-wrapper-' + id); if (!el) return;
            const disabled = el.classList.toggle('disabled');
            el.style.filter = disabled ? 'grayscale(1) contrast(0.5)' : 'none';
            el.style.opacity = disabled ? '0.6' : '1';
            if (!el.classList.contains('is-button')) {
              el.style.pointerEvents = disabled ? 'none' : 'auto';
            } else {
              const innerBtn = el.querySelector('button');
              if (innerBtn) innerBtn.disabled = disabled;
            }
          };

          window.toggleVisibility = function(id) {
            const el = document.getElementById('el-wrapper-' + id); if (!el) return;
            const isHidden = el.classList.toggle('is-hidden');
            document.querySelectorAll('path[data-attached-node-id="' + id + '"]').forEach(path => {
              path.style.opacity = isHidden ? '0' : '1';
              path.style.pointerEvents = isHidden ? 'none' : 'auto';
            });
          };

          window.triggerFlow = function(id) {
            revealCascade(id);
          };

          window.goToSlideById = function(id) {
            if (slides.length === 0) {
              slides = elements.filter(el => el.type === 'node' && el.isSlide !== false).sort((a, b) => a.x - b.x);
            }
            const index = slides.findIndex(s => s.id === id);
            if (index !== -1) {
              if (!isPresenting) {
                startPresentation();
              }
              goToSlide(index);
            }
          };

          function updateTransform() {
            content.style.transform = 'translate(' + pan.x + 'px, ' + pan.y + 'px) scale(' + scale + ')';
            document.getElementById('zoom-percent').innerText = Math.round(scale * 100) + '%';
            let gridS = 24 * scale;
            while(gridS < 15) gridS *= 2;
            while(gridS > 60) gridS /= 2;
            container.style.backgroundSize = gridS + 'px ' + gridS + 'px';
            container.style.backgroundPosition = pan.x + 'px ' + pan.y + 'px';
            
            // Adjust interactive button scale when zoomed out
            const btnScale = scale < 1 ? 1 / scale : 1;
            container.style.setProperty('--conn-btn-scale', btnScale + '');
            updateBrushCursor();
          }

          container.onwheel = e => {
            e.preventDefault(); const delta = -e.deltaY * 0.001; const ns = Math.min(Math.max(0.05, scale * (1 + delta)), 20);
            const r = container.getBoundingClientRect(); const mx = e.clientX - r.left, my = e.clientY - r.top;
            const cx = (mx - pan.x) / scale, cy = (my - pan.y) / scale;
            pan.x = mx - cx * ns; pan.y = my - cy * ns; scale = ns; updateTransform();
          };

          let isResizingBrush = false;
          let startResizeInfo = { x: 0, width: 0 };

          container.addEventListener('pointerdown', e => {
            if (e.altKey && e.button === 2) {
              isResizingBrush = true;
              const slider = document.getElementById('brush-width-slider');
              startResizeInfo = { x: e.clientX, width: parseFloat(slider ? slider.value : '4') };
              return;
            }
            if (isSpaceDown) { isPanning = true; container.classList.add('panning'); startPan = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }; return; }
            if (e.button === 2) {
              e.preventDefault();
              const el = e.target.closest('.draggable-element');
              if (el) {
                const id = el.id.replace('el-wrapper-', '');
                const elData = elements.find(item => item.id === id);
                if (elData && elData.id?.startsWith('runtime-text-')) {
                  selectRuntimeTextElement(id);
                  lastRightClickReset = { id: null, time: 0 };
                  const r = container.getBoundingClientRect();
                  const canvasX = (e.clientX - r.left - pan.x) / scale;
                  const canvasY = (e.clientY - r.top - pan.y) / scale;
                  showHtmlContextMenu(e.clientX, e.clientY, canvasX, canvasY, id);
                } else {
                  const now = Date.now();
                  if (lastRightClickReset.id === id && now - lastRightClickReset.time < 550) {
                    resetElementPosition(id);
                    lastRightClickReset = { id: null, time: 0 };
                  } else {
                    lastRightClickReset = { id, time: now };
                  }
                }
              } else {
                lastRightClickReset = { id: null, time: 0 };
                const r = container.getBoundingClientRect();
                const canvasX = (e.clientX - r.left - pan.x) / scale;
                const canvasY = (e.clientY - r.top - pan.y) / scale;
                showHtmlContextMenu(e.clientX, e.clientY, canvasX, canvasY, null);
              }
              return;
            }
            if (isBrushMode) {
              const r = container.getBoundingClientRect();
              const x = (e.clientX - r.left - pan.x) / scale, y = (e.clientY - r.top - pan.y) / scale;
              if (brushTool === 'erase') {
                isErasing = true;
                lastEraserPos = { x, y };
                const brushWidthVal = parseFloat(document.getElementById('brush-width-slider')?.value || '4');
                eraseBrushStrokesAt({ x, y }, null, brushWidthVal / 2);
              } else {
                currentStroke = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                currentStroke.setAttribute('fill', 'none');
                currentStroke.setAttribute('stroke', document.getElementById('brush-color').value);
                const brushWidthVal = document.getElementById('brush-width-slider') ? document.getElementById('brush-width-slider').value : '4';
                currentStroke.setAttribute('stroke-width', brushWidthVal);
                currentStroke.setAttribute('stroke-linecap', 'round');
                currentStroke.setAttribute('stroke-linejoin', 'round');
                currentStroke.dataset.pts = x + ',' + y;
                brushLayer.appendChild(currentStroke);
              }
              return;
            }
            window.blockClick = false;
            if (e.target.closest('.brush-toolbar') || e.target.closest('#presentation-bar') || e.target.closest('.theme-toggle-btn') || e.target.closest('.zoom-controls') || e.target.closest('.conn-btn-group') || e.target.closest('.conn-btn')) {
              return;
            }
            if (e.target.closest('[contenteditable="true"]')) {
              return;
            }
            hideHtmlContextMenu();
            const el = e.target.closest('.draggable-element');
            if (el) {
              const id = el.id.replace('el-wrapper-', '');
              if (!id.startsWith('runtime-text-')) clearRuntimeTextSelection();
              activeDrag = el;
              startDrag = { x: e.clientX, y: e.clientY, ex: parseFloat(el.style.left), ey: parseFloat(el.style.top) };
              el.style.zIndex = 2000;
              e.stopPropagation();
            } else {
              clearRuntimeTextSelection();
            }
          }, false);

          window.addEventListener('pointermove', e => {
            if (isResizingBrush) {
              const deltaX = e.clientX - startResizeInfo.x;
              const newWidth = Math.max(1, Math.min(100, Math.floor(startResizeInfo.width + deltaX * 0.2)));
              const slider = document.getElementById('brush-width-slider');
              if (slider) {
                slider.value = newWidth + '';
                document.getElementById('brush-width-val').innerText = newWidth;
                updateBrushCursor(e);
              }
              return;
            }
            updateBrushCursor(e);
            if (isPanning) { pan.x = startPan.px + (e.clientX - startPan.x); pan.y = startPan.py + (e.clientY - startPan.y); updateTransform(); return; }
            if (isErasing) {
              const r = container.getBoundingClientRect();
              const x = (e.clientX - r.left - pan.x) / scale, y = (e.clientY - r.top - pan.y) / scale;
              const brushWidthVal = parseFloat(document.getElementById('brush-width-slider')?.value || '4');
              eraseBrushStrokesAt({ x, y }, lastEraserPos, brushWidthVal / 2);
              lastEraserPos = { x, y };
              return;
            }
            if (currentStroke) {
              const r = container.getBoundingClientRect();
              const x = (e.clientX - r.left - pan.x) / scale, y = (e.clientY - r.top - pan.y) / scale;
              currentStroke.dataset.pts += ' ' + x + ',' + y;
              currentStroke.setAttribute('d', 'M ' + currentStroke.dataset.pts.split(' ').map(p => p.replace(',', ' ')).join(' L '));
            }
            if (activeDrag) {
              const totalMove = Math.hypot(e.clientX - startDrag.x, e.clientY - startDrag.y);
              if (totalMove > 5) {
                window.blockClick = true;
              }
              const dx = (e.clientX - startDrag.x) / scale, dy = (e.clientY - startDrag.y) / scale;
              const newX = startDrag.ex + dx, newY = startDrag.ey + dy;
              activeDrag.style.left = newX + 'px'; activeDrag.style.top = newY + 'px';
              const id = activeDrag.id.replace('el-wrapper-', '');
              const elData = elements.find(el => el.id === id);
              if (elData) {
                const diffX = newX - elData.x;
                const diffY = newY - elData.y;
                elData.x = newX;
                elData.y = newY;
                if (diffX !== 0 || diffY !== 0) {
                  translateAttachedBrushPaths(id, diffX, diffY);
                }
              }
              requestAnimationFrame(updateConnections);
            }
          });

          window.addEventListener('pointerup', () => {
            if (currentStroke) {
              const ptsStr = currentStroke.dataset.pts || '';
              const pts = ptsStr.split(' ').map(pt => {
                const [x, y] = pt.split(',').map(parseFloat);
                return { x, y };
              });
              let attachedNodeId = null;
              for (let i = elements.length - 1; i >= 0; i--) {
                const node = elements[i];
                if (node.visible === false) continue;
                const bounds = getElementCanvasBounds(node);
                const intersects = pts.some(p =>
                  p.x >= bounds.x &&
                  p.x <= bounds.x + bounds.width &&
                  p.y >= bounds.y &&
                  p.y <= bounds.y + bounds.height
                );
                if (intersects) {
                  attachedNodeId = node.id;
                  break;
                }
              }
              if (ptsStr) {
                currentStroke.setAttribute('data-pts', ptsStr);
              }
              if (attachedNodeId) {
                currentStroke.setAttribute('data-attached-node-id', attachedNodeId);
                currentStroke.dataset.attachedNodeId = attachedNodeId;
              }
              saveHistory();
            }
            currentStroke = null;
            isErasing = false;
            lastEraserPos = null;
            isPanning = false;
            isResizingBrush = false;
            container.classList.remove('panning');
            if (activeDrag) {
              activeDrag.style.zIndex = activeDrag.classList.contains('is-node') ? 1 : 2;
              activeDrag = null;
            }
          });

          document.getElementById('zoom-fit').onclick = () => {
            const rootEls = elements.filter(el => !el.parentId);
            if (!rootEls.length) { scale = 1; pan = {x:0,y:0}; updateTransform(); return; }
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            rootEls.forEach(el => { minX = Math.min(minX, el.x); minY = Math.min(minY, el.y); maxX = Math.max(maxX, el.x + el.width); maxY = Math.max(maxY, el.y + el.height); });
            const p = 50, cw = maxX - minX, ch = maxY - minY, aw = window.innerWidth - p*2, ah = window.innerHeight - p*2;
            scale = Math.min(Math.min(aw/cw, ah/ch), 1.5);
            pan.x = window.innerWidth/2 - ((minX+maxX)/2)*scale; pan.y = window.innerHeight/2 - ((minY+maxY)/2)*scale;
            updateTransform(); updateConnections();
          };

          function getAbsoluteBounds(id) {
            const data = elements.find(item => item.id === id);
            if (data) {
              const bounds = getElementCanvasBounds(data);
              return { ...bounds, rotation: data.rotation || 0 };
            }
            const el = document.getElementById('el-wrapper-' + id); if (!el) return null;
            let x = parseFloat(el.style.left), y = parseFloat(el.style.top);
            const parent = el.parentElement.closest('.is-node');
            if (parent) { x += parseFloat(parent.style.left) + 16; y += parseFloat(parent.style.top) + 45 + 16; }
            return { x, y, width: parseFloat(el.style.width), height: parseFloat(el.style.height), rotation: 0 };
          }

          function rotateVector(x, y, degrees) {
            const rad = degrees * Math.PI / 180;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);
            return {
              x: x * cos - y * sin,
              y: x * sin + y * cos
            };
          }

          function updateConnections() {
            connections.forEach(conn => {
              const path = document.getElementById('conn-' + conn.id); if (!path) return;
              const f = getAbsoluteBounds(conn.fromId), t = getAbsoluteBounds(conn.toId); if (!f || !t) return;
              const coords = (b, p) => {
                const cx = b.x + b.width / 2;
                const cy = b.y + b.height / 2;
                let lx = 0, ly = 0, nx = 1, ny = 0;
                if (p === 'top') {
                  ly = -b.height / 2; nx = 0; ny = -1;
                } else if (p === 'bottom') {
                  ly = b.height / 2; nx = 0; ny = 1;
                } else if (p === 'left') {
                  lx = -b.width / 2; nx = -1; ny = 0;
                } else {
                  lx = b.width / 2; nx = 1; ny = 0;
                }
                const point = rotateVector(lx, ly, b.rotation || 0);
                const normal = rotateVector(nx, ny, b.rotation || 0);
                return { x: cx + point.x, y: cy + point.y, nx: normal.x, ny: normal.y };
              };
              const s = coords(f, conn.fromPort), e = coords(t, conn.toPort);
              const connArrow = Object.assign({ start: conn.startArrow || 'none', end: conn.endArrow || 'none', size: 6 }, conn.arrow || {});
              const connStroke = Object.assign({ lineType: 'curve' }, conn.stroke || {});
              const gap = Math.max(1.8, connArrow.size * 0.3);
              if (connArrow.start !== 'none') {
                s.x += s.nx * gap;
                s.y += s.ny * gap;
              }
              if (connArrow.end !== 'none') {
                e.x += e.nx * gap;
                e.y += e.ny * gap;
              }
              const dx = e.x - s.x;
              const dy = e.y - s.y;
              const dist = Math.hypot(dx, dy);
              const cd = Math.min(Math.max(dist * 0.35, 30), 120);
              let cx1 = s.x, cy1 = s.y, cx2 = e.x, cy2 = e.y;
              cx1 += s.nx * cd;
              cy1 += s.ny * cd;
              cx2 += e.nx * cd;
              cy2 += e.ny * cd;
              const midX = 0.125 * s.x + 0.375 * cx1 + 0.375 * cx2 + 0.125 * e.x;
              const midY = 0.125 * s.y + 0.375 * cy1 + 0.375 * cy2 + 0.125 * e.y;
              const d = connStroke.lineType === 'straight'
                ? 'M ' + s.x + ' ' + s.y + ' L ' + e.x + ' ' + e.y
                : connStroke.lineType === 'elbow'
                  ? 'M ' + s.x + ' ' + s.y + ' L ' + s.x + ' ' + midY + ' L ' + e.x + ' ' + midY + ' L ' + e.x + ' ' + e.y
                  : 'M ' + s.x + ' ' + s.y + ' C ' + cx1 + ' ' + cy1 + ', ' + cx2 + ' ' + cy2 + ', ' + e.x + ' ' + e.y;
              const reverseD = connStroke.lineType === 'straight'
                ? 'M ' + e.x + ' ' + e.y + ' L ' + s.x + ' ' + s.y
                : connStroke.lineType === 'elbow'
                  ? 'M ' + e.x + ' ' + e.y + ' L ' + e.x + ' ' + midY + ' L ' + s.x + ' ' + midY + ' L ' + s.x + ' ' + s.y
                  : 'M ' + e.x + ' ' + e.y + ' C ' + cx2 + ' ' + cy2 + ', ' + cx1 + ' ' + cy1 + ', ' + s.x + ' ' + s.y;
              path.setAttribute('d', d);
              const pulsePath = document.getElementById('conn-pulse-' + conn.id);
              if (pulsePath) {
                pulsePath.setAttribute('d', d);
              }
              const helperPath = document.getElementById('conn-text-' + conn.id);
              if (helperPath) {
                helperPath.setAttribute('d', reverseD);
              }
              const labelEl = document.getElementById('conn-label-' + conn.id);
              if (labelEl) {
                const tagName = labelEl.tagName.toLowerCase();
                if (tagName === 'textpath') {
                  // do nothing
                } else if (tagName === 'foreignobject') {
                  labelEl.setAttribute('x', (midX - 200).toString());
                  labelEl.setAttribute('y', (midY - 20).toString());
                } else {
                  labelEl.setAttribute('x', midX.toString());
                  labelEl.setAttribute('y', midY.toString());
                }
              }
              const connGroup = document.getElementById('conn-group-' + conn.id);
              if (connGroup && (connGroup.classList.contains('wire-draw') || connGroup.classList.contains('wire-undraw'))) {
                const len = path.getTotalLength ? path.getTotalLength() : 500;
                connGroup.style.setProperty('--wire-len', len + '');
              }
            });
          }
          function animateInitialConnections() {
            document.querySelectorAll('.connection-group').forEach(cg => {
              const toId = cg.dataset.to;
              const toEl = document.getElementById('el-wrapper-' + toId);
              const fromId = cg.dataset.from;
              const fromEl = document.getElementById('el-wrapper-' + fromId);
              
              const isFromHidden = fromEl && fromEl.classList.contains('is-hidden');
              const isToHidden = toEl && toEl.classList.contains('is-hidden');
              
              if (!cg.classList.contains('is-hidden') && !isFromHidden && !isToHidden) {
                animateWire(cg, true);
              } else {
                cg.style.opacity = '0';
              }
            });
          }
          function resetVisibilities() {
            elements.forEach(el => {
              const wrapper = document.getElementById('el-wrapper-' + el.id);
              if (wrapper) {
                wrapper.classList.remove('flow-reveal', 'flow-hide', 'show-btns');
                wrapper.style.filter = '';
                
                const isInteractiveHidden = hiddenNodes.includes(el.id);
                if (isInteractiveHidden) {
                   wrapper.classList.add('is-hidden');
                  wrapper.style.opacity = '0';
                  wrapper.style.pointerEvents = 'none';
                } else if (el.isDisabled) {
                  wrapper.classList.remove('is-hidden');
                  wrapper.style.filter = 'grayscale(1) contrast(0.5)';
                  wrapper.style.opacity = '0.6';
                  if (el.type !== 'button') wrapper.style.pointerEvents = 'none';
                  else wrapper.style.pointerEvents = 'auto';
                } else {
                  wrapper.classList.remove('is-hidden');
                  wrapper.style.opacity = '1';
                  wrapper.style.pointerEvents = 'auto';
                }

                const btn = wrapper.querySelector('button');
                if (btn && el.type === 'button') {
                  btn.disabled = !!el.isDisabled;
                }

                wrapper.querySelectorAll('.conn-btn').forEach(cb => {
                  cb.classList.remove('active', 'clicked-hidden');
                });
              }
            });

            document.querySelectorAll('.connection-group').forEach(cg => {
              cg.classList.remove('flow-active');
              const connId = cg.dataset.id;
              const isInitialHidden = hiddenConnections.includes(connId);
              cg.style.opacity = '0';
              if (isInitialHidden) {
                cg.classList.add('is-hidden');
              } else {
                cg.classList.remove('is-hidden');
              }
          });
          }

          function startPropagationAnimation() {
            const targetIds = new Set(connections.map(c => c.toId));
            const rootNodes = elements.filter(el => !el.parentId && !targetIds.has(el.id));
            const startNodes = rootNodes.length > 0 ? rootNodes : elements.filter(el => !el.parentId);
            
            const visitedNodes = new Set();
            const queue = startNodes.map(n => ({ id: n.id, delay: 0 }));
            queue.forEach(item => visitedNodes.add(item.id));
            
            while (queue.length > 0) {
              const current = queue.shift();
              const outConns = connections.filter(c => c.fromId === current.id);
              outConns.forEach(conn => {
                const connGroup = document.getElementById('conn-group-' + conn.id);
                if (connGroup) {
                  setTimeout(() => {
                    connGroup.classList.add('flow-active');
                  }, current.delay);
                }
                
                if (!visitedNodes.has(conn.toId)) {
                  visitedNodes.add(conn.toId);
                  queue.push({ id: conn.toId, delay: current.delay + 500 });
                }
              });
            }
          }

          updateTransform(); updateConnections();
          setTimeout(() => {
            if (document.getElementById('zoom-fit')) {
              document.getElementById('zoom-fit').click();
            }
          }, 50);
          setTimeout(() => {
            animateInitialConnections();
            startPropagationAnimation();
          }, 500);

          function handleUserInteraction(e) {
            const isElementClick = e.target.closest('.draggable-element') || 
                                   e.target.closest('.connection-group') || 
                                   e.target.closest('.conn-btn') ||
                                   (isBrushMode && !e.target.closest('.brush-toolbar') && !e.target.closest('.theme-toggle-btn') && !e.target.closest('.zoom-controls'));
            if (isElementClick) {
              if (!userInteracted) {
                userInteracted = true;
                stopAutoplay();
              }
            }
          }
          window.addEventListener('pointerdown', handleUserInteraction, { capture: true });

          setTimeout(() => {
            if (!userInteracted) {
              startAutoplay();
            }
          }, 1500);
        })();
      <\/script>
      <script id="js-builder-state" type="application/json">${E({variants:t.map(e=>e.id===n?{...e,elements:r,connections:i,brushStrokes:a,guides:o}:e),activeVariantId:n,theme:s})}<\/script>
      </body>
      </html>
    `}var Je=class{d;constructor(e){this.d=e}saveHistory=()=>{let{elementsRef:e,connectionsRef:t,brushStrokesRef:n,setHistory:r,setRedoStack:i}=this.d,a={elements:structuredClone(e.current),connections:structuredClone(t.current),brushStrokes:structuredClone(n.current)};r(e=>[...e.slice(-49),a]),i([])};saveHistoryOnce=(e,t=700)=>{let{historyScopesRef:n}=this.d;n.current[e]||this.saveHistory(),window.clearTimeout(n.current[e]),n.current[e]=window.setTimeout(()=>{delete n.current[e]},t)};undo=()=>{let{elementsRef:e,connectionsRef:t,brushStrokesRef:n,setHistory:r,setRedoStack:i,setElements:a,setConnections:o,setBrushStrokes:s}=this.d;r(r=>{if(r.length===0)return r;let c=r[r.length-1];return i(r=>[...r,{elements:structuredClone(e.current),connections:structuredClone(t.current),brushStrokes:structuredClone(n.current)}]),a(c.elements),o(c.connections),s(c.brushStrokes),r.slice(0,-1)})};redo=()=>{let{elementsRef:e,connectionsRef:t,brushStrokesRef:n,setHistory:r,setRedoStack:i,setElements:a,setConnections:o,setBrushStrokes:s}=this.d;i(i=>{if(i.length===0)return i;let c=i[i.length-1];return r(r=>[...r,{elements:structuredClone(e.current),connections:structuredClone(t.current),brushStrokes:structuredClone(n.current)}]),a(c.elements),o(c.connections),s(c.brushStrokes),i.slice(0,-1)})}},Ye=[];for(let e=0;e<256;++e)Ye.push((e+256).toString(16).slice(1));function Xe(e,t=0){return(Ye[e[t+0]]+Ye[e[t+1]]+Ye[e[t+2]]+Ye[e[t+3]]+`-`+Ye[e[t+4]]+Ye[e[t+5]]+`-`+Ye[e[t+6]]+Ye[e[t+7]]+`-`+Ye[e[t+8]]+Ye[e[t+9]]+`-`+Ye[e[t+10]]+Ye[e[t+11]]+Ye[e[t+12]]+Ye[e[t+13]]+Ye[e[t+14]]+Ye[e[t+15]]).toLowerCase()}var Ze=new Uint8Array(16);function Qe(){return crypto.getRandomValues(Ze)}function Z(e,t,n){return!t&&!e&&crypto.randomUUID?crypto.randomUUID():$e(e,t,n)}function $e(e,t,n){e||={};let r=e.random??e.rng?.()??Qe();if(r.length<16)throw Error(`Random bytes length must be >= 16`);if(r[6]=r[6]&15|64,r[8]=r[8]&63|128,t){if(n||=0,n<0||n+16>t.length)throw RangeError(`UUID byte range ${n}:${n+15} is out of buffer bounds`);for(let e=0;e<16;++e)t[n+e]=r[e];return t}return Xe(r)}var et=class{d;constructor(e){this.d=e}selectElement=(e,t=!1)=>{let{elementsRef:n,setSelectedIds:r,setSelectedConnectionId:i,setIsPropertiesOpen:a}=this.d;if(!e){r([]);return}if(t){let t=n.current.find(t=>t.id===e),i=t?.groupId?n.current.filter(e=>e.groupId===t.groupId).map(e=>e.id):[e];r(e=>i.every(t=>e.includes(t))?e.filter(e=>!i.includes(e)):Array.from(new Set([...e,...i])))}else{let t=n.current.find(t=>t.id===e);t?.groupId?r(n.current.filter(e=>e.groupId===t.groupId).map(e=>e.id)):r([e])}i(null),a(!0)};selectConnection=e=>{let{setSelectedConnectionId:t,setSelectedIds:n,setIsPropertiesOpen:r}=this.d;t(e),e&&(n([]),r(!0))};selectAll=()=>{let{elementsRef:e,setSelectedIds:t,setSelectedConnectionId:n}=this.d;t(e.current.map(e=>e.id)),n(null)};copySelected=()=>{let{selectedIds:e,elementsRef:t,setCopiedElements:n}=this.d,r=new Set(e),i=!0;for(;i;)i=!1,t.current.forEach(e=>{e.parentId&&r.has(e.parentId)&&!r.has(e.id)&&(r.add(e.id),i=!0)});let a=t.current.filter(e=>r.has(e.id));a.length>0&&n(structuredClone(a))};pasteCopied=()=>{let{copiedElements:e,saveHistory:t,setElements:n,setSelectedIds:r}=this.d;if(e.length===0)return;t();let i=new Map;e.forEach(e=>{i.set(e.id,Z())});let a=e.map(e=>{let t=i.get(e.id),n=e.parentId;e.parentId&&i.has(e.parentId)?n=i.get(e.parentId):e.parentId&&(n=null);let r=n?0:20,a=n?0:20;return{...e,id:t,parentId:n,x:e.x+r,y:e.y+a}});n(e=>[...e,...a]),r(a.map(e=>e.id))}};function tt(e,t={}){let n=ve[e]||{width:100,height:100};return{id:Z(),type:e,name:``,x:0,y:0,width:n.width,height:n.height,rotation:0,scaleX:1,scaleY:1,opacity:1,visible:!0,locked:!1,zIndex:0,fill:{...B},stroke:{...he},shadow:{...ge},text:null,parentId:null,groupId:null,interactive:!1,pinned:!1,disabled:!1,isSlide:!0,fillParent:!1,animations:[],aspectRatioLocked:!1,...t}}function nt(e={}){return{...tt(`text`,e),type:`text`,text:{...H,content:`Workflow Text`,...e.text||{}},stroke:{...he,width:1,color:`var(--border-color)`,radius:4,...e.stroke||{}},...e}}function rt(e={}){return{...tt(`button`,e),type:`button`,action:{..._e,...e.action||{}},fill:{...me,...e.fill||{}},stroke:{...he,radius:6,...e.stroke||{}},text:{...H,content:`Action`,fontWeight:700,color:`#ffffff`,...e.text||{}},...e}}function it(e={}){return{...tt(`image`,e),type:`image`,src:e.src||`https://images.unsplash.com/photo-1531297172867-4f40136225a4?auto=format&fit=crop&w=300&q=80`,alt:e.alt||`Placeholder`,objectFit:e.objectFit||`cover`,objectPosition:e.objectPosition||`50% 50%`,stroke:{...he,radius:4,...e.stroke||{}},...e}}function at(e={}){return{...tt(`video`,e),type:`video`,src:e.src||``,stroke:{...he,radius:8,...e.stroke||{}},...e}}function ot(e={}){return{...tt(`shape`,e),type:`shape`,shapeType:e.shapeType||`rectangle`,stroke:{...he,width:2,color:`#4caf50`,radius:8,...e.stroke||{}},text:e.text||{...H,content:``,fontSize:14,color:`var(--text-primary)`},...e}}function st(e={}){return{...tt(`node`,e),type:`node`,fill:{...V,...e.fill||{}},text:e.text||{...H,content:``},...e}}function ct(e={}){return{...tt(`icon`,e),type:`icon`,iconName:e.iconName||`home`,iconColor:e.iconColor||`var(--text-primary)`,...e}}function lt(e,t={}){switch(e){case`text`:return nt(t);case`button`:return rt(t);case`image`:return it(t);case`video`:return at(t);case`shape`:return ot(t);case`node`:return st(t);case`icon`:return ct(t);default:return nt(t)}}var ut=class{d;constructor(e){this.d=e}revealDownstream=e=>{let{connectionsRef:t,elementsRef:n,setElements:r}=this.d,i=new Set,a=new Set,o=e=>{i.has(e)||(i.add(e),t.current.filter(t=>t.fromId===e).forEach(e=>{let t=e.toId,r=n.current.find(e=>e.id===t);r&&(a.add(t),r.interactive||o(t))}))};o(e),a.size>0&&r(e=>e.map(e=>a.has(e.id)?{...e,visible:!0}:e))};addElement=(e,t,n)=>{let{saveHistory:r,elements:i,pan:a,scale:o,setElements:s,setSelectedIds:c,setSelectedConnectionId:l}=this.d;r();let u=Z(),d=lt(e,{id:u,...n}),f=window.innerWidth/2,p=window.innerHeight/2,m=i.length*15%150,h=(f-a.x)/o,g=(p-a.y)/o;d.x=t?t.x:h-d.width/2+m,d.y=t?t.y:g-d.height/2+m,d.name=n?.name||`${e.charAt(0).toUpperCase()+e.slice(1)} ${i.length+1}`,n?.width&&(d.width=n.width),n?.height&&(d.height=n.height),s([...i,d]),c([u]),l(null)};addSlideNode=(e=`blank`)=>{let{saveHistory:t,elementsRef:n,setElements:r,setSelectedIds:i,setSelectedConnectionId:a,setIsPropertiesOpen:o}=this.d;t();let s=Z(),c=n.current.filter(e=>e.type===`node`&&e.isSlide!==!1).sort((e,t)=>e.x-t.x),l=c[c.length-1],u=l?l.x+l.width+90:120,d=l?l.y:120,f=Math.max(0,...n.current.map(e=>e.zIndex||0)),p=lt(`node`,{id:s,name:`Slide ${c.length+1}`,x:u,y:d,width:640,height:360,zIndex:f+1,isSlide:!0,fill:{type:`solid`,color:`var(--bg-node)`},stroke:{width:1,color:`var(--border-color)`,style:`solid`,radius:10,cap:`round`,join:`round`}}),m=(e,t,n,r,i,a,o,c=`center`)=>lt(`text`,{id:Z(),parentId:s,name:e,x:t,y:n,width:r,height:i,zIndex:f+2,fill:{type:`none`,color:`transparent`},stroke:{width:0,color:`transparent`,style:`solid`,radius:0,cap:`round`,join:`round`},text:{content:e,fontFamily:`'Google Sans Text'`,fontSize:a,fontWeight:o,fontStyle:`normal`,textDecoration:`none`,color:`var(--text-primary)`,align:c,verticalAlign:`middle`,lineHeight:1.25,letterSpacing:0,padding:{top:8,right:8,bottom:8,left:8}}}),h=[];e===`title`?(h.push(m(`Presentation title`,54,92,500,70,36,700)),h.push(m(`Subtitle`,92,170,424,44,18,400))):e===`titleBody`?(h.push(m(`Slide title`,38,28,540,54,30,700,`left`)),h.push(m(`Add supporting points here`,54,112,500,120,18,400,`left`))):e===`section`?(h.push(m(`Section headline`,54,106,500,62,34,700)),h.push(m(`Short context`,110,176,390,40,16,400))):e===`media`&&(h.push(m(`Slide title`,38,24,540,48,28,700,`left`)),h.push(lt(`image`,{id:Z(),parentId:s,name:`Image placeholder`,x:40,y:92,width:260,height:170,zIndex:f+2,objectFit:`cover`})),h.push(m(`Add notes beside the image`,326,116,230,110,18,400,`left`))),r(e=>[...e,p,...h]),i([s]),a(null),o(!0)};duplicateSlideNode=e=>{let{elementsRef:t,saveHistory:n,connectionsRef:r,brushStrokesRef:i,setElements:a,setConnections:o,setBrushStrokes:s,setSelectedIds:c,setSelectedConnectionId:l}=this.d,u=t.current.find(t=>t.id===e&&t.type===`node`);if(!u)return;n();let d=new Map,f=e=>t.current.filter(t=>t.parentId===e).flatMap(e=>[e,...f(e.id)]),p=f(e);[u,...p].forEach(e=>d.set(e.id,Z()));let m=u.width+90,h=[u,...p].map(e=>({...structuredClone(e),id:d.get(e.id),name:e.id===u.id?`${e.name||`Slide`} Copy`:e.name,parentId:e.parentId&&d.has(e.parentId)?d.get(e.parentId):e.parentId,x:e.parentId?e.x:e.x+m,y:e.y,animations:(e.animations||[]).map(e=>({...e,id:Z()})),actionTarget:d.get(e.actionTarget)||e.actionTarget,action:e.action?{...e.action,target:d.get(e.action.target)||e.action.target}:e.action})),g=r.current.filter(e=>d.has(e.fromId)&&d.has(e.toId)).map(e=>({...structuredClone(e),id:Z(),fromId:d.get(e.fromId),toId:d.get(e.toId)})),_=i.current.filter(e=>e.attachedNodeId&&d.has(e.attachedNodeId)).map(e=>({...structuredClone(e),id:Z(),attachedNodeId:e.attachedNodeId&&d.get(e.attachedNodeId)||e.attachedNodeId,points:e.points.map(e=>({x:e.x+m,y:e.y}))}));a(e=>[...e,...h]),o(e=>[...e,...g]),s(e=>[...e,..._]),c([d.get(e)]),l(null)};moveSlideNode=(e,t)=>{let{elementsRef:n,saveHistory:r,setElements:i,setCurrentSlideIndex:a}=this.d,o=n.current.filter(e=>e.type===`node`&&e.isSlide!==!1).sort((e,t)=>e.x-t.x),s=o.findIndex(t=>t.id===e),c=t===`left`?s-1:s+1;if(s<0||c<0||c>=o.length)return;r();let l=o[s],u=o[c];i(e=>e.map(e=>e.id===l.id?{...e,x:u.x,y:u.y}:e.id===u.id?{...e,x:l.x,y:l.y}:e)),a(c)};updateElement=(e,t)=>{this.d.setElements(n=>n.map(n=>{if(n.id!==e)return n;let r={...n};for(let[e,n]of Object.entries(t))e===`backgroundColor`?r.fill={...r.fill,type:n===`transparent`?`none`:`solid`,color:n}:e===`borderWidth`?r.stroke={...r.stroke,width:n}:e===`borderColor`?r.stroke={...r.stroke,color:n}:e===`borderRadius`?r.stroke={...r.stroke,radius:n}:e===`color`&&r.text?r.text={...r.text,color:n}:e===`fontSize`&&r.text?r.text={...r.text,fontSize:n}:e===`fontFamily`&&r.text?r.text={...r.text,fontFamily:n}:e===`textAlign`&&r.text?r.text={...r.text,align:n}:e===`text`&&typeof n==`string`&&r.text&&typeof r.text==`object`?r.text={...r.text,content:n}:e===`isHidden`?r.visible=!n:e===`isLocked`?r.locked=n:e===`isDisabled`?r.disabled=n:e===`isPinned`?r.pinned=n:e===`enableExpandButton`?r.interactive=n:e===`title`?r.name=n:e===`actionType`&&r.type===`button`?r.action={...r.action,type:n}:e===`actionTarget`&&r.type===`button`?r.action={...r.action,target:n}:e===`link`&&r.type===`button`?r.action={...r.action,link:n}:e===`objectPosition`&&r.type===`image`?r.objectPosition=n:r[e]=n;return r}))};removeElement=e=>{let{saveHistory:t,elementsRef:n,setElements:r,setConnections:i,setBrushStrokes:a,setSelectedIds:o}=this.d;t();let s=new Set([e]),c=!0;for(;c;)c=!1,n.current.forEach(e=>{e.parentId&&s.has(e.parentId)&&!s.has(e.id)&&(s.add(e.id),c=!0)});r(e=>e.filter(e=>!s.has(e.id))),i(e=>e.filter(e=>!s.has(e.fromId)&&!s.has(e.toId))),a(e=>e.filter(e=>!e.attachedNodeId||!s.has(e.attachedNodeId))),o(e=>e.filter(e=>!s.has(e)))};removeSelected=()=>{let{saveHistory:e,selectedIds:t,elementsRef:n,setElements:r,setConnections:i,setSelectedIds:a}=this.d;e();let o=new Set(t);n.current.forEach(e=>{e.parentId&&o.has(e.parentId)&&o.add(e.id)}),r(e=>e.filter(e=>!o.has(e.id))),i(e=>e.filter(e=>!o.has(e.fromId)&&!o.has(e.toId))),a([])};duplicateSelected=()=>{let{saveHistory:e,selectedIds:t,elementsRef:n,connectionsRef:r,brushStrokesRef:i,setElements:a,setConnections:o,setBrushStrokes:s,setSelectedIds:c,setSelectedConnectionId:l}=this.d;e();let u=new Set(t),d=!0;for(;d;)d=!1,n.current.forEach(e=>{e.parentId&&u.has(e.parentId)&&!u.has(e.id)&&(u.add(e.id),d=!0)});let f=new Map;u.forEach(e=>f.set(e,Z()));let p=[];u.forEach(e=>{let t=n.current.find(t=>t.id===e);if(!t)return;let r=t.parentId;t.parentId&&f.has(t.parentId)&&(r=f.get(t.parentId));let i=!t.parentId||!u.has(t.parentId),a=i?40:0,o=i?40:0;p.push({...t,id:f.get(t.id),parentId:r,x:t.x+a,y:t.y+o,animations:(t.animations||[]).map(e=>({...e,id:Z()}))})});let m=r.current.filter(e=>u.has(e.fromId)&&u.has(e.toId)).map(e=>({...structuredClone(e),id:Z(),fromId:f.get(e.fromId),toId:f.get(e.toId)})),h=i.current.filter(e=>e.attachedNodeId&&u.has(e.attachedNodeId)).map(e=>({...structuredClone(e),id:Z(),attachedNodeId:f.get(e.attachedNodeId),points:e.points.map(e=>({...e}))}));p.length>0&&(a(e=>[...e,...p]),o(e=>[...e,...m]),s(e=>[...e,...h]),c(t.map(e=>f.get(e)).filter(Boolean)),l(null))};alignElements=e=>{let{selectedIds:t,saveHistory:n,elementsRef:r,setElements:i}=this.d;if(t.length<=1)return;n();let a=r.current.filter(e=>t.includes(e.id));if(a.length===0)return;let o=a.map(e=>e.x),s=a.map(e=>e.x+e.width),c=a.map(e=>e.y),l=a.map(e=>e.y+e.height),u=Math.min(...o),d=Math.max(...s),f=Math.min(...c),p=Math.max(...l),m=(u+d)/2,h=(f+p)/2;i(n=>n.map(n=>{if(!t.includes(n.id))return n;let r=n.x,i=n.y;switch(e){case`left`:r=u;break;case`center`:r=m-n.width/2;break;case`right`:r=d-n.width;break;case`top`:i=f;break;case`middle`:i=h-n.height/2;break;case`bottom`:i=p-n.height;break}return{...n,x:r,y:i}}))};distributeElements=e=>{let{selectedIds:t,saveHistory:n,elementsRef:r,setElements:i}=this.d;if(t.length<=2)return;n();let a=r.current.filter(e=>t.includes(e.id));if(!(a.length<=2))if(e===`horizontal`){let e=[...a].sort((e,t)=>e.x+e.width/2-(t.x+t.width/2)),t=e[0].x+e[0].width/2,n=(e[e.length-1].x+e[e.length-1].width/2-t)/(e.length-1);i(r=>r.map(r=>{let i=e.findIndex(e=>e.id===r.id);if(i===-1||i===0||i===e.length-1)return r;let a=t+i*n-r.width/2;return{...r,x:a}}))}else{let e=[...a].sort((e,t)=>e.y+e.height/2-(t.y+t.height/2)),t=e[0].y+e[0].height/2,n=(e[e.length-1].y+e[e.length-1].height/2-t)/(e.length-1);i(r=>r.map(r=>{let i=e.findIndex(e=>e.id===r.id);if(i===-1||i===0||i===e.length-1)return r;let a=t+i*n-r.height/2;return{...r,y:a}}))}};updateElementAnimations=(e,t)=>{let{saveHistory:n,setElements:r}=this.d;n(),r(n=>n.map(n=>n.id===e?{...n,animations:t}:n))}},dt=class{d;constructor(e){this.d=e}addConnection=(e,t,n,r)=>{let{saveHistory:i,connectionsRef:a,setConnections:o}=this.d;i(),e!==n&&(a.current.find(i=>i.fromId===e&&i.toId===n&&i.fromPort===t&&i.toPort===r)||o(i=>[...i,{id:Z(),fromId:e,toId:n,fromPort:t,toPort:r}]))};removeConnection=e=>{let{saveHistory:t,setConnections:n,selectedConnectionId:r,setSelectedConnectionId:i}=this.d;t(),n(t=>t.filter(t=>t.id!==e)),r===e&&i(null)};updateConnection=(e,t)=>{let{setConnections:n}=this.d;n(n=>n.map(n=>n.id===e?{...n,...t}:n))}},ft=class{d;constructor(e){this.d=e}addBrushStroke=e=>{let{saveHistory:t,elementsRef:n,setBrushStrokes:r}=this.d;t();let i=Le.findBrushAttachmentElementId(e.points,n.current),a={...e,attachedNodeId:i};r(e=>[...e,a])};clearBrush=()=>{this.d.saveHistory(),this.d.setBrushStrokes([])};setBrushMode=e=>{let{setIsBrushMode:t,setSelectedIds:n,setSelectedConnectionId:r}=this.d;t(e),e&&(n([]),r(null))};setBrushColor=e=>this.d.setBrushColorVal(e);setBrushWidth=e=>this.d.setBrushWidthVal(e);eraseBrushStrokesAt=(e,t,n)=>{this.d.setBrushStrokes(r=>{let i=!1,a=[];for(let o of r){let r=[];for(let s of o.points)(t?Fe(s,t,e):Math.hypot(s.x-e.x,s.y-e.y))<=n+o.width/2?(r.length>1&&a.push({id:Z(),points:r,color:o.color,width:o.width,attachedNodeId:o.attachedNodeId}),r=[],i=!0):r.push(s);r.length>1&&a.push({id:o.id,points:r,color:o.color,width:o.width,attachedNodeId:o.attachedNodeId})}return i?a:r})}},pt=class{d;constructor(e){this.d=e}bringToFront=e=>{let{saveHistory:t,setElements:n}=this.d;t(),n(t=>{let n=Math.max(...t.map(e=>e.zIndex||0));return t.map(t=>t.id===e?{...t,zIndex:n+1}:t)})};sendToBack=e=>{let{saveHistory:t,setElements:n}=this.d;t(),n(t=>{let n=Math.min(...t.map(e=>e.zIndex||0));return t.map(t=>t.id===e?{...t,zIndex:n-1}:t)})};bringForward=e=>{let{saveHistory:t,setElements:n}=this.d;t(),n(t=>{let n=t.find(t=>t.id===e);if(!n)return t;let r=n.zIndex||0,i=t.filter(e=>(e.zIndex||0)>r);if(i.length===0)return t;let a=Math.min(...i.map(e=>e.zIndex||0));return t.map(t=>t.id===e?{...t,zIndex:a+1}:t)})};sendBackward=e=>{let{saveHistory:t,setElements:n}=this.d;t(),n(t=>{let n=t.find(t=>t.id===e);if(!n)return t;let r=n.zIndex||0,i=t.filter(e=>(e.zIndex||0)<r);if(i.length===0)return t;let a=Math.max(...i.map(e=>e.zIndex||0));return t.map(t=>t.id===e?{...t,zIndex:a-1}:t)})};reorderElements=(e,t)=>{let{saveHistory:n,setElements:r}=this.d;n(),r(n=>{let r=[...n].sort((e,t)=>(t.zIndex||0)-(e.zIndex||0)),i=r.findIndex(t=>t.id===e),a=r.findIndex(e=>e.id===t);if(i===-1||a===-1)return n;let o=[...r],[s]=o.splice(i,1);return o.splice(a,0,s),n.map(e=>{let t=o.findIndex(t=>t.id===e.id);return t===-1?e:{...e,zIndex:o.length-t}})})};groupElements=e=>{let{saveHistory:t,setElements:n}=this.d;if(e.length<2)return;t();let r=Z();n(t=>t.map(t=>e.includes(t.id)?{...t,groupId:r}:t))};ungroupElements=e=>{let{saveHistory:t,setElements:n}=this.d;t(),n(t=>t.map(t=>t.groupId===e?{...t,groupId:null}:t))}},mt=/<script id="js-builder-state" type="application\/json">([\s\S]*?)<\/script>/,ht={parseStateFromHtml(e){let t=e.match(mt);return!t||!t[1]?null:JSON.parse(t[1])},parseStateFromCode(e){let t=e.match(mt);return t&&t[1]?JSON.parse(t[1]):JSON.parse(e)},remapForMerge(e,t,n,r){let i=new Map;return e.forEach(e=>i.set(e.id,Z())),{newElements:e.map(e=>{let t=e.parentId;return t&&i.has(t)?t=i.get(t):t&&=null,{...e,id:i.get(e.id),parentId:t,x:t?e.x:e.x+50,y:t?e.y:e.y+50}}),newConnections:t.filter(e=>(i.has(e.fromId)||r.has(e.fromId))&&(i.has(e.toId)||r.has(e.toId))).map(e=>({...e,id:Z(),fromId:i.get(e.fromId)||e.fromId,toId:i.get(e.toId)||e.toId})),newBrushStrokes:n.filter(e=>Array.isArray(e.points)).map(e=>({...e,id:Z(),attachedNodeId:e.attachedNodeId&&i.get(e.attachedNodeId)||null,points:e.points.map(e=>({x:e.x+50,y:e.y+50}))}))}}},gt=class{d;constructor(e){this.d=e}switchVariant=e=>{let{activeVariantId:t,variants:n,elements:r,connections:i,brushStrokes:a,guides:o,setActiveVariantIdState:s,setVariants:c,setElements:l,setConnections:u,setBrushStrokes:d,setGuides:f,setSelectedIds:p,setSelectedConnectionId:m,setHistory:h,setRedoStack:g}=this.d;if(e===t)return;let _=n.map(e=>e.id===t?{...e,elements:r,connections:i,brushStrokes:a,guides:o}:e),v=_.find(t=>t.id===e);if(v){let t=je(v.elements),n=Me(v.connections);s(e),c(_),l(t),u(n),d(v.brushStrokes),f(v.guides),p([]),m(null),h([]),g([])}};addVariant=()=>{let{variants:e,saveHistory:t,activeVariantId:n,elements:r,connections:i,brushStrokes:a,guides:o,setVariants:s,setActiveVariantIdState:c,setElements:l,setConnections:u,setBrushStrokes:d,setGuides:f,setSelectedIds:p,setSelectedConnectionId:m,setHistory:h,setRedoStack:g}=this.d;if(e.length>=5)return;t();let _=Z(),v={id:_,name:`Variant ${e.length+1}`,elements:[],connections:[],brushStrokes:[],guides:[]};s([...e.map(e=>e.id===n?{...e,elements:r,connections:i,brushStrokes:a,guides:o}:e),v]),c(_),l([]),u([]),d([]),f([]),p([]),m(null),h([]),g([])};deleteVariant=e=>{let{variants:t,saveHistory:n,activeVariantId:r,setActiveVariantIdState:i,setVariants:a,setElements:o,setConnections:s,setBrushStrokes:c,setGuides:l,setSelectedIds:u,setSelectedConnectionId:d,setHistory:f,setRedoStack:p}=this.d;if(t.length<=1)return;n();let m=t.findIndex(t=>t.id===e),h=t.filter(t=>t.id!==e);if(r===e){let e=h[m===0?0:m-1],t=je(e.elements),n=Me(e.connections);i(e.id),a(h),o(t),s(n),c(e.brushStrokes),l(e.guides),u([]),d(null),f([]),p([])}else a(h)};renameVariant=(e,t)=>{this.d.setVariants(n=>n.map(n=>n.id===e?{...n,name:t}:n))};importHTML=e=>{let{saveHistory:t,setVariants:n,setActiveVariantIdState:r,setElements:i,setConnections:a,setBrushStrokes:o,setGuides:s,setTheme:c,setSelectedIds:l,setSelectedConnectionId:u,setHistory:d,setRedoStack:f}=this.d;try{let p=ht.parseStateFromHtml(e);if(!p)return!1;if(p.variants&&p.activeVariantId){t();let e=Ne(p.variants);if(e.length===0)return!1;let m=e.some(e=>e.id===p.activeVariantId)?p.activeVariantId:e[0]?.id||`default`;n(e),r(m);let h=e.find(e=>e.id===m);return h&&(i(h.elements||[]),a(h.connections||[]),o(h.brushStrokes||[]),s(h.guides||[])),(p.theme===`light`||p.theme===`dark`)&&c(p.theme),l([]),u(null),d([]),f([]),!0}else if(p.elements){t();let e={id:`default`,name:`Variant 1`,elements:je(p.elements||[]),connections:Me(p.connections||[]),brushStrokes:p.brushStrokes||[],guides:p.guides||[]};return n([e]),r(`default`),i(e.elements),a(e.connections),o(e.brushStrokes),s(e.guides),(p.theme===`light`||p.theme===`dark`)&&c(p.theme),l([]),u(null),d([]),f([]),!0}return!1}catch(e){return console.error(`Failed to import HTML state`,e),!1}};importCodeAndMerge=e=>{let{saveHistory:t,elementsRef:n,setElements:r,setConnections:i,setBrushStrokes:a,setSelectedIds:o}=this.d;try{let s=ht.parseStateFromCode(e),c=[],l=[],u=[];if(s.variants&&s.activeVariantId){let e=s.variants.find(e=>e.id===s.activeVariantId)||s.variants[0];e&&(c=e.elements||[],l=e.connections||[],u=e.brushStrokes||[])}else if(s.elements)c=s.elements||[],l=s.connections||[],u=s.brushStrokes||[];else return!1;c=je(c),l=Me(l),t();let d=new Set(n.current.map(e=>e.id)),{newElements:f,newConnections:p,newBrushStrokes:m}=ht.remapForMerge(c,l,u,d);return r(e=>[...e,...f]),i(e=>[...e,...p]),a(e=>[...e,...m]),o(f.map(e=>e.id)),!0}catch(e){return console.error(`Failed to import code and merge`,e),!1}}},_t=class{d;constructor(e){this.d=e}addGuide=(e,t,n)=>{this.d.setGuides(r=>{let i=[...r,{id:n||Z(),type:e,position:t}];return Y.saveGuides(i),i})};updateGuide=(e,t)=>{this.d.setGuides(n=>{let r=n.map(n=>n.id===e?{...n,position:t}:n);return Y.saveGuides(r),r})};removeGuide=e=>{this.d.setGuides(t=>{let n=t.filter(t=>t.id!==e);return Y.saveGuides(n),n})}},Q=fe(),vt=(0,R.createContext)(void 0),yt=({children:e})=>{let[t,n]=(0,R.useState)(()=>{let e=Y.parsedVariants();return e?Ne(e):[{id:`default`,name:`Variant 1`,elements:je(Y.read(Y.KEYS.elements,[])),connections:Me(Y.read(Y.KEYS.connections,[])),brushStrokes:Y.read(Y.KEYS.brush,[]),guides:Y.read(Y.KEYS.guides,[])}]}),[r,i]=(0,R.useState)(()=>Y.activeVariantId()),[a,o]=(0,R.useState)(()=>je(Y.activeVariantField(`elements`,Y.KEYS.elements,[]))),[s,c]=(0,R.useState)(()=>Me(Y.activeVariantField(`connections`,Y.KEYS.connections,[]))),[l,u]=(0,R.useState)(()=>Y.activeVariantField(`brushStrokes`,Y.KEYS.brush,[])),[d,f]=(0,R.useState)(()=>{let e=Y.getString(Y.KEYS.theme);return e===`light`||e===`dark`?e:`dark`}),[p,m]=(0,R.useState)(()=>Y.activeVariantField(`guides`,Y.KEYS.guides,[])),[h,g]=(0,R.useState)([]),[_,v]=(0,R.useState)(()=>Y.getString(Y.KEYS.snap)!==`false`),[y,b]=(0,R.useState)(()=>Y.getString(Y.KEYS.blur)!==`false`),x=e=>{f(e),Y.saveTheme(e)};(0,R.useEffect)(()=>{document.body.className=d===`light`?`light-theme`:`dark-theme`},[d]);let[,S]=(0,R.useState)([]),[,ee]=(0,R.useState)([]),[C,w]=(0,R.useState)([]),[T,E]=(0,R.useState)(null),[te,D]=(0,R.useState)(null),[O,ne]=(0,R.useState)(1),[k,re]=(0,R.useState)({x:0,y:0}),[A,ie]=(0,R.useState)(null),[j,M]=(0,R.useState)(!1),[N,P]=(0,R.useState)(0),[ae,F]=(0,R.useState)([]),[oe,se]=(0,R.useState)(null),[ce,le]=(0,R.useState)(!1),[ue,I]=(0,R.useState)(!0),[de,fe]=(0,R.useState)(!1),[pe,L]=(0,R.useState)(`#4caf50`),[z,B]=(0,R.useState)(4),[V,me]=(0,R.useState)(`draw`),he=(0,R.useRef)(a),ge=(0,R.useRef)(s),H=(0,R.useRef)(l);he.current=a,ge.current=s,H.current=l;let _e=(0,R.useCallback)((e,t=he.current)=>Le.getElementCanvasBounds(e,t),[]),ve=(0,R.useRef)({});(0,R.useEffect)(()=>{let e=ve.current;return()=>{Object.values(e).forEach(e=>window.clearTimeout(e))}},[]);let ye=e=>{v(e),Y.saveSnap(e)},be=e=>{b(e),Y.saveBlur(e)};(0,R.useEffect)(()=>{Y.saveElements(a)},[a]),(0,R.useEffect)(()=>{Y.saveConnections(s)},[s]),(0,R.useEffect)(()=>{Y.saveBrush(l)},[l]);let xe=(0,R.useRef)({});(0,R.useEffect)(()=>{let e={},t=!1,n={};a.forEach(r=>{let i=_e(r,a);e[r.id]={x:i.x,y:i.y};let o=xe.current[r.id];if(o){let e=i.x-o.x,a=i.y-o.y;(e!==0||a!==0)&&(n[r.id]={dx:e,dy:a},t=!0)}}),t&&u(e=>e.map(e=>{if(e.attachedNodeId&&n[e.attachedNodeId]){let{dx:t,dy:r}=n[e.attachedNodeId];return{...e,points:e.points.map(e=>({x:e.x+t,y:e.y+r}))}}return e})),xe.current=e},[a,_e]);let Se=(0,R.useRef)(r);(0,R.useEffect)(()=>{if(Se.current!==r){Se.current=r;return}n(e=>e.map(e=>e.id===r?{...e,elements:a,connections:s,brushStrokes:l,guides:p}:e))},[a,s,l,p,r]),(0,R.useEffect)(()=>{Y.saveVariants(t)},[t]),(0,R.useEffect)(()=>{Y.saveActiveVariantId(r)},[r]);let U=(0,R.useRef)({}).current;U.elementsRef=he,U.connectionsRef=ge,U.brushStrokesRef=H,U.historyScopesRef=ve,U.elements=a,U.connections=s,U.brushStrokes=l,U.selectedIds=C,U.selectedConnectionId=T,U.copiedElements=h,U.variants=t,U.activeVariantId=r,U.guides=p,U.pan=k,U.scale=O,U.setElements=o,U.setConnections=c,U.setBrushStrokes=u,U.setSelectedIds=w,U.setSelectedConnectionId=E,U.setCopiedElements=g,U.setVariants=n,U.setActiveVariantIdState=i,U.setGuides=m,U.setHistory=S,U.setRedoStack=ee,U.setCurrentSlideIndex=P,U.setIsPropertiesOpen=I,U.setIsBrushMode=fe,U.setBrushColorVal=L,U.setBrushWidthVal=B,U.setTheme=x;let Ce=(0,R.useRef)(void 0);if(!Ce.current){let e=new Je(U);U.saveHistory=e.saveHistory,Ce.current={history:e,selection:new et(U),element:new ut(U),connection:new dt(U),brush:new ft(U),layer:new pt(U),variant:new gt(U),guide:new _t(U)}}let{history:W,selection:we,element:Te,connection:Ee,brush:De,layer:G,variant:Oe,guide:K}=Ce.current,ke=()=>qe({variants:t,activeVariantId:r,elements:a,connections:s,brushStrokes:l,guides:p,theme:d}),[q,Ae]=(0,R.useState)({isOpen:!1,type:`alert`,title:``,message:``,resolve:null}),J=(0,R.useCallback)((e,t=`Notification`)=>new Promise(n=>{Ae({isOpen:!0,type:`alert`,title:t,message:e,resolve:()=>n()})}),[]),Pe=(0,R.useCallback)((e,t=`Confirmation`)=>new Promise(n=>{Ae({isOpen:!0,type:`confirm`,title:t,message:e,resolve:e=>n(e)})}),[]);return(0,Q.jsxs)(vt.Provider,{value:{elements:a,connections:s,selectedIds:C,selectedConnectionId:T,connectingNode:te,scale:O,pan:k,addElement:Te.addElement,addSlideNode:Te.addSlideNode,duplicateSlideNode:Te.duplicateSlideNode,moveSlideNode:Te.moveSlideNode,updateElement:Te.updateElement,updateConnection:Ee.updateConnection,removeElement:Te.removeElement,removeSelected:Te.removeSelected,selectElement:we.selectElement,selectConnection:we.selectConnection,setConnectingNode:D,addConnection:Ee.addConnection,removeConnection:Ee.removeConnection,duplicateSelected:Te.duplicateSelected,setScale:ne,setPan:re,exportHTML:ke,alignElements:Te.alignElements,distributeElements:Te.distributeElements,isPresenting:j,setIsPresenting:M,editingFocalPointId:A,setEditingFocalPointId:ie,brushStrokes:l,isBrushMode:de,brushColor:pe,brushWidth:z,setBrushMode:De.setBrushMode,setBrushColor:De.setBrushColor,setBrushWidth:De.setBrushWidth,addBrushStroke:De.addBrushStroke,clearBrush:De.clearBrush,undo:W.undo,redo:W.redo,saveHistory:W.saveHistory,saveHistoryOnce:W.saveHistoryOnce,brushTool:V,setBrushTool:me,eraseBrushStrokesAt:De.eraseBrushStrokesAt,theme:d,setTheme:x,guides:p,addGuide:K.addGuide,updateGuide:K.updateGuide,removeGuide:K.removeGuide,copySelected:we.copySelected,pasteCopied:we.pasteCopied,selectAll:we.selectAll,isSnapEnabled:_,setIsSnapEnabled:ye,isBlurEnabled:y,setIsBlurEnabled:be,currentSlideIndex:N,setCurrentSlideIndex:P,revealDownstream:Te.revealDownstream,playedAnimationIds:ae,setPlayedAnimationIds:F,previewAnimationId:oe,setPreviewAnimationId:se,isHelpOpen:ce,setIsHelpOpen:le,isPropertiesOpen:ue,setIsPropertiesOpen:I,variants:t,activeVariantId:r,switchVariant:Oe.switchVariant,addVariant:Oe.addVariant,deleteVariant:Oe.deleteVariant,renameVariant:Oe.renameVariant,importHTML:Oe.importHTML,importCodeAndMerge:Oe.importCodeAndMerge,showAlert:J,showConfirm:Pe,bringToFront:G.bringToFront,sendToBack:G.sendToBack,bringForward:G.bringForward,sendBackward:G.sendBackward,reorderElements:G.reorderElements,groupElements:G.groupElements,ungroupElements:G.ungroupElements,updateElementAnimations:Te.updateElementAnimations},children:[e,q.isOpen&&(0,Q.jsx)(`div`,{className:`custom-dialog-overlay`,onClick:()=>{q.type===`alert`&&(q.resolve?.(!0),Ae(e=>({...e,isOpen:!1})))},children:(0,Q.jsxs)(`div`,{className:`custom-dialog-container`,onClick:e=>e.stopPropagation(),children:[(0,Q.jsx)(`div`,{className:`custom-dialog-header`,children:(0,Q.jsx)(`span`,{className:`custom-dialog-title`,children:q.title})}),(0,Q.jsx)(`div`,{className:`custom-dialog-body`,children:(0,Q.jsx)(`p`,{className:`custom-dialog-message`,style:{whiteSpace:`pre-wrap`,margin:0},children:q.message})}),(0,Q.jsxs)(`div`,{className:`custom-dialog-footer`,children:[q.type===`confirm`&&(0,Q.jsx)(`button`,{className:`custom-dialog-btn secondary`,onClick:()=>{q.resolve?.(!1),Ae(e=>({...e,isOpen:!1}))},children:`Cancel`}),(0,Q.jsx)(`button`,{className:`custom-dialog-btn primary`,onClick:()=>{q.resolve?.(!0),Ae(e=>({...e,isOpen:!1}))},children:`Confirm`})]})]})})]})},bt=()=>{let e=(0,R.useContext)(vt);if(!e)throw Error(`useBuilder must be used within BuilderProvider`);return e},xt=de(),St=()=>{let{variants:e,activeVariantId:t,switchVariant:n,addVariant:r,deleteVariant:i,renameVariant:a,importHTML:s,importCodeAndMerge:c,exportHTML:l,setIsPresenting:u,showConfirm:p}=bt(),[m,h]=(0,R.useState)(null),[g,_]=(0,R.useState)(``),[v,y]=(0,R.useState)(!1),[b,x]=(0,R.useState)(!1),[S,ee]=(0,R.useState)(``),[C,w]=(0,R.useState)(!1),[T,E]=(0,R.useState)(``),[te,D]=(0,R.useState)(``),[O,ne]=(0,R.useState)(null),[k,re]=(0,R.useState)(`success`),A=(0,R.useRef)(null),ie=(0,R.useRef)(null);(0,R.useEffect)(()=>()=>{ie.current!==null&&window.clearTimeout(ie.current)},[]),(0,R.useEffect)(()=>{if(!v||!C||!T){D(``);return}let e=new Blob([T],{type:`text/html;charset=utf-8`}),t=URL.createObjectURL(e);return D(t),()=>{URL.revokeObjectURL(t)}},[T,v,C]);let j=(e,t=`success`)=>{ie.current!==null&&window.clearTimeout(ie.current),ne(e),re(t),ie.current=window.setTimeout(()=>{ne(null),ie.current=null},3e3)},M=(e,t,n)=>{n.stopPropagation(),h(e),_(t)},N=e=>{g.trim()&&a(e,g.trim()),h(null)},ae=(e,t)=>{e.key===`Enter`?N(t):e.key===`Escape`&&h(null)};return(0,Q.jsxs)(`header`,{className:`top-header`,children:[(0,Q.jsx)(`div`,{className:`header-left`,children:(0,Q.jsxs)(`div`,{className:`logo-container`,children:[(0,Q.jsx)(`span`,{className:`logo-text`,children:`Academy Tool`}),(0,Q.jsx)(`span`,{className:`logo-badge`,children:`v2.0`})]})}),(0,Q.jsx)(`div`,{className:`header-middle`,children:(0,Q.jsxs)(`div`,{className:`variant-tabs`,children:[e.map(r=>{let a=r.id===t,o=m===r.id;return(0,Q.jsx)(`div`,{className:`variant-tab ${a?`active`:``}`,onClick:()=>!o&&n(r.id),children:o?(0,Q.jsx)(`input`,{type:`text`,value:g,onChange:e=>_(e.target.value),onBlur:()=>N(r.id),onKeyDown:e=>ae(e,r.id),autoFocus:!0,className:`tab-rename-input`,onClick:e=>e.stopPropagation()}):(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(`span`,{className:`tab-name`,onDoubleClick:e=>M(r.id,r.name,e),children:r.name}),(0,Q.jsx)(`button`,{className:`tab-action-btn edit-btn`,onClick:e=>M(r.id,r.name,e),title:`Rename page`,children:(0,Q.jsx)(le,{size:12})}),e.length>1&&(0,Q.jsx)(`button`,{className:`tab-action-btn delete-btn`,onClick:async e=>{e.stopPropagation(),await p(`Are you sure you want to delete page "${r.name}"?`,`Confirm Delete`)&&i(r.id)},title:`Delete page`,children:(0,Q.jsx)(F,{size:12})})]})},r.id)}),e.length<5&&(0,Q.jsxs)(`button`,{className:`add-variant-btn`,onClick:r,title:`Add variant page (Max 5)`,children:[(0,Q.jsx)(se,{size:16}),(0,Q.jsx)(`span`,{children:`Add Variant`})]})]})}),(0,Q.jsxs)(`div`,{className:`header-right`,children:[(0,Q.jsxs)(`button`,{className:`header-action-btn`,onClick:()=>x(!0),title:`Import by Code`,children:[(0,Q.jsx)(d,{size:16}),(0,Q.jsx)(`span`,{children:`Import Code`})]}),(0,Q.jsxs)(`button`,{className:`header-action-btn`,onClick:()=>{A.current?.click()},title:`Import HTML`,children:[(0,Q.jsx)(P,{size:16}),(0,Q.jsx)(`span`,{children:`Import`})]}),(0,Q.jsxs)(`button`,{className:`header-action-btn`,onClick:()=>{try{E(l()),w(!0),y(!0)}catch(e){console.error(`Failed to preview HTML`,e),j(`Failed to preview HTML. Check the console for details.`,`error`)}},title:`Live Preview Code`,children:[(0,Q.jsx)(f,{size:16}),(0,Q.jsx)(`span`,{children:`Preview`})]}),(0,Q.jsxs)(`button`,{className:`header-action-btn primary`,onClick:()=>{try{E(l()),w(!1),y(!0)}catch(e){console.error(`Failed to export HTML`,e),j(`Failed to export HTML. Check the console for details.`,`error`)}},title:`Export HTML`,children:[(0,Q.jsx)(o,{size:16}),(0,Q.jsx)(`span`,{children:`Export`})]}),(0,Q.jsx)(`div`,{className:`divider`}),(0,Q.jsxs)(`button`,{className:`presentation-trigger-btn`,onClick:()=>u(!0),title:`Play presentation slideshow`,children:[(0,Q.jsx)(ue,{size:16,fill:`currentColor`}),(0,Q.jsx)(`span`,{children:`Present`})]}),(0,Q.jsx)(`input`,{type:`file`,ref:A,onChange:e=>{let t=e.target.files?.[0];if(!t)return;let n=new FileReader;n.onload=e=>{let t=e.target?.result;s(t)?j(`HTML imported successfully!`,`success`):j(`Failed to import: Invalid builder state.`,`error`)},n.readAsText(t),e.target.value=``},style:{display:`none`},accept:`.html`})]}),O&&(0,Q.jsxs)(`div`,{className:`editor-toast ${k}`,children:[(0,Q.jsx)(`div`,{className:`toast-icon`,children:(0,Q.jsx)(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`3`,strokeLinecap:`round`,strokeLinejoin:`round`,children:k===`success`?(0,Q.jsx)(`polyline`,{points:`20 6 9 17 4 12`}):(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(`line`,{x1:`18`,y1:`6`,x2:`6`,y2:`18`}),(0,Q.jsx)(`line`,{x1:`6`,y1:`6`,x2:`18`,y2:`18`})]})})}),(0,Q.jsx)(`span`,{className:`toast-message`,children:O})]}),b&&(0,xt.createPortal)((0,Q.jsx)(`div`,{className:`editor-modal-overlay`,children:(0,Q.jsxs)(`div`,{className:`editor-modal-container`,children:[(0,Q.jsxs)(`div`,{className:`editor-modal-header`,children:[(0,Q.jsx)(`span`,{className:`modal-title`,children:`Import by Code`}),(0,Q.jsx)(`div`,{className:`modal-actions`,children:(0,Q.jsx)(`button`,{className:`modal-btn close`,onClick:()=>x(!1),children:(0,Q.jsx)(F,{size:18})})})]}),(0,Q.jsx)(`div`,{className:`editor-modal-body`,children:(0,Q.jsxs)(`div`,{className:`modal-export-content`,children:[(0,Q.jsx)(`p`,{className:`modal-desc`,children:`Paste the JSON or HTML code exported from this builder to merge it into the current canvas.`}),(0,Q.jsx)(`textarea`,{value:S,onChange:e=>ee(e.target.value),className:`modal-code-area`,placeholder:`Paste code here...`}),(0,Q.jsxs)(`div`,{className:`modal-buttons-row`,children:[(0,Q.jsx)(`button`,{className:`modal-btn secondary`,onClick:()=>x(!1),children:`Cancel`}),(0,Q.jsx)(`button`,{className:`modal-btn primary`,onClick:()=>{S.trim()&&(c(S)?(j(`Code imported and merged successfully!`,`success`),x(!1),ee(``)):j(`Failed to import code. Invalid format.`,`error`))},children:`Merge Code`})]})]})})]})}),document.body),v&&(0,xt.createPortal)((0,Q.jsx)(`div`,{className:`editor-modal-overlay`,children:(0,Q.jsxs)(`div`,{className:`editor-modal-container ${C?`large`:``}`,children:[(0,Q.jsxs)(`div`,{className:`editor-modal-header`,children:[(0,Q.jsx)(`span`,{className:`modal-title`,children:C?`Live Preview`:`Export HTML Code`}),(0,Q.jsxs)(`div`,{className:`modal-actions`,children:[C&&(0,Q.jsx)(`button`,{className:`modal-btn`,onClick:()=>w(!1),children:`Show Code`}),(0,Q.jsx)(`button`,{className:`modal-btn close`,onClick:()=>y(!1),children:(0,Q.jsx)(F,{size:18})})]})]}),(0,Q.jsx)(`div`,{className:`editor-modal-body`,children:C?(0,Q.jsx)(`div`,{className:`modal-preview-frame`,children:(0,Q.jsx)(`iframe`,{src:te,title:`Live Preview`,sandbox:`allow-scripts allow-same-origin`},te)}):(0,Q.jsxs)(`div`,{className:`modal-export-content`,children:[(0,Q.jsx)(`p`,{className:`modal-desc`,children:`Here is the complete HTML page code. You can download the file directly or copy the embed code below.`}),(0,Q.jsx)(`textarea`,{readOnly:!0,value:T,className:`modal-code-area`,onClick:e=>e.target.select()}),(0,Q.jsxs)(`div`,{className:`modal-buttons-row`,children:[(0,Q.jsx)(`button`,{className:`modal-btn secondary`,onClick:async()=>{try{await navigator.clipboard.writeText(T),j(`Code copied to clipboard!`,`success`)}catch(e){console.error(`Failed to copy HTML`,e),j(`Clipboard permission denied. Copy the code manually.`,`error`)}},children:`Copy Code`}),(0,Q.jsx)(`button`,{className:`modal-btn primary`,onClick:()=>{let n=new Blob([T],{type:`text/html;charset=utf-8`}),r=URL.createObjectURL(n),i=document.createElement(`a`),a=e.find(e=>e.id===t),o=a?`${a.name.toLowerCase().replace(/\s+/g,`_`)}.html`:`export.html`;i.href=r,i.download=o,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(r),j(`Download started!`,`success`)},children:`Download HTML File`})]})]})})]})}),document.body)]})},Ct=()=>{let{addElement:e,selectedIds:t,duplicateSelected:n,theme:i,setTheme:o,isSnapEnabled:s,setIsSnapEnabled:c,isHelpOpen:d,setIsHelpOpen:f}=bt(),[p,m]=(0,R.useState)(!1),[h,_]=(0,R.useState)(!1),[y,b]=(0,R.useState)(!1),x=(0,R.useRef)(null),S=(0,R.useRef)(null),C=(0,R.useRef)(null),w=t.length>0;(0,R.useEffect)(()=>{let e=e=>{x.current&&!x.current.contains(e.target)&&m(!1),C.current&&!C.current.contains(e.target)&&b(!1)};return(p||y)&&document.addEventListener(`mousedown`,e),()=>document.removeEventListener(`mousedown`,e)},[p,y]),(0,R.useEffect)(()=>{let e=e=>{S.current&&!S.current.contains(e.target)&&_(!1)};return h&&document.addEventListener(`mousedown`,e),()=>document.removeEventListener(`mousedown`,e)},[h]);let E=[{type:`rectangle`,name:`Rectangle`,svg:(0,Q.jsx)(`rect`,{x:`5`,y:`5`,width:`20`,height:`20`,rx:`2`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`})},{type:`ellipse`,name:`Circle`,svg:(0,Q.jsx)(`circle`,{cx:`15`,cy:`15`,r:`10`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`})},{type:`triangle`,name:`Triangle`,svg:(0,Q.jsx)(`polygon`,{points:`15,4 26,24 4,24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinejoin:`round`})},{type:`rightTriangle`,name:`Right Triangle`,svg:(0,Q.jsx)(`polygon`,{points:`5,5 25,25 5,25`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinejoin:`round`})},{type:`diamond`,name:`Diamond`,svg:(0,Q.jsx)(`polygon`,{points:`15,4 26,15 15,26 4,15`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinejoin:`round`})},{type:`pentagon`,name:`Pentagon`,svg:(0,Q.jsx)(`polygon`,{points:`15,4 26,12 22,25 8,25 4,12`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinejoin:`round`})},{type:`hexagon`,name:`Hexagon`,svg:(0,Q.jsx)(`polygon`,{points:`15,4 25,10 25,20 15,26 5,20 5,10`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinejoin:`round`})},{type:`star`,name:`Star`,svg:(0,Q.jsx)(`polygon`,{points:`15,3 18,11 27,11 20,16 22,24 15,19 8,24 10,16 3,11 12,11`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinejoin:`round`})},{type:`parallelogram`,name:`Parallelogram`,svg:(0,Q.jsx)(`polygon`,{points:`9,5 26,5 21,25 4,25`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinejoin:`round`})},{type:`trapezoid`,name:`Trapezoid`,svg:(0,Q.jsx)(`polygon`,{points:`8,5 22,5 27,25 3,25`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinejoin:`round`})},{type:`arrowRight`,name:`Arrow Right`,svg:(0,Q.jsx)(`polygon`,{points:`4,11 18,11 18,6 26,15 18,24 18,19 4,19`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinejoin:`round`})},{type:`arrowLeft`,name:`Arrow Left`,svg:(0,Q.jsx)(`polygon`,{points:`26,11 12,11 12,6 4,15 12,24 12,19 26,19`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinejoin:`round`})},{type:`arrowUp`,name:`Arrow Up`,svg:(0,Q.jsx)(`polygon`,{points:`11,26 11,12 6,12 15,4 24,12 19,12 19,26`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinejoin:`round`})},{type:`arrowDown`,name:`Arrow Down`,svg:(0,Q.jsx)(`polygon`,{points:`11,4 11,18 6,18 15,26 24,18 19,18 19,4`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinejoin:`round`})},{type:`line`,name:`Line`,svg:(0,Q.jsx)(`line`,{x1:`5`,y1:`25`,x2:`25`,y2:`5`,stroke:`currentColor`,strokeWidth:`2`})},{type:`arrow`,name:`Arrow`,svg:(0,Q.jsxs)(`g`,{children:[(0,Q.jsx)(`line`,{x1:`5`,y1:`25`,x2:`21`,y2:`9`,stroke:`currentColor`,strokeWidth:`2`}),(0,Q.jsx)(`polygon`,{points:`25,5 17,7 23,13`,fill:`currentColor`})]})},{type:`elbow`,name:`Elbow Connector`,svg:(0,Q.jsx)(`path`,{d:`M 5 25 L 15 25 L 15 5 L 25 5`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`})}],te=t=>{e(`shape`,void 0,{shapeType:t}),m(!1)};return(0,Q.jsxs)(`div`,{className:`toolbar`,children:[(0,Q.jsx)(`div`,{className:`toolbar-item`,onClick:()=>e(`node`),title:`Add Node Container`,children:(0,Q.jsx)(u,{size:22})}),(0,Q.jsx)(`div`,{className:`toolbar-item`,onClick:()=>e(`image`),title:`Add Image`,children:(0,Q.jsx)(ne,{size:22})}),(0,Q.jsx)(`div`,{className:`toolbar-item`,onClick:()=>e(`video`),title:`Add Video`,children:(0,Q.jsx)(ie,{size:22})}),(0,Q.jsxs)(`div`,{className:`toolbar-item ${y?`active`:``}`,onClick:()=>b(!y),title:`Add Text`,style:{position:`relative`},children:[(0,Q.jsx)(ee,{size:22}),y&&(0,Q.jsx)(`div`,{ref:C,className:`shape-popover`,onClick:e=>e.stopPropagation(),style:{width:`180px`},children:(0,Q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,padding:`8px`,gap:`4px`},children:[(0,Q.jsx)(`div`,{className:`shape-popover-item`,style:{padding:`8px 12px`,textAlign:`left`,fontWeight:`bold`,fontSize:`24px`,borderRadius:`4px`,cursor:`pointer`},onClick:()=>{e(`text`,void 0,{text:{content:`Heading 1`,fontSize:32,fontWeight:700}}),b(!1)},children:`Heading 1`}),(0,Q.jsx)(`div`,{className:`shape-popover-item`,style:{padding:`8px 12px`,textAlign:`left`,fontWeight:`bold`,fontSize:`18px`,borderRadius:`4px`,cursor:`pointer`},onClick:()=>{e(`text`,void 0,{text:{content:`Heading 2`,fontSize:24,fontWeight:600}}),b(!1)},children:`Heading 2`}),(0,Q.jsx)(`div`,{className:`shape-popover-item`,style:{padding:`8px 12px`,textAlign:`left`,fontSize:`14px`,borderRadius:`4px`,cursor:`pointer`},onClick:()=>{e(`text`,void 0,{text:{content:`Paragraph`,fontSize:16,fontWeight:400}}),b(!1)},children:`Normal Text`}),(0,Q.jsx)(`div`,{className:`shape-popover-item`,style:{padding:`8px 12px`,textAlign:`left`,fontSize:`11px`,color:`#8c8d9c`,borderRadius:`4px`,cursor:`pointer`},onClick:()=>{e(`text`,void 0,{text:{content:`Small Text`,fontSize:12,fontWeight:400,color:`#8c8d9c`}}),b(!1)},children:`Small Text`})]})})]}),(0,Q.jsx)(`div`,{className:`toolbar-item`,onClick:()=>e(`button`),title:`Add Button`,children:(0,Q.jsx)(r,{size:22})}),(0,Q.jsxs)(`div`,{className:`toolbar-item ${p?`active`:``}`,onClick:()=>m(!p),title:`Add Shape`,style:{position:`relative`},children:[(0,Q.jsx)(A,{size:22}),p&&(0,Q.jsx)(`div`,{ref:x,className:`shape-popover`,onClick:e=>e.stopPropagation(),children:(0,Q.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(4, 1fr)`,gap:`8px`,padding:`12px`},children:E.map(e=>(0,Q.jsx)(`div`,{className:`shape-popover-item`,onClick:()=>te(e.type),title:e.name,children:(0,Q.jsx)(`svg`,{width:`24`,height:`24`,viewBox:`0 0 30 30`,style:{color:`var(--text-primary)`},children:e.svg})},e.type))})})]}),(0,Q.jsxs)(`div`,{className:`toolbar-item ${h?`active`:``}`,onClick:()=>_(!h),title:`Add Icon`,style:{position:`relative`},children:[(0,Q.jsx)(M,{size:22}),h&&(0,Q.jsx)(`div`,{ref:S,className:`shape-popover`,onClick:e=>e.stopPropagation(),style:{width:`220px`,maxHeight:`300px`,overflowY:`auto`},children:(0,Q.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(5, 1fr)`,gap:`8px`,padding:`12px`},children:Object.keys(Re).map(t=>(0,Q.jsx)(`div`,{className:`shape-popover-item`,onClick:()=>{e(`icon`,void 0,{iconName:t,color:`var(--text-primary)`}),_(!1)},title:t,style:{display:`flex`,alignItems:`center`,justifyContent:`center`,padding:`4px`,borderRadius:`6px`},children:(0,Q.jsx)(`svg`,{width:`18`,height:`18`,viewBox:`0 0 24 24`,stroke:`currentColor`,fill:`none`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,children:(0,Q.jsx)(`g`,{dangerouslySetInnerHTML:{__html:Re[t]}})})},t))})})]}),(0,Q.jsx)(`div`,{style:{height:`1px`,backgroundColor:`var(--border-color)`,margin:`8px 0`}}),(0,Q.jsx)(`div`,{className:`toolbar-item ${s?`active`:``}`,onClick:()=>c(!s),title:s?`Disable Snapping`:`Enable Snapping`,children:(0,Q.jsx)(a,{size:22})}),(0,Q.jsx)(`div`,{className:`toolbar-item`,onClick:()=>o(i===`light`?`dark`:`light`),title:i===`light`?`Switch to Dark Mode`:`Switch to Light Mode`,children:i===`light`?(0,Q.jsx)(v,{size:22}):(0,Q.jsx)(T,{size:22})}),(0,Q.jsx)(`div`,{className:`toolbar-item ${d?`active`:``}`,onClick:()=>f(!d),title:`Keyboard Shortcuts (H)`,children:(0,Q.jsx)(g,{size:22})}),(0,Q.jsx)(`div`,{style:{height:`1px`,backgroundColor:`var(--border-color)`,margin:`8px 0`}}),(0,Q.jsx)(`div`,{className:`toolbar-item`,style:{opacity:w?1:.3,cursor:w?`pointer`:`default`},onClick:()=>w&&n(),title:`Duplicate Selected`,children:(0,Q.jsx)(l,{size:22})})]})},wt=({element:e})=>{let t=Be(e),n=t.type,r=t.text||``,i=t.fontSize,a=t.fontFamily,o=t.borderWidth||0,{elements:s,selectedIds:c,selectElement:l,updateElement:u,setConnectingNode:d,connectingNode:f,addConnection:p,scale:m,editingFocalPointId:h,setEditingFocalPointId:g,saveHistory:_,isSnapEnabled:v,guides:y,isPresenting:b,currentSlideIndex:x,setCurrentSlideIndex:S,revealDownstream:ee,isBrushMode:C,showAlert:w}=bt(),T=(0,R.useRef)(s),E=(0,R.useRef)(c),te=(0,R.useRef)(m),O=(0,R.useRef)(v),ne=(0,R.useRef)(y),k=(0,R.useRef)(t);T.current=s,E.current=c,te.current=m,O.current=v,ne.current=y,k.current=t;let re=c.includes(t.id),A=h===t.id,ie=(0,R.useRef)(null),j=(0,R.useRef)(null),[M,N]=(0,R.useState)(!1),P=(0,R.useRef)(null),ae=(0,R.useRef)(null),F=e.text&&typeof e.text==`object`?e.text:null,oe=F?.padding||{top:10,right:14,bottom:10,left:14},se=F?.verticalAlign||`middle`,ce=se===`top`?`flex-start`:se===`bottom`?`flex-end`:`center`,le=(t=e.fill)=>{if(!t||t.type===`none`)return`transparent`;if(t.type===`gradient`&&t.gradient){let e=t.gradient.stops.map(e=>`${e.color} ${Math.round(e.offset*100)}%`).join(`, `);return t.gradient.type===`radial`?`radial-gradient(circle, ${e})`:`linear-gradient(${t.gradient.angle}deg, ${e})`}return t.color||`transparent`},ue=le(),I={color:Ge(F?.color||t.color),fontSize:`${F?.fontSize||t.fontSize||16}px`,fontFamily:F?.fontFamily||t.fontFamily,fontWeight:F?.fontWeight||400,fontStyle:F?.fontStyle||`normal`,textDecoration:F?.textDecoration||`none`,textAlign:F?.align||t.textAlign||`center`,lineHeight:F?.lineHeight||t.lineHeight||1.5,letterSpacing:`${F?.letterSpacing??t.letterSpacing??0}px`},de=`fill-${t.id}`,fe=()=>{let t=e.fill;if(!t||t.type!==`gradient`||!t.gradient)return null;let n=t.gradient.stops.map(e=>(0,Q.jsx)(`stop`,{offset:`${Math.round(e.offset*100)}%`,stopColor:e.color},`${e.offset}-${e.color}`));if(t.gradient.type===`radial`)return(0,Q.jsx)(`radialGradient`,{id:de,children:n});let r=t.gradient.angle*Math.PI/180,i=Math.cos(r),a=Math.sin(r);return(0,Q.jsx)(`linearGradient`,{id:de,x1:`${50-i*50}%`,y1:`${50-a*50}%`,x2:`${50+i*50}%`,y2:`${50+a*50}%`,children:n})},pe=e.fill?.type===`gradient`?`url(#${de})`:t.backgroundColor,L=()=>{let e=window.getSelection();return e&&e.rangeCount>0?e.getRangeAt(0):null},z=e=>{if(e){let t=window.getSelection();t&&(t.removeAllRanges(),t.addRange(e))}},B=e=>{let t=window.getSelection();if(!t||t.rangeCount===0)return;let n=t.getRangeAt(0);n.deleteContents();let r=document.createTextNode(e);n.insertNode(r),n.setStartAfter(r),n.collapse(!0),t.removeAllRanges(),t.addRange(n),ae.current=n.cloneRange()},V=e=>{P.current&&P.current.focus(),z(ae.current);let t=window.getSelection();if(!t||t.rangeCount===0)return;let n=t.getRangeAt(0);if(n.collapsed)return;let r=document.createElement(`span`);Object.assign(r.style,e),r.appendChild(n.extractContents()),n.insertNode(r);let i=document.createRange();i.selectNodeContents(r),t.removeAllRanges(),t.addRange(i),ae.current=i.cloneRange()};(0,R.useEffect)(()=>{if(M&&P.current){let e=r;P.current.innerHTML=e,P.current.focus();try{let e=document.createRange();e.selectNodeContents(P.current);let t=window.getSelection();t&&(t.removeAllRanges(),t.addRange(e))}catch(e){console.error(e)}}},[M,r,n]),(0,R.useEffect)(()=>{if(n===`text`&&!M&&ie.current){let e=ie.current.querySelector(`.text-element-content`);if(e){let n=e.scrollHeight+18+o*2;n>t.height+2&&u(t.id,{height:Math.ceil(n)})}}},[r,t.width,i,a,n,M,u,t.height,o,t.id]);let me=n=>{let r=!1;if(n&&n.relatedTarget){let e=n.relatedTarget;(e.closest(`.properties-panel`)||e.closest(`.rich-text-toolbar`)||e.closest(`.toolbar`)||e.closest(`.brush-toolbar`))&&(r=!0)}if(!r){for(let e of[`.properties-panel`,`.rich-text-toolbar`,`.toolbar`,`.brush-toolbar`,`.sketch-picker`])if(document.querySelector(`${e}:hover`)){r=!0;break}}if(r){if(P.current){let n=P.current.innerHTML,r={text:{...e.text||{content:``,fontFamily:`'Google Sans Text'`,fontSize:16,fontWeight:400,fontStyle:`normal`,textDecoration:`none`,color:`var(--text-primary)`,align:`center`,verticalAlign:`middle`,lineHeight:1.5,letterSpacing:0,padding:{top:10,right:14,bottom:10,left:14}},content:n}};if(t.type===`text`){let e=P.current,n=e.style.height;e.style.height=`auto`;let i=e.scrollHeight;e.style.height=n;let a=t.borderWidth||0;r.height=Math.max(30,i+18+a*2)}u(t.id,r)}return}if(P.current){let n=P.current.innerHTML,r={text:{...e.text||{content:``,fontFamily:`'Google Sans Text'`,fontSize:16,fontWeight:400,fontStyle:`normal`,textDecoration:`none`,color:`var(--text-primary)`,align:`center`,verticalAlign:`middle`,lineHeight:1.5,letterSpacing:0,padding:{top:10,right:14,bottom:10,left:14}},content:n}};if(t.type===`text`){let e=P.current,n=e.style.height;e.style.height=`auto`;let i=e.scrollHeight;e.style.height=n;let a=t.borderWidth||0;r.height=Math.max(30,i+18+a*2)}u(t.id,r)}N(!1)},he=()=>(0,Q.jsxs)(`div`,{className:`rich-text-toolbar`,onMouseDown:e=>e.preventDefault(),children:[(0,Q.jsx)(`button`,{className:`rich-text-btn`,onClick:()=>V({fontWeight:`700`}),title:`Bold`,style:{fontWeight:`bold`},children:`B`}),(0,Q.jsx)(`button`,{className:`rich-text-btn`,onClick:()=>V({fontStyle:`italic`}),title:`Italic`,style:{fontStyle:`italic`},children:`I`}),(0,Q.jsx)(`button`,{className:`rich-text-btn`,onClick:()=>V({textDecoration:`underline`}),title:`Underline`,style:{textDecoration:`underline`},children:`U`}),(0,Q.jsx)(`div`,{style:{width:`1px`,height:`16px`,background:`var(--border-color)`,margin:`0 4px`}}),(0,Q.jsxs)(`div`,{className:`rich-text-color-picker-container`,title:`Text Color`,children:[(0,Q.jsx)(`span`,{children:`🎨`}),(0,Q.jsx)(`input`,{type:`color`,className:`rich-text-color-picker-input`,onMouseDown:e=>{e.stopPropagation(),ae.current=L()},onChange:e=>{P.current&&P.current.focus(),z(ae.current),V({color:e.target.value})}})]})]}),ge=(0,R.useRef)({x:0,y:0}),H=(0,R.useRef)({x:0,y:0,w:0,h:0}),_e=(0,R.useRef)([]),ve=(0,R.useRef)(null),ye=(0,R.useRef)([]),be=(0,R.useRef)([]),xe=e=>{if(b||A)return;let n=e.target;if(M||n.closest(`.rich-text-toolbar`)||n.closest(`[contenteditable="true"]`)){e.stopPropagation();return}e.stopPropagation();let r=e.shiftKey;if(!re&&!r?l(t.id,!1):r&&l(t.id,!0),t.isLocked)return;ge.current={x:e.clientX,y:e.clientY};let i=!re&&!r?[t.id]:re?c:[...c,t.id];_e.current=s.filter(e=>i.includes(e.id)).filter(e=>!e.parentId||!i.includes(e.parentId)).map(e=>({id:e.id,x:e.x,y:e.y})),H.current={x:t.x,y:t.y,w:t.width,h:t.height};let a=!1,o=e=>{let t=te.current,n=O.current,r=k.current,i=T.current,o=E.current,s=ne.current,c=(e.clientX-ge.current.x)/t,l=(e.clientY-ge.current.y)/t;!a&&(Math.abs(c)>.1||Math.abs(l)>.1)&&(_(),a=!0);let d=c,f=l;e.shiftKey&&(Math.abs(c)>Math.abs(l)?f=0:d=0);let p=null,m=null;if(n&&!e.shiftKey){let e=H.current.x+c,t=H.current.y+l,n=r.width,a=r.height,u=[],h=[];if(i.forEach(i=>{if(o.includes(i.id)||i.parentId===r.id||i.id===r.id)return;let s=i.x,c=i.y,l=i.width,d=i.height;[s,s+l/2,s+l].forEach(t=>{[e,e+n/2,e+n].forEach(n=>{let r=t-n;if(Math.abs(r)<8){let i=n-e;u.push({val:t-i,diff:Math.abs(r)})}})}),[c,c+d/2,c+d].forEach(e=>{[t,t+a/2,t+a].forEach(n=>{let r=e-n;if(Math.abs(r)<8){let i=n-t;h.push({val:e-i,diff:Math.abs(r)})}})})}),s.forEach(r=>{r.type===`vertical`?[e,e+n/2,e+n].forEach(t=>{let n=r.position-t;if(Math.abs(n)<8){let i=t-e;u.push({val:r.position-i,diff:Math.abs(n)})}}):[t,t+a/2,t+a].forEach(e=>{let n=r.position-e;if(Math.abs(n)<8){let i=e-t;h.push({val:r.position-i,diff:Math.abs(n)})}})}),u.length>0){u.sort((e,t)=>e.diff-t.diff);let e=u[0].val;d=e-H.current.x,p=e}if(h.length>0){h.sort((e,t)=>e.diff-t.diff);let e=h[0].val;f=e-H.current.y,m=e}let g=window.setSnapGuides;if(g){let e=null,t=null,n=r.width,a=r.height;if(p!==null){let t=[...i.filter(e=>!o.includes(e.id)&&e.parentId!==r.id&&e.id!==r.id).flatMap(e=>[e.x,e.x+e.width/2,e.x+e.width]),...s.filter(e=>e.type===`vertical`).map(e=>e.position)].find(e=>Math.abs(e-(p+n/2))<2||Math.abs(e-p)<2||Math.abs(e-(p+n))<2);t!==void 0&&(e=t)}if(m!==null){let e=[...i.filter(e=>!o.includes(e.id)&&e.parentId!==r.id&&e.id!==r.id).flatMap(e=>[e.y,e.y+e.height/2,e.y+e.height]),...s.filter(e=>e.type===`horizontal`).map(e=>e.position)].find(e=>Math.abs(e-(m+a/2))<2||Math.abs(e-m)<2||Math.abs(e-(m+a))<2);e!==void 0&&(t=e)}g({x:e,y:t})}}_e.current.forEach(e=>{u(e.id,{x:e.x+d,y:e.y+f})})},d=e=>{window.removeEventListener(`pointermove`,o),window.removeEventListener(`pointerup`,d);let t=window.setSnapGuides;t&&t({x:null,y:null});let n=k.current,r=T.current;if(_e.current.length===1){let t=ie.current;if(t){if(Math.sqrt((e.clientX-ge.current.x)**2+(e.clientY-ge.current.y)**2)<5)return;t.classList.add(`pointer-events-none`);let i=document.elementFromPoint(e.clientX,e.clientY);t.classList.remove(`pointer-events-none`);let a=i?.closest(`.is-node`),o=a?.getAttribute(`data-id`);if(o&&o!==n.id&&n.type!==`node`){if(n.parentId===o)return;let e=r.find(e=>e.id===o);if(e){let t=n.x,i=n.y;if(n.parentId){let e=r.find(e=>e.id===n.parentId);e&&(t+=e.x+16,i+=e.y+45+16)}u(n.id,{parentId:o,x:t-e.x-16,y:i-(e.y+45+16)})}}else if(!a&&n.parentId){let e=r.find(e=>e.id===n.parentId);e&&u(n.id,{parentId:null,x:n.x+e.x+16,y:n.y+e.y+45+16})}}}};window.addEventListener(`pointermove`,o),window.addEventListener(`pointerup`,d)},Se=e=>{if(!A||!j.current)return;e.stopPropagation();let n={x:e.clientX,y:e.clientY},[r,i]=(t.objectPosition||`50% 50%`).split(` `).map(e=>parseFloat(e)),a=e=>{let a=j.current.getBoundingClientRect(),o=(e.clientX-n.x)/a.width*100,s=(e.clientY-n.y)/a.height*100,c=r-o,l=i-s;c=Math.max(0,Math.min(100,c)),l=Math.max(0,Math.min(100,l)),u(t.id,{objectPosition:`${Math.round(c)}% ${Math.round(l)}%`})},o=()=>{window.removeEventListener(`pointermove`,a),window.removeEventListener(`pointerup`,o)};window.addEventListener(`pointermove`,a),window.addEventListener(`pointerup`,o)},U=(e,n)=>{e.stopPropagation(),re||l(t.id);let r=c.includes(t.id)?c:[...c,t.id],i=s.filter(e=>r.includes(e.id)),a=Math.min(...i.map(e=>e.x)),o=Math.min(...i.map(e=>e.y)),d=Math.max(...i.map(e=>e.x+e.width)),f=Math.max(...i.map(e=>e.y+e.height)),p=d-a,m=f-o;ve.current={x:a,y:o,w:p,h:m},ye.current=i.map(e=>({id:e.id,relX:p>0?(e.x-a)/p:0,relY:m>0?(e.y-o)/m:0,relW:p>0?e.width/p:1,relH:m>0?e.height/m:1})),ge.current={x:e.clientX,y:e.clientY},H.current={x:t.x,y:t.y,w:t.width,h:t.height};let h=!1,g=e=>{let t=te.current,r=O.current,i=k.current,a=T.current,o=E.current,s=ne.current,c=(e.clientX-ge.current.x)/t,l=(e.clientY-ge.current.y)/t;if(!h&&(Math.abs(c)>.1||Math.abs(l)>.1)&&(_(),h=!0),ve.current){let t=c,d=l,f=null,p=null;if(r&&!e.shiftKey&&!e.altKey){let e=[],r=[];a.forEach(t=>{if(o.includes(t.id)||t.parentId===i.id||t.id===i.id)return;let a=t.x,s=t.y,u=t.width,d=t.height,f=[a,a+u/2,a+u],p=[s,s+d/2,s+d];if(n.includes(`e`)){let t=H.current.x+H.current.w+c;f.forEach(n=>{let r=n-t;Math.abs(r)<8&&e.push({val:n,diff:Math.abs(r)})})}else if(n.includes(`w`)){let t=H.current.x+c;f.forEach(n=>{let r=n-t;Math.abs(r)<8&&e.push({val:n,diff:Math.abs(r)})})}if(n.includes(`s`)){let e=H.current.y+H.current.h+l;p.forEach(t=>{let n=t-e;Math.abs(n)<8&&r.push({val:t,diff:Math.abs(n)})})}else if(n.includes(`n`)){let e=H.current.y+l;p.forEach(t=>{let n=t-e;Math.abs(n)<8&&r.push({val:t,diff:Math.abs(n)})})}}),s.forEach(t=>{if(t.type===`vertical`){if(n.includes(`e`)){let n=H.current.x+H.current.w+c,r=t.position-n;Math.abs(r)<8&&e.push({val:t.position,diff:Math.abs(r)})}else if(n.includes(`w`)){let n=H.current.x+c,r=t.position-n;Math.abs(r)<8&&e.push({val:t.position,diff:Math.abs(r)})}}else if(n.includes(`s`)){let e=H.current.y+H.current.h+l,n=t.position-e;Math.abs(n)<8&&r.push({val:t.position,diff:Math.abs(n)})}else if(n.includes(`n`)){let e=H.current.y+l,n=t.position-e;Math.abs(n)<8&&r.push({val:t.position,diff:Math.abs(n)})}}),e.length>0&&(e.sort((e,t)=>e.diff-t.diff),f=e[0].val,n.includes(`e`)?t=f-(H.current.x+H.current.w):n.includes(`w`)&&(t=f-H.current.x)),r.length>0&&(r.sort((e,t)=>e.diff-t.diff),p=r[0].val,n.includes(`s`)?d=p-(H.current.y+H.current.h):n.includes(`n`)&&(d=p-H.current.y))}let m=window.setSnapGuides;m&&m({x:f,y:p});let h=H.current.w/H.current.h,g=H.current.w,_=H.current.h;if(e.altKey){let e=n.includes(`w`)?-t:t,r=n.includes(`n`)?-d:d;Math.abs(e)>Math.abs(r)?(g=H.current.w+e,_=g/h):(_=H.current.h+r,g=_*h)}else n.includes(`w`)?g=H.current.w-t:n.includes(`e`)&&(g=H.current.w+t),n.includes(`n`)?_=H.current.h-d:n.includes(`s`)&&(_=H.current.h+d);if(g>=2&&_>=2){let e=g/H.current.w,t=_/H.current.h,r=ve.current,i=r.w*e,a=r.h*t,o=r.x,s=r.y;n.includes(`w`)&&(o=r.x+r.w-i),n.includes(`n`)&&(s=r.y+r.h-a),ye.current.forEach(e=>{u(e.id,{x:o+e.relX*i,y:s+e.relY*a,width:Math.max(2,e.relW*i),height:Math.max(2,e.relH*a)})})}}},v=()=>{window.removeEventListener(`pointermove`,g),window.removeEventListener(`pointerup`,v);let e=window.setSnapGuides;e&&e({x:null,y:null})};window.addEventListener(`pointermove`,g),window.addEventListener(`pointerup`,v)},Ce=e=>{e.stopPropagation(),re||l(t.id);let n=c.includes(t.id)?c:[...c,t.id];be.current=s.filter(e=>n.includes(e.id)).map(e=>({id:e.id,rotation:e.rotation||0}));let r=!1,i=e=>{if(ie.current){r||=(_(),!0);let n=ie.current.getBoundingClientRect(),i=n.left+n.width/2,a=n.top+n.height/2,o=Math.atan2(e.clientY-a,e.clientX-i)*(180/Math.PI)+90;o<0&&(o+=360),o=Math.round(o);let s=be.current.find(e=>e.id===t.id)?.rotation||0,c=o-s;be.current.forEach(e=>{u(e.id,{rotation:(e.rotation+c)%360})})}},a=()=>{window.removeEventListener(`pointermove`,i),window.removeEventListener(`pointerup`,a)};window.addEventListener(`pointermove`,i),window.addEventListener(`pointerup`,a)},W=(e,n)=>{e.stopPropagation(),d({id:t.id,port:n})},we=(e,n)=>{e.stopPropagation(),f&&f.id!==t.id&&p(f.id,f.port,t.id,n),d(null)},Te=()=>{let e=t;switch(t.type){case`text`:return M?(0,Q.jsxs)(`div`,{style:{width:`100%`,height:`100%`,position:`relative`,display:`flex`,alignItems:`center`,justifyContent:`center`,backgroundColor:`rgba(0,0,0,0.2)`,border:`1px solid #4caf50`,borderRadius:`${t.borderRadius}px`,boxSizing:`border-box`,padding:`10px 14px`,lineHeight:`1.5`,overflowY:`auto`},children:[he(),(0,Q.jsx)(`div`,{ref:P,contentEditable:!0,suppressContentEditableWarning:!0,onBlur:me,onKeyDown:e=>{e.key===`Enter`&&!e.shiftKey?(e.preventDefault(),me()):e.key===`Escape`&&(e.preventDefault(),N(!1))},style:{...I,width:`100%`,outline:`none`,userSelect:`text`,wordBreak:`break-word`},onPaste:e=>{e.preventDefault(),B(e.clipboardData.getData(`text/plain`))},onKeyUp:()=>{ae.current=L()},onMouseUp:()=>{ae.current=L()}})]}):(0,Q.jsx)(`div`,{onDoubleClick:()=>N(!0),style:{...I,background:ue,borderWidth:`${t.stroke?.width??0}px`,borderStyle:t.stroke?.style||`solid`,borderColor:X(t.stroke?.color||`transparent`),borderRadius:`${t.stroke?.radius??0}px`,width:`100%`,height:`100%`,display:`flex`,alignItems:ce,justifyContent:`center`,wordBreak:`break-word`,overflow:`hidden`,padding:`${oe.top}px ${oe.right}px ${oe.bottom}px ${oe.left}px`,boxSizing:`border-box`},children:(0,Q.jsx)(`div`,{className:`text-element-content`,style:{width:`100%`,textAlign:I.textAlign,wordBreak:`break-word`,lineHeight:I.lineHeight,letterSpacing:I.letterSpacing},dangerouslySetInnerHTML:{__html:t.text}})});case`button`:return M?(0,Q.jsxs)(`div`,{style:{width:`100%`,height:`100%`,position:`relative`,display:`flex`,alignItems:`center`,justifyContent:`center`,backgroundColor:`rgba(0,0,0,0.2)`,border:`1px solid #4caf50`,borderRadius:`${t.borderRadius}px`,boxSizing:`border-box`,padding:`8px 14px`,lineHeight:`1.5`,overflowY:`auto`},children:[he(),(0,Q.jsx)(`div`,{ref:P,contentEditable:!0,suppressContentEditableWarning:!0,onBlur:me,onKeyDown:e=>{e.key===`Enter`&&!e.shiftKey?(e.preventDefault(),me()):e.key===`Escape`&&(e.preventDefault(),N(!1))},style:{...I,width:`100%`,outline:`none`,userSelect:`text`,wordBreak:`break-word`},onPaste:e=>{e.preventDefault(),B(e.clipboardData.getData(`text/plain`))},onKeyUp:()=>{ae.current=L()},onMouseUp:()=>{ae.current=L()}})]}):(0,Q.jsx)(`button`,{onDoubleClick:()=>{b||N(!0)},onClick:e=>{if(!b)return;e.stopPropagation();let n=t.actionType,r=t.actionTarget;if(n===`alert`)w(r||`Button clicked!`,`Notification`);else if(n===`link`)t.link&&window.open(t.link,`_blank`,`noopener,noreferrer`);else if(n===`toggleDisabled`){if(r){let e=s.find(e=>e.id===r);e&&u(r,{disabled:!e.disabled})}}else if(n===`toggleVisibility`){if(r){let e=s.find(e=>e.id===r);e&&u(r,{visible:!e.visible})}}else if(n===`triggerFlow`)r&&ee(r);else if(n===`nextSlide`)x<s.filter(e=>e.type===`node`&&e.isSlide!==!1).sort((e,t)=>e.x-t.x).length-1&&S(x+1);else if(n===`prevSlide`)x>0&&S(x-1);else if(n===`goToSlide`&&r){let e=s.filter(e=>e.type===`node`&&e.isSlide!==!1).sort((e,t)=>e.x-t.x).findIndex(e=>e.id===r);e!==-1&&S(e)}},disabled:t.isDisabled,style:{...I,background:ue,width:`100%`,height:`100%`,display:`flex`,alignItems:ce,justifyContent:`center`,cursor:b?`pointer`:`default`,pointerEvents:`auto`,transition:`opacity 0.2s, transform 0.1s`,padding:`${oe.top}px ${oe.right}px ${oe.bottom}px ${oe.left}px`,boxSizing:`border-box`,borderWidth:`${t.stroke?.width??0}px`,borderStyle:t.stroke?.style||`solid`,borderColor:X(t.stroke?.color||`transparent`),borderRadius:`${t.stroke?.radius??6}px`},children:(0,Q.jsx)(`div`,{style:{width:`100%`,textAlign:I.textAlign,wordBreak:`break-word`,lineHeight:I.lineHeight,letterSpacing:I.letterSpacing},dangerouslySetInnerHTML:{__html:t.text}})});case`image`:{let n=e.objectPosition||`50% 50%`,r=(()=>{if(!t.src||!t.src.includes(`lh3.googleusercontent.com`))return t.src;let e=t.imageQuality;if(e===void 0)return t.src;let n=t.src.replace(/=s\d+$/,``);return e===100?`${n}=s0`:`${n}=s${Math.round(40*e)}`})();return(0,Q.jsxs)(`div`,{style:{width:`100%`,height:`100%`,display:`flex`,flexDirection:`column`},children:[e.title&&(0,Q.jsx)(`div`,{className:`media-header`,style:{fontSize:`${e.fontSize||11}px`},children:e.title}),(0,Q.jsxs)(`div`,{style:{flex:1,position:`relative`,overflow:`hidden`},onPointerDown:Se,children:[(0,Q.jsx)(`div`,{className:`media-settings-btn`,onClick:e=>{e.stopPropagation(),g(A?null:t.id)},title:`Set Focal Point`,children:(0,Q.jsx)(D,{size:14})}),A&&(0,Q.jsxs)(`div`,{className:`focal-point-overlay`,style:{cursor:`move`},children:[(0,Q.jsx)(`div`,{className:`focal-point-indicator`,style:{left:n.split(` `)[0],top:n.split(` `)[1]}}),(0,Q.jsx)(`div`,{style:{color:`#fff`,fontSize:`10px`,background:`rgba(0,0,0,0.6)`,padding:`4px 8px`,borderRadius:`4px`,position:`absolute`,bottom:`10px`},children:`Drag to pan image`})]}),(0,Q.jsx)(`img`,{src:r,alt:t.alt,style:{width:`100%`,height:`100%`,objectFit:t.objectFit,objectPosition:n,borderWidth:`${t.stroke?.width??0}px`,borderStyle:t.stroke?.style||`solid`,borderColor:X(t.stroke?.color||`transparent`),borderRadius:`${t.stroke?.radius??0}px`,boxSizing:`border-box`},draggable:!1,loading:`lazy`,decoding:`async`})]})]})}case`video`:return(0,Q.jsxs)(`div`,{style:{width:`100%`,height:`100%`,display:`flex`,flexDirection:`column`},children:[e.title&&(0,Q.jsx)(`div`,{className:`media-header`,style:{fontSize:`${e.fontSize||11}px`},children:e.title}),(0,Q.jsxs)(`div`,{style:{flex:1,position:`relative`,overflow:`hidden`},onPointerDown:Se,children:[(0,Q.jsx)(`div`,{className:`media-settings-btn`,style:{pointerEvents:`auto`},onClick:e=>{e.stopPropagation(),g(A?null:t.id)},title:`Set Video Alignment`,children:(0,Q.jsx)(D,{size:14})}),A&&(0,Q.jsx)(`div`,{className:`focal-point-overlay`,style:{cursor:`move`},children:(0,Q.jsx)(`div`,{style:{color:`#fff`,fontSize:`10px`,background:`rgba(0,0,0,0.6)`,padding:`4px 8px`,borderRadius:`4px`},children:`Drag to align video`})}),(0,Q.jsx)(`div`,{style:{width:`100%`,height:`100%`,pointerEvents:`none`},children:(0,Q.jsx)(`iframe`,{src:t.src,style:{width:`100%`,height:`100%`,objectFit:`cover`,borderWidth:`${t.stroke?.width??0}px`,borderStyle:t.stroke?.style||`solid`,borderColor:X(t.stroke?.color||`transparent`),borderRadius:`${t.stroke?.radius??0}px`,boxSizing:`border-box`},frameBorder:`0`,allowFullScreen:!0})})]})]});case`shape`:{let n=e.text||``,r=null;if(M?r=(0,Q.jsxs)(`div`,{style:{position:`absolute`,top:0,left:0,width:`100%`,height:`100%`,zIndex:10,display:`flex`,alignItems:`center`,justifyContent:`center`,backgroundColor:`rgba(0,0,0,0.3)`,border:`1px solid #4caf50`,borderRadius:`${t.borderRadius||0}px`,boxSizing:`border-box`,padding:`8px`,overflowY:`auto`},children:[he(),(0,Q.jsx)(`div`,{ref:P,contentEditable:!0,suppressContentEditableWarning:!0,onBlur:me,onKeyDown:e=>{e.key===`Enter`&&!e.shiftKey?(e.preventDefault(),me()):e.key===`Escape`&&(e.preventDefault(),N(!1))},style:{...I,width:`100%`,outline:`none`,userSelect:`text`,wordBreak:`break-word`},onPaste:e=>{e.preventDefault(),B(e.clipboardData.getData(`text/plain`))},onKeyUp:()=>{ae.current=L()},onMouseUp:()=>{ae.current=L()}})]}):n&&(r=(0,Q.jsx)(`div`,{style:{position:`absolute`,top:0,left:0,width:`100%`,height:`100%`,display:`flex`,alignItems:`center`,justifyContent:`center`,pointerEvents:`none`,padding:`8px`,boxSizing:`border-box`,overflow:`hidden`},children:(0,Q.jsx)(`div`,{style:{width:`100%`,...I,wordBreak:`break-word`},dangerouslySetInnerHTML:{__html:n}})})),t.shapeType===`line`)return(0,Q.jsxs)(`div`,{style:{position:`relative`,width:`100%`,height:`100%`},onDoubleClick:()=>N(!0),children:[(0,Q.jsx)(`svg`,{width:`100%`,height:`100%`,style:{overflow:`visible`,filter:t.shadow?.enabled?`drop-shadow(${t.shadow.offsetX}px ${t.shadow.offsetY}px ${t.shadow.blur}px ${t.shadow.color})`:void 0},children:(0,Q.jsx)(`line`,{x1:`0`,y1:`0`,x2:t.width,y2:t.height,stroke:X(t.borderColor),strokeWidth:t.borderWidth,strokeDasharray:t.stroke?.style===`dashed`?`8 4`:t.stroke?.style===`dotted`?`2 2`:void 0})}),r]});if(t.shapeType===`arrow`){let e=`arrowhead-${t.id}`;return(0,Q.jsxs)(`div`,{style:{position:`relative`,width:`100%`,height:`100%`},onDoubleClick:()=>N(!0),children:[(0,Q.jsxs)(`svg`,{width:`100%`,height:`100%`,style:{overflow:`visible`,filter:t.shadow?.enabled?`drop-shadow(${t.shadow.offsetX}px ${t.shadow.offsetY}px ${t.shadow.blur}px ${t.shadow.color})`:void 0},children:[(0,Q.jsx)(`defs`,{children:(0,Q.jsx)(`marker`,{id:e,viewBox:`0 0 10 10`,refX:`6`,refY:`5`,markerWidth:`8`,markerHeight:`8`,orient:`auto-start-reverse`,children:(0,Q.jsx)(`path`,{d:`M 0 1 L 10 5 L 0 9 z`,fill:X(t.borderColor)})})}),(0,Q.jsx)(`line`,{x1:`0`,y1:`0`,x2:t.width,y2:t.height,stroke:X(t.borderColor),strokeWidth:t.borderWidth,strokeDasharray:t.stroke?.style===`dashed`?`8 4`:t.stroke?.style===`dotted`?`2 2`:void 0,markerEnd:`url(#${e})`})]}),r]})}if(t.shapeType===`elbow`){let e=t.width/2,n=`M 0 0 L ${e} 0 L ${e} ${t.height} L ${t.width} ${t.height}`;return(0,Q.jsxs)(`div`,{style:{position:`relative`,width:`100%`,height:`100%`},onDoubleClick:()=>N(!0),children:[(0,Q.jsx)(`svg`,{width:`100%`,height:`100%`,style:{overflow:`visible`,filter:t.shadow?.enabled?`drop-shadow(${t.shadow.offsetX}px ${t.shadow.offsetY}px ${t.shadow.blur}px ${t.shadow.color})`:void 0},children:(0,Q.jsx)(`path`,{d:n,fill:`none`,stroke:X(t.borderColor),strokeWidth:t.borderWidth,strokeDasharray:t.stroke?.style===`dashed`?`8 4`:t.stroke?.style===`dotted`?`2 2`:void 0})}),r]})}if(t.shapeType===`rectangle`)return(0,Q.jsx)(`div`,{style:{position:`relative`,width:`100%`,height:`100%`,background:ue,borderWidth:`${t.stroke?.width??0}px`,borderStyle:t.stroke?.style||`solid`,borderColor:X(t.stroke?.color||`transparent`),borderRadius:`${t.stroke?.radius??0}px`},onDoubleClick:()=>N(!0),children:r});if(t.shapeType===`ellipse`)return(0,Q.jsx)(`div`,{style:{position:`relative`,width:`100%`,height:`100%`,background:ue,borderWidth:`${t.stroke?.width??0}px`,borderStyle:t.stroke?.style||`solid`,borderColor:X(t.stroke?.color||`transparent`),borderRadius:`50%`},onDoubleClick:()=>N(!0),children:r});let i={triangle:`50,0 100,100 0,100`,rightTriangle:`0,0 100,100 0,100`,diamond:`50,0 100,50 50,100 0,50`,pentagon:`50,0 100,38 82,100 18,100 0,38`,hexagon:`50,0 100,25 100,75 50,100 0,75 0,25`,parallelogram:`25,0 100,0 75,100 0,100`,trapezoid:`20,0 80,0 100,100 0,100`,star:`50,0 63,38 100,38 69,59 82,100 50,75 18,100 31,59 0,38 37,38`,arrowRight:`0,30 60,30 60,10 100,50 60,90 60,70 0,70`,arrowLeft:`100,30 40,30 40,10 0,50 40,90 40,70 100,70`,arrowUp:`30,100 30,40 10,40 50,0 90,40 70,40 70,100`,arrowDown:`30,0 30,60 10,60 50,100 90,60 70,60 70,0`},a=i[t.shapeType]||i.triangle;return(0,Q.jsxs)(`div`,{style:{position:`relative`,width:`100%`,height:`100%`},onDoubleClick:()=>N(!0),children:[(0,Q.jsxs)(`svg`,{width:`100%`,height:`100%`,preserveAspectRatio:`none`,style:{overflow:`visible`,filter:t.shadow?.enabled?`drop-shadow(${t.shadow.offsetX}px ${t.shadow.offsetY}px ${t.shadow.blur}px ${t.shadow.color})`:void 0},children:[(0,Q.jsx)(`defs`,{children:fe()}),(0,Q.jsx)(`polygon`,{points:a,fill:pe,stroke:X(t.borderColor),strokeWidth:t.borderWidth,strokeDasharray:t.stroke?.style===`dashed`?`8 4`:t.stroke?.style===`dotted`?`2 2`:void 0,vectorEffect:`non-scaling-stroke`})]}),r]})}case`icon`:{let e=ze(t.iconName||`home`);return(0,Q.jsx)(`div`,{style:{width:`100%`,height:`100%`,display:`flex`,alignItems:`center`,justifyContent:`center`},children:(0,Q.jsx)(`svg`,{viewBox:`0 0 24 24`,width:`100%`,height:`100%`,stroke:t.iconColor||t.color||`currentColor`,fill:`none`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,style:{display:`block`,filter:t.shadow?.enabled?`drop-shadow(${t.shadow.offsetX}px ${t.shadow.offsetY}px ${t.shadow.blur}px ${t.shadow.color})`:void 0},children:(0,Q.jsx)(`g`,{dangerouslySetInnerHTML:{__html:e}})})})}case`node`:return(0,Q.jsx)(Q.Fragment,{children:s.filter(e=>e.parentId===t.id).map(e=>(0,Q.jsx)(wt,{element:e},e.id))});default:return null}},Ee=f&&f.id!==t.id,De=t,G=De.parentId&&De.fillParent;return(0,Q.jsxs)(`div`,{ref:ie,className:`element-wrapper ${t.type===`node`?`is-node`:``} ${t.type===`button`?`is-button`:``} ${re?`selected`:``} ${Ee?`connecting`:``} ${t.isDisabled?`disabled`:``} ${t.isHidden?`is-hidden`:``} ${C?`pointer-events-none`:``}`,"data-id":t.id,style:{left:G?0:t.x,top:G?0:t.y,width:G?`100%`:t.width,height:G?`100%`:t.height,transform:G?`none`:`rotate(${t.rotation||0}deg)`,background:t.type===`node`?le(e.fill)||Ke(`node`,t.backgroundColor):void 0,zIndex:t.zIndex??(t.type===`node`?20:21),opacity:t.isHidden||t.isDisabled?void 0:t.opacity??1,pointerEvents:C?`none`:`auto`,borderWidth:t.type===`node`?`${t.stroke?.width??1}px`:void 0,borderStyle:t.type===`node`?t.stroke?.style||`solid`:void 0,borderColor:t.type===`node`?X(t.stroke?.color||`var(--border-color)`):void 0,borderRadius:[`node`,`text`,`button`,`image`,`video`].includes(t.type)?`${t.stroke?.radius??(t.type===`node`?10:t.type===`button`?6:0)}px`:void 0,boxShadow:t.type!==`shape`&&t.type!==`icon`&&t.shadow?.enabled?`${t.shadow.offsetX}px ${t.shadow.offsetY}px ${t.shadow.blur}px ${t.shadow.spread||0}px ${t.shadow.color}`:void 0},onPointerDown:xe,onDoubleClick:e=>{b||[`text`,`button`,`shape`,`node`].includes(t.type)&&(e.stopPropagation(),N(!0))},children:[t.type===`node`&&(M||t.name&&t.name.trim()!==``)&&(0,Q.jsxs)(`div`,{className:`element-header`,style:{fontFamily:t.fontFamily,fontSize:`${De.fontSize||14}px`},children:[(0,Q.jsx)(D,{size:16,color:`#8c8d9c`}),M?(0,Q.jsx)(`input`,{type:`text`,value:t.name||``,autoFocus:!0,onChange:e=>u(t.id,{name:e.target.value}),onBlur:()=>N(!1),onKeyDown:e=>{e.key===`Enter`&&N(!1)},style:{flex:1,background:`rgba(0,0,0,0.4)`,border:`1px solid #4caf50`,color:Ge(t.color),outline:`none`,fontSize:`12px`,padding:`2px 6px`,borderRadius:`4px`},onFocus:e=>e.target.select()}):(0,Q.jsx)(`span`,{style:{flex:1,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`,color:Ge(t.color)},onDoubleClick:e=>{e.stopPropagation(),N(!0)},children:t.name})]}),(0,Q.jsx)(`div`,{ref:j,className:`element-content`,style:{pointerEvents:M||b?`auto`:[`text`,`button`,`shape`].includes(t.type)?`none`:`auto`},children:Te()}),!t.parentId&&!A&&(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(`div`,{className:`node-handle top`,onPointerDown:e=>W(e,`top`),onPointerUp:e=>we(e,`top`)}),(0,Q.jsx)(`div`,{className:`node-handle right`,onPointerDown:e=>W(e,`right`),onPointerUp:e=>we(e,`right`)}),(0,Q.jsx)(`div`,{className:`node-handle bottom`,onPointerDown:e=>W(e,`bottom`),onPointerUp:e=>we(e,`bottom`)}),(0,Q.jsx)(`div`,{className:`node-handle left`,onPointerDown:e=>W(e,`left`),onPointerUp:e=>we(e,`left`)})]}),re&&!A&&!t.isLocked&&(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(`div`,{className:`rotate-handle`,onPointerDown:Ce,onDoubleClick:e=>{e.stopPropagation(),u(t.id,{rotation:0})},title:`Rotate Element (Double-click to reset)`}),(0,Q.jsx)(`div`,{className:`resize-handle nw`,onPointerDown:e=>U(e,`nw`)}),(0,Q.jsx)(`div`,{className:`resize-handle ne`,onPointerDown:e=>U(e,`ne`)}),(0,Q.jsx)(`div`,{className:`resize-handle sw`,onPointerDown:e=>U(e,`sw`)}),(0,Q.jsx)(`div`,{className:`resize-handle se`,onPointerDown:e=>U(e,`se`)})]})]})};function Tt(e,t){let n=[];t.forEach(t=>{(t.id===e||t.parentId===e)&&(t.animations||[]).forEach(e=>{n.push({anim:e,elementId:t.id})})}),n.sort((e,t)=>(e.anim.order||0)-(t.anim.order||0));let r=[],i=null;return n.forEach(({anim:e})=>{e.trigger===`onClick`||e.trigger===`onEnter`||!i?(i={triggerAnimId:e.id,animations:[e]},r.push(i)):i.animations.push(e)}),r}var Et=()=>{let{elements:e,connections:t,selectElement:n,connectingNode:r,setConnectingNode:i,selectedIds:a,selectedConnectionId:o,selectConnection:s,removeConnection:c,scale:u,setScale:d,pan:f,setPan:p,editingFocalPointId:m,setEditingFocalPointId:g,addElement:v,removeSelected:y,duplicateSelected:b,updateElement:x,brushStrokes:w,isBrushMode:T,brushColor:E,brushWidth:D,setBrushWidth:O,addBrushStroke:k,clearBrush:re,setBrushMode:A,setBrushColor:ie,undo:N,redo:P,saveHistory:ae,guides:oe,addGuide:se,updateGuide:le,removeGuide:I,copySelected:de,pasteCopied:fe,selectAll:pe,isSnapEnabled:L,isPresenting:z,setIsPresenting:B,currentSlideIndex:V,setCurrentSlideIndex:me,revealDownstream:he,isHelpOpen:ge,setIsHelpOpen:H,brushTool:_e,setBrushTool:ve,eraseBrushStrokesAt:ye,playedAnimationIds:be,setPlayedAnimationIds:Ce}=bt(),W=(0,R.useRef)(null),[we,Te]=(0,R.useState)({x:0,y:0}),[Ee,De]=(0,R.useState)(!1),[G,Oe]=(0,R.useState)(!1),[K,ke]=(0,R.useState)(null),[q,Ae]=(0,R.useState)(null),[je,Me]=(0,R.useState)(null),[Ne,J]=(0,R.useState)(!1),Pe=(0,R.useRef)(null),Fe=(0,R.useRef)(null),Ie=(0,R.useRef)(!1),Y=(0,R.useRef)({x:0,width:0}),Le=(0,R.useRef)(e.length>0),Re=(0,R.useRef)(!1),[ze,Be]=(0,R.useState)({x:null,y:null}),[Ve,He]=(0,R.useState)(null),[Ue,Ge]=(0,R.useState)(!1),[X,Ke]=(0,R.useState)({x:-100,y:-100}),[qe,Je]=(0,R.useState)([]),[Ye,Xe]=(0,R.useState)(!1);(0,R.useEffect)(()=>{if(!Ue)return;let e=e=>{Ke({x:e.clientX,y:e.clientY}),Je(t=>{let n=[...t,{x:e.clientX,y:e.clientY}];return n.length>20&&n.shift(),n})};return window.addEventListener(`pointermove`,e),()=>window.removeEventListener(`pointermove`,e)},[Ue]),(0,R.useEffect)(()=>{if(!Ue){Je([]);return}let e=!0,t=()=>{e&&(Je(e=>e.length===0?e:e.slice(1)),requestAnimationFrame(t))},n=setTimeout(()=>{requestAnimationFrame(t)},80);return()=>{e=!1,clearTimeout(n)}},[z,Ue,X]);let Ze=(0,R.useCallback)(t=>{let n=e.filter(e=>e.type===`node`&&e.isSlide!==!1).sort((e,t)=>e.x-t.x);if(n.length===0)return;let r=Math.max(0,Math.min(t,n.length-1)),i=n[r],a=[],o=[];e.forEach(e=>{(e.id===i.id||e.parentId===i.id)&&(e.animations||[]).forEach(e=>{a.push(e.id),e.trigger===`onEnter`&&o.push(e.id)})});let s=be.filter(e=>!a.includes(e));Ce(r<V?[...s,...a]:[...s,...o]),me(r);let c=n[r];if(c.visible||(x(c.id,{visible:!0}),he(c.id)),!W.current)return;let l=W.current.getBoundingClientRect(),u=l.width-120,f=l.height-120,m=u/c.width,h=f/c.height,g=Math.min(m,h,2),_=l.width/2-(c.x+c.width/2)*g,v=l.height/2-(c.y+c.height/2)*g;d(g),p({x:_,y:v})},[e,d,p,x,he,me,V,be,Ce]),Qe=(0,R.useCallback)(()=>{let t=e.filter(e=>e.type===`node`&&e.isSlide!==!1).sort((e,t)=>e.x-t.x),n=t[V];if(!n)return;let r=Tt(n.id,e).find(e=>!e.animations.every(e=>be.includes(e.id)));if(r){let e=r.animations.map(e=>e.id);Ce(t=>[...t,...e])}else V<t.length-1&&Ze(V+1)},[e,V,be,Ce,Ze]),$e=(0,R.useCallback)(()=>{V>0&&Ze(V-1)},[V,Ze]);(0,R.useEffect)(()=>{z?Ze(V):Xe(!1)},[z,V,Ze]),(0,R.useEffect)(()=>(window.setSnapGuides=Be,()=>{delete window.setSnapGuides}),[]);let et=(0,R.useRef)({startX:0,startY:0,initialPanX:0,initialPanY:0}),tt=(0,R.useCallback)(()=>{if(e.length===0||!W.current){d(1),p({x:0,y:0});return}let t=W.current.getBoundingClientRect();if(t.width<=0||t.height<=0)return;let n=1/0,r=1/0,i=-1/0,a=-1/0;e.filter(e=>!e.parentId).forEach(e=>{n=Math.min(n,e.x),r=Math.min(r,e.y),i=Math.max(i,e.x+e.width),a=Math.max(a,e.y+e.height)});let o=i-n,s=a-r;if(!Number.isFinite(o)||!Number.isFinite(s)||o<=0||s<=0)return;let c=t.width-100,l=t.height-100,u=Math.min(Math.min(c/o,l/s),1.5),f=(n+i)/2,m=(r+a)/2,h=t.width/2-f*u,g=t.height/2-m*u;d(u),p({x:h,y:g})},[e,d,p]);(0,R.useEffect)(()=>{if(!Le.current||Re.current||e.length===0)return;let t=window.requestAnimationFrame(()=>{tt(),Re.current=!0});return()=>window.cancelAnimationFrame(t)},[e.length,tt]),(0,R.useEffect)(()=>{let t=t=>{let n=t.target,r=n.tagName===`INPUT`||n.tagName===`TEXTAREA`||n.tagName===`SELECT`||n.contentEditable===`true`;if(!r&&(t.key.toLowerCase()===`h`||t.key===`?`)){t.preventDefault(),H(!ge);return}if(!r&&t.key.toLowerCase()===`l`){t.preventDefault(),Ge(e=>!e);return}if(z){t.key===`ArrowRight`||t.key===` `||t.code===`Space`||t.key===`Enter`?(t.preventDefault(),Qe()):t.key===`ArrowLeft`||(t.key===` `||t.code===`Space`)&&t.shiftKey?(t.preventDefault(),$e()):t.key===`Escape`&&(t.preventDefault(),B(!1));return}if(!r&&[`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`].includes(t.key)&&a.length>0){t.preventDefault(),ae();let n=t.shiftKey?10:1,r=0,i=0;t.key===`ArrowUp`?i=-n:t.key===`ArrowDown`?i=n:t.key===`ArrowLeft`?r=-n:t.key===`ArrowRight`&&(r=n),a.forEach(t=>{let n=e.find(e=>e.id===t);n&&!n.locked&&x(n.id,{x:n.x+r,y:n.y+i})});return}if(m&&(t.key===`Enter`||t.key===`Escape`)){g(null);return}!r&&t.code===`Space`&&(t.preventDefault(),De(!0)),(t.key===`Delete`||t.key===`Backspace`)&&!r&&(a.length>0?y():o&&c(o)),(t.ctrlKey||t.metaKey)&&t.key===`d`&&!r&&(t.preventDefault(),b()),t.key.toLowerCase()===`b`&&!r&&(t.preventDefault(),T&&_e===`draw`?A(!1):(A(!0),ve(`draw`))),t.key.toLowerCase()===`e`&&!r&&(t.preventDefault(),T&&_e===`erase`?A(!1):(A(!0),ve(`erase`))),t.key.toLowerCase()===`x`&&!r&&(t.preventDefault(),re()),(t.ctrlKey||t.metaKey)&&t.key===`a`&&!r&&(t.preventDefault(),pe()),(t.ctrlKey||t.metaKey)&&t.key===`c`&&!r&&(t.preventDefault(),de()),(t.ctrlKey||t.metaKey)&&t.key===`v`&&!r&&(t.preventDefault(),fe()),(t.ctrlKey||t.metaKey)&&!t.shiftKey&&t.key===`z`&&!r&&(t.preventDefault(),N()),(t.ctrlKey||t.metaKey)&&t.shiftKey&&t.key===`Z`&&!r&&(t.preventDefault(),P()),(t.ctrlKey||t.metaKey)&&t.key===`y`&&!r&&(t.preventDefault(),P()),(t.ctrlKey||t.metaKey)&&t.key===`0`&&!r&&(t.preventDefault(),tt()),(t.ctrlKey||t.metaKey)&&(t.key===`=`||t.key===`+`)&&!r&&(t.preventDefault(),O(Math.min(100,D+5))),(t.ctrlKey||t.metaKey)&&t.key===`-`&&!r&&(t.preventDefault(),O(Math.max(1,D-5)))},n=e=>{e.code===`Space`&&(De(!1),Oe(!1))};return window.addEventListener(`keydown`,t),window.addEventListener(`keyup`,n),()=>{window.removeEventListener(`keydown`,t),window.removeEventListener(`keyup`,n)}},[a,o,y,c,m,g,b,T,A,re,N,P,pe,de,fe,z,V,e,Ze,Qe,$e,ae,x,B,ge,H,_e,ve,tt,D,O]),(0,R.useEffect)(()=>{let e=e=>{e.preventDefault();let t=W.current;if(!t)return;let n=-e.deltaY*.001,r=Math.min(Math.max(.05,u*(1+n)),20),i=t.getBoundingClientRect(),a=e.clientX-i.left,o=e.clientY-i.top,s=(a-f.x)/u,c=(o-f.y)/u,l=a-s*r,m=o-c*r;d(r),p({x:l,y:m})},t=W.current;return t&&t.addEventListener(`wheel`,e,{passive:!1}),()=>{t&&t.removeEventListener(`wheel`,e)}},[u,f,d,p]);let nt=e=>{if(e.altKey&&e.button===2){Ie.current=!0,Y.current={x:e.clientX,width:D};return}K&&ke(null);let t=W.current.getBoundingClientRect(),r=(e.clientX-t.left-f.x)/u,i=(e.clientY-t.top-f.y)/u;if(Ee){Oe(!0),et.current={startX:e.clientX,startY:e.clientY,initialPanX:f.x,initialPanY:f.y};return}if(T){_e===`erase`?(ae(),J(!0),Pe.current={x:r,y:i},ye({x:r,y:i},null,D/2)):Me([{x:r,y:i}]);return}e.shiftKey||(n(null),s(null)),Ae({x1:r,y1:i,x2:r,y2:i})},rt=(0,R.useRef)(null);(0,R.useLayoutEffect)(()=>{if(!K||!rt.current)return;let e=rt.current.getBoundingClientRect(),t=e.width||190,n=e.height||250,r=K.originalX,i=K.originalY;r+t>window.innerWidth&&(r=window.innerWidth-t-10),i+n>window.innerHeight&&(i=window.innerHeight-n-10),r=Math.max(10,r),i=Math.max(10,i),(r!==K.x||i!==K.y)&&ke({x:r,y:i,originalX:K.originalX,originalY:K.originalY})},[K,a]);let it=e=>{if(e.preventDefault(),e.altKey)return;let t=e.target.closest(`.element-wrapper`)||a.length>0?330:250,n=e.clientX,r=e.clientY;n+190>window.innerWidth&&(n=window.innerWidth-190-10),r+t>window.innerHeight&&(r=window.innerHeight-t-10),n=Math.max(10,n),r=Math.max(10,r),ke({x:n,y:r,originalX:e.clientX,originalY:e.clientY})},at=e=>{if(!K)return;let t=W.current.getBoundingClientRect(),n=K.originalX,r=K.originalY,i=(n-t.left-f.x)/u,a=(r-t.top-f.y)/u;v(e,{x:i-50,y:a-25}),ke(null)},ot=(0,R.useCallback)(e=>{if(Ie.current){let t=e.clientX-Y.current.x;O(Math.max(1,Math.min(100,Math.floor(Y.current.width+t*.2))));return}Fe.current&&(Fe.current.style.left=`${e.clientX}px`,Fe.current.style.top=`${e.clientY}px`);let t=W.current.getBoundingClientRect();if(Ve){if(Ve.type===`horizontal`){let n=(e.clientY-t.top-f.y)/u;le(Ve.id,n)}else{let n=(e.clientX-t.left-f.x)/u;le(Ve.id,n)}return}let n=(e.clientX-t.left-f.x)/u,i=(e.clientY-t.top-f.y)/u;if(Ne){let e={x:n,y:i};ye(e,Pe.current,D/2),Pe.current=e;return}if(je){Me(e=>e?[...e,{x:n,y:i}]:null);return}if(G){p({x:et.current.initialPanX+(e.clientX-et.current.startX),y:et.current.initialPanY+(e.clientY-et.current.startY)});return}if(q){Ae(e=>e?{...e,x2:n,y2:i}:null);return}r&&Te({x:n,y:i})},[r,u,f,G,p,je,q,Ve,le,Ne,D,O,ye]),st=(0,R.useCallback)(t=>{if(Ie.current){Ie.current=!1;return}if(Ve){let e=W.current.getBoundingClientRect(),n=t.clientX-e.left,r=t.clientY-e.top;(Ve.type===`horizontal`&&(r<20||r>e.height)||Ve.type===`vertical`&&(n<20||n>e.width))&&I(Ve.id),He(null);return}if(Ne){J(!1),Pe.current=null;return}if(je&&(k({id:Z(),points:je,color:E,width:D}),Me(null)),G&&Oe(!1),r&&i(null),q){let t=Math.min(q.x1,q.x2),r=Math.max(q.x1,q.x2),i=Math.min(q.y1,q.y2),a=Math.max(q.y1,q.y2);e.filter(e=>!e.parentId).forEach(e=>{e.x>=t&&e.x+e.width<=r&&e.y>=i&&e.y+e.height<=a&&n(e.id,!0)}),Ae(null)}},[je,G,r,q,e,n,k,E,D,i,Ve,I,Ne]);(0,R.useEffect)(()=>(window.addEventListener(`pointermove`,ot),window.addEventListener(`pointerup`,st),()=>{window.removeEventListener(`pointermove`,ot),window.removeEventListener(`pointerup`,st)}),[ot,st]);let[ct,lt]=(0,R.useState)({width:1e3,height:1e3});(0,R.useEffect)(()=>{if(!W.current)return;let e=W.current.getBoundingClientRect();lt({width:e.width,height:e.height});let t=()=>{if(!W.current)return;let e=W.current.getBoundingClientRect();lt({width:e.width,height:e.height})};return window.addEventListener(`resize`,t),()=>window.removeEventListener(`resize`,t)},[]);let ut=(e,t,n)=>{let r=[10,50,100,500,1e3],i=100;for(let e of r)if(e*n>=40){i=e;break}let a=[],o=Math.floor(-t/(i*n))*i,s=Math.ceil((e-t)/(i*n))*i;for(let e=o;e<=s;e+=i){let r=t+e*n;a.push({value:e,pos:r,isMajor:e%(i*5)==0})}return{ticks:a,interval:i}},dt=(e,t)=>{e.stopPropagation();let n=W.current.getBoundingClientRect(),r=Z();t===`horizontal`?(se(`horizontal`,(e.clientY-n.top-f.y)/u,r),He({id:r,type:`horizontal`,isNew:!0})):(se(`vertical`,(e.clientX-n.left-f.x)/u,r),He({id:r,type:`vertical`,isNew:!0}))},ft=(e,t,n)=>{e.stopPropagation(),He({id:t,type:n,isNew:!1})},pt=t=>{let n=e.find(e=>e.id===t);if(!n)return null;let{x:r,y:i}=n,{width:a,height:o}=n;if(n.parentId){let t=e.find(e=>e.id===n?.parentId);t&&(r+=t.x+16,i+=t.y+45+16)}return{x:r,y:i,width:a,height:o,rotation:n.rotation||0}},mt=(e,t,n)=>{let r=n*Math.PI/180,i=Math.cos(r),a=Math.sin(r);return{x:e*i-t*a,y:e*a+t*i}},ht=(e,t,n,r,i,a,o,s)=>{let c=r-e,l=i-t,u=Math.min(Math.max(Math.hypot(c,l)*.35,30),120),d=e,f=t,p=r,m=i;return o?(d+=o.x*u,f+=o.y*u):n===`top`?f-=u:n===`bottom`?f+=u:n===`left`?d-=u:d+=u,s?(p+=s.x*u,m+=s.y*u):a===`top`?m-=u:a===`bottom`?m+=u:a===`left`?p-=u:p+=u,`M ${e} ${t} C ${d} ${f}, ${p} ${m}, ${r} ${i}`},gt=(e,t)=>{let n=e.rotation||0,r=e.x+e.width/2,i=e.y+e.height/2,a=0,o=0,s,c;t===`top`?(o=-e.height/2,s=0,c=-1):t===`bottom`?(o=e.height/2,s=0,c=1):t===`left`?(a=-e.width/2,s=-1,c=0):(a=e.width/2,s=1,c=0);let l=mt(a,o,n),u=mt(s,c,n);return{x:r+l.x,y:i+l.y,nx:u.x,ny:u.y}},_t=24*u;for(;_t<15;)_t*=2;for(;_t>60;)_t/=2;let vt=(0,R.useMemo)(()=>new Map(e.map(e=>[e.id,e])),[e]),yt=(0,R.useMemo)(()=>e.filter(e=>!e.parentId),[e]),xt=(0,R.useMemo)(()=>e.filter(e=>e.type===`node`&&e.isSlide!==!1).sort((e,t)=>e.x-t.x),[e]),St=xt[V];(0,R.useEffect)(()=>{if(xt.length===0){V!==0&&me(0);return}V>xt.length-1&&me(xt.length-1)},[V,xt.length,me]);let Ct=St?Tt(St.id,e).some(e=>!e.animations.every(e=>be.includes(e.id))):!1,Et=V===0,Dt=V>=xt.length-1&&!Ct;return(0,Q.jsxs)(`div`,{className:`canvas-container ${z&&Ue?`laser-cursor-none`:``} ${T&&!Ee?`brush-cursor-none`:``}`,onContextMenu:it,children:[(0,Q.jsx)(`style`,{children:We.map(e=>e.css).join(`
`)}),!z&&(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(`div`,{style:{position:`absolute`,top:0,left:0,width:20,height:20,background:`var(--bg-toolbar)`,borderBottom:`1px solid var(--border-color)`,borderRight:`1px solid var(--border-color)`,zIndex:1002}}),(()=>{let{ticks:e}=ut(ct.width-20,f.x-20,u);return(0,Q.jsx)(`svg`,{style:{position:`absolute`,top:0,left:20,width:`calc(100% - 20px)`,height:20,background:`var(--bg-toolbar)`,borderBottom:`1px solid var(--border-color)`,zIndex:1001,userSelect:`none`,pointerEvents:`auto`,cursor:`row-resize`},onPointerDown:e=>dt(e,`horizontal`),children:e.map((e,t)=>e.pos<0?null:(0,Q.jsxs)(`g`,{children:[(0,Q.jsx)(`line`,{x1:e.pos,y1:e.isMajor?8:12,x2:e.pos,y2:20,stroke:`var(--text-secondary)`,strokeWidth:`1`}),e.isMajor&&(0,Q.jsx)(`text`,{x:e.pos+3,y:3,fontSize:`9`,fill:`var(--text-secondary)`,textAnchor:`start`,dominantBaseline:`hanging`,children:e.value})]},`h-tick-${t}`))})})(),(()=>{let{ticks:e}=ut(ct.height-20,f.y-20,u);return(0,Q.jsx)(`svg`,{style:{position:`absolute`,top:20,left:0,width:20,height:`calc(100% - 20px)`,background:`var(--bg-toolbar)`,borderRight:`1px solid var(--border-color)`,zIndex:1001,userSelect:`none`,pointerEvents:`auto`,cursor:`col-resize`},onPointerDown:e=>dt(e,`vertical`),children:e.map((e,t)=>e.pos<0?null:(0,Q.jsxs)(`g`,{children:[(0,Q.jsx)(`line`,{x1:e.isMajor?8:12,y1:e.pos,x2:20,y2:e.pos,stroke:`var(--text-secondary)`,strokeWidth:`1`}),e.isMajor&&(0,Q.jsx)(`text`,{x:2,y:e.pos+3,fontSize:`9`,fill:`var(--text-secondary)`,transform:`rotate(-90 2 ${e.pos+3})`,textAnchor:`end`,dominantBaseline:`middle`,children:e.value})]},`v-tick-${t}`))})})()]}),(0,Q.jsx)(`div`,{className:`canvas ${Ee?`space-down`:``} ${G?`panning`:``} ${T&&!Ee?_e===`erase`?`eraser-cursor`:`brush-cursor`:``}`,ref:W,onPointerDown:nt,style:{backgroundPosition:`${f.x}px ${f.y}px`,backgroundSize:`${_t}px ${_t}px`},children:(0,Q.jsxs)(`div`,{className:`canvas-content`,style:{transform:`translate(${f.x}px, ${f.y}px) scale(${u})`,transformOrigin:`0 0`,width:`100%`,height:`100%`,position:`absolute`,transition:z?`transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)`:`none`},children:[(0,Q.jsxs)(`svg`,{className:`connections-layer`,style:{overflow:`visible`,zIndex:1,position:`absolute`,pointerEvents:`none`},children:[(0,Q.jsx)(`defs`,{}),t.map(t=>{let n=e.find(e=>e.id===t.fromId),r=e.find(e=>e.id===t.toId);if(!n||!r)return null;let i=pt(t.fromId),a=pt(t.toId);if(!i||!a)return null;let l=gt(i,t.fromPort),u=gt(a,t.toPort),{x:d,y:f}=l,{x:p,y:m}=u,h=xe(t),g=Se(t),_=o===t.id?`#4caf50`:h.color,v=`editor-marker-${t.id}`,y=g.start===`none`?`none`:`url(#${v}-start)`,b=g.end===`none`?`none`:`url(#${v}-end)`,x=Math.max(1.8,g.size*.3);g.start!==`none`&&(d+=l.nx*x,f+=l.ny*x),g.end!==`none`&&(p+=u.nx*x,m+=u.ny*x);let S=p-d,ee=m-f,C=Math.min(Math.max(Math.hypot(S,ee)*.35,30),120),w=d,E=f,te=p,D=m;w+=l.nx*C,E+=l.ny*C,te+=u.nx*C,D+=u.ny*C;let O=.125*d+.375*w+.375*te+.125*p,ne=.125*f+.375*E+.375*D+.125*m,k=h.lineType===`straight`?`M ${d} ${f} L ${p} ${m}`:h.lineType===`elbow`?`M ${d} ${f} L ${d} ${ne} L ${p} ${ne} L ${p} ${m}`:`M ${d} ${f} C ${w} ${E}, ${te} ${D}, ${p} ${m}`,re=(e,t,n)=>e===`circle`?(0,Q.jsx)(`marker`,{id:t,viewBox:`0 0 10 10`,refX:`5`,refY:`5`,markerWidth:g.size,markerHeight:g.size,orient:n,children:(0,Q.jsx)(`circle`,{cx:`5`,cy:`5`,r:`3.2`,fill:_})}):e===`diamond`?(0,Q.jsx)(`marker`,{id:t,viewBox:`0 0 10 10`,refX:`5`,refY:`5`,markerWidth:g.size,markerHeight:g.size,orient:n,children:(0,Q.jsx)(`path`,{d:`M 5 0.8 L 9.2 5 L 5 9.2 L 0.8 5 Z`,fill:_})}):(0,Q.jsx)(`marker`,{id:t,viewBox:`0 0 10 10`,refX:`7`,refY:`5`,markerWidth:g.size,markerHeight:g.size,orient:n,children:(0,Q.jsx)(`path`,{d:e===`triangle`?`M 1 1 L 9 5 L 1 9 Z`:`M 0 1.5 L 10 5 L 0 8.5 Z`,fill:_})}),A=!n.visible||!r.visible;return(0,Q.jsxs)(`g`,{className:`connection-group ${o===t.id?`selected`:``}`,style:{opacity:A?z?0:.4:1,pointerEvents:A||T?`none`:`auto`,transition:`opacity 0.4s ease`},onPointerDown:e=>{e.stopPropagation(),s(t.id)},onDoubleClick:e=>{e.stopPropagation(),c(t.id)},children:[(0,Q.jsxs)(`defs`,{children:[g.start!==`none`&&re(g.start,`${v}-start`,`auto-start-reverse`),g.end!==`none`&&re(g.end,`${v}-end`,`auto`)]}),(0,Q.jsx)(`path`,{id:`editor-conn-${t.id}`,d:k,className:`connection-path`,markerStart:y,markerEnd:b,stroke:_,strokeWidth:h.width,strokeDasharray:U(h.style,h.width),strokeLinecap:`round`,strokeLinejoin:`round`,style:{stroke:_,strokeWidth:h.width}}),(0,Q.jsx)(`path`,{id:`editor-conn-pulse-${t.id}`,d:k,className:`flow-pulse-path`,fill:`none`,stroke:_,strokeWidth:Math.max(2,h.width),strokeLinecap:`round`,opacity:`0.8`}),(0,Q.jsx)(`path`,{d:k,stroke:`transparent`,strokeWidth:`20`,fill:`none`}),t.label&&(t.labelAlignment===`follow`?(0,Q.jsxs)(Q.Fragment,{children:[t.reverseLabelDirection&&(0,Q.jsx)(`path`,{id:`editor-conn-text-${t.id}`,d:`M ${p} ${m} C ${te} ${D}, ${w} ${E}, ${d} ${f}`,fill:`none`,stroke:`none`,pointerEvents:`none`}),(0,Q.jsx)(`text`,{fill:t.color||`var(--text-primary)`,fontSize:t.fontSize||`14`,fontFamily:t.fontFamily,dy:`-5`,pointerEvents:`none`,fontWeight:`bold`,children:(0,Q.jsx)(`textPath`,{href:t.reverseLabelDirection?`#editor-conn-text-${t.id}`:`#editor-conn-${t.id}`,startOffset:`50%`,textAnchor:`middle`,children:t.label})})]}):(0,Q.jsx)(`foreignObject`,{x:O-200,y:ne-20,width:400,height:40,pointerEvents:`none`,children:(0,Q.jsx)(`div`,{style:{display:`flex`,justifyContent:`center`,alignItems:`center`,width:`100%`,height:`100%`,pointerEvents:`none`},children:(0,Q.jsx)(`span`,{style:{background:`var(--bg-canvas)`,padding:`3px 10px`,borderRadius:`100px`,fontSize:`${t.fontSize||12}px`,color:t.color||`var(--text-primary)`,fontWeight:`bold`,whiteSpace:`nowrap`,border:`1px solid var(--border-color)`,boxShadow:`0 2px 8px rgba(0,0,0,0.15)`,fontFamily:t.fontFamily||`inherit`},children:t.label})})}))]},t.id)}),r&&(()=>{let e=pt(r.id);if(!e)return null;let t=gt(e,r.port);return(0,Q.jsx)(`path`,{d:ht(t.x,t.y,r.port,we.x,we.y,`left`,{x:t.nx,y:t.ny}),fill:`none`,stroke:`#4caf50`,strokeWidth:`2`,strokeDasharray:`5,5`})})()]}),yt.map(e=>(0,Q.jsx)(wt,{element:e},e.id)),oe.map(e=>e.type===`horizontal`?(0,Q.jsx)(`div`,{onPointerDown:t=>ft(t,e.id,`horizontal`),style:{position:`absolute`,top:e.position,left:-1e4,right:-1e4,height:`6px`,marginTop:`-3px`,borderTop:`1.5px dashed #ff5252`,cursor:`row-resize`,zIndex:1998,pointerEvents:T?`none`:`auto`}},e.id):(0,Q.jsx)(`div`,{onPointerDown:t=>ft(t,e.id,`vertical`),style:{position:`absolute`,left:e.position,top:-1e4,bottom:-1e4,width:`6px`,marginLeft:`-3px`,borderLeft:`1.5px dashed #ff5252`,cursor:`col-resize`,zIndex:1998,pointerEvents:T?`none`:`auto`}},e.id)),L&&ze.x!==null&&(0,Q.jsx)(`div`,{style:{position:`absolute`,left:ze.x,top:-1e4,bottom:-1e4,width:`1px`,borderLeft:`1px dashed #4caf50`,zIndex:1999,pointerEvents:`none`}}),L&&ze.y!==null&&(0,Q.jsx)(`div`,{style:{position:`absolute`,top:ze.y,left:-1e4,right:-1e4,height:`1px`,borderTop:`1px dashed #4caf50`,zIndex:1999,pointerEvents:`none`}}),(0,Q.jsxs)(`svg`,{className:`brush-layer`,style:{overflow:`visible`,position:`absolute`,zIndex:1e3,pointerEvents:`none`},children:[w.map(e=>{let t=e.attachedNodeId?vt.get(e.attachedNodeId):null,n=t?!t.visible:!1;return(0,Q.jsx)(`path`,{d:e.points.map((e,t)=>`${t===0?`M`:`L`} ${e.x} ${e.y}`).join(` `),fill:`none`,stroke:e.color,strokeWidth:e.width,strokeLinecap:`round`,strokeLinejoin:`round`,opacity:n?z?0:.2:1,style:{transition:`opacity 0.4s ease`}},e.id)}),je&&(0,Q.jsx)(`path`,{d:je.map((e,t)=>`${t===0?`M`:`L`} ${e.x} ${e.y}`).join(` `),fill:`none`,stroke:E,strokeWidth:D,strokeLinecap:`round`,strokeLinejoin:`round`,opacity:`0.6`})]}),q&&(0,Q.jsx)(`div`,{style:{position:`absolute`,left:Math.min(q.x1,q.x2),top:Math.min(q.y1,q.y2),width:Math.abs(q.x2-q.x1),height:Math.abs(q.y2-q.y1),backgroundColor:`rgba(76, 175, 80, 0.1)`,border:`1px solid #4caf50`,pointerEvents:`none`,zIndex:2e3}})]})}),!z&&(0,Q.jsxs)(`div`,{className:`brush-toolbar`,style:{position:`absolute`,top:`20px`,left:`50%`,transform:`translateX(-50%)`,display:`flex`,gap:`10px`,background:`var(--bg-toolbar)`,padding:`10px`,borderRadius:`12px`,border:`1px solid var(--border-color)`,zIndex:1e3,boxShadow:`0 8px 24px rgba(0,0,0,0.5)`,alignItems:`center`},children:[(0,Q.jsx)(`button`,{className:`btn ${T&&_e===`draw`?`primary`:``}`,onClick:()=>{T&&_e===`draw`?A(!1):(A(!0),ve(`draw`))},title:`Brush Tool (B)`,children:(0,Q.jsx)(C,{size:18})}),(0,Q.jsx)(`button`,{className:`btn ${T&&_e===`erase`?`primary`:``}`,onClick:()=>{T&&_e===`erase`?A(!1):(A(!0),ve(`erase`))},title:`Eraser Tool (E)`,children:(0,Q.jsx)(h,{size:18})}),(0,Q.jsx)(`button`,{className:`btn`,onClick:re,title:`Clear All Drawings (X)`,children:(0,Q.jsx)(j,{size:18})}),(0,Q.jsx)(`div`,{style:{width:`1px`,background:`var(--border-color)`,margin:`0 5px`}}),(0,Q.jsx)(`button`,{className:`btn`,onClick:N,title:`Undo (Ctrl/⌘+Z)`,children:(0,Q.jsx)(S,{size:18})}),(0,Q.jsx)(`button`,{className:`btn`,onClick:P,title:`Redo (Ctrl/⌘+Shift+Z)`,children:(0,Q.jsx)(te,{size:18})}),(0,Q.jsx)(`div`,{style:{width:`1px`,background:`var(--border-color)`,margin:`0 5px`}}),(0,Q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`6px`,padding:`0 4px`},children:[(0,Q.jsx)(`span`,{style:{fontSize:`11px`,color:`var(--text-secondary)`,userSelect:`none`},children:`Size:`}),(0,Q.jsx)(`input`,{type:`range`,min:`1`,max:`100`,value:D,onChange:e=>O(parseInt(e.target.value)),style:{width:`60px`,cursor:`pointer`,height:`4px`,background:`var(--border-color)`,borderRadius:`2px`,outline:`none`},title:`Brush Size: ${D}px`}),(0,Q.jsx)(`span`,{style:{fontSize:`11px`,color:`var(--text-secondary)`,minWidth:`16px`,textAlign:`right`,userSelect:`none`},children:D})]}),(0,Q.jsx)(`div`,{style:{width:`1px`,background:`var(--border-color)`,margin:`0 5px`}}),(0,Q.jsx)(`div`,{className:`color-picker-wrapper`,children:(0,Q.jsx)(`input`,{type:`color`,value:E,onChange:e=>ie(e.target.value)})})]}),K&&!z&&(0,Q.jsxs)(`div`,{ref:rt,className:`context-menu`,style:{left:K.x,top:K.y},children:[(0,Q.jsxs)(`div`,{className:`context-menu-item`,onClick:()=>at(`node`),children:[(0,Q.jsx)(_,{size:14}),` Add Node`]}),(0,Q.jsx)(`div`,{className:`context-menu-separator`}),(0,Q.jsxs)(`div`,{className:`context-menu-item`,onClick:()=>at(`text`),children:[(0,Q.jsx)(ee,{size:14}),` Add Text`]}),(0,Q.jsxs)(`div`,{className:`context-menu-item`,onClick:()=>at(`button`),children:[(0,Q.jsx)(ce,{size:14}),` Add Button`]}),(0,Q.jsxs)(`div`,{className:`context-menu-item`,onClick:()=>at(`image`),children:[(0,Q.jsx)(ne,{size:14}),` Add Image`]}),(0,Q.jsxs)(`div`,{className:`context-menu-item`,onClick:()=>at(`video`),children:[(0,Q.jsx)(ue,{size:14}),` Add Video`]}),(0,Q.jsxs)(`div`,{className:`context-menu-item`,onClick:()=>at(`icon`),children:[(0,Q.jsx)(M,{size:14}),` Add Icon`]}),a.length>0&&(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(`div`,{className:`context-menu-separator`}),(0,Q.jsxs)(`div`,{className:`context-menu-item`,onClick:()=>{b(),ke(null)},children:[(0,Q.jsx)(l,{size:14}),` Duplicate Selected`]}),(0,Q.jsxs)(`div`,{className:`context-menu-item`,onClick:()=>{y(),ke(null)},style:{color:`#ef5350`},children:[(0,Q.jsx)(j,{size:14}),` Delete Selected`]})]})]}),!z&&(0,Q.jsxs)(`div`,{className:`zoom-controls`,children:[(0,Q.jsxs)(`span`,{children:[Math.round(u*100),`%`]}),(0,Q.jsx)(`button`,{onClick:tt,className:`btn-fit`,title:`Fit in view (Ctrl/⌘+0)`,children:`Fit`})]}),z&&(0,Q.jsxs)(`div`,{style:{position:`fixed`,bottom:`24px`,left:`50%`,transform:`translateX(-50%)`,background:`var(--bg-toolbar)`,border:`1px solid var(--border-color)`,borderRadius:`24px`,padding:`8px 24px`,display:`flex`,alignItems:`center`,gap:`20px`,zIndex:1e4,boxShadow:`0 12px 32px rgba(0,0,0,0.6)`,color:`var(--text-primary)`},children:[(0,Q.jsx)(`button`,{className:`btn`,onClick:$e,disabled:Et,tabIndex:-1,style:{padding:`6px 12px`,opacity:Et?.4:1,background:`var(--btn-bg)`,color:`var(--text-primary)`,border:`none`,borderRadius:`12px`,cursor:`pointer`},children:`← Prev`}),(0,Q.jsx)(`select`,{value:V,onChange:e=>Ze(parseInt(e.target.value)),style:{background:`var(--input-bg)`,color:`var(--text-primary)`,border:`1px solid var(--border-color)`,borderRadius:`8px`,padding:`4px 8px`,fontSize:`13px`,fontWeight:600,cursor:`pointer`,outline:`none`},children:xt.map((e,t)=>(0,Q.jsxs)(`option`,{value:t,children:[`Slide `,t+1,`: `,e.name||`Node ${t+1}`]},e.id))}),(0,Q.jsx)(`button`,{className:`btn`,onClick:Qe,disabled:Dt,tabIndex:-1,style:{padding:`6px 12px`,opacity:Dt?.4:1,background:`var(--btn-bg)`,color:`var(--text-primary)`,border:`none`,borderRadius:`12px`,cursor:`pointer`},children:`Next →`}),(0,Q.jsx)(`div`,{style:{width:`1px`,background:`var(--border-color)`,height:`20px`}}),(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>Xe(e=>!e),disabled:!St?.speakerNotes,tabIndex:-1,style:{padding:`6px 12px`,opacity:St?.speakerNotes?1:.45,background:`var(--btn-bg)`,color:`var(--text-primary)`,border:`none`,borderRadius:`12px`,cursor:St?.speakerNotes?`pointer`:`default`},children:`Notes`}),(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>B(!1),tabIndex:-1,style:{padding:`6px 16px`,background:`#ef5350`,color:`#fff`,border:`none`,borderRadius:`12px`,cursor:`pointer`,fontWeight:600},children:`Exit`})]}),z&&Ye&&St?.speakerNotes&&(0,Q.jsxs)(`div`,{className:`speaker-notes-panel`,children:[(0,Q.jsxs)(`div`,{className:`speaker-notes-header`,children:[(0,Q.jsx)(`span`,{children:`Speaker Notes`}),(0,Q.jsx)(`button`,{onClick:()=>Xe(!1),tabIndex:-1,children:`×`})]}),(0,Q.jsx)(`pre`,{children:St.speakerNotes})]}),Ue&&(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(`svg`,{style:{position:`fixed`,top:0,left:0,width:`100vw`,height:`100vh`,pointerEvents:`none`,zIndex:1e5,overflow:`visible`},children:qe.map((e,t)=>{if(t===0)return null;let n=qe[t-1],r=t/qe.length,i=r*.8,a=r*8+2;return(0,Q.jsx)(`line`,{x1:n.x,y1:n.y,x2:e.x,y2:e.y,stroke:`#ff1744`,strokeWidth:a,strokeLinecap:`round`,opacity:i,style:{filter:`drop-shadow(0 0 4px #ff1744)`}},`laser-seg-${t}`)})}),(0,Q.jsx)(`div`,{className:`laser-pointer`,style:{position:`fixed`,left:X.x,top:X.y,pointerEvents:`none`,zIndex:100001}})]}),ge&&(0,Q.jsx)(`div`,{className:`help-modal-overlay`,onClick:()=>H(!1),children:(0,Q.jsxs)(`div`,{className:`help-modal-content`,onClick:e=>e.stopPropagation(),children:[(0,Q.jsxs)(`div`,{className:`help-modal-header`,children:[(0,Q.jsx)(`h2`,{children:`Keyboard Shortcuts`}),(0,Q.jsx)(`button`,{className:`help-close-btn`,onClick:()=>H(!1),children:(0,Q.jsx)(F,{size:18})})]}),(0,Q.jsxs)(`div`,{className:`help-modal-body`,children:[(0,Q.jsxs)(`div`,{className:`shortcut-section`,children:[(0,Q.jsx)(`h3`,{children:`General Editing`}),(0,Q.jsxs)(`div`,{className:`shortcut-grid`,children:[(0,Q.jsxs)(`div`,{className:`shortcut-row`,children:[(0,Q.jsxs)(`span`,{className:`shortcut-keys`,children:[(0,Q.jsx)(`kbd`,{children:`Ctrl/⌘`}),` + `,(0,Q.jsx)(`kbd`,{children:`C`}),` / `,(0,Q.jsx)(`kbd`,{children:`V`})]}),(0,Q.jsx)(`span`,{className:`shortcut-desc`,children:`Copy / Paste selected`})]}),(0,Q.jsxs)(`div`,{className:`shortcut-row`,children:[(0,Q.jsxs)(`span`,{className:`shortcut-keys`,children:[(0,Q.jsx)(`kbd`,{children:`Ctrl/⌘`}),` + `,(0,Q.jsx)(`kbd`,{children:`D`})]}),(0,Q.jsx)(`span`,{className:`shortcut-desc`,children:`Duplicate selected`})]}),(0,Q.jsxs)(`div`,{className:`shortcut-row`,children:[(0,Q.jsxs)(`span`,{className:`shortcut-keys`,children:[(0,Q.jsx)(`kbd`,{children:`Delete`}),` / `,(0,Q.jsx)(`kbd`,{children:`Backspace`})]}),(0,Q.jsx)(`span`,{className:`shortcut-desc`,children:`Delete selected element / connection`})]}),(0,Q.jsxs)(`div`,{className:`shortcut-row`,children:[(0,Q.jsxs)(`span`,{className:`shortcut-keys`,children:[(0,Q.jsx)(`kbd`,{children:`Ctrl/⌘`}),` + `,(0,Q.jsx)(`kbd`,{children:`A`})]}),(0,Q.jsx)(`span`,{className:`shortcut-desc`,children:`Select all elements`})]}),(0,Q.jsxs)(`div`,{className:`shortcut-row`,children:[(0,Q.jsxs)(`span`,{className:`shortcut-keys`,children:[(0,Q.jsx)(`kbd`,{children:`Ctrl/⌘`}),` + `,(0,Q.jsx)(`kbd`,{children:`Z`}),` / `,(0,Q.jsx)(`kbd`,{children:`Y`})]}),(0,Q.jsx)(`span`,{className:`shortcut-desc`,children:`Undo / Redo`})]}),(0,Q.jsxs)(`div`,{className:`shortcut-row`,children:[(0,Q.jsxs)(`span`,{className:`shortcut-keys`,children:[(0,Q.jsx)(`kbd`,{children:`Shift`}),` + Drag`]}),(0,Q.jsx)(`span`,{className:`shortcut-desc`,children:`Lock drag axis (horizontal/vertical)`})]})]})]}),(0,Q.jsxs)(`div`,{className:`shortcut-section`,children:[(0,Q.jsx)(`h3`,{children:`Tools & View`}),(0,Q.jsxs)(`div`,{className:`shortcut-grid`,children:[(0,Q.jsxs)(`div`,{className:`shortcut-row`,children:[(0,Q.jsx)(`span`,{className:`shortcut-keys`,children:(0,Q.jsx)(`kbd`,{children:`B`})}),(0,Q.jsx)(`span`,{className:`shortcut-desc`,children:`Toggle brush tool`})]}),(0,Q.jsxs)(`div`,{className:`shortcut-row`,children:[(0,Q.jsx)(`span`,{className:`shortcut-keys`,children:(0,Q.jsx)(`kbd`,{children:`E`})}),(0,Q.jsx)(`span`,{className:`shortcut-desc`,children:`Toggle eraser tool`})]}),(0,Q.jsxs)(`div`,{className:`shortcut-row`,children:[(0,Q.jsx)(`span`,{className:`shortcut-keys`,children:(0,Q.jsx)(`kbd`,{children:`X`})}),(0,Q.jsx)(`span`,{className:`shortcut-desc`,children:`Clear all drawings`})]}),(0,Q.jsxs)(`div`,{className:`shortcut-row`,children:[(0,Q.jsxs)(`span`,{className:`shortcut-keys`,children:[(0,Q.jsx)(`kbd`,{children:`Space`}),` + Drag`]}),(0,Q.jsx)(`span`,{className:`shortcut-desc`,children:`Pan canvas`})]}),(0,Q.jsxs)(`div`,{className:`shortcut-row`,children:[(0,Q.jsx)(`span`,{className:`shortcut-keys`,children:(0,Q.jsx)(`kbd`,{children:`Scroll Wheel`})}),(0,Q.jsx)(`span`,{className:`shortcut-desc`,children:`Zoom in / out`})]}),(0,Q.jsxs)(`div`,{className:`shortcut-row`,children:[(0,Q.jsxs)(`span`,{className:`shortcut-keys`,children:[(0,Q.jsx)(`kbd`,{children:`Ctrl/⌘`}),` + `,(0,Q.jsx)(`kbd`,{children:`0`})]}),(0,Q.jsx)(`span`,{className:`shortcut-desc`,children:`Fit in view`})]}),(0,Q.jsxs)(`div`,{className:`shortcut-row`,children:[(0,Q.jsxs)(`span`,{className:`shortcut-keys`,children:[(0,Q.jsx)(`kbd`,{children:`H`}),` / `,(0,Q.jsx)(`kbd`,{children:`?`})]}),(0,Q.jsx)(`span`,{className:`shortcut-desc`,children:`Toggle this Help shortcuts menu`})]})]})]}),(0,Q.jsxs)(`div`,{className:`shortcut-section`,children:[(0,Q.jsx)(`h3`,{children:`Presentation Mode`}),(0,Q.jsxs)(`div`,{className:`shortcut-grid`,children:[(0,Q.jsxs)(`div`,{className:`shortcut-row`,children:[(0,Q.jsxs)(`span`,{className:`shortcut-keys`,children:[(0,Q.jsx)(`kbd`,{children:`Space`}),` / `,(0,Q.jsx)(`kbd`,{children:`Enter`}),` / `,(0,Q.jsx)(`kbd`,{children:`→`})]}),(0,Q.jsx)(`span`,{className:`shortcut-desc`,children:`Next slide`})]}),(0,Q.jsxs)(`div`,{className:`shortcut-row`,children:[(0,Q.jsxs)(`span`,{className:`shortcut-keys`,children:[(0,Q.jsx)(`kbd`,{children:`Shift`}),` + `,(0,Q.jsx)(`kbd`,{children:`Space`}),` / `,(0,Q.jsx)(`kbd`,{children:`←`})]}),(0,Q.jsx)(`span`,{className:`shortcut-desc`,children:`Previous slide`})]}),(0,Q.jsxs)(`div`,{className:`shortcut-row`,children:[(0,Q.jsx)(`span`,{className:`shortcut-keys`,children:(0,Q.jsx)(`kbd`,{children:`L`})}),(0,Q.jsx)(`span`,{className:`shortcut-desc`,children:`Toggle laser pointer cursor`})]}),(0,Q.jsxs)(`div`,{className:`shortcut-row`,children:[(0,Q.jsx)(`span`,{className:`shortcut-keys`,children:(0,Q.jsx)(`kbd`,{children:`Escape`})}),(0,Q.jsx)(`span`,{className:`shortcut-desc`,children:`Exit slideshow`})]})]})]})]})]})}),T&&!Ee&&(0,Q.jsx)(`div`,{ref:Fe,className:`brush-custom-cursor`,style:{left:`-100px`,top:`-100px`},children:(0,Q.jsx)(`div`,{className:`brush-custom-cursor-circle`,style:{width:`${D*u}px`,height:`${D*u}px`}})})]})},Dt=({label:e,name:t,value:n,onChange:r,onTransparent:i})=>{let{saveHistory:a}=bt(),[o,s]=(0,R.useState)(!1),[c,l]=(0,R.useState)(n),u=(0,R.useRef)(null),d=(0,R.useRef)(null),f=(0,R.useRef)(n),[p,m]=(0,R.useState)({top:0,left:0});(0,R.useEffect)(()=>{let e=e=>{u.current&&!u.current.contains(e.target)&&d.current&&!d.current.contains(e.target)&&s(!1)};return o&&document.addEventListener(`mousedown`,e),()=>{document.removeEventListener(`mousedown`,e)}},[o]),(0,R.useEffect)(()=>{l(n)},[n]),(0,R.useEffect)(()=>{if(o&&d.current){let e=d.current.getBoundingClientRect(),t=e.bottom+8,n=e.right-220;t+340>window.innerHeight&&(t=e.top-340-8),n<8&&(n=8),n+220>window.innerWidth&&(n=window.innerWidth-220-8),m({top:t,left:n})}},[o]);let h=()=>{a(),f.current=n,s(!0)},g=e=>{let n=e.hex+(e.rgb.a!==void 0&&e.rgb.a!==1?Math.round(e.rgb.a*255).toString(16).padStart(2,`0`):``);l(n),r({target:{name:t,value:n}})},_=()=>{r({target:{name:t,value:f.current}}),s(!1)},v=()=>{s(!1)},y=n===`transparent`||n===``;return(0,Q.jsxs)(`div`,{ref:d,style:{display:`flex`,alignItems:`center`,gap:`8px`,marginBottom:`6px`},children:[(0,Q.jsx)(`div`,{style:{width:`45px`,fontSize:`11px`,color:`#8c8d9c`,fontWeight:500},children:e}),(0,Q.jsxs)(`div`,{style:{position:`relative`,flex:1,display:`flex`,alignItems:`center`,gap:`6px`},children:[(0,Q.jsx)(`div`,{onClick:h,onMouseDown:e=>e.preventDefault(),style:{width:`24px`,height:`24px`,borderRadius:`6px`,background:y?`repeating-conic-gradient(#3a3c50 0% 25%, transparent 0% 50%) 50% / 8px 8px`:n,border:`2px solid #2d2e3e`,cursor:`pointer`,flexShrink:0,boxShadow:`inset 0 0 0 1px rgba(255,255,255,0.1)`},title:`Choose Color`}),(0,Q.jsx)(`input`,{type:`text`,value:y?`transparent`:n,onChange:r,name:t,style:{flex:1,padding:`6px 8px`,fontSize:`11px`,fontFamily:`"Fira Code", monospace`,background:`rgba(20, 21, 31, 0.6)`,border:`1px solid #2d2e3e`,borderRadius:`6px`,color:`#e0e0e0`,outline:`none`,minWidth:0,transition:`all 0.2s`},onFocus:e=>e.target.style.borderColor=`#4caf50`,onBlur:e=>e.target.style.borderColor=`#2d2e3e`,placeholder:`#hex or transparent`}),(0,Q.jsx)(`button`,{onClick:i,onMouseDown:e=>e.preventDefault(),title:`Set to Transparent`,style:{width:`24px`,height:`24px`,borderRadius:`6px`,border:`1px solid #3a3c50`,background:`rgba(36, 37, 51, 0.8)`,cursor:`pointer`,flexShrink:0,display:`flex`,alignItems:`center`,justifyContent:`center`,color:`#8c8d9c`,padding:0,transition:`all 0.2s`},onMouseEnter:e=>e.currentTarget.style.color=`#ef5350`,onMouseLeave:e=>e.currentTarget.style.color=`#8c8d9c`,children:(0,Q.jsxs)(`svg`,{width:`12`,height:`12`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,Q.jsx)(`circle`,{cx:`12`,cy:`12`,r:`10`}),(0,Q.jsx)(`line`,{x1:`4.93`,y1:`4.93`,x2:`19.07`,y2:`19.07`})]})})]}),o&&(0,xt.createPortal)((0,Q.jsx)(`div`,{ref:u,style:{position:`fixed`,top:p.top,left:p.left,zIndex:99999,filter:`drop-shadow(0 12px 32px rgba(0,0,0,0.8))`},children:(0,Q.jsxs)(`div`,{style:{background:`#1e1f2e`,border:`1px solid #3a3c50`,borderRadius:`8px`,overflow:`hidden`},children:[(0,Q.jsx)(L,{color:c,onChange:g,disableAlpha:!1,presetColors:[`#242533`,`#4caf50`,`#ef5350`,`#42a5f5`,`#ab47bc`,`#e0e0e0`,`#1a1b26`],styles:{default:{picker:{background:`#1e1f2e`,border:`none`,boxShadow:`none`}}}}),(0,Q.jsxs)(`div`,{style:{padding:`10px 14px`,background:`#1a1b26`,borderTop:`1px solid #2d2e3e`,display:`flex`,justifyContent:`flex-end`,gap:`8px`},children:[(0,Q.jsx)(`button`,{onClick:_,style:{padding:`6px 12px`,background:`transparent`,border:`1px solid #3a3c50`,color:`#8c8d9c`,borderRadius:`6px`,fontSize:`12px`,cursor:`pointer`,fontWeight:600},children:`Cancel`}),(0,Q.jsx)(`button`,{onClick:v,style:{padding:`6px 16px`,background:`#4caf50`,border:`none`,color:`#fff`,borderRadius:`6px`,fontSize:`12px`,cursor:`pointer`,fontWeight:600,boxShadow:`0 2px 8px rgba(76, 175, 80, 0.4)`},children:`OK`})]})]})}),document.body)]})},Ot=({element:e,onChange:t})=>{let n=e.fill||{type:`none`,color:`transparent`},r=e=>{t(e===`none`?{fill:{type:`none`,color:`transparent`}}:e===`solid`?{fill:{type:`solid`,color:n.color===`transparent`?`#4caf50`:n.color}}:{fill:{type:`gradient`,color:n.color||`#4caf50`,gradient:{type:`linear`,angle:90,stops:[{offset:0,color:n.color||`#4caf50`},{offset:1,color:`#ffffff`}]}}})},i=e=>{t({fill:{...n,color:e.target.value}})},a=()=>{t({fill:{type:`none`,color:`transparent`}})},o=(e,r)=>{if(!n.gradient)return;let i=[...n.gradient.stops];i[e]={...i[e],color:r},t({fill:{...n,gradient:{...n.gradient,stops:i}}})},s=e=>{n.gradient&&t({fill:{...n,gradient:{...n.gradient,type:e}}})},c=e=>{n.gradient&&t({fill:{...n,gradient:{...n.gradient,angle:e}}})};return(0,Q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`},children:[(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`4px`},children:[(0,Q.jsx)(`button`,{onClick:()=>r(`none`),className:`btn ${n.type===`none`?`primary`:``}`,style:{flex:1,fontSize:`11px`,padding:`6px`},children:`None`}),(0,Q.jsx)(`button`,{onClick:()=>r(`solid`),className:`btn ${n.type===`solid`?`primary`:``}`,style:{flex:1,fontSize:`11px`,padding:`6px`},children:`Solid`}),(0,Q.jsx)(`button`,{onClick:()=>r(`gradient`),className:`btn ${n.type===`gradient`?`primary`:``}`,style:{flex:1,fontSize:`11px`,padding:`6px`},children:`Gradient`})]}),n.type===`solid`&&(0,Q.jsx)(Dt,{label:`Color`,name:`color`,value:n.color,onChange:i,onTransparent:a}),n.type===`gradient`&&n.gradient&&(0,Q.jsxs)(`div`,{style:{background:`rgba(0,0,0,0.15)`,padding:`10px`,borderRadius:`8px`,border:`1px solid var(--border-color)`,display:`flex`,flexDirection:`column`,gap:`8px`},children:[(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,alignItems:`center`},children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,width:`45px`},children:`Type`}),(0,Q.jsxs)(`select`,{value:n.gradient.type,onChange:e=>s(e.target.value),style:{flex:1,padding:`4px`},children:[(0,Q.jsx)(`option`,{value:`linear`,children:`Linear`}),(0,Q.jsx)(`option`,{value:`radial`,children:`Radial`})]})]}),n.gradient.type===`linear`&&(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,alignItems:`center`},children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,width:`45px`},children:`Angle`}),(0,Q.jsx)(`input`,{type:`number`,value:n.gradient.angle,onChange:e=>c(parseInt(e.target.value)||0),style:{flex:1,padding:`4px`},min:0,max:360}),(0,Q.jsx)(`span`,{style:{fontSize:`11px`,color:`var(--text-secondary)`},children:`°`})]}),(0,Q.jsxs)(`div`,{style:{marginTop:`4px`},children:[(0,Q.jsx)(`div`,{style:{fontSize:`10px`,color:`#8c8d9c`,marginBottom:`6px`,fontWeight:600,textTransform:`uppercase`},children:`Gradient Stops`}),(0,Q.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`6px`},children:n.gradient.stops.map((e,t)=>(0,Q.jsx)(Dt,{label:`Stop ${t+1}`,name:`stop-${t}`,value:e.color,onChange:e=>o(t,e.target.value),onTransparent:()=>o(t,`transparent`)},t))})]})]})]})},kt=({element:e,onChange:t})=>{let n=e.stroke||{width:0,color:`transparent`,style:`solid`,radius:0,cap:`round`,join:`round`},r=(e,r)=>{t({stroke:{...n,[e]:r}})},i=[`line`,`arrow`,`elbow`].includes(e.shapeType||``);return(0,Q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`},children:[(0,Q.jsx)(Dt,{label:`Color`,name:`strokeColor`,value:n.color,onChange:e=>r(`color`,e.target.value),onTransparent:()=>r(`color`,`transparent`)}),(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`8px`},children:[(0,Q.jsxs)(`div`,{style:{flex:1},children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,marginBottom:`4px`,fontWeight:600},children:`Width`}),(0,Q.jsx)(`input`,{type:`number`,value:n.width,onChange:e=>r(`width`,Math.max(0,parseInt(e.target.value)||0)),style:{width:`100%`},min:0})]}),(0,Q.jsxs)(`div`,{style:{flex:1},children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,marginBottom:`4px`,fontWeight:600},children:`Style`}),(0,Q.jsxs)(`select`,{value:n.style,onChange:e=>r(`style`,e.target.value),style:{width:`100%`,padding:`4px`},children:[(0,Q.jsx)(`option`,{value:`solid`,children:`Solid`}),(0,Q.jsx)(`option`,{value:`dashed`,children:`Dashed`}),(0,Q.jsx)(`option`,{value:`dotted`,children:`Dotted`})]})]})]}),!i&&(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,alignItems:`center`,marginTop:`4px`},children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,width:`70px`,fontWeight:600},children:`Corner Radius`}),(0,Q.jsx)(`input`,{type:`number`,value:n.radius,onChange:e=>r(`radius`,Math.max(0,parseInt(e.target.value)||0)),style:{flex:1},min:0})]})]})},At=({element:e,onChange:t})=>{let n=e.shadow||ge,r=(e,r)=>{t({shadow:{...n,[e]:r}})};return(0,Q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`6px`},children:[(0,Q.jsx)(({label:e,checked:t,onToggle:n})=>(0,Q.jsxs)(`div`,{onClick:()=>n(!t),style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,padding:`4px 0`,cursor:`pointer`,marginBottom:`8px`},children:[(0,Q.jsx)(`span`,{style:{fontSize:`12px`,color:t?`var(--text-primary)`:`var(--text-secondary)`,fontWeight:t?600:400},children:e}),(0,Q.jsx)(`div`,{style:{width:`32px`,height:`18px`,borderRadius:`9px`,position:`relative`,backgroundColor:t?`#e91e63`:`rgba(128,128,128,0.25)`,transition:`background-color 0.2s`},children:(0,Q.jsx)(`div`,{style:{width:`14px`,height:`14px`,borderRadius:`50%`,backgroundColor:`#fff`,position:`absolute`,top:`2px`,left:t?`16px`:`2px`,transition:`left 0.2s`}})})]}),{label:`Enable Drop Shadow`,checked:n.enabled,onToggle:e=>r(`enabled`,e)}),n.enabled&&(0,Q.jsxs)(`div`,{style:{background:`rgba(0,0,0,0.15)`,padding:`10px`,borderRadius:`8px`,border:`1px solid var(--border-color)`,display:`flex`,flexDirection:`column`,gap:`8px`},children:[(0,Q.jsx)(Dt,{label:`Color`,name:`shadowColor`,value:n.color,onChange:e=>r(`color`,e.target.value),onTransparent:()=>r(`color`,`transparent`)}),(0,Q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:`8px`},children:[(0,Q.jsxs)(`div`,{children:[(0,Q.jsx)(`div`,{style:{fontSize:`10px`,color:`#8c8d9c`,marginBottom:`2px`},children:`Offset X`}),(0,Q.jsx)(`input`,{type:`number`,value:n.offsetX,onChange:e=>r(`offsetX`,parseInt(e.target.value)||0),style:{width:`100%`}})]}),(0,Q.jsxs)(`div`,{children:[(0,Q.jsx)(`div`,{style:{fontSize:`10px`,color:`#8c8d9c`,marginBottom:`2px`},children:`Offset Y`}),(0,Q.jsx)(`input`,{type:`number`,value:n.offsetY,onChange:e=>r(`offsetY`,parseInt(e.target.value)||0),style:{width:`100%`}})]}),(0,Q.jsxs)(`div`,{children:[(0,Q.jsx)(`div`,{style:{fontSize:`10px`,color:`#8c8d9c`,marginBottom:`2px`},children:`Blur`}),(0,Q.jsx)(`input`,{type:`number`,value:n.blur,onChange:e=>r(`blur`,Math.max(0,parseInt(e.target.value)||0)),style:{width:`100%`},min:0})]}),(0,Q.jsxs)(`div`,{children:[(0,Q.jsx)(`div`,{style:{fontSize:`10px`,color:`#8c8d9c`,marginBottom:`2px`},children:`Spread`}),(0,Q.jsx)(`input`,{type:`number`,value:n.spread,onChange:e=>r(`spread`,parseInt(e.target.value)||0),style:{width:`100%`}})]})]})]})]})},jt=({element:e,onChange:n})=>{let r=e.text||{content:``,fontFamily:`'Google Sans Text'`,fontSize:16,fontWeight:400,fontStyle:`normal`,textDecoration:`none`,color:`var(--text-primary)`,align:`center`,verticalAlign:`middle`,lineHeight:1.5,letterSpacing:0,padding:{top:10,right:14,bottom:10,left:14}},i=(e,t)=>{n({text:{...r,[e]:t}})},a=(e,t)=>{n({text:{...r,padding:{...r.padding,[e]:t}}})},o=e=>{if(e.trim()===``)return null;let t=Number(e);return Number.isFinite(t)?t:null},s=(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(`option`,{value:`sans-serif`,children:`Sans-Serif`}),(0,Q.jsx)(`option`,{value:`'Google Sans Display'`,children:`Google Sans Display`}),(0,Q.jsx)(`option`,{value:`'Google Sans Flex'`,children:`Google Sans Flex`}),(0,Q.jsx)(`option`,{value:`'Google Sans Text'`,children:`Google Sans Text`}),(0,Q.jsx)(`option`,{value:`'Lexend Deca'`,children:`Lexend Deca`}),(0,Q.jsx)(`option`,{value:`serif`,children:`Serif`}),(0,Q.jsx)(`option`,{value:`monospace`,children:`Monospace`}),(0,Q.jsx)(`option`,{value:`Arial`,children:`Arial`}),(0,Q.jsx)(`option`,{value:`Georgia`,children:`Georgia`}),(0,Q.jsx)(`option`,{value:`Verdana`,children:`Verdana`})]});return(0,Q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`},children:[(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`8px`},children:[(0,Q.jsxs)(`div`,{style:{flex:2},children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,marginBottom:`4px`,fontWeight:600},children:`Font Family`}),(0,Q.jsx)(`select`,{value:r.fontFamily,onChange:e=>i(`fontFamily`,e.target.value),style:{width:`100%`,padding:`4px`},children:s})]}),(0,Q.jsxs)(`div`,{style:{flex:1},children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,marginBottom:`4px`,fontWeight:600},children:`Size`}),(0,Q.jsx)(`input`,{type:`number`,value:r.fontSize,onChange:e=>{let t=o(e.target.value);t!==null&&i(`fontSize`,Math.round(t))},onBlur:e=>{let t=o(e.target.value);i(`fontSize`,t===null||t<6?12:Math.round(t))},style:{width:`100%`},min:6})]})]}),(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`6px`,marginTop:`4px`},children:[(0,Q.jsx)(`button`,{onClick:()=>i(`fontWeight`,r.fontWeight===700?400:700),className:`btn`,style:{flex:1,padding:`6px`,background:r.fontWeight===700?`var(--btn-hover-bg)`:`transparent`,border:`1px solid var(--border-color)`,color:r.fontWeight===700?`#fff`:`var(--text-secondary)`},title:`Bold`,children:(0,Q.jsx)(b,{size:14,style:{margin:`0 auto`}})}),(0,Q.jsx)(`button`,{onClick:()=>i(`fontStyle`,r.fontStyle===`italic`?`normal`:`italic`),className:`btn`,style:{flex:1,padding:`6px`,background:r.fontStyle===`italic`?`var(--btn-hover-bg)`:`transparent`,border:`1px solid var(--border-color)`,color:r.fontStyle===`italic`?`#fff`:`var(--text-secondary)`},title:`Italic`,children:(0,Q.jsx)(t,{size:14,style:{margin:`0 auto`}})}),(0,Q.jsx)(`button`,{onClick:()=>i(`textDecoration`,r.textDecoration===`underline`?`none`:`underline`),className:`btn`,style:{flex:1,padding:`6px`,background:r.textDecoration===`underline`?`var(--btn-hover-bg)`:`transparent`,border:`1px solid var(--border-color)`,color:r.textDecoration===`underline`?`#fff`:`var(--text-secondary)`},title:`Underline`,children:(0,Q.jsx)(O,{size:14,style:{margin:`0 auto`}})})]}),(0,Q.jsxs)(`div`,{children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,marginBottom:`4px`,fontWeight:600},children:`Horizontal Align`}),(0,Q.jsx)(`div`,{style:{display:`flex`,gap:`4px`,background:`rgba(0,0,0,0.2)`,padding:`4px`,borderRadius:`8px`,border:`1px solid var(--border-color)`},children:[`left`,`center`,`right`,`justify`].map(e=>{let t=e===`left`?ae:e===`center`?oe:e===`right`?re:w;return(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>i(`align`,e),style:{flex:1,padding:`6px`,background:r.align===e?`#4caf50`:`transparent`,color:r.align===e?`#fff`:`var(--text-secondary)`,border:`none`,borderRadius:`4px`},children:(0,Q.jsx)(t,{size:14,style:{margin:`0 auto`}})},e)})})]}),(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,alignItems:`center`,marginTop:`4px`},children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,width:`75px`,fontWeight:600},children:`Vertical Align`}),(0,Q.jsxs)(`select`,{value:r.verticalAlign,onChange:e=>i(`verticalAlign`,e.target.value),style:{flex:1,padding:`4px`},children:[(0,Q.jsx)(`option`,{value:`top`,children:`Top`}),(0,Q.jsx)(`option`,{value:`middle`,children:`Middle`}),(0,Q.jsx)(`option`,{value:`bottom`,children:`Bottom`})]})]}),(0,Q.jsx)(`div`,{style:{marginTop:`4px`},children:(0,Q.jsx)(Dt,{label:`Text Color`,name:`textColor`,value:r.color,onChange:e=>i(`color`,e.target.value),onTransparent:()=>i(`color`,`transparent`)})}),(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,marginTop:`4px`},children:[(0,Q.jsxs)(`div`,{style:{flex:1},children:[(0,Q.jsx)(`div`,{style:{fontSize:`10px`,color:`#8c8d9c`,marginBottom:`2px`},children:`Line Height`}),(0,Q.jsx)(`input`,{type:`number`,value:r.lineHeight,onChange:e=>{let t=o(e.target.value);t!==null&&i(`lineHeight`,t)},onBlur:e=>{let t=o(e.target.value);i(`lineHeight`,t===null?1.5:t)},step:`0.1`,min:`0.5`,max:`3`,style:{width:`100%`}})]}),(0,Q.jsxs)(`div`,{style:{flex:1},children:[(0,Q.jsx)(`div`,{style:{fontSize:`10px`,color:`#8c8d9c`,marginBottom:`2px`},children:`Letter Spacing`}),(0,Q.jsx)(`input`,{type:`number`,value:r.letterSpacing,onChange:e=>{let t=o(e.target.value);t!==null&&i(`letterSpacing`,t)},onBlur:e=>{let t=o(e.target.value);i(`letterSpacing`,t===null?0:t)},step:`0.5`,style:{width:`100%`}})]})]}),(0,Q.jsxs)(`div`,{style:{marginTop:`6px`},children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,marginBottom:`4px`,fontWeight:600},children:`Internal Padding (px)`}),(0,Q.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(4, 1fr)`,gap:`6px`},children:[[`top`,`T`],[`right`,`R`],[`bottom`,`B`],[`left`,`L`]].map(([e,t])=>(0,Q.jsxs)(`div`,{children:[(0,Q.jsx)(`div`,{style:{fontSize:`9px`,color:`var(--text-secondary)`,marginBottom:`2px`,textAlign:`center`},children:t}),(0,Q.jsx)(`input`,{type:`number`,value:r.padding?.[e]??0,onChange:t=>{let n=o(t.target.value);n!==null&&a(e,Math.round(n))},onBlur:t=>{let n=o(t.target.value);a(e,n===null||n<0?0:Math.round(n))},style:{width:`100%`,textAlign:`center`,padding:`4px`},min:0})]},e))})]})]})},Mt=({elementIds:e})=>{let{elements:t,bringToFront:r,sendToBack:i,bringForward:a,sendBackward:o,alignElements:l,distributeElements:u,groupElements:d,ungroupElements:f}=bt(),p=t=>{e.forEach(e=>{t===`front`?r(e):t===`back`?i(e):t===`forward`?a(e):t===`backward`&&o(e)})},m=e.length>1,h=Array.from(new Set(t.filter(t=>e.includes(t.id)&&t.groupId).map(e=>e.groupId)));return(0,Q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`},children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,fontWeight:600,textTransform:`uppercase`,marginBottom:`2px`},children:`Order Layer`}),(0,Q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(4, 1fr)`,gap:`6px`},children:[(0,Q.jsxs)(`button`,{onClick:()=>p(`front`),className:`btn`,style:{padding:`8px`,display:`flex`,flexDirection:`column`,alignItems:`center`,gap:`4px`},title:`Bring to Front`,children:[(0,Q.jsx)(I,{size:16}),(0,Q.jsx)(`span`,{style:{fontSize:`9px`},children:`Front`})]}),(0,Q.jsxs)(`button`,{onClick:()=>p(`forward`),className:`btn`,style:{padding:`8px`,display:`flex`,flexDirection:`column`,alignItems:`center`,gap:`4px`},title:`Bring Forward`,children:[(0,Q.jsx)(c,{size:16}),(0,Q.jsx)(`span`,{style:{fontSize:`9px`},children:`Forward`})]}),(0,Q.jsxs)(`button`,{onClick:()=>p(`backward`),className:`btn`,style:{padding:`8px`,display:`flex`,flexDirection:`column`,alignItems:`center`,gap:`4px`},title:`Send Backward`,children:[(0,Q.jsx)(s,{size:16}),(0,Q.jsx)(`span`,{style:{fontSize:`9px`},children:`Backwd`})]}),(0,Q.jsxs)(`button`,{onClick:()=>p(`back`),className:`btn`,style:{padding:`8px`,display:`flex`,flexDirection:`column`,alignItems:`center`,gap:`4px`},title:`Send to Back`,children:[(0,Q.jsx)(n,{size:16}),(0,Q.jsx)(`span`,{style:{fontSize:`9px`},children:`Back`})]})]}),(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,fontWeight:600,textTransform:`uppercase`,marginTop:`10px`,marginBottom:`2px`},children:`Group`}),(0,Q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:`6px`},children:[(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>d(e),disabled:!m,style:{padding:`7px 4px`,fontSize:`10px`,opacity:m?1:.45},title:`Group selected elements`,children:`Group`}),(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>h.forEach(e=>f(e)),disabled:h.length===0,style:{padding:`7px 4px`,fontSize:`10px`,opacity:h.length?1:.45},title:`Ungroup selected elements`,children:`Ungroup`})]}),m&&(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,fontWeight:600,textTransform:`uppercase`,marginTop:`10px`,marginBottom:`2px`},children:`Align Selected`}),(0,Q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(3, 1fr)`,gap:`6px`},children:[(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>l(`left`),style:{padding:`6px 4px`,fontSize:`10px`},title:`Align left edges`,children:`Left`}),(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>l(`center`),style:{padding:`6px 4px`,fontSize:`10px`},title:`Align centers horizontally`,children:`Center`}),(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>l(`right`),style:{padding:`6px 4px`,fontSize:`10px`},title:`Align right edges`,children:`Right`}),(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>l(`top`),style:{padding:`6px 4px`,fontSize:`10px`},title:`Align top edges`,children:`Top`}),(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>l(`middle`),style:{padding:`6px 4px`,fontSize:`10px`},title:`Align centers vertically`,children:`Middle`}),(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>l(`bottom`),style:{padding:`6px 4px`,fontSize:`10px`},title:`Align bottom edges`,children:`Bottom`})]}),(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,fontWeight:600,textTransform:`uppercase`,marginTop:`10px`,marginBottom:`2px`},children:`Distribute Selected`}),(0,Q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:`6px`},children:[(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>u(`horizontal`),style:{padding:`6px 4px`,fontSize:`10px`},title:`Distribute centers horizontally`,children:`Horizontal`}),(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>u(`vertical`),style:{padding:`6px 4px`,fontSize:`10px`},title:`Distribute centers vertically`,children:`Vertical`})]})]})]})},Nt=({element:e,onChange:t})=>{let n=e.animations||[],{setPreviewAnimationId:r}=bt(),i=()=>{let e={id:Z(),trigger:`onClick`,type:`entrance`,effect:`fadeIn`,duration:500,delay:0,easing:`ease`,order:n.length+1};t({animations:[...n,e]})},a=(e,r,i)=>{t({animations:n.map(t=>{if(t.id!==e)return t;let n={...t,[r]:i};return r===`type`&&(i===`entrance`?n.effect=`fadeIn`:i===`exit`?n.effect=`fadeOut`:i===`emphasis`&&(n.effect=`pulse`)),n})})},o=e=>{t({animations:n.filter(t=>t.id!==e)})},s=e=>{r(null),requestAnimationFrame(()=>{r(e.id),window.setTimeout(()=>{r(null)},e.delay+e.duration+150)})},c=[{value:`fadeIn`,label:`Fade In`},{value:`slideInLeft`,label:`Fly In from Left`},{value:`slideInRight`,label:`Fly In from Right`},{value:`slideInTop`,label:`Fly In from Top`},{value:`slideInBottom`,label:`Fly In from Bottom`},{value:`zoomIn`,label:`Zoom In`},{value:`bounceIn`,label:`Bounce In`}],l=[{value:`fadeOut`,label:`Fade Out`},{value:`slideOutLeft`,label:`Fly Out to Left`},{value:`slideOutRight`,label:`Fly Out to Right`},{value:`slideOutTop`,label:`Fly Out to Top`},{value:`slideOutBottom`,label:`Fly Out to Bottom`},{value:`zoomOut`,label:`Zoom Out`}],u=[{value:`pulse`,label:`Pulse`},{value:`bounce`,label:`Bounce`},{value:`shake`,label:`Shake`},{value:`spin`,label:`Spin`},{value:`grow`,label:`Grow`},{value:`shrink`,label:`Shrink`}];return(0,Q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`},children:[(0,Q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`},children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,fontWeight:600,textTransform:`uppercase`},children:`Animations`}),(0,Q.jsxs)(`button`,{onClick:i,className:`btn`,style:{padding:`4px 8px`,fontSize:`11px`,display:`flex`,alignItems:`center`,gap:`4px`,background:`#3a3c50`,color:`#fff`},children:[(0,Q.jsx)(se,{size:12}),` Add`]})]}),n.length===0?(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`var(--text-secondary)`,textAlign:`center`,padding:`12px`,background:`rgba(0,0,0,0.1)`,borderRadius:`6px`,border:`1px dashed var(--border-color)`},children:`No animations added`}):(0,Q.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`10px`},children:n.map((e,t)=>(0,Q.jsxs)(`div`,{style:{background:`rgba(255,255,255,0.03)`,border:`1px solid var(--border-color)`,borderRadius:`8px`,padding:`8px`,display:`flex`,flexDirection:`column`,gap:`6px`,position:`relative`},children:[(0,Q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`2px`},children:[(0,Q.jsxs)(`span`,{style:{fontSize:`10px`,color:`var(--text-secondary)`,fontWeight:600},children:[`Animation `,t+1]}),(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`4px`,alignItems:`center`},children:[(0,Q.jsx)(`button`,{onClick:()=>s(e),style:{background:`none`,border:`none`,color:`#4caf50`,cursor:`pointer`,padding:`2px`,display:`flex`},title:`Preview Animation`,children:(0,Q.jsx)(ue,{size:12})}),(0,Q.jsx)(`button`,{onClick:()=>o(e.id),style:{background:`none`,border:`none`,color:`#ef5350`,cursor:`pointer`,padding:`2px`,display:`flex`},title:`Remove Animation`,children:(0,Q.jsx)(j,{size:12})})]})]}),(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,alignItems:`center`},children:[(0,Q.jsx)(`div`,{style:{fontSize:`10px`,color:`#8c8d9c`,width:`50px`},children:`Type`}),(0,Q.jsxs)(`select`,{value:e.type,onChange:t=>a(e.id,`type`,t.target.value),style:{flex:1,padding:`3px`,fontSize:`11px`},children:[(0,Q.jsx)(`option`,{value:`entrance`,children:`Entrance`}),(0,Q.jsx)(`option`,{value:`exit`,children:`Exit`}),(0,Q.jsx)(`option`,{value:`emphasis`,children:`Emphasis`})]})]}),(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,alignItems:`center`},children:[(0,Q.jsx)(`div`,{style:{fontSize:`10px`,color:`#8c8d9c`,width:`50px`},children:`Effect`}),(0,Q.jsxs)(`select`,{value:e.effect,onChange:t=>a(e.id,`effect`,t.target.value),style:{flex:1,padding:`3px`,fontSize:`11px`},children:[e.type===`entrance`&&c.map(e=>(0,Q.jsx)(`option`,{value:e.value,children:e.label},e.value)),e.type===`exit`&&l.map(e=>(0,Q.jsx)(`option`,{value:e.value,children:e.label},e.value)),e.type===`emphasis`&&u.map(e=>(0,Q.jsx)(`option`,{value:e.value,children:e.label},e.value))]})]}),(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,alignItems:`center`},children:[(0,Q.jsx)(`div`,{style:{fontSize:`10px`,color:`#8c8d9c`,width:`50px`},children:`Trigger`}),(0,Q.jsxs)(`select`,{value:e.trigger,onChange:t=>a(e.id,`trigger`,t.target.value),style:{flex:1,padding:`3px`,fontSize:`11px`},children:[(0,Q.jsx)(`option`,{value:`onClick`,children:`On Click`}),(0,Q.jsx)(`option`,{value:`withPrevious`,children:`With Previous`}),(0,Q.jsx)(`option`,{value:`afterPrevious`,children:`After Previous`}),(0,Q.jsx)(`option`,{value:`onEnter`,children:`On Slide Enter`})]})]}),(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`8px`},children:[(0,Q.jsxs)(`div`,{style:{flex:1},children:[(0,Q.jsx)(`div`,{style:{fontSize:`9px`,color:`#8c8d9c`,marginBottom:`2px`},children:`Duration (ms)`}),(0,Q.jsx)(`input`,{type:`number`,value:e.duration,onChange:t=>a(e.id,`duration`,Math.max(0,parseInt(t.target.value)||0)),style:{width:`100%`,padding:`3px`,fontSize:`11px`},min:0,step:100})]}),(0,Q.jsxs)(`div`,{style:{flex:1},children:[(0,Q.jsx)(`div`,{style:{fontSize:`9px`,color:`#8c8d9c`,marginBottom:`2px`},children:`Delay (ms)`}),(0,Q.jsx)(`input`,{type:`number`,value:e.delay,onChange:t=>a(e.id,`delay`,Math.max(0,parseInt(t.target.value)||0)),style:{width:`100%`,padding:`3px`,fontSize:`11px`},min:0,step:100})]})]})]},e.id))})]})},Pt=()=>(0,Q.jsx)(`div`,{style:{height:`1px`,background:`#2d2e3e`,margin:`10px 0`}}),$=({children:e})=>(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,textTransform:`uppercase`,letterSpacing:`0.5px`,fontWeight:600,marginBottom:`6px`,marginTop:`12px`},children:e}),Ft=({label:e,checked:t,onChange:n,color:r=`#4caf50`})=>(0,Q.jsxs)(`div`,{onClick:()=>n(!t),style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,padding:`6px 0`,cursor:`pointer`},children:[(0,Q.jsx)(`span`,{style:{fontSize:`12px`,color:t?`var(--text-primary)`:`var(--text-secondary)`,fontWeight:t?600:400,transition:`color 0.2s`},children:e}),(0,Q.jsx)(`div`,{style:{width:`32px`,height:`18px`,borderRadius:`9px`,position:`relative`,transition:`background 0.3s cubic-bezier(0.4, 0, 0.2, 1)`,backgroundColor:t?r:`rgba(128, 128, 128, 0.25)`,boxShadow:`inset 0 1px 3px rgba(0,0,0,0.2)`},children:(0,Q.jsx)(`div`,{style:{width:`14px`,height:`14px`,borderRadius:`50%`,backgroundColor:`#fff`,position:`absolute`,top:`2px`,left:t?`16px`:`2px`,transition:`left 0.3s cubic-bezier(0.4, 0, 0.2, 1)`,boxShadow:`0 2px 4px rgba(0,0,0,0.2)`}})})]}),It=({title:e,children:t,defaultOpen:n=!0})=>{let[r,i]=R.useState(n);return(0,Q.jsxs)(`div`,{style:{marginBottom:`8px`,border:`1px solid var(--border-color)`,borderRadius:`8px`},children:[(0,Q.jsxs)(`div`,{onClick:()=>i(!r),style:{padding:`8px 12px`,background:`var(--panel-header-bg)`,cursor:`pointer`,display:`flex`,justifyContent:`space-between`,alignItems:`center`,userSelect:`none`,borderRadius:r?`8px 8px 0 0`:`8px`},children:[(0,Q.jsx)(`span`,{style:{fontSize:`12px`,fontWeight:600,color:`var(--text-primary)`},children:e}),(0,Q.jsx)(`span`,{style:{fontSize:`10px`,color:`var(--text-secondary)`},children:r?`▼`:`▶`})]}),r&&(0,Q.jsx)(`div`,{style:{padding:`12px`,background:`var(--bg-toolbar)`,borderTop:`1px solid var(--border-color)`,display:`flex`,flexDirection:`column`,gap:`10px`,borderRadius:`0 0 8px 8px`},children:t})]})},Lt=(e,t)=>{if(!e||!t)return{width:480,height:270};let n=Math.max(e,t),r=Math.min(680/e,460/t),i=r<1?r:Math.max(1,Math.min(r,360/n));return{width:Math.max(80,Math.round(e*i)),height:Math.max(80,Math.round(t*i))}},Rt=e=>new Promise((t,n)=>{let r=new Image;r.onload=()=>t({width:r.naturalWidth||r.width,height:r.naturalHeight||r.height}),r.onerror=()=>n(Error(`Could not load image dimensions.`)),r.src=e}),zt=e=>new Promise((t,n)=>{let r=URL.createObjectURL(e),i=new FileReader,a=new Image,o=``,s=0,c=0,l=!1,u=!1,d=!1,f=()=>URL.revokeObjectURL(r),p=()=>{d||!l||!u||(d=!0,f(),t({src:o,width:s,height:c}))},m=e=>{d||(d=!0,f(),n(e))};i.onerror=()=>m(Error(`Could not read image file.`)),i.onload=()=>{o=String(i.result||``),l=!0,p()},a.decoding=`async`,a.onerror=()=>m(Error(`Could not decode image file.`)),a.onload=()=>{s=a.naturalWidth||a.width,c=a.naturalHeight||a.height,u=!0,p()},a.src=r,i.readAsDataURL(e)}),Bt=({label:e,value:t,onChange:n,min:r,max:i,disabled:a,style:o})=>{let s=e=>{let t=typeof e==`number`?e:parseFloat(String(e??``));return Number.isFinite(t)?t:0},c=e=>{let t=Number.isFinite(e)?e:0;return r!==void 0&&(t=Math.max(r,t)),i!==void 0&&(t=Math.min(i,t)),t},[l,u]=R.useState(String(Math.round(s(t))));return R.useEffect(()=>{u(String(Math.round(s(t))))},[t]),(0,Q.jsxs)(`div`,{children:[e&&(0,Q.jsx)(`div`,{style:{fontSize:`9px`,color:`var(--text-secondary)`,marginBottom:`2px`,textAlign:`center`},children:e}),(0,Q.jsx)(`input`,{type:`number`,value:l,onChange:e=>{u(e.target.value);let t=parseFloat(e.target.value);isNaN(t)||n(t)},onBlur:()=>{let e=c(parseFloat(l));u(String(e)),n(e)},disabled:a,min:r,max:i,style:o})]})},Vt=()=>{let{elements:e,selectedIds:t,updateElement:n,removeElement:r,removeSelected:i,exportHTML:a,connections:o,selectedConnectionId:s,updateConnection:c,removeConnection:l,theme:u,setTheme:d,isSnapEnabled:f,setIsSnapEnabled:p,isBlurEnabled:m,setIsBlurEnabled:h,alignElements:g,distributeElements:_,setIsPresenting:v,isPropertiesOpen:y,setIsPropertiesOpen:b,saveHistory:x,saveHistoryOnce:S,showAlert:ee}=bt(),C=t[t.length-1],T=e.find(e=>e.id===C),[E,te]=R.useState(!1),[O,ne]=R.useState(!1),[k,A]=R.useState(``),[ie,j]=R.useState(``),M=R.useRef(0);R.useEffect(()=>{if(!E||!O||!k){j(``);return}let e=new Blob([k],{type:`text/html;charset=utf-8`}),t=URL.createObjectURL(e);return j(t),()=>{URL.revokeObjectURL(t)}},[k,E,O]);let N=()=>{A(a()),te(!0)},P=()=>{A(a()),ne(!0),te(!0)},se=async()=>{try{await navigator.clipboard.writeText(k)}catch(e){console.error(`Failed to copy HTML`,e),await ee(`Clipboard permission was denied. Please copy the code manually.`,`Copy failed`)}},ce=()=>E?(0,xt.createPortal)((0,Q.jsx)(`div`,{style:{position:`fixed`,top:0,left:0,right:0,bottom:0,backgroundColor:`rgba(0,0,0,0.85)`,display:`flex`,alignItems:`center`,justifyContent:`center`,zIndex:1e4},children:(0,Q.jsxs)(`div`,{style:{backgroundColor:`#1e1f2e`,padding:`20px`,borderRadius:`12px`,width:O?`90vw`:`700px`,height:O?`90vh`:`auto`,maxWidth:`1200px`,border:`1px solid #2d2e3e`,display:`flex`,flexDirection:`column`},children:[(0,Q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`16px`,paddingBottom:`12px`,borderBottom:`1px solid #2d2e3e`},children:[(0,Q.jsx)(`span`,{style:{color:`#fff`,fontSize:`15px`,fontWeight:600},children:O?`Preview`:`Export HTML`}),(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`8px`},children:[O&&(0,Q.jsx)(`button`,{className:`btn primary`,onClick:()=>ne(!1),style:{height:`32px`,padding:`0 14px`,fontSize:`12px`},children:`Code`}),(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>te(!1),style:{height:`32px`,padding:`0 14px`,fontSize:`12px`,color:`#fff`},children:`Close`})]})]}),O?(0,Q.jsx)(`div`,{style:{flex:1,backgroundColor:`#000`,borderRadius:`8px`,overflow:`hidden`,border:`1px solid #2d2e3e`},children:(0,Q.jsx)(`iframe`,{src:ie,style:{width:`100%`,height:`100%`,border:`none`},title:`Preview`,sandbox:`allow-scripts allow-same-origin`},ie)}):(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(`p`,{style:{color:`#666`,fontSize:`12px`,marginBottom:`10px`},children:`Paste into Google Sites "Embed Code"`}),(0,Q.jsx)(`textarea`,{readOnly:!0,value:k,style:{width:`100%`,height:`300px`,padding:`10px`,fontFamily:`monospace`,fontSize:`11px`,backgroundColor:`#0a0b10`,color:`#4caf50`,border:`1px solid #2d2e3e`,borderRadius:`6px`,resize:`none`}}),(0,Q.jsx)(`div`,{style:{display:`flex`,justifyContent:`flex-end`,marginTop:`12px`},children:(0,Q.jsx)(`button`,{className:`btn primary`,onClick:se,children:`Copy`})})]})]})}),document.body):null,le=(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(`option`,{value:`sans-serif`,children:`Sans-Serif`}),(0,Q.jsx)(`option`,{value:`'Google Sans Display'`,children:`Google Sans Display`}),(0,Q.jsx)(`option`,{value:`'Google Sans Flex'`,children:`Google Sans Flex`}),(0,Q.jsx)(`option`,{value:`'Google Sans Text'`,children:`Google Sans Text`}),(0,Q.jsx)(`option`,{value:`'Lexend Deca'`,children:`Lexend Deca`}),(0,Q.jsx)(`option`,{value:`serif`,children:`Serif`}),(0,Q.jsx)(`option`,{value:`monospace`,children:`Monospace`}),(0,Q.jsx)(`option`,{value:`Arial`,children:`Arial`}),(0,Q.jsx)(`option`,{value:`Georgia`,children:`Georgia`}),(0,Q.jsx)(`option`,{value:`Verdana`,children:`Verdana`})]}),ue=()=>b(!1);if(!y)return(0,Q.jsx)(`button`,{onClick:()=>b(!0),style:{position:`fixed`,right:`16px`,top:`16px`,width:`44px`,height:`44px`,borderRadius:`50%`,backgroundColor:`var(--bg-toolbar)`,border:`1px solid var(--border-color)`,display:`flex`,alignItems:`center`,justifyContent:`center`,cursor:`pointer`,zIndex:1e3,boxShadow:`0 4px 12px rgba(0,0,0,0.3)`,color:`var(--text-primary)`,transition:`all 0.2s`},title:`Show Properties Panel`,children:(0,Q.jsx)(D,{size:20})});if(!T&&!s)return(0,Q.jsxs)(`div`,{className:`properties-panel ${m?``:`no-blur`}`,children:[(0,Q.jsxs)(`div`,{style:{flex:1,display:`flex`,flexDirection:`column`,gap:`12px`,padding:`10px 0`},children:[(0,Q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,Q.jsx)(`div`,{style:{fontSize:`13px`,fontWeight:600,color:`var(--text-primary)`},children:`Global Settings`}),(0,Q.jsx)(`button`,{onClick:ue,style:{background:`none`,border:`none`,color:`var(--text-secondary)`,cursor:`pointer`,padding:`4px`,display:`flex`,alignItems:`center`},title:`Hide Panel`,children:(0,Q.jsx)(F,{size:16})})]}),(0,Q.jsx)(Pt,{}),(0,Q.jsx)(Ft,{label:`Light Theme`,checked:u===`light`,onChange:e=>d(e?`light`:`dark`),color:`#4caf50`}),(0,Q.jsx)(Ft,{label:`Enable Snapping`,checked:f,onChange:e=>p(e),color:`#4caf50`}),(0,Q.jsx)(Ft,{label:`Enable Blur`,checked:m,onChange:e=>h(e),color:`#4caf50`}),(0,Q.jsx)(Pt,{}),(0,Q.jsx)(`div`,{style:{flex:1,display:`flex`,alignItems:`center`,justifyContent:`center`},children:(0,Q.jsx)(`p`,{style:{color:`var(--text-secondary)`,fontSize:`12px`},children:`Select an element to view properties`})})]}),(0,Q.jsx)(`button`,{onClick:()=>v(!0),className:`btn`,style:{width:`100%`,padding:`10px`,background:`#3f51b5`,color:`#fff`,border:`none`,borderRadius:`6px`,cursor:`pointer`,fontWeight:600,marginBottom:`8px`,display:`flex`,alignItems:`center`,justifyContent:`center`,gap:`6px`},children:`Present Slideshow`}),(0,Q.jsx)(`button`,{onClick:N,className:`btn primary`,style:{width:`100%`,padding:`10px`},children:`Export HTML`}),ce()]});if(s){let e=o.find(e=>e.id===s);if(!e)return null;let t=xe(e),n=Se(e),r=t=>{S(`connection-panel:${e.id}`),c(e.id,t)},i=e=>{r({stroke:{...t,...e}})},a=e=>{let t={...n,...e};r({arrow:t,startArrow:t.start===`arrow`?`arrow`:`none`,endArrow:t.end===`arrow`?`arrow`:`none`})};return(0,Q.jsxs)(`div`,{className:`properties-panel ${m?``:`no-blur`}`,children:[(0,Q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`12px`},children:[(0,Q.jsx)(`div`,{style:{fontSize:`13px`,fontWeight:600,color:`var(--text-primary)`},children:`Connection`}),(0,Q.jsx)(`button`,{onClick:ue,style:{background:`none`,border:`none`,color:`var(--text-secondary)`,cursor:`pointer`,padding:`4px`,display:`flex`,alignItems:`center`},title:`Hide Panel`,children:(0,Q.jsx)(F,{size:16})})]}),(0,Q.jsx)($,{children:`Label`}),(0,Q.jsx)(`input`,{type:`text`,value:e.label||``,onChange:t=>{let n=t.target.value,i={label:n};if(n){let t=n.toLowerCase().trim();t===`no`||t===`không`||t===`n`||t===`k`?i.interactiveBtnText=`NO`:t===`yes`||t===`có`||t===`y`?i.interactiveBtnText=`YES`:e.interactiveBtnText||(i.interactiveBtnText=`YES`)}else i.interactiveBtnText=void 0;r(i)},placeholder:`Label...`}),e.label&&(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)($,{children:`Interactive Button Text`}),(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,marginTop:`4px`},children:[(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>r({interactiveBtnText:`YES`}),style:{flex:1,padding:`6px`,background:(e.interactiveBtnText||`YES`)===`YES`?`#4caf50`:`var(--btn-bg)`,color:`#fff`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`,fontSize:`12px`,transition:`background-color 0.2s`},children:`YES`}),(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>r({interactiveBtnText:`NO`}),style:{flex:1,padding:`6px`,background:e.interactiveBtnText===`NO`?`#4caf50`:`var(--btn-bg)`,color:`#fff`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`,fontSize:`12px`,transition:`background-color 0.2s`},children:`NO`})]})]}),(0,Q.jsx)($,{children:`Alignment`}),(0,Q.jsxs)(`select`,{value:e.labelAlignment||`horizontal`,onChange:e=>r({labelAlignment:e.target.value}),children:[(0,Q.jsx)(`option`,{value:`horizontal`,children:`Horizontal`}),(0,Q.jsx)(`option`,{value:`follow`,children:`Follow Curve`})]}),e.labelAlignment===`follow`&&(0,Q.jsx)(`div`,{style:{marginTop:`6px`},children:(0,Q.jsx)(Ft,{label:`Reverse Text Direction`,checked:!!e.reverseLabelDirection,onChange:e=>r({reverseLabelDirection:e}),color:`#4caf50`})}),(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`4px`,marginTop:`6px`},children:[(0,Q.jsxs)(`div`,{style:{flex:2},children:[(0,Q.jsx)($,{children:`Font`}),(0,Q.jsx)(`select`,{value:e.fontFamily||`sans-serif`,onChange:e=>r({fontFamily:e.target.value}),children:le})]}),(0,Q.jsxs)(`div`,{style:{flex:1},children:[(0,Q.jsx)($,{children:`Label Size`}),(0,Q.jsx)(`input`,{type:`number`,value:e.fontSize||14,onChange:e=>r({fontSize:parseInt(e.target.value)||14})})]})]}),(0,Q.jsx)(`div`,{style:{marginTop:`6px`},children:(0,Q.jsx)(Dt,{label:`Text Color`,name:`color`,value:e.color||`#e0e0e0`,onChange:e=>r({color:e.target.value}),onTransparent:()=>r({color:`transparent`})})}),(0,Q.jsx)(Pt,{}),(0,Q.jsx)($,{children:`Line Style`}),(0,Q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:`8px`,marginTop:`4px`},children:[(0,Q.jsxs)(`div`,{children:[(0,Q.jsx)($,{children:`Path`}),(0,Q.jsxs)(`select`,{value:t.lineType,onChange:e=>i({lineType:e.target.value}),children:[(0,Q.jsx)(`option`,{value:`curve`,children:`Curve`}),(0,Q.jsx)(`option`,{value:`straight`,children:`Straight`}),(0,Q.jsx)(`option`,{value:`elbow`,children:`Elbow`})]})]}),(0,Q.jsxs)(`div`,{children:[(0,Q.jsx)($,{children:`Stroke`}),(0,Q.jsxs)(`select`,{value:t.style,onChange:e=>i({style:e.target.value}),children:[(0,Q.jsx)(`option`,{value:`solid`,children:`Solid`}),(0,Q.jsx)(`option`,{value:`dashed`,children:`Dashed`}),(0,Q.jsx)(`option`,{value:`dotted`,children:`Dotted`})]})]}),(0,Q.jsxs)(`div`,{children:[(0,Q.jsx)($,{children:`Width`}),(0,Q.jsx)(`input`,{type:`number`,min:1,max:20,value:t.width,onChange:e=>i({width:Math.max(1,parseInt(e.target.value)||1)})})]}),(0,Q.jsxs)(`div`,{children:[(0,Q.jsx)($,{children:`Arrow Size`}),(0,Q.jsx)(`input`,{type:`number`,min:4,max:24,value:n.size,onChange:e=>a({size:Math.max(4,parseInt(e.target.value)||4)})})]})]}),(0,Q.jsx)(`div`,{style:{marginTop:`6px`},children:(0,Q.jsx)(Dt,{label:`Line Color`,name:`lineColor`,value:t.color,onChange:e=>i({color:e.target.value}),onTransparent:()=>i({color:`transparent`})})}),(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`6px`,marginTop:`6px`},children:[(0,Q.jsxs)(`div`,{style:{flex:1},children:[(0,Q.jsx)($,{children:`Start Arrow`}),(0,Q.jsxs)(`select`,{value:n.start,onChange:e=>a({start:e.target.value}),children:[(0,Q.jsx)(`option`,{value:`none`,children:`None`}),(0,Q.jsx)(`option`,{value:`arrow`,children:`Arrow`}),(0,Q.jsx)(`option`,{value:`triangle`,children:`Triangle`}),(0,Q.jsx)(`option`,{value:`circle`,children:`Circle`}),(0,Q.jsx)(`option`,{value:`diamond`,children:`Diamond`})]})]}),(0,Q.jsxs)(`div`,{style:{flex:1},children:[(0,Q.jsx)($,{children:`End Arrow`}),(0,Q.jsxs)(`select`,{value:n.end,onChange:e=>a({end:e.target.value}),children:[(0,Q.jsx)(`option`,{value:`none`,children:`None`}),(0,Q.jsx)(`option`,{value:`arrow`,children:`Arrow`}),(0,Q.jsx)(`option`,{value:`triangle`,children:`Triangle`}),(0,Q.jsx)(`option`,{value:`circle`,children:`Circle`}),(0,Q.jsx)(`option`,{value:`diamond`,children:`Diamond`})]})]})]}),(0,Q.jsxs)(`div`,{style:{display:`none`,gap:`6px`,marginTop:`6px`},children:[(0,Q.jsxs)(`div`,{style:{flex:1},children:[(0,Q.jsx)($,{children:`Start`}),(0,Q.jsxs)(`select`,{value:e.startArrow||`none`,onChange:e=>r({startArrow:e.target.value}),children:[(0,Q.jsx)(`option`,{value:`none`,children:`—`}),(0,Q.jsx)(`option`,{value:`arrow`,children:`Arrow`})]})]}),(0,Q.jsxs)(`div`,{style:{flex:1},children:[(0,Q.jsx)($,{children:`End`}),(0,Q.jsxs)(`select`,{value:e.endArrow||`none`,onChange:e=>r({endArrow:e.target.value}),children:[(0,Q.jsx)(`option`,{value:`none`,children:`—`}),(0,Q.jsx)(`option`,{value:`arrow`,children:`Arrow`})]})]})]}),(0,Q.jsxs)(`div`,{style:{marginTop:`auto`,display:`flex`,flexDirection:`column`,gap:`6px`},children:[(0,Q.jsx)(`button`,{onClick:()=>l(e.id),style:{width:`100%`,padding:`8px`,background:`none`,border:`1px solid #ef5350`,color:`#ef5350`,borderRadius:`6px`,cursor:`pointer`,fontSize:`12px`},children:`Delete`}),(0,Q.jsx)(`button`,{onClick:N,className:`btn primary`,style:{width:`100%`,padding:`10px`},children:`Export HTML`})]}),ce()]})}let I=r=>{let{name:i,value:a,type:o}=r.target,s=a;o===`number`&&(s=parseFloat(a)),S(`bulk-panel:${t.join(`,`)}`),t.forEach(t=>{let r=e.find(e=>e.id===t);if(!r)return;let a=s;if(i===`src`&&typeof a==`string`){let e=a.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)||a.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);if(e&&e[1]&&(r.type===`image`?a=`https://lh3.googleusercontent.com/d/${e[1]}`:r.type===`video`&&(a=`https://drive.google.com/file/d/${e[1]}/preview`)),r.type===`image`){let e=new Image;e.onload=()=>{n(r.id,{...Lt(e.naturalWidth||e.width,e.naturalHeight||e.height),src:a})},e.src=a;return}if(r.type===`video`){n(r.id,{width:560,height:315,src:a});return}}i===`width`&&a<10&&(a=10),i===`height`&&a<10&&(a=10),n(t,{[i]:a})})},de=(e,r)=>{x(),t.forEach(t=>{n(t,{[e]:r})})},fe=e=>{x(),t.forEach(t=>{n(t,{[e]:`transparent`})})},pe=r=>{x(),t.forEach(t=>{let i=e.find(e=>e.id===t);i&&[`text`,`button`,`shape`,`node`].includes(i.type)&&n(t,{textAlign:r})})},L=e=>{S(`element-panel:${t.join(`,`)}`),t.forEach(t=>{n(t,e)})},z=async(e,t={})=>{let n=++M.current;if(!T||T.type!==`image`){L({src:e,...t});return}try{let r=await Rt(e);if(n!==M.current)return;L({src:e,...Lt(r.width,r.height),...t})}catch{if(n!==M.current)return;L({src:e,...t})}},B=T?Be(T):null,V=e=>e?(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)($,{children:`Text Alignment`}),(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`4px`,marginTop:`6px`,background:`rgba(0,0,0,0.2)`,padding:`4px`,borderRadius:`8px`,border:`1px solid var(--border-color)`},children:[(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>pe(`left`),onMouseDown:e=>e.preventDefault(),style:{flex:1,padding:`6px`,display:`flex`,justifyContent:`center`,alignItems:`center`,background:e.textAlign===`left`?`#4caf50`:`transparent`,color:e.textAlign===`left`?`#fff`:`var(--text-secondary)`,border:`none`,borderRadius:`4px`,cursor:`pointer`},title:`Align Left`,children:(0,Q.jsx)(ae,{size:16})}),(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>pe(`center`),onMouseDown:e=>e.preventDefault(),style:{flex:1,padding:`6px`,display:`flex`,justifyContent:`center`,alignItems:`center`,background:!e.textAlign||e.textAlign===`center`?`#4caf50`:`transparent`,color:!e.textAlign||e.textAlign===`center`?`#fff`:`var(--text-secondary)`,border:`none`,borderRadius:`4px`,cursor:`pointer`},title:`Align Center`,children:(0,Q.jsx)(oe,{size:16})}),(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>pe(`right`),onMouseDown:e=>e.preventDefault(),style:{flex:1,padding:`6px`,display:`flex`,justifyContent:`center`,alignItems:`center`,background:e.textAlign===`right`?`#4caf50`:`transparent`,color:e.textAlign===`right`?`#fff`:`var(--text-secondary)`,border:`none`,borderRadius:`4px`,cursor:`pointer`},title:`Align Right`,children:(0,Q.jsx)(re,{size:16})}),(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>pe(`justify`),onMouseDown:e=>e.preventDefault(),style:{flex:1,padding:`6px`,display:`flex`,justifyContent:`center`,alignItems:`center`,background:e.textAlign===`justify`?`#4caf50`:`transparent`,color:e.textAlign===`justify`?`#fff`:`var(--text-secondary)`,border:`none`,borderRadius:`4px`,cursor:`pointer`},title:`Justify`,children:(0,Q.jsx)(w,{size:16})})]})]}):null;if(t.length>1){let n=e.some(e=>t.includes(e.id)&&[`text`,`button`,`shape`,`node`].includes(e.type)),r=e.some(e=>t.includes(e.id)&&[`text`,`button`,`shape`,`node`,`image`,`video`].includes(e.type)),a=e.find(e=>t.includes(e.id)&&[`text`,`button`,`shape`,`node`].includes(e.type)),o=e.find(e=>t.includes(e.id)&&[`text`,`button`,`shape`,`node`,`image`,`video`].includes(e.type)),s=n=>{let r=e.filter(e=>t.includes(e.id));return r.length===0?!1:r.every(e=>e[n]===!0)},c=e.filter(e=>t.includes(e.id)&&e.type===`node`).every(e=>e.isSlide!==!1);return(0,Q.jsxs)(`div`,{className:`properties-panel ${m?``:`no-blur`}`,children:[(0,Q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`4px`},children:[(0,Q.jsx)(`span`,{style:{fontSize:`14px`,fontWeight:600,color:`var(--text-primary)`},children:`Bulk Edit`}),(0,Q.jsx)(`button`,{onClick:ue,style:{background:`none`,border:`none`,color:`var(--text-secondary)`,cursor:`pointer`,padding:`4px`,display:`flex`,alignItems:`center`},title:`Hide Panel`,children:(0,Q.jsx)(F,{size:16})})]}),(0,Q.jsxs)(`div`,{style:{padding:`6px 10px`,background:`rgba(76, 175, 80, 0.15)`,borderRadius:`6px`,fontSize:`11px`,color:`#4caf50`,fontWeight:600,textAlign:`center`,marginBottom:`8px`},children:[t.length,` elements selected`]}),(0,Q.jsx)(Pt,{}),(0,Q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`,marginBottom:`12px`},children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,textTransform:`uppercase`,letterSpacing:`0.5px`,fontWeight:600},children:`Align Selected`}),(0,Q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(3, 1fr)`,gap:`6px`},children:[(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>g(`left`),style:{padding:`6px 4px`,fontSize:`10px`,width:`100%`,boxSizing:`border-box`},title:`Align left edges`,children:`Left`}),(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>g(`center`),style:{padding:`6px 4px`,fontSize:`10px`,width:`100%`,boxSizing:`border-box`},title:`Align centers horizontally`,children:`Center`}),(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>g(`right`),style:{padding:`6px 4px`,fontSize:`10px`,width:`100%`,boxSizing:`border-box`},title:`Align right edges`,children:`Right`}),(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>g(`top`),style:{padding:`6px 4px`,fontSize:`10px`,width:`100%`,boxSizing:`border-box`},title:`Align top edges`,children:`Top`}),(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>g(`middle`),style:{padding:`6px 4px`,fontSize:`10px`,width:`100%`,boxSizing:`border-box`},title:`Align centers vertically`,children:`Middle`}),(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>g(`bottom`),style:{padding:`6px 4px`,fontSize:`10px`,width:`100%`,boxSizing:`border-box`},title:`Align bottom edges`,children:`Bottom`})]}),(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,textTransform:`uppercase`,letterSpacing:`0.5px`,fontWeight:600,marginTop:`4px`},children:`Distribute Selected`}),(0,Q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:`6px`},children:[(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>_(`horizontal`),style:{padding:`6px 4px`,fontSize:`10px`,width:`100%`,boxSizing:`border-box`},title:`Distribute centers horizontally`,children:`Horizontal`}),(0,Q.jsx)(`button`,{className:`btn`,onClick:()=>_(`vertical`),style:{padding:`6px 4px`,fontSize:`10px`,width:`100%`,boxSizing:`border-box`},title:`Distribute centers vertically`,children:`Vertical`})]})]}),(0,Q.jsx)(Pt,{}),(0,Q.jsx)($,{children:`Properties`}),(0,Q.jsxs)(`div`,{style:{background:`rgba(0,0,0,0.2)`,borderRadius:`12px`,padding:`6px 14px`,border:`1px solid var(--border-color)`,marginBottom:`8px`},children:[(0,Q.jsx)(Ft,{label:`Lock Position`,checked:s(`isLocked`),onChange:e=>de(`isLocked`,e),color:`#e91e63`}),(0,Q.jsx)(Ft,{label:`Disabled`,checked:s(`isDisabled`),onChange:e=>de(`isDisabled`,e),color:`#ef5350`}),(0,Q.jsx)(Ft,{label:`Hidden`,checked:s(`isHidden`),onChange:e=>de(`isHidden`,e),color:`#ff9800`}),(0,Q.jsx)(Ft,{label:`Pinned`,checked:s(`isPinned`),onChange:e=>de(`isPinned`,e),color:`#ab47bc`}),(0,Q.jsx)(Ft,{label:`Interactive Btns`,checked:s(`enableExpandButton`),onChange:e=>de(`enableExpandButton`,e),color:`#42a5f5`}),e.some(e=>t.includes(e.id)&&e.type===`node`)&&(0,Q.jsx)(Ft,{label:`Include in Presentation`,checked:c,onChange:e=>de(`isSlide`,e),color:`#3f51b5`})]}),n&&(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(Pt,{}),(0,Q.jsx)($,{children:`Text Formatting`}),(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`4px`,marginTop:`6px`},children:[(0,Q.jsxs)(`div`,{style:{flex:2},children:[(0,Q.jsx)($,{children:`Font`}),(0,Q.jsx)(`select`,{name:`fontFamily`,value:a?.fontFamily||`sans-serif`,onChange:I,children:le})]}),(0,Q.jsxs)(`div`,{style:{flex:1},children:[(0,Q.jsx)($,{children:`Size`}),(0,Q.jsx)(`input`,{type:`number`,name:`fontSize`,value:a?.fontSize||14,onChange:I})]})]}),V(a),(0,Q.jsx)(`div`,{style:{marginTop:`12px`},children:(0,Q.jsx)(Dt,{label:`Text Color`,name:`color`,value:a?.color||`#ffffff`,onChange:I,onTransparent:()=>fe(`color`)})})]}),r&&(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(Pt,{}),(0,Q.jsx)($,{children:`Style & Border`}),(0,Q.jsxs)(`div`,{style:{marginTop:`12px`},children:[(0,Q.jsx)(Dt,{label:`Fill Color`,name:`backgroundColor`,value:o?.backgroundColor||`transparent`,onChange:I,onTransparent:()=>fe(`backgroundColor`)}),(0,Q.jsx)(Dt,{label:`Line Color`,name:`borderColor`,value:o?.borderColor||`transparent`,onChange:I,onTransparent:()=>fe(`borderColor`)})]}),(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`4px`,marginTop:`4px`},children:[(0,Q.jsxs)(`div`,{style:{flex:1},children:[(0,Q.jsx)($,{children:`Line Width`}),(0,Q.jsx)(`input`,{type:`number`,name:`borderWidth`,value:o?.borderWidth||0,onChange:I,min:0})]}),(0,Q.jsxs)(`div`,{style:{flex:1},children:[(0,Q.jsx)($,{children:`Border Radius`}),(0,Q.jsx)(`input`,{type:`number`,name:`borderRadius`,value:o?.borderRadius||0,onChange:I,min:0})]})]})]}),(0,Q.jsxs)(`div`,{style:{marginTop:`auto`,paddingTop:`12px`,display:`flex`,flexDirection:`column`,gap:`6px`},children:[(0,Q.jsx)(`button`,{onClick:()=>v(!0),className:`btn`,style:{width:`100%`,padding:`8px`,background:`#3f51b5`,color:`#fff`,border:`none`,borderRadius:`6px`,cursor:`pointer`,fontSize:`12px`,fontWeight:600},children:`Present Slideshow`}),(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`6px`},children:[(0,Q.jsx)(`button`,{onClick:i,style:{flex:1,padding:`8px`,background:`none`,border:`1px solid var(--border-color)`,color:`#ef5350`,borderRadius:`6px`,cursor:`pointer`,fontSize:`12px`,fontWeight:500},children:`Delete Selected`}),(0,Q.jsx)(`button`,{onClick:P,style:{flex:1,padding:`8px`,background:`none`,border:`1px solid var(--border-color)`,color:`var(--text-primary)`,borderRadius:`6px`,cursor:`pointer`,fontSize:`12px`,fontWeight:500},children:`Preview`}),(0,Q.jsx)(`button`,{onClick:N,style:{flex:1,padding:`8px`,background:`#4caf50`,border:`none`,color:`#fff`,borderRadius:`6px`,cursor:`pointer`,fontSize:`12px`,fontWeight:600},children:`Export`})]})]}),ce()]})}return(0,Q.jsxs)(`div`,{className:`properties-panel ${m?``:`no-blur`}`,children:[(0,Q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,marginBottom:`8px`,flexShrink:0},children:[(0,Q.jsxs)(`div`,{style:{display:`flex`,alignItems:`baseline`,gap:`8px`},children:[(0,Q.jsx)(`span`,{style:{fontSize:`14px`,fontWeight:600,color:`var(--text-primary)`},children:T.type.toUpperCase()}),(0,Q.jsx)(`span`,{style:{fontSize:`9px`,color:`var(--text-secondary)`,fontFamily:`monospace`},children:T.id.substring(0,8)})]}),(0,Q.jsx)(`button`,{onClick:ue,style:{background:`none`,border:`none`,color:`var(--text-secondary)`,cursor:`pointer`,padding:`4px`,display:`flex`,alignItems:`center`},title:`Hide Panel`,children:(0,Q.jsx)(F,{size:16})})]}),(0,Q.jsxs)(`div`,{style:{flex:1,overflowY:`auto`,paddingRight:`4px`},children:[(0,Q.jsx)(It,{title:`Size & Position`,defaultOpen:!0,children:(0,Q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`},children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,fontWeight:600},children:`Element Name`}),(0,Q.jsx)(`input`,{type:`text`,value:T.name||``,onChange:e=>L({name:e.target.value}),placeholder:`Name...`,style:{width:`100%`}}),(0,Q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(4, 1fr)`,gap:`6px`,marginTop:`4px`},children:[(0,Q.jsx)(Bt,{label:`X`,value:T.x,onChange:e=>L({x:e}),disabled:!!T.fillParent,style:{width:`100%`,boxSizing:`border-box`,padding:`4px 2px`,textAlign:`center`}}),(0,Q.jsx)(Bt,{label:`Y`,value:T.y,onChange:e=>L({y:e}),disabled:!!T.fillParent,style:{width:`100%`,boxSizing:`border-box`,padding:`4px 2px`,textAlign:`center`}}),(0,Q.jsx)(Bt,{label:`W`,value:T.width,onChange:e=>L({width:e}),disabled:!!T.fillParent,min:10,style:{width:`100%`,boxSizing:`border-box`,padding:`4px 2px`,textAlign:`center`}}),(0,Q.jsx)(Bt,{label:`H`,value:T.height,onChange:e=>L({height:e}),disabled:!!T.fillParent,min:10,style:{width:`100%`,boxSizing:`border-box`,padding:`4px 2px`,textAlign:`center`}})]}),(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,alignItems:`center`,marginTop:`4px`},children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,width:`50px`},children:`Rotation`}),(0,Q.jsx)(Bt,{value:T.rotation||0,onChange:e=>L({rotation:e}),style:{flex:1,padding:`4px`}}),(0,Q.jsx)(`span`,{style:{fontSize:`11px`,color:`var(--text-secondary)`},children:`°`})]}),(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,alignItems:`center`},children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,width:`50px`},children:`Opacity`}),(0,Q.jsx)(`input`,{type:`range`,min:`0`,max:`100`,value:Math.round((T.opacity??1)*100),onChange:e=>L({opacity:parseFloat(e.target.value)/100}),style:{flex:1}}),(0,Q.jsxs)(`span`,{style:{fontSize:`11px`,color:`var(--text-secondary)`,width:`30px`,textAlign:`right`},children:[Math.round((T.opacity??1)*100),`%`]})]})]})}),(0,Q.jsx)(It,{title:`Arrange & Layers`,defaultOpen:!1,children:(0,Q.jsx)(Mt,{elementIds:t})}),(0,Q.jsx)(It,{title:`Animations`,defaultOpen:!1,children:(0,Q.jsx)(Nt,{element:T,onChange:L})}),[`node`,`shape`,`text`,`button`].includes(T.type)&&(0,Q.jsx)(It,{title:`Fill / Background`,defaultOpen:!0,children:(0,Q.jsx)(Ot,{element:T,onChange:L})}),[`node`,`shape`,`text`,`button`,`image`,`video`].includes(T.type)&&(0,Q.jsx)(It,{title:`Border & Corners`,defaultOpen:!0,children:(0,Q.jsx)(kt,{element:T,onChange:L})}),[`node`,`shape`,`image`,`video`,`text`,`button`,`icon`].includes(T.type)&&(0,Q.jsx)(It,{title:`Drop Shadow`,defaultOpen:!1,children:(0,Q.jsx)(At,{element:T,onChange:L})}),[`text`,`button`,`shape`,`node`].includes(T.type)&&(0,Q.jsx)(It,{title:`Text Formatting`,defaultOpen:!0,children:(0,Q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`6px`},children:[T.type===`text`&&(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`var(--text-secondary)`,padding:`6px`,background:`rgba(255,255,255,0.03)`,borderRadius:`4px`,border:`1px dashed var(--border-color)`,marginBottom:`6px`,textAlign:`center`},children:`Double-click text box on canvas to edit text content`}),T.type===`shape`&&(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`var(--text-secondary)`,padding:`6px`,background:`rgba(255,255,255,0.03)`,borderRadius:`4px`,border:`1px dashed var(--border-color)`,marginBottom:`6px`,textAlign:`center`},children:`Double-click shape on canvas to edit text content`}),(0,Q.jsx)(jt,{element:T,onChange:L})]})}),(0,Q.jsx)(It,{title:`Properties & Flags`,defaultOpen:!1,children:(0,Q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`6px`},children:[T.parentId&&(0,Q.jsx)(Ft,{label:`Fill Parent`,checked:!!T.fillParent,onChange:e=>L({fillParent:e})}),(0,Q.jsx)(Ft,{label:`Lock Position`,checked:!!T.locked,onChange:e=>L({locked:e}),color:`#e91e63`}),(0,Q.jsx)(Ft,{label:`Disabled`,checked:!!T.disabled,onChange:e=>L({disabled:e}),color:`#ef5350`}),(0,Q.jsx)(Ft,{label:`Hidden`,checked:!T.visible,onChange:e=>L({visible:!e}),color:`#ff9800`}),(0,Q.jsx)(Ft,{label:`Pinned`,checked:!!T.pinned,onChange:e=>L({pinned:e}),color:`#ab47bc`}),(0,Q.jsx)(Ft,{label:`Interactive Btns`,checked:!!T.interactive,onChange:e=>L({interactive:e}),color:`#42a5f5`}),T.type===`node`&&(0,Q.jsx)(Ft,{label:`Include in Presentation`,checked:T.isSlide!==!1,onChange:e=>L({isSlide:e}),color:`#3f51b5`})]})}),T.type===`node`&&(0,Q.jsx)(It,{title:`Speaker Notes`,defaultOpen:!1,children:(0,Q.jsx)(`textarea`,{value:T.speakerNotes||``,onChange:e=>L({speakerNotes:e.target.value}),placeholder:`Notes for this presentation node...`,style:{width:`100%`,minHeight:`96px`,resize:`vertical`,padding:`8px`,background:`var(--input-bg)`,color:`var(--text-primary)`,border:`1px solid var(--border-color)`,borderRadius:`6px`,fontSize:`12px`,lineHeight:1.4,boxSizing:`border-box`}})}),T.type===`button`&&(0,Q.jsx)(It,{title:`Button Action`,defaultOpen:!0,children:(0,Q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`},children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,fontWeight:600},children:`Action Type`}),(0,Q.jsxs)(`select`,{value:B.actionType||`alert`,onChange:e=>L({actionType:e.target.value}),style:{width:`100%`,padding:`4px`},children:[(0,Q.jsx)(`option`,{value:`alert`,children:`Alert`}),(0,Q.jsx)(`option`,{value:`link`,children:`Link (URL)`}),(0,Q.jsx)(`option`,{value:`toggleDisabled`,children:`Toggle Disabled State`}),(0,Q.jsx)(`option`,{value:`toggleVisibility`,children:`Toggle Visibility`}),(0,Q.jsx)(`option`,{value:`triggerFlow`,children:`Trigger Flow (Reveal Cascade)`}),(0,Q.jsx)(`option`,{value:`nextSlide`,children:`Next Slide`}),(0,Q.jsx)(`option`,{value:`prevSlide`,children:`Previous Slide`}),(0,Q.jsx)(`option`,{value:`goToSlide`,children:`Go to Slide`})]}),B.actionType===`link`&&(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,fontWeight:600,marginTop:`4px`},children:`URL`}),(0,Q.jsx)(`input`,{type:`text`,value:B.link||``,onChange:e=>L({link:e.target.value}),style:{width:`100%`}})]}),B.actionType===`goToSlide`&&(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,fontWeight:600,marginTop:`4px`},children:`Target Slide (Node)`}),(0,Q.jsxs)(`select`,{value:B.actionTarget||``,onChange:e=>L({actionTarget:e.target.value}),style:{width:`100%`,padding:`4px`},children:[(0,Q.jsx)(`option`,{value:``,children:`—`}),e.filter(e=>e.type===`node`&&e.isSlide!==!1).map(e=>(0,Q.jsxs)(`option`,{value:e.id,children:[`Slide: `,e.name||e.id.substring(0,6)]},e.id))]})]}),[`triggerFlow`,`toggleVisibility`,`toggleDisabled`].includes(B.actionType)&&(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,fontWeight:600,marginTop:`4px`},children:`Target Element`}),(0,Q.jsxs)(`select`,{value:B.actionTarget||``,onChange:e=>L({actionTarget:e.target.value}),style:{width:`100%`,padding:`4px`},children:[(0,Q.jsx)(`option`,{value:``,children:`—`}),e.filter(e=>e.id!==T.id).map(e=>(0,Q.jsxs)(`option`,{value:e.id,children:[e.type.toUpperCase(),`: `,e.name||e.id.substring(0,6)]},e.id))]})]}),B.actionType===`alert`&&(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,fontWeight:600,marginTop:`4px`},children:`Alert Message`}),(0,Q.jsx)(`input`,{type:`text`,value:B.actionTarget||``,onChange:e=>L({actionTarget:e.target.value}),style:{width:`100%`}})]})]})}),T.type===`shape`&&(0,Q.jsx)(It,{title:`Shape Settings`,defaultOpen:!0,children:(0,Q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`},children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,fontWeight:600},children:`Shape Type`}),(0,Q.jsxs)(`select`,{value:B.shapeType||`rectangle`,onChange:e=>L({shapeType:e.target.value}),style:{width:`100%`,padding:`4px`},children:[(0,Q.jsx)(`option`,{value:`rectangle`,children:`Rectangle`}),(0,Q.jsx)(`option`,{value:`ellipse`,children:`Circle / Ellipse`}),(0,Q.jsx)(`option`,{value:`line`,children:`Line`}),(0,Q.jsx)(`option`,{value:`arrow`,children:`Arrow`}),(0,Q.jsx)(`option`,{value:`elbow`,children:`Elbow Connector`}),(0,Q.jsx)(`option`,{value:`triangle`,children:`Triangle`}),(0,Q.jsx)(`option`,{value:`rightTriangle`,children:`Right Triangle`}),(0,Q.jsx)(`option`,{value:`diamond`,children:`Diamond`}),(0,Q.jsx)(`option`,{value:`pentagon`,children:`Pentagon`}),(0,Q.jsx)(`option`,{value:`hexagon`,children:`Hexagon`}),(0,Q.jsx)(`option`,{value:`star`,children:`Star`}),(0,Q.jsx)(`option`,{value:`parallelogram`,children:`Parallelogram`}),(0,Q.jsx)(`option`,{value:`trapezoid`,children:`Trapezoid`}),(0,Q.jsx)(`option`,{value:`arrowRight`,children:`Arrow Right`}),(0,Q.jsx)(`option`,{value:`arrowLeft`,children:`Arrow Left`}),(0,Q.jsx)(`option`,{value:`arrowUp`,children:`Arrow Up`}),(0,Q.jsx)(`option`,{value:`arrowDown`,children:`Arrow Down`})]})]})}),[`image`,`video`].includes(T.type)&&(0,Q.jsx)(It,{title:`Media Settings`,defaultOpen:!0,children:(0,Q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`},children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,fontWeight:600},children:`URL`}),(0,Q.jsx)(`input`,{type:`text`,value:B.src||``,onChange:e=>{let t=e.target.value,n=t.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)||t.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/),r=t;n&&n[1]&&(T.type===`image`?r=`https://lh3.googleusercontent.com/d/${n[1]}`:T.type===`video`&&(r=`https://drive.google.com/file/d/${n[1]}/preview`)),T.type===`image`?z(r):L({src:r})},style:{width:`100%`},placeholder:`https://...`}),T.type===`image`&&(0,Q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`,marginTop:`8px`},children:[(0,Q.jsx)(Ft,{label:`Custom Quality`,checked:T.imageQuality!==void 0,onChange:e=>L({imageQuality:e?100:void 0}),color:`#4caf50`}),T.imageQuality!==void 0&&(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,alignItems:`center`},children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,width:`70px`},children:`Quality`}),(0,Q.jsx)(Bt,{value:T.imageQuality,onChange:e=>L({imageQuality:Math.max(1,Math.min(100,e))}),style:{flex:1,padding:`4px`},min:1,max:100}),(0,Q.jsx)(`span`,{style:{fontSize:`11px`,color:`var(--text-secondary)`},children:`%`})]})]}),T.type===`image`&&(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(`input`,{type:`file`,accept:`image/*`,onChange:async e=>{let t=e.target.files?.[0];if(t)try{if(t.size>12*1024*1024){await ee(`Image is too large. Please choose an image under 12MB.`,`Upload image`);return}let e=await zt(t);L({src:e.src,...Lt(e.width,e.height),alt:t.name})}catch(e){console.error(`Failed to upload image`,e),await ee(`Could not process this image. Please try another file.`,`Upload image`)}finally{e.target.value=``}},style:{width:`100%`,fontSize:`11px`}}),(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,fontWeight:600,marginTop:`4px`},children:`Alt Text`}),(0,Q.jsx)(`input`,{type:`text`,value:B.alt||``,onChange:e=>L({alt:e.target.value}),style:{width:`100%`}}),(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,fontWeight:600,marginTop:`4px`},children:`Object Fit`}),(0,Q.jsxs)(`select`,{value:B.objectFit||`cover`,onChange:e=>L({objectFit:e.target.value}),style:{width:`100%`,padding:`4px`},children:[(0,Q.jsx)(`option`,{value:`contain`,children:`Contain`}),(0,Q.jsx)(`option`,{value:`cover`,children:`Cover`}),(0,Q.jsx)(`option`,{value:`fill`,children:`Fill`})]})]})]})}),T.type===`icon`&&(0,Q.jsx)(It,{title:`Icon Settings`,defaultOpen:!0,children:(0,Q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`},children:[(0,Q.jsx)(`div`,{style:{fontSize:`11px`,color:`#8c8d9c`,fontWeight:600},children:`Icon Name`}),(0,Q.jsx)(`select`,{value:B.iconName||`home`,onChange:e=>L({iconName:e.target.value}),style:{width:`100%`,padding:`4px`},children:Object.keys(Re).map(e=>(0,Q.jsx)(`option`,{value:e,children:e.toUpperCase()},e))}),(0,Q.jsx)(Dt,{label:`Icon Color`,name:`iconColor`,value:B.iconColor||`var(--text-primary)`,onChange:e=>L({iconColor:e.target.value}),onTransparent:()=>L({iconColor:`transparent`})})]})})]}),(0,Q.jsxs)(`div`,{style:{marginTop:`auto`,paddingTop:`12px`,display:`flex`,flexDirection:`column`,gap:`6px`,flexShrink:0},children:[(0,Q.jsx)(`button`,{onClick:()=>v(!0),className:`btn`,style:{width:`100%`,padding:`10px`,background:`#3f51b5`,color:`#fff`,border:`none`,borderRadius:`6px`,cursor:`pointer`,fontWeight:600,display:`flex`,alignItems:`center`,justifyContent:`center`,gap:`6px`},children:`Present Slideshow`}),(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`6px`},children:[(0,Q.jsx)(`button`,{onClick:()=>r(T.id),style:{flex:1,padding:`10px`,background:`none`,border:`1px solid var(--border-color)`,color:`#ef5350`,borderRadius:`6px`,cursor:`pointer`,fontWeight:500},children:`Delete`}),(0,Q.jsx)(`button`,{onClick:P,style:{flex:1,padding:`10px`,background:`none`,border:`1px solid var(--border-color)`,color:`var(--text-primary)`,borderRadius:`6px`,cursor:`pointer`,fontWeight:500},children:`Preview`}),(0,Q.jsx)(`button`,{onClick:N,className:`btn primary`,style:{flex:1,padding:`10px`},children:`Export`})]})]}),ce()]})},Ht=()=>{let{elements:e,selectedIds:t,selectElement:n,updateElement:r,bringForward:a,sendBackward:o,reorderElements:l}=bt(),[u,d]=(0,R.useState)(!1),[h,g]=(0,R.useState)(null),[_,v]=(0,R.useState)(``),y=R.useRef(null),b=(e,t)=>{y.current=t,e.dataTransfer.effectAllowed=`move`,e.dataTransfer.setData(`text/plain`,t)},x=(e,t)=>{y.current!==t&&e.preventDefault()},S=(e,t)=>{e.preventDefault();let n=y.current||e.dataTransfer.getData(`text/plain`);n&&n!==t&&l(n,t),y.current=null},C=[...e].sort((e,t)=>(t.zIndex||0)-(e.zIndex||0)),w=e=>{switch(e){case`text`:return(0,Q.jsx)(ee,{size:14,color:`#42a5f5`});case`shape`:return(0,Q.jsx)(E,{size:14,color:`#4caf50`});case`image`:return(0,Q.jsx)(ne,{size:14,color:`#ab47bc`});case`video`:return(0,Q.jsx)(ie,{size:14,color:`#ef5350`});case`button`:return(0,Q.jsx)(ue,{size:14,color:`#ff9800`});default:return(0,Q.jsx)(k,{size:14,color:`#8c8d9c`})}},T=e=>{g(e.id),v(e.name||e.type.toUpperCase())},te=e=>{_.trim()&&r(e,{name:_.trim()}),g(null)};return u?(0,Q.jsxs)(`div`,{style:{position:`absolute`,left:`70px`,top:`402px`,bottom:`20px`,width:`240px`,backgroundColor:`var(--bg-panel)`,backdropFilter:`blur(12px)`,border:`1px solid var(--border-color)`,borderRadius:`16px`,display:`flex`,flexDirection:`column`,zIndex:999,boxShadow:`0 8px 32px rgba(0,0,0,0.4)`,overflow:`hidden`,transition:`all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`},children:[(0,Q.jsxs)(`div`,{style:{padding:`12px 16px`,background:`var(--panel-header-bg)`,borderBottom:`1px solid var(--border-color)`,display:`flex`,alignItems:`center`,justifyContent:`space-between`},children:[(0,Q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,Q.jsx)(k,{size:16,color:`var(--text-primary)`}),(0,Q.jsx)(`span`,{style:{fontSize:`13px`,fontWeight:600,color:`var(--text-primary)`},children:`Layers`})]}),(0,Q.jsx)(`button`,{onClick:()=>d(!1),style:{background:`none`,border:`none`,color:`var(--text-secondary)`,cursor:`pointer`,fontSize:`11px`,padding:`2px 6px`,borderRadius:`4px`},className:`btn`,children:`Hide`})]}),(0,Q.jsx)(`div`,{style:{flex:1,overflowY:`auto`,padding:`8px`,display:`flex`,flexDirection:`column`,gap:`4px`},children:C.length===0?(0,Q.jsx)(`div`,{style:{padding:`20px 10px`,textAlign:`center`,color:`var(--text-secondary)`,fontSize:`11px`},children:`No elements on canvas`}):C.map((l,u)=>{let d=t.includes(l.id);return(0,Q.jsxs)(`div`,{onClick:()=>n(l.id,!1),draggable:!0,onDragStart:e=>b(e,l.id),onDragOver:e=>x(e,l.id),onDrop:e=>S(e,l.id),style:{display:`flex`,alignItems:`center`,padding:`8px 10px`,borderRadius:`8px`,backgroundColor:d?`rgba(76, 175, 80, 0.15)`:`transparent`,border:`1px solid ${d?`#4caf50`:`transparent`}`,cursor:`grab`,userSelect:`none`,transition:`all 0.2s`,gap:`8px`},className:`layer-item`,children:[w(l.type),(0,Q.jsx)(`div`,{style:{flex:1,minWidth:0},children:h===l.id?(0,Q.jsx)(`input`,{type:`text`,value:_,onChange:e=>v(e.target.value),onBlur:()=>te(l.id),onKeyDown:e=>{e.key===`Enter`&&te(l.id),e.key===`Escape`&&g(null)},autoFocus:!0,style:{width:`100%`,padding:`2px 4px`,fontSize:`11px`,background:`rgba(0,0,0,0.3)`,border:`1px solid #4caf50`,borderRadius:`4px`,color:`#fff`,outline:`none`}}):(0,Q.jsx)(`span`,{onDoubleClick:()=>T(l),style:{fontSize:`11px`,fontWeight:d?600:400,color:l.visible?`var(--text-primary)`:`var(--text-secondary)`,textDecoration:l.visible?`none`:`line-through`,whiteSpace:`nowrap`,overflow:`hidden`,textOverflow:`ellipsis`,display:`block`},title:`Double-click to rename`,children:l.name||`${l.type.toUpperCase()} ${e.length-u}`})}),d&&(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`2px`,marginRight:`4px`},children:[(0,Q.jsx)(`button`,{onClick:e=>{e.stopPropagation(),a(l.id)},style:{background:`none`,border:`none`,color:`var(--text-secondary)`,padding:`2px`,cursor:`pointer`},title:`Move Up`,children:(0,Q.jsx)(c,{size:10})}),(0,Q.jsx)(`button`,{onClick:e=>{e.stopPropagation(),o(l.id)},style:{background:`none`,border:`none`,color:`var(--text-secondary)`,padding:`2px`,cursor:`pointer`},title:`Move Down`,children:(0,Q.jsx)(s,{size:10})})]}),(0,Q.jsxs)(`div`,{style:{display:`flex`,gap:`4px`,alignItems:`center`},children:[(0,Q.jsx)(`button`,{onClick:e=>{e.stopPropagation(),r(l.id,{visible:!l.visible})},style:{background:`none`,border:`none`,color:l.visible?`var(--text-primary)`:`var(--text-secondary)`,cursor:`pointer`,padding:`2px`},children:l.visible?(0,Q.jsx)(f,{size:12}):(0,Q.jsx)(p,{size:12,opacity:.5})}),(0,Q.jsx)(`button`,{onClick:e=>{e.stopPropagation(),r(l.id,{locked:!l.locked})},style:{background:`none`,border:`none`,color:l.locked?`#e91e63`:`var(--text-secondary)`,cursor:`pointer`,padding:`2px`},children:l.locked?(0,Q.jsx)(i,{size:12}):(0,Q.jsx)(m,{size:12,opacity:.4})})]})]},l.id)})})]}):(0,Q.jsx)(`button`,{onClick:()=>d(!0),style:{position:`fixed`,left:`16px`,bottom:`16px`,width:`44px`,height:`44px`,borderRadius:`50%`,backgroundColor:`var(--bg-toolbar)`,border:`1px solid var(--border-color)`,display:`flex`,alignItems:`center`,justifyContent:`center`,cursor:`pointer`,zIndex:1e3,boxShadow:`0 4px 12px rgba(0,0,0,0.3)`,color:`var(--text-primary)`,transition:`all 0.2s`},title:`Show Layers Panel`,children:(0,Q.jsx)(k,{size:20})})},Ut=[{value:`blank`,label:`Blank`},{value:`title`,label:`Title`},{value:`titleBody`,label:`Title + Body`},{value:`section`,label:`Section`},{value:`media`,label:`Media`}],Wt=()=>{let{elements:e,selectedIds:t,selectElement:n,removeElement:r,updateElement:i,addSlideNode:a,duplicateSlideNode:o,moveSlideNode:s,setCurrentSlideIndex:c,saveHistory:u}=bt(),[d,m]=R.useState(!1),[h,g]=R.useState(`titleBody`),v=e.filter(e=>e.type===`node`).sort((e,t)=>e.x-t.x),b=v.filter(e=>e.isSlide!==!1),S=e=>{n(e,!1);let t=b.findIndex(t=>t.id===e);t>=0&&c(t)};return d?(0,Q.jsxs)(`aside`,{className:`slide-navigator`,"aria-label":`Slide nodes`,children:[(0,Q.jsxs)(`div`,{className:`slide-navigator-header`,children:[(0,Q.jsxs)(`div`,{children:[(0,Q.jsx)(`div`,{className:`slide-navigator-title`,children:`Slides`}),(0,Q.jsx)(`div`,{className:`slide-navigator-subtitle`,children:`Freeform nodes`})]}),(0,Q.jsx)(`button`,{className:`slide-icon-btn`,onClick:()=>a(h),title:`Add slide node`,children:(0,Q.jsx)(se,{size:16})}),(0,Q.jsx)(`button`,{className:`slide-header-hide`,onClick:()=>m(!1),title:`Hide slide nodes`,children:`Hide`})]}),(0,Q.jsx)(`div`,{className:`slide-layout-row`,children:(0,Q.jsx)(`select`,{value:h,onChange:e=>g(e.target.value),title:`New slide layout`,children:Ut.map(e=>(0,Q.jsx)(`option`,{value:e.value,children:e.label},e.value))})}),(0,Q.jsx)(`div`,{className:`slide-node-list`,children:v.length===0?(0,Q.jsx)(`div`,{className:`slide-empty-state`,children:`No nodes yet`}):v.map((n,a)=>{let c=t.includes(n.id),d=e.filter(e=>e.parentId===n.id),m=b.findIndex(e=>e.id===n.id),h=m>=0;return(0,Q.jsxs)(`div`,{className:`slide-node-card ${c?`active`:``} ${h?``:`excluded`}`,onClick:()=>S(n.id),children:[(0,Q.jsx)(`div`,{className:`slide-node-index`,children:h?m+1:`off`}),(0,Q.jsx)(`div`,{className:`slide-node-thumb`,children:(0,Q.jsxs)(`div`,{className:`slide-node-frame`,children:[(0,Q.jsx)(`div`,{className:`slide-node-name`,children:n.name||`Node ${a+1}`}),d.slice(0,3).map(e=>(0,Q.jsx)(`div`,{className:`slide-thumb-line ${e.type}`},e.id))]})}),(0,Q.jsxs)(`div`,{className:`slide-node-meta`,children:[(0,Q.jsxs)(`span`,{children:[Math.round(n.width),` x `,Math.round(n.height)]}),(0,Q.jsx)(`button`,{className:`slide-mini-btn`,onClick:e=>{e.stopPropagation(),u(),i(n.id,{isSlide:!h})},title:h?`Remove from presentation`:`Restore to presentation`,children:h?(0,Q.jsx)(f,{size:12}):(0,Q.jsx)(p,{size:12})})]}),(0,Q.jsxs)(`div`,{className:`slide-node-actions`,children:[(0,Q.jsx)(`button`,{className:`slide-mini-btn`,onClick:e=>{e.stopPropagation(),s(n.id,`left`)},disabled:!h||m===0,title:`Move earlier`,children:(0,Q.jsx)(x,{size:12})}),(0,Q.jsx)(`button`,{className:`slide-mini-btn`,onClick:e=>{e.stopPropagation(),s(n.id,`right`)},disabled:!h||m===b.length-1,title:`Move later`,children:(0,Q.jsx)(y,{size:12})}),(0,Q.jsx)(`button`,{className:`slide-mini-btn`,onClick:e=>{e.stopPropagation(),o(n.id)},title:`Duplicate slide node`,children:(0,Q.jsx)(l,{size:12})}),(0,Q.jsx)(`button`,{className:`slide-mini-btn danger`,onClick:e=>{e.stopPropagation(),r(n.id)},title:`Delete slide node`,children:(0,Q.jsx)(j,{size:12})})]})]},n.id)})})]}):(0,Q.jsx)(`button`,{className:`floating-panel-toggle slide-toggle`,onClick:()=>m(!0),title:`Show slide nodes`,children:(0,Q.jsx)(_,{size:20})})};function Gt(){let{theme:e,isPresenting:t}=bt();return(0,Q.jsxs)(`div`,{className:`app-container ${e}-theme ${t?`is-presenting`:``}`,children:[!t&&(0,Q.jsx)(St,{}),(0,Q.jsxs)(`div`,{className:`editor-workspace`,children:[!t&&(0,Q.jsx)(Ct,{}),!t&&(0,Q.jsx)(Wt,{}),!t&&(0,Q.jsx)(Ht,{}),(0,Q.jsx)(Et,{}),!t&&(0,Q.jsx)(Vt,{})]})]})}function Kt(){return(0,Q.jsx)(yt,{children:(0,Q.jsx)(Gt,{})})}(0,z.createRoot)(document.getElementById(`root`)).render((0,Q.jsx)(R.StrictMode,{children:(0,Q.jsx)(Kt,{})}));