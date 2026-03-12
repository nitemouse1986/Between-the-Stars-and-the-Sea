import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Plane, MapPin, Compass, CheckSquare, Square, Anchor } from "lucide-react";

const T = {
  ocean:"#0A2239",jungle:"#1B4332",gold:"#D4AF37",terra:"#E07A5F",
  paper:"#F4EEDD",paperd:"#E8DABC",ink:"#1A1209",
  waPink:"#F2C6B4",waCream:"#FDF6E3",waSage:"#B8C9A3",
  waMust:"#E8C84A",waBlue:"#A8C5D8",waBrick:"#C8654A",
  sm:"'Space Mono','Courier New',monospace",
  ser:"'Fraunces','Playfair Display',Georgia,serif",
};
const TAPE=["#E07A5F","#D4AF37","#2D6A4F","#7B5E2A","#457B9D","#8B4513","#C45E3A","#6B8E6B"];
const ROTS=[-2.1,1.8,-1.4,2.3,-1.0,2.6,-1.7,1.3,-2.4,1.6,-1.1,2.0,-1.8,1.5,-2.2,1.9,-1.3];
const WA_NUMBER="15551234567";
const WA_MESSAGE="Hi! I have a question about our May 2026 expedition booking.";

const DAYS=[
  {day:"Day 1",date:"May 12",title:"The Departure",location:"New York (JFK)",img:"/images/The_Departure.jpg",desc:"The journey begins. Boarding Etihad EY2 business class out of JFK, leaving the concrete jungle for the actual jungle."},
  {day:"Day 2",date:"May 13",title:"Chasing the Sun",location:"Abu Dhabi (AUH)",img:"/images/Chasing_the_Sun.jpg",desc:"Connecting in Abu Dhabi on EY392. A day lost to the clouds, crossing time zones and oceans."},
  {day:"Day 3",date:"May 14",title:"The Gathering",location:"Habarana, Sri Lanka",img:"/images/The_Gathering.jpg",desc:"Touchdown in Colombo. Drive to Water Garden Sigiriya. Afternoon private jeep safari at Minneriya — the largest gathering of wild Asian elephants on earth."},
  {day:"Day 4",date:"May 15",title:"The Lion Rock",location:"Sigiriya & Polonnaruwa",img:"/images/The_Lion_Rock.jpg",desc:"Morning climb up the 1,200 steps of the ancient Sigiriya Rock Fortress. Afternoon exploring the ruins of the 11th-century Polonnaruwa Kingdom."},
  {day:"Day 5",date:"May 16",title:"The Sacred Tooth",location:"Kandy, Sri Lanka",img:"/images/The_Sacred_Tooth.jpg",desc:"Journey to the hill capital. Exploring the Temple of the Sacred Tooth Relic. Checking into Adigar's Manor. Evening Puja ceremony at 18:30."},
  {day:"Day 6",date:"May 17",title:"The Emerald Railway",location:"Nuwara Eliya → Ella",img:"/images/The_Emerald_Railway.jpg",desc:"Boarding the world-famous panoramic train through the misty tea plantations. Then driving to the wild edge of Yala National Park."},
  {day:"Day 7",date:"May 18",title:"Leopard Country",location:"Yala National Park",img:"/images/Leopard_Country.jpg",desc:"Two private jeep safaris — morning and afternoon — tracking the elusive Sri Lankan leopard through Block 1. Highest leopard density on earth."},
  {day:"Day 8",date:"May 19",title:"Dutch Forts & City Lights",location:"Galle & Colombo",img:"/images/Dutch_Forts___City_Lights.jpg",desc:"Driving the coast to explore the 17th-century Galle Dutch Fort (UNESCO). Final Sri Lankan night at Shangri-La Colombo. Dinner at Ministry of Crab."},
  {day:"Day 9",date:"May 20",title:"Island Hopping",location:"Colombo → Jakarta → Bali",img:"/images/Island_Hopping.jpg",desc:"Departing CMB on SriLankan UL364, connecting in Jakarta (clear Indonesian e-VOA here), landing in Denpasar. Joumpa VIP arrival bypasses immigration."},
  {day:"Day 10",date:"May 21",title:"Acclimation",location:"Alila Villas Uluwatu",img:"/images/Acclimation.jpg",desc:"A totally unstructured day to recover from travel. Cliffside infinity pool, Bintang beers, and tropical breezes 100m above the Indian Ocean."},
  {day:"Day 11",date:"May 22",title:"Setting Sail",location:"Komodo Islands",img:"/images/Setting_Sail.jpg",desc:"Early Batik Air flight to Labuan Bajo. Boarding the Zada Nara Liveaboard Master Suite. Sailing to Kelor Island, snorkeling at Manjarite, sunset at Kalong."},
  {day:"Day 12",date:"May 23",title:"Prehistoric Seas",location:"Padar Island & Pink Beach",img:"/images/Prehistoric_Seas.png",desc:"Pre-dawn hike at Padar Island. Afternoon on the legendary Pink Beach. Swimming with gentle giants at Manta Point. Dinner under the Milky Way."},
  {day:"Day 13",date:"May 24",title:"Return to the Gods",location:"Ubud, Bali",img:"/images/Return_to_the_Gods.jpg",desc:"Final morning on the Zada Nara before flying AirAsia back to Bali. Checking into The Kayon Jungle Resort for the final leg of the birthday celebration."},
  {day:"Day 14",date:"May 25",title:"Jungle & Spa",location:"Ubud, Bali",img:"/images/Jungle___Spa.jpg",desc:"Unstructured adventure day. Evening dinner at Kubu at Mandapa — private cocoon pods suspended over the Ayung River gorge. Smart casual enforced."},
  {day:"Day 15",date:"May 26",title:"Beach Club Hedonism",location:"Bali",img:"/images/Beach_Club_Hedonism.jpg",desc:"Unstructured day. Daybed at Potato Head Beach Club or Savaya for sunset cocktails and beats above the Indian Ocean."},
  {day:"Day 16",date:"May 27",title:"The Final Sunset",location:"Bali",img:"/images/The_Final_Sunset.jpg",desc:"Our last full day. A massive 40th birthday dinner feast. Note: 15-hour gap between check-out and 03:35 flight — arrange day-use room in advance."},
  {day:"Day 17",date:"May 28",title:"The Midnight Flight",location:"Bali → Dubai → New York",img:"/images/The_Midnight_Flight.jpg",desc:"Departing Bali at 03:35 on Emirates EK0399. Shower at Emirates Lounge in Dubai. Touching down at JFK at 14:15 EST — carrying the whole expedition home."},
];

const PACKING=[
  {category:"The Essentials & Docs",color:T.ocean,items:["Passports (Valid 6+ months)","Printed E-Visas (Sri Lanka & Indonesia)","Travel Insurance Docs","International Driving Permit","Zada Liveaboard & Ceylon Tour Confirmations","Etihad, Batik & AirAsia Boarding Passes","Cash (USD for exchange)","Credit Cards (No foreign transaction fees)"]},
  {category:"Safari & Adventure",color:T.jungle,items:["Sturdy trail/hiking shoes (Padar & Sigiriya)","Neutral/Khaki lightweight trousers","Breathable moisture-wicking tees","Binoculars (Yala Leopard spotting)","High-DEET Mosquito Repellent","Lightweight rain shell","Dry bag (for Liveaboard transfers)","GoPro with underwater housing & floatie","Reef-safe SPF 50+ Sunscreen","Motion sickness pills/patches"]},
  {category:"Resort & Evening (Bali)",color:"#7B5E2A",items:["Linen button-down shirts","Chino shorts","Evening loafers / nice sandals","Silk or lightweight evening shirts","Signature evening cologne","Lightweight blazer (optional)","Sunglasses (Polarized)"]},
  {category:"Temple & Culture",color:"#5C4A1E",items:["Sarong (or buy locally)","T-shirts covering shoulders","Easy slip-on/off shoes (for temple entry)","Lightweight pants covering knees"]},
  {category:"Apparel Basics",color:"#2D6A4F",items:["Underwear (18+ pairs)","Socks (10+ pairs, mostly ankle/hiking)","Sleepwear","Swim trunks (3-4 pairs)","Rashguard (for Manta snorkeling)","Everyday walking sneakers","Flip-flops / slides"]},
  {category:"Tech & Apothecary",color:"#457B9D",items:["Universal Power Adapters (UK for SL, EU for Indo)","Power banks (High capacity)","Kindle / Books","Noise-canceling headphones","Aloe Vera / Aftersun","Basic First Aid (Bandaids, Advil, Imodium)","Daily medications & vitamins"]},
];

const STOPS=[
  {id:"JFK",label:"New York",x:178,y:138,flag:"🇺🇸"},
  {id:"AUH",label:"Abu Dhabi",x:490,y:168,flag:"🇦🇪"},
  {id:"CMB",label:"Colombo",x:538,y:215,flag:"🇱🇰"},
  {id:"CGK",label:"Jakarta",x:598,y:252,flag:"🇮🇩"},
  {id:"DPS",label:"Bali",x:622,y:258,flag:"🇮🇩"},
  {id:"LBJ",label:"Labuan Bajo",x:642,y:262,flag:"🦎"},
  {id:"DXB",label:"Dubai",x:484,y:163,flag:"🇦🇪"},
];
function arcPath(x1,y1,x2,y2,bend=40){
  const mx=(x1+x2)/2,my=(y1+y2)/2-bend;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}
const FLIGHT_ARCS=[
  {from:"JFK",to:"AUH",label:"EY2",bend:55},
  {from:"AUH",to:"CMB",label:"EY392",bend:30},
  {from:"CMB",to:"CGK",label:"UL364",bend:25},
  {from:"CGK",to:"DPS",label:"GA428",bend:10},
  {from:"DPS",to:"LBJ",label:"ID6333",bend:8},
  {from:"LBJ",to:"DPS",label:"QZ647",bend:-8},
  {from:"DPS",to:"DXB",label:"EK399",bend:40},
  {from:"DXB",to:"JFK",label:"EK201",bend:60},
];

function Grain(){
  return <div style={{position:"fixed",inset:0,zIndex:9998,pointerEvents:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,opacity:0.04,mixBlendMode:"overlay"}}/>;
}

function WhatsAppBubble(){
  const [hov,setHov]=useState(false);
  const url=`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;
  return(
    <motion.a href={url} target="_blank" rel="noopener noreferrer"
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      animate={{scale:hov?1.08:1}} transition={{type:"spring",stiffness:300,damping:20}}
      style={{position:"fixed",bottom:28,right:28,zIndex:9999,width:60,height:60,borderRadius:"50%",
        background:"linear-gradient(135deg, #25D366, #128C7E)",display:"flex",alignItems:"center",
        justifyContent:"center",boxShadow:"0 6px 28px rgba(37,211,102,0.45)",textDecoration:"none",cursor:"pointer"}}>
      <svg viewBox="0 0 32 32" width={32} height={32} fill="white">
        <path d="M16 2C8.268 2 2 8.268 2 16c0 2.455.64 4.76 1.757 6.76L2 30l7.43-1.73A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.83-1.594l-.418-.248-4.41 1.027 1.057-4.303-.274-.44A11.46 11.46 0 0 1 4.5 16C4.5 9.596 9.596 4.5 16 4.5S27.5 9.596 27.5 16 22.404 27.5 16 27.5zm6.29-8.61c-.345-.172-2.04-1.006-2.355-1.12-.316-.113-.546-.172-.775.172-.23.344-.888 1.12-1.09 1.35-.2.23-.4.258-.745.086-.345-.172-1.456-.537-2.773-1.71-1.025-.914-1.717-2.042-1.918-2.386-.2-.345-.022-.53.15-.702.155-.154.345-.4.517-.6.172-.2.23-.345.345-.574.115-.23.057-.43-.028-.602-.086-.172-.776-1.87-1.063-2.56-.28-.672-.564-.58-.775-.59l-.66-.01c-.23 0-.6.086-.915.43-.316.344-1.205 1.178-1.205 2.871 0 1.694 1.233 3.33 1.405 3.56.172.23 2.427 3.706 5.882 5.196.822.355 1.464.567 1.964.726.825.263 1.576.226 2.17.137.662-.1 2.04-.833 2.328-1.637.287-.805.287-1.494.2-1.637-.085-.143-.315-.23-.66-.4z"/>
      </svg>
      <motion.div animate={{opacity:hov?1:0,x:hov?0:10}}
        style={{position:"absolute",right:70,top:"50%",transform:"translateY(-50%)",background:T.ocean,
          color:T.paper,borderRadius:4,padding:"6px 12px",whiteSpace:"nowrap",fontFamily:T.sm,
          fontSize:9,letterSpacing:"0.1em",pointerEvents:"none",boxShadow:"0 4px 14px rgba(0,0,0,0.3)"}}>
        Message Vendors
      </motion.div>
    </motion.a>
  );
}

function FlightMap(){
  const stopMap=Object.fromEntries(STOPS.map(s=>[s.id,s]));
  const [active,setActive]=useState(null);
  return(
    <section id="flight-map" style={{background:"#0d1b2a",padding:"0 0 0"}}>
      <div style={{padding:"64px 56px 32px",maxWidth:980,margin:"0 auto"}}>
        <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7}} style={{textAlign:"center"}}>
          <p style={{fontFamily:T.sm,fontSize:9,color:T.terra,letterSpacing:"0.32em",textTransform:"uppercase",marginBottom:12}}>5 Airlines · 8 Flight Legs</p>
          <h2 style={{fontFamily:T.ser,fontSize:"clamp(32px,5vw,58px)",fontStyle:"italic",fontWeight:900,color:T.paper,margin:0}}>The Flight Plan</h2>
          <div style={{width:56,height:5,background:T.gold,margin:"14px auto 0",borderRadius:3}}/>
        </motion.div>
      </div>
      <div style={{position:"sticky",top:0,zIndex:100,background:"#0d1b2a"}}>
        <div style={{maxWidth:980,margin:"0 auto",padding:"0 24px 24px"}}>
          <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{duration:1}}
            style={{border:"1px solid rgba(212,175,55,0.18)",borderRadius:6,overflow:"hidden",background:"rgba(10,34,57,0.95)"}}>
            <svg viewBox="0 0 800 380" style={{width:"100%",height:"auto",display:"block"}}>
              <defs>
                <filter id="glow"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={T.gold} opacity="0.7"/></marker>
              </defs>
              <rect width="800" height="380" fill="#0d1b2a"/>
              <path d="M80,60 L220,55 L240,90 L230,130 L210,160 L190,175 L160,170 L130,155 L100,140 L80,110 Z" fill="#1B3A2A" stroke="rgba(212,175,55,0.12)" strokeWidth="0.5"/>
              <path d="M355,60 L430,55 L445,75 L440,100 L420,110 L395,108 L370,95 L355,75 Z" fill="#1B3A2A" stroke="rgba(212,175,55,0.12)" strokeWidth="0.5"/>
              <path d="M360,115 L415,110 L430,140 L425,200 L400,240 L375,235 L355,200 L350,155 Z" fill="#1B3A2A" stroke="rgba(212,175,55,0.12)" strokeWidth="0.5"/>
              <path d="M440,130 L510,120 L520,155 L500,175 L465,170 L445,155 Z" fill="#1B3A2A" stroke="rgba(212,175,55,0.12)" strokeWidth="0.5"/>
              <path d="M510,140 L570,135 L580,175 L560,210 L530,215 L510,185 Z" fill="#1B3A2A" stroke="rgba(212,175,55,0.12)" strokeWidth="0.5"/>
              <path d="M575,165 L660,155 L670,195 L655,225 L625,235 L590,225 L570,200 Z" fill="#1B3A2A" stroke="rgba(212,175,55,0.12)" strokeWidth="0.5"/>
              <path d="M625,275 L720,265 L740,300 L730,335 L680,345 L640,330 L615,305 Z" fill="#1B3A2A" stroke="rgba(212,175,55,0.12)" strokeWidth="0.5"/>
              {[100,200,300].map(y=><line key={y} x1="0" y1={y} x2="800" y2={y} stroke="rgba(212,175,55,0.05)" strokeWidth="1"/>)}
              {[200,400,600].map(x=><line key={x} x1={x} y1="0" x2={x} y2="380" stroke="rgba(212,175,55,0.05)" strokeWidth="1"/>)}
              {FLIGHT_ARCS.map((arc_data,i)=>{
                const s=stopMap[arc_data.from],e=stopMap[arc_data.to];
                const d=arcPath(s.x,s.y,e.x,e.y,arc_data.bend);
                return(<g key={i}>
                  <path d={d} fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="3.5" strokeLinecap="round"/>
                  <motion.path d={d} fill="none" stroke={T.gold} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5 4"
                    initial={{pathLength:0}} whileInView={{pathLength:1}} viewport={{once:true}}
                    transition={{duration:1.8,delay:i*0.18,ease:"easeInOut"}} markerEnd="url(#arrow)" filter="url(#glow)"/>
                </g>);
              })}
              {STOPS.map((stop)=>(
                <g key={stop.id} style={{cursor:"pointer"}} onClick={()=>setActive(active===stop.id?null:stop.id)}>
                  <motion.circle cx={stop.x} cy={stop.y} r={12} fill="none" stroke={T.gold} strokeWidth="1"
                    animate={{r:[10,18,10],opacity:[0.6,0,0.6]}} transition={{duration:2.5,repeat:Infinity,delay:STOPS.indexOf(stop)*0.3}}/>
                  <circle cx={stop.x} cy={stop.y} r={5} fill={active===stop.id?T.terra:T.gold} stroke="#0d1b2a" strokeWidth="2" style={{filter:"drop-shadow(0 0 4px #D4AF37)"}}/>
                  <text x={stop.x} y={stop.y-11} textAnchor="middle" fill={T.paper} fontSize="8" fontFamily="'Space Mono',monospace" style={{pointerEvents:"none",letterSpacing:"0.08em"}}>{stop.id}</text>
                </g>
              ))}
              {active&&(()=>{
                const s=stopMap[active];
                return(<g>
                  <rect x={s.x+10} y={s.y-26} width={110} height={34} rx={3} fill={T.ocean} stroke={T.gold} strokeWidth="0.8" opacity="0.97"/>
                  <text x={s.x+65} y={s.y-12} textAnchor="middle" fill={T.gold} fontSize="9" fontFamily="'Space Mono',monospace" fontWeight="bold">{s.flag} {s.label}</text>
                  <text x={s.x+65} y={s.y+2} textAnchor="middle" fill={T.paper} fontSize="7" fontFamily="'Space Mono',monospace" opacity="0.7">{s.id}</text>
                </g>);
              })()}
              <g><line x1="18" y1="356" x2="48" y2="356" stroke={T.gold} strokeWidth="1.5" strokeDasharray="5 4"/><text x="54" y="360" fill={T.paper} fontSize="7" fontFamily="'Space Mono',monospace" opacity="0.5">FLIGHT ROUTE · TAP CITY TO IDENTIFY</text></g>
            </svg>
          </motion.div>
        </div>
      </div>
      <div style={{maxWidth:980,margin:"0 auto",padding:"0 56px 64px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))",gap:8}}>
          {FLIGHT_ARCS.map((leg,i)=>{
            const s=stopMap[leg.from];
            return(<motion.div key={i} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.06}}
              style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(212,175,55,0.12)",borderRadius:3,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
              <Plane size={11} color={T.gold} style={{flexShrink:0}}/>
              <div>
                <p style={{fontFamily:T.sm,fontSize:8,color:T.gold,margin:0,letterSpacing:"0.12em"}}>{leg.label}</p>
                <p style={{fontFamily:T.sm,fontSize:9,color:T.paper,margin:"2px 0 0",opacity:0.7}}>{leg.from} → {leg.to}</p>
              </div>
            </motion.div>);
          })}
        </div>
      </div>
    </section>
  );
}

function Nav(){
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{
    const h=()=>setScrolled(window.scrollY>60);
    window.addEventListener("scroll",h,{passive:true});
    return()=>window.removeEventListener("scroll",h);
  },[]);
  return(
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:500,
      background:scrolled?"rgba(10,34,57,0.97)":"transparent",
      backdropFilter:scrolled?"blur(16px)":"none",
      borderBottom:scrolled?"1px solid rgba(212,175,55,0.22)":"none",
      transition:"all 0.4s ease",padding:"14px 40px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div>
        <p style={{fontFamily:T.sm,fontSize:8,color:T.gold,letterSpacing:"0.3em",opacity:0.55,margin:0}}>PRIVATE EXPEDITION · 2026</p>
        <p style={{fontFamily:T.ser,fontSize:14,fontStyle:"italic",fontWeight:700,color:T.paper,margin:0}}>Between the Stars & the Sea</p>
      </div>
      <div style={{display:"flex",gap:28}}>
        {[["#flight-map","The Route"],["#expedition","The Log"],["#the-kit","The Kit"]].map(([href,label])=>(
          <a key={label} href={href} style={{fontFamily:T.sm,fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",color:T.gold,textDecoration:"none",opacity:0.75}}>{label}</a>
        ))}
      </div>
    </nav>
  );
}

function Hero(){
  return(
    <section style={{minHeight:"100vh",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",padding:"120px 48px 80px",textAlign:"center",background:T.waCream}}>
      <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
        {[{color:T.waPink,top:"0%",h:"14%"},{color:T.waCream,top:"14%",h:"14%"},{color:T.waSage,top:"28%",h:"14%"},
          {color:T.waCream,top:"42%",h:"14%"},{color:T.waMust,top:"56%",h:"14%"},{color:T.waCream,top:"70%",h:"14%"},{color:T.waBlue,top:"84%",h:"16%"}
        ].map((s,i)=>(
          <motion.div key={i} initial={{opacity:0}} animate={{opacity:0.28}} transition={{duration:1.5,delay:i*0.1}}
            style={{position:"absolute",left:0,right:0,top:s.top,height:s.h,background:s.color}}/>
        ))}
        <div style={{position:"absolute",left:"50%",top:0,bottom:0,width:1,background:`linear-gradient(to bottom, transparent, ${T.gold}40, transparent)`,transform:"translateX(-50%)"}}/>
        {[{shape:"circle",size:180,x:"8%",y:"10%",color:T.waPink,dur:8},
          {shape:"square",size:120,x:"82%",y:"8%",color:T.waSage,dur:10},
          {shape:"circle",size:90,x:"85%",y:"72%",color:T.waMust,dur:7},
          {shape:"square",size:60,x:"5%",y:"75%",color:T.waBlue,dur:9},
          {shape:"circle",size:40,x:"20%",y:"55%",color:T.waBrick,dur:6},
          {shape:"circle",size:30,x:"75%",y:"40%",color:T.waPink,dur:11},
        ].map((el,i)=>(
          <motion.div key={i} animate={{y:[0,-18,0],rotate:el.shape==="square"?[0,8,0]:[0,0,0]}}
            transition={{duration:el.dur,repeat:Infinity,ease:"easeInOut",delay:i*0.7}}
            style={{position:"absolute",left:el.x,top:el.y,width:el.size,height:el.size,
              borderRadius:el.shape==="circle"?"50%":"4px",background:el.color,opacity:0.18}}/>
        ))}
        {[{t:16,l:16},{t:16,r:16},{b:16,l:16},{b:16,r:16}].map((pos,i)=>(
          <div key={i} style={{position:"absolute",...pos,width:60,height:60,border:`2px solid ${T.gold}`,opacity:0.18,borderRadius:2}}>
            <div style={{position:"absolute",inset:8,border:`1px solid ${T.gold}`}}/>
          </div>
        ))}
      </div>

      <motion.div initial={{opacity:0,scale:0.85,y:30}} animate={{opacity:1,scale:1,y:0}}
        transition={{duration:1.2,ease:[0.34,1.56,0.64,1],delay:0.3}}
        style={{position:"relative",zIndex:10,width:200,height:200,marginBottom:36}}>
        <div style={{width:200,height:200,borderRadius:"50%",border:`6px solid ${T.gold}`,
          boxShadow:`0 0 0 3px ${T.waCream}, 0 0 0 6px ${T.gold}40, 0 16px 48px rgba(0,0,0,0.2)`,
          overflow:"hidden",position:"relative",background:T.paperd}}>
          <img src="/images/Nick_Josh_.png" alt="Nick & Josh"
            style={{width:"100%",height:"100%",objectFit:"cover",filter:"sepia(15%) saturate(85%) brightness(1.05)"}}/>
        </div>
        <div style={{position:"absolute",bottom:-14,left:"50%",transform:"translateX(-50%)",
          background:T.ocean,padding:"4px 16px",borderRadius:2,whiteSpace:"nowrap",boxShadow:"0 4px 12px rgba(0,0,0,0.2)"}}>
          <span style={{fontFamily:T.sm,fontSize:8,color:T.gold,letterSpacing:"0.2em"}}>NICK & JOSH · MMXXVI</span>
        </div>
      </motion.div>

      <motion.p initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.7,duration:0.8}}
        style={{fontFamily:T.sm,fontSize:10,color:T.waBrick,letterSpacing:"0.3em",textTransform:"uppercase",
          marginBottom:18,marginTop:28,zIndex:10,position:"relative"}}>
        A 40th Birthday Expedition · May 2026
      </motion.p>

      <motion.h1 initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:0.9,duration:1}}
        style={{fontFamily:T.ser,fontSize:"clamp(42px,7vw,88px)",fontStyle:"italic",fontWeight:900,
          lineHeight:0.95,marginBottom:20,position:"relative",zIndex:10}}>
        <span style={{color:T.ocean}}>Between the Stars</span><br/>
        <span style={{color:T.waBrick}}>and the Sea</span>
      </motion.h1>

      <motion.div initial={{scaleX:0}} animate={{scaleX:1}} transition={{delay:1.2,duration:0.8}}
        style={{display:"flex",alignItems:"center",gap:14,marginBottom:32,position:"relative",zIndex:10}}>
        <div style={{height:2,width:60,background:T.gold}}/>
        <Compass size={16} color={T.gold}/>
        <div style={{height:2,width:60,background:T.gold}}/>
      </motion.div>

      <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.2,duration:0.8}}
        style={{fontFamily:T.sm,fontSize:10,color:T.ocean,opacity:0.45,letterSpacing:"0.28em",
          marginBottom:48,position:"relative",zIndex:10}}>
        SRI LANKA · BALI · KOMODO
      </motion.p>

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.3,duration:0.8}}
        style={{display:"flex",gap:0,flexWrap:"wrap",justifyContent:"center",marginBottom:48,
          position:"relative",zIndex:10,border:`2px solid ${T.gold}`,borderRadius:4,overflow:"hidden",background:T.ocean}}>
        {[["17","Days"],["3","Countries"],["15","Nights"],["5","Airlines"]].map(([v,l],i)=>(
          <div key={l} style={{textAlign:"center",padding:"18px 32px",borderRight:i<3?`1px solid rgba(212,175,55,0.22)`:"none"}}>
            <p style={{fontFamily:T.ser,fontSize:44,fontWeight:900,color:T.gold,lineHeight:1,margin:0}}>{v}</p>
            <p style={{fontFamily:T.sm,fontSize:8,color:T.paper,opacity:0.45,letterSpacing:"0.25em",marginTop:5}}>{l}</p>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.5}}
        style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center",marginBottom:64,position:"relative",zIndex:10}}>
        {[{f:"🇱🇰",n:"Sri Lanka",d:"May 14–20",s:"Sigiriya · Yala · Colombo",bg:T.waSage},
          {f:"🇮🇩",n:"Bali",d:"May 20–28",s:"Uluwatu · Ubud",bg:T.waMust},
          {f:"🦎",n:"Komodo",d:"May 22–24",s:"Zada Nara Liveaboard",bg:T.waPink}
        ].map(x=>(
          <div key={x.n} style={{background:x.bg,border:`2px solid ${T.ink}20`,borderRadius:3,padding:"14px 22px",
            textAlign:"center",minWidth:150,boxShadow:"3px 3px 0 rgba(0,0,0,0.08)"}}>
            <p style={{fontSize:24,margin:0}}>{x.f}</p>
            <p style={{fontFamily:T.ser,fontSize:15,fontWeight:700,fontStyle:"italic",color:T.ink,margin:"5px 0 2px",opacity:0.85}}>{x.n}</p>
            <p style={{fontFamily:T.sm,fontSize:8,color:T.ink,letterSpacing:"0.18em",margin:0,opacity:0.55}}>{x.d}</p>
            <p style={{fontFamily:T.sm,fontSize:8,color:T.ink,opacity:0.38,marginTop:3}}>{x.s}</p>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.8}}
        style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,position:"relative",zIndex:10}}>
        <p style={{fontFamily:T.sm,fontSize:8,color:T.ocean,opacity:0.28,letterSpacing:"0.32em"}}>SCROLL TO EXPLORE</p>
        <div style={{width:1,height:52,background:`linear-gradient(to bottom, ${T.ocean}60, transparent)`}}/>
      </motion.div>
    </section>
  );
}

function Polaroid({d,idx}){
  const rot=ROTS[idx%ROTS.length];
  const tape=TAPE[idx%TAPE.length];
  const tape2=TAPE[(idx+3)%TAPE.length];
  const [hov,setHov]=useState(false);
  const tint=idx<8?"sepia(25%) saturate(80%) hue-rotate(5deg) brightness(0.92) contrast(1.06)":idx<13?"sepia(10%) saturate(90%) hue-rotate(-5deg) brightness(0.90) contrast(1.08)":"sepia(15%) saturate(75%) brightness(0.88) contrast(1.1)";
  return(
    <motion.div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      animate={{rotate:hov?0:rot,scale:hov?1.05:1}} transition={{type:"spring",stiffness:180,damping:22}}
      style={{background:T.waCream,padding:"10px 10px 64px",width:320,flexShrink:0,
        boxShadow:`${rot>0?8:-8}px 14px 44px rgba(0,0,0,0.22)`,cursor:"default",
        position:"relative",border:`1px solid ${T.paperd}`}}>
      <div style={{position:"absolute",top:-12,left:22,width:64,height:20,background:tape,opacity:0.92,borderRadius:1,transform:"rotate(-3deg)",zIndex:10}}/>
      <div style={{position:"absolute",top:-8,right:18,width:48,height:16,background:tape2,opacity:0.7,borderRadius:1,transform:"rotate(4deg)",zIndex:10}}/>
      <div style={{height:260,overflow:"hidden",position:"relative",background:T.paperd}}>
        <img src={d.img} alt={d.title}
          style={{width:"100%",height:"100%",objectFit:"cover",display:"block",filter:tint,
            transition:"transform 0.6s ease",transform:hov?"scale(1.04)":"scale(1)"}}/>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(26,18,9,0.35) 100%)"}}/>
        <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(to top, rgba(26,18,9,0.55) 0%, transparent 100%)",padding:"22px 12px 10px"}}>
          <span style={{fontFamily:T.sm,fontSize:8,color:T.paper,letterSpacing:"0.15em",opacity:0.9}}>{d.day} · {d.date}</span>
        </div>
      </div>
      <div style={{paddingTop:14,textAlign:"center"}}>
        <p style={{fontFamily:T.ser,fontSize:14,fontWeight:700,fontStyle:"italic",color:T.ink,margin:"0 0 4px",lineHeight:1.2}}>{d.title}</p>
        <p style={{fontFamily:T.sm,fontSize:8,color:T.ocean,opacity:0.45,letterSpacing:"0.14em",margin:0}}>{d.location.toUpperCase()}</p>
        <div style={{width:24,height:3,background:tape,margin:"8px auto 0",borderRadius:2}}/>
      </div>
    </motion.div>
  );
}

function DayRow({d,idx}){
  const ref=useRef(null);
  const [vis,setVis]=useState(false);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setVis(true);obs.disconnect();}},{threshold:0.08});
    if(ref.current)obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);
  const isEven=idx%2===0;
  const tape=TAPE[idx%TAPE.length];
  return(
    <div ref={ref} style={{marginBottom:72}}>
      <motion.div initial={{opacity:0,y:64}} animate={vis?{opacity:1,y:0}:{}} transition={{duration:0.9,ease:[0.22,1,0.36,1]}}
        style={{display:"flex",flexDirection:isEven?"row":"row-reverse",gap:52,alignItems:"flex-start"}}>
        <Polaroid d={d} idx={idx}/>
        <div style={{flex:1,paddingTop:20,minWidth:0}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:10,background:T.ocean,padding:"5px 14px",borderRadius:2,marginBottom:20}}>
            <span style={{fontFamily:T.sm,fontSize:9,color:T.gold,letterSpacing:"0.15em"}}>{d.day}</span>
            <span style={{color:T.gold,opacity:0.3}}>|</span>
            <span style={{fontFamily:T.sm,fontSize:9,color:T.paper,opacity:0.75}}>{d.date}, 2026</span>
          </div>
          <h3 style={{fontFamily:T.ser,fontSize:"clamp(28px,3.5vw,52px)",fontStyle:"italic",fontWeight:900,color:T.ocean,lineHeight:0.95,margin:"0 0 14px"}}>{d.title}</h3>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:20}}>
            <MapPin size={12} color={T.terra}/>
            <span style={{fontFamily:T.sm,fontSize:10,color:T.terra,letterSpacing:"0.12em",textTransform:"uppercase"}}>{d.location}</span>
          </div>
          <div style={{width:48,height:4,background:tape,borderRadius:3,marginBottom:20}}/>
          <p style={{fontFamily:T.sm,fontSize:12,color:T.ocean,lineHeight:1.95,opacity:0.75,maxWidth:380,margin:0}}>{d.desc}</p>
        </div>
      </motion.div>
    </div>
  );
}

function SHead({eyebrow,title,light}){
  return(
    <motion.div initial={{opacity:0,y:32}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.75}}
      style={{textAlign:"center",marginBottom:64}}>
      <p style={{fontFamily:T.sm,fontSize:9,color:T.terra,letterSpacing:"0.32em",textTransform:"uppercase",marginBottom:14}}>{eyebrow}</p>
      <h2 style={{fontFamily:T.ser,fontSize:"clamp(36px,5vw,64px)",fontStyle:"italic",fontWeight:900,color:light?T.paper:T.ocean,margin:0}}>{title}</h2>
      <div style={{width:56,height:5,background:T.gold,margin:"14px auto 0",borderRadius:3}}/>
    </motion.div>
  );
}

function PackCard({cat,checked,onToggle}){
  const done=cat.items.filter(it=>checked[`${cat.category}::${it}`]).length;
  const pct=(done/cat.items.length)*100;
  const all=done===cat.items.length;
  return(
    <div style={{background:T.paper,border:`1px solid ${T.paperd}`,borderTop:`4px solid ${cat.color}`,
      borderRadius:4,padding:"20px 18px",breakInside:"avoid",marginBottom:14}}>
      <h3 style={{fontFamily:T.ser,fontSize:14,fontWeight:700,color:cat.color,margin:"0 0 12px"}}>{cat.category}</h3>
      <div style={{height:3,background:T.paperd,borderRadius:4,overflow:"hidden",marginBottom:5}}>
        <motion.div animate={{width:`${pct}%`}} transition={{duration:0.5}}
          style={{height:"100%",background:all?T.jungle:cat.color,borderRadius:4}}/>
      </div>
      <p style={{fontFamily:T.sm,fontSize:8,color:cat.color,opacity:0.55,marginBottom:14,letterSpacing:"0.12em"}}>{done}/{cat.items.length} PACKED</p>
      {cat.items.map((item,i)=>{
        const k=`${cat.category}::${item}`;const c=!!checked[k];
        return(
          <motion.div key={i} onClick={()=>onToggle(k)} whileHover={{x:3}} whileTap={{scale:0.97}}
            style={{display:"flex",alignItems:"flex-start",gap:8,padding:"7px 0",cursor:"pointer",
              borderBottom:i<cat.items.length-1?`1px solid ${T.paperd}`:"none"}}>
            {c?<CheckSquare size={13} color={T.jungle} style={{flexShrink:0,marginTop:2}}/>
              :<Square size={13} color={T.ocean} style={{flexShrink:0,marginTop:2,opacity:0.28}}/>}
            <span style={{fontFamily:T.sm,fontSize:11,lineHeight:1.5,color:c?T.jungle:T.ocean,
              textDecoration:c?"line-through":"none",opacity:c?0.45:0.85,transition:"all 0.2s ease"}}>{item}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function App(){
  const [checked,setChecked]=useState({});
  const toggle=k=>setChecked(p=>({...p,[k]:!p[k]}));
  const totalItems=PACKING.reduce((a,c)=>a+c.items.length,0);
  const totalDone=Object.values(checked).filter(Boolean).length;
  const pct=totalItems?Math.round((totalDone/totalItems)*100):0;

  return(
    <div style={{background:T.paper,minHeight:"100vh",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700;1,9..144,900&family=Space+Mono:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;}body{margin:0;}
        ::selection{background:#D4AF37;color:#0A2239;}
        @media(max-width:768px){.day-row-inner{flex-direction:column!important;}nav a:not(:first-child){display:none!important;}}
      `}</style>
      <Grain/>
      <Nav/>
      <Hero/>
      <FlightMap/>
      <section id="expedition" style={{padding:"96px 56px",background:T.paper}}>
        <div style={{maxWidth:980,margin:"0 auto"}}>
          <SHead eyebrow="17-Day Private Expedition · May 12–28, 2026" title="The Expedition Log"/>
          <div style={{display:"flex",gap:4,justifyContent:"center",padding:"0 0 52px",opacity:0.15}}>
            {Array.from({length:16}).map((_,i)=><div key={i} style={{width:22,height:16,border:`2px solid ${T.ocean}`,borderRadius:1}}/>)}
          </div>
          {DAYS.map((d,i)=><DayRow key={i} d={d} idx={i}/>)}
        </div>
      </section>
      <section id="the-kit" style={{background:T.ocean,padding:"96px 56px"}}>
        <div style={{maxWidth:980,margin:"0 auto"}}>
          <SHead eyebrow="Interactive Expedition Checklist" title="The Kit" light/>
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
            style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(212,175,55,0.22)",borderRadius:4,
              padding:"18px 24px",marginBottom:44,display:"flex",alignItems:"center",gap:24}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontFamily:T.sm,fontSize:9,color:T.gold,letterSpacing:"0.2em"}}>Overall Progress</span>
                <span style={{fontFamily:T.sm,fontSize:9,color:T.gold}}>{totalDone} / {totalItems} Items</span>
              </div>
              <div style={{height:6,background:"rgba(255,255,255,0.1)",borderRadius:6,overflow:"hidden"}}>
                <motion.div animate={{width:`${pct}%`}} transition={{duration:0.6}}
                  style={{height:"100%",background:pct===100?T.jungle:T.gold,borderRadius:6}}/>
              </div>
            </div>
            <div style={{textAlign:"center",flexShrink:0}}>
              <p style={{fontFamily:T.ser,fontSize:36,fontWeight:900,color:T.gold,margin:0,lineHeight:1}}>{pct}%</p>
              <p style={{fontFamily:T.sm,fontSize:7,color:T.paper,opacity:0.4,letterSpacing:"0.2em",marginTop:3}}>PACKED</p>
            </div>
          </motion.div>
          <p style={{fontFamily:T.sm,fontSize:10,color:T.paper,opacity:0.32,textAlign:"center",marginTop:-28,marginBottom:44,letterSpacing:"0.1em"}}>Click any item to mark as packed ↓</p>
          <div style={{columns:"280px 3",columnGap:16}}>
            {PACKING.map((cat,i)=>(
              <motion.div key={cat.category} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.07}}>
                <PackCard cat={cat} checked={checked} onToggle={toggle}/>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <footer style={{background:T.ocean,borderTop:`3px solid ${T.gold}`,padding:"44px 56px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:8}}>
          <div style={{height:1,width:48,background:T.gold,opacity:0.3}}/>
          <div style={{width:36,height:36,border:`1.5px solid ${T.gold}`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",opacity:0.45}}><Anchor size={14} color={T.gold}/></div>
          <div style={{height:1,width:48,background:T.gold,opacity:0.3}}/>
        </div>
        <p style={{fontFamily:T.ser,fontSize:20,fontStyle:"italic",color:T.paper,opacity:0.65,margin:0}}>Between the Stars and the Sea</p>
        <p style={{fontFamily:T.sm,fontSize:8,color:T.gold,opacity:0.4,letterSpacing:"0.3em",textTransform:"uppercase",margin:0}}>Nick & Josh · 40th Birthday Expedition · May 2026</p>
        <p style={{fontFamily:T.sm,fontSize:8,color:T.paper,opacity:0.2,margin:0}}>Private · Not for distribution</p>
      </footer>
      <WhatsAppBubble/>
    </div>
  );
}
