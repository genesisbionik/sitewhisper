(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[398],{5114:function(e,t,n){Promise.resolve().then(n.bind(n,4630))},4630:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return f}});var s=n(7437),a=n(2265),i=n(2869),o=n(473),r=n(8905),c=n(8453),l=n(8066),d=n(2735),u=n(7992),m=n(257);function f(){let[e,t]=(0,a.useState)([{role:"assistant",content:"\uD83D\uDC4B Welcome to SiteWhisper! Enter any website URL above to analyze and transform web content into AI-ready knowledge. I'll help you extract valuable information and create structured data that AI systems can understand.\n\nLet's begin! Just paste a URL to get started. ✨"}]),[n,f]=(0,a.useState)(!1),[h,x]=(0,a.useState)([]),[g,p]=(0,a.useState)(75),{toast:v}=(0,u.pm)();(0,a.useEffect)(()=>{var e;console.log("Environment check:",{hasDeepSeekKey:!!m.env.NEXT_PUBLIC_DEEPSEEK_API_KEY,keyLength:null===(e=m.env.NEXT_PUBLIC_DEEPSEEK_API_KEY)||void 0===e?void 0:e.length,nodeEnv:"production"})},[]);let b=async e=>{if(g<10){v({title:"Not enough tokens",description:"Please purchase more tokens to continue scanning.",variant:"destructive"});return}f(!0),t(t=>[...t,{role:"user",content:"Analyzing ".concat(e)}]),await new Promise(e=>setTimeout(e,2e3));let n=[{id:"1",title:"Main Content",content:"Primary content extracted from the homepage discussing key features and benefits.",confidence:95},{id:"2",title:"Navigation Structure",content:"Site navigation pattern identified with main sections and hierarchical organization.",confidence:88},{id:"3",title:"Contact Information",content:"Contact details and communication channels extracted from footer and contact pages.",confidence:92}];x(n),t(e=>[...e,{role:"assistant",content:n.map(e=>e.content).join("\n\n")}]),f(!1),p(e=>e-10)};return(0,s.jsx)("div",{className:"flex h-[calc(100vh-4rem)] flex-col gap-4 p-4",children:(0,s.jsxs)("div",{className:"grid gap-4 lg:grid-cols-[1fr,280px]",children:[(0,s.jsxs)("div",{className:"flex flex-col rounded-lg border bg-background shadow-sm",children:[(0,s.jsx)("div",{className:"flex items-center gap-2 border-b p-4",children:(0,s.jsx)(c.$,{onSubmit:b,isLoading:n})}),(0,s.jsx)("div",{className:"flex-1 overflow-auto",children:(0,s.jsxs)("div",{className:"divide-y",children:[e.map((e,t)=>(0,s.jsx)(o.J,{...e},t)),n&&(0,s.jsx)(o.J,{role:"assistant",content:"",isLoading:!0})]})})]}),(0,s.jsxs)("div",{className:"flex flex-col gap-4",children:[(0,s.jsx)(l.Y,{availableTokens:g,maxTokens:100}),(0,s.jsxs)("div",{className:"flex items-center justify-between",children:[(0,s.jsx)("h2",{className:"text-lg font-semibold",children:"Memory Blocks"}),(0,s.jsxs)(i.z,{variant:"outline",size:"sm",onClick:()=>{if(g<5){v({title:"Not enough tokens",description:"Please purchase more tokens to export data.",variant:"destructive"});return}console.log("Exporting data..."),p(e=>e-5),v({title:"Export successful",description:"Your data has been exported successfully."})},disabled:0===h.length,children:[(0,s.jsx)(d.Z,{className:"mr-2 h-4 w-4"}),"Export"]})]}),(0,s.jsxs)("div",{className:"space-y-4",children:[h.map(e=>(0,s.jsx)(r.f,{...e,isSelected:!1,onClick:()=>{},url:""},e.id)),0===h.length&&(0,s.jsx)("div",{className:"rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground",children:"No memory blocks yet. Start by analyzing a website."})]})]})]})})}}},function(e){e.O(0,[50,808,280,971,117,744],function(){return e(e.s=5114)}),_N_E=e.O()}]);