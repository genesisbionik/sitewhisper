"use strict";(()=>{var e={};e.id=555,e.ids=[555],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2169:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>m,patchFetch:()=>w,requestAsyncStorage:()=>u,routeModule:()=>c,serverHooks:()=>l,staticGenerationAsyncStorage:()=>d});var a={};r.r(a),r.d(a,{POST:()=>p});var o=r(9303),n=r(8716),i=r(3131),s=r(7070);async function p(e){try{let{url:t}=await e.json(),r=await fetch("https://crawl4ai-production.up.railway.app/crawl",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({urls:[t],priority:10})}),a=await r.json(),o=[{id:"primary-content",title:"Primary Content",content:a.summary||"Content extracted from homepage",type:"content"},{id:"navigation",title:"Site Navigation",content:"Navigation structure extracted from the website",type:"navigation"},{id:"contact",title:"Contact Information",content:"Contact details extracted from the website",type:"contact"}];return s.NextResponse.json({taskId:a.task_id,url:a.url,pagesCrawled:a.pages_crawled,memoryBlocks:o})}catch(e){return console.error("Crawler error:",e),s.NextResponse.json({error:"Failed to crawl website"},{status:500})}}let c=new o.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/crawl/route",pathname:"/api/crawl",filename:"route",bundlePath:"app/api/crawl/route"},resolvedPagePath:"/Users/Steve/Documents/SiteWhisperAi/app/api/crawl/route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:u,staticGenerationAsyncStorage:d,serverHooks:l}=c,m="/api/crawl/route";function w(){return(0,i.patchFetch)({serverHooks:l,staticGenerationAsyncStorage:d})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[92,972],()=>r(2169));module.exports=a})();