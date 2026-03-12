import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Plane, Download, FileText, ExternalLink,
  MapPin, Compass, CheckSquare, Square, Anchor
} from "lucide-react";

const T = {
  ocean:  "#0A2239",
  jungle: "#1B4332",
  gold:   "#D4AF37",
  terra:  "#E07A5F",
  paper:  "#F4EEDD",
  paperd: "#E8DABC",
  sm:     "'Space Mono', 'Courier New', monospace",
  ser:    "'Fraunces', 'Playfair Display', Georgia, serif",
};
const TAPE = ["#E07A5F","#D4AF37","#2D6A4F","#7B5E2A","#457B9D","#8B4513","#6B2D8B","#C45E3A"];
const ROTS = [-2.1,1.8,-1.4,2.3,-1.0,2.6,-1.7,1.3,-2.4,1.6,-1.1,2.0,-1.8,1.5,-2.2,1.9,-1.3];

// ── AIRPORTS (equirectangular → 1000×440 SVG)
const AP = {
  JFK:{code:"JFK",city:"New York",   x:297,y:145},
  AUH:{code:"AUH",city:"Abu Dhabi",  x:651,y:181},
  DXB:{code:"DXB",city:"Dubai",      x:654,y:178},
  CMB:{code:"CMB",city:"Colombo",    x:722,y:218},
  CGK:{code:"CGK",city:"Jakarta",    x:796,y:248},
  DPS:{code:"DPS",city:"Bali",       x:820,y:253},
  LBJ:{code:"LBJ",city:"Labuan Bajo",x:833,y:252},
};

// ── REAL FLIGHT LEGS FROM CONFIRMATIONS
const LEGS = [
  {from:"JFK",to:"AUH",flight:"EY 2",   date:"12 May",depart:"15:45",arrive:"12:25+1",airline:"Etihad Airways",    cls:"Business",color:"#D4AF37",ref:"BET4KE"},
  {from:"AUH",to:"CMB",flight:"EY 392", date:"14 May",depart:"02:25",arrive:"08:35",  airline:"Etihad Airways",    cls:"Business",color:"#D4AF37",ref:"BET4KE"},
  {from:"CMB",to:"CGK",flight:"UL 364", date:"20 May",depart:"07:20",arrive:"13:30",  airline:"SriLankan Airlines",cls:"Economy", color:"#E07A5F",ref:""},
  {from:"CGK",to:"DPS",flight:"GA 420", date:"20 May",depart:"17:00",arrive:"19:55",  airline:"Garuda Indonesia",  cls:"Economy", color:"#E07A5F",ref:""},
  {from:"DPS",to:"LBJ",flight:"ID 6333",date:"22 May",depart:"07:55",arrive:"09:10",  airline:"Batik Air",         cls:"Economy", color:"#2D6A4F",ref:"NJFCLT",warn:"20kg checked bag limit — both pax confirmed"},
  {from:"LBJ",to:"DPS",flight:"QZ 647", date:"24 May",depart:"13:05",arrive:"14:20",  airline:"AirAsia",           cls:"Economy", color:"#2D6A4F",ref:"AFJ5MN",warn:"Seats 2C & 2D confirmed"},
  {from:"DPS",to:"DXB",flight:"EK 399", date:"28 May",depart:"00:35",arrive:"05:35",  airline:"Emirates",          cls:"Business",color:"#C45E3A",ref:"",note:"Boeing 777-300ER"},
  {from:"DXB",to:"JFK",flight:"EK 201", date:"28 May",depart:"08:30",arrive:"14:25",  airline:"Emirates",          cls:"Business",color:"#C45E3A",ref:"",note:"Airbus A380-800"},
];

const DAYS = [
  {day:"Day 1", date:"May 12",title:"The Departure",            location:"New York (JFK)",          desc:"The journey begins. Boarding Etihad EY2 Business Class from JFK Terminal 4 at 15:45. Seat 07A. Booking ref: BET4KE. Baggage: 2 pieces each up to 32kg.",seed:101},
  {day:"Day 2", date:"May 13",title:"Chasing the Sun",          location:"Abu Dhabi (AUH)",          desc:"Arrive AUH Zayed International Terminal A at 12:25. Overnight layover. Connecting EY392 departs 02:25 on May 14 — seat 02A.",seed:102},
  {day:"Day 3", date:"May 14",title:"The Gathering",            location:"Habarana, Sri Lanka",      desc:"Land CMB 08:35. Drive to Water Garden Sigiriya. Afternoon private jeep safari at Minneriya — the largest single gathering of wild Asian elephants on earth.",seed:103},
  {day:"Day 4", date:"May 15",title:"The Lion Rock",            location:"Sigiriya & Polonnaruwa",   desc:"Dawn climb up the 1,200 steps of Sigiriya Rock Fortress. Afternoon in the ruins of the 11th-century Polonnaruwa Kingdom.",seed:104},
  {day:"Day 5", date:"May 16",title:"The Sacred Tooth",         location:"Kandy, Sri Lanka",         desc:"Journey to the hill capital. Temple of the Sacred Tooth Relic. Check into Adigar's Manor. Evening Puja ceremony at 18:30 — drumming, fire, incense.",seed:105},
  {day:"Day 6", date:"May 17",title:"The Emerald Railway",      location:"Nuwara Eliya → Ella",      desc:"Boarding the world-famous panoramic hill train Ambewela → Ella through misty tea estates. Then driving south to Yala National Park: Uga Chena Huts.",seed:106},
  {day:"Day 7", date:"May 18",title:"Leopard Country",          location:"Yala National Park",       desc:"Luxury cabin with private plunge pool. Two private jeep safaris — dawn and dusk — tracking Sri Lankan leopard through Block 1. Highest density on earth.",seed:107},
  {day:"Day 8", date:"May 19",title:"Dutch Forts & City Lights",location:"Galle & Colombo",          desc:"Drive the coast to the 17th-century Galle Dutch Fort (UNESCO). Final Sri Lanka night at Shangri-La Colombo. Dinner at Ministry of Crab — World's 50 Best.",seed:108},
  {day:"Day 9", date:"May 20",title:"Island Hopping",           location:"CMB → CGK → DPS",          desc:"UL364 departs CMB 07:20, arrives CGK 13:30 Terminal 3. 3h 30m transit — clear Indonesian e-VOA here. GA420 departs 17:00, arrives DPS 19:55 Terminal D.",seed:109},
  {day:"Day 10",date:"May 21",title:"Acclimation",              location:"Alila Villas Uluwatu",     desc:"Total rest day. Alila Uluwatu cliffside infinity pool 100m above the Indian Ocean. Bintang beers. Kecak Fire Dance at the Uluwatu Temple at sunset.",seed:110},
  {day:"Day 11",date:"May 22",title:"Setting Sail",             location:"Komodo National Park",     desc:"ID6333 DPS 07:55 → LBJ 09:10 (ref NJFCLT). Board Zada Nara Liveaboard Master Suite. Sail to Kelor Island. Snorkel Manjarite. Sunset at Kalong Island.",seed:111},
  {day:"Day 12",date:"May 23",title:"Prehistoric Seas",         location:"Padar & Pink Beach",       desc:"Pre-dawn hike at Padar Island — Indonesia's most jaw-dropping panorama. Relax on the legendary Pink Beach. Swim with gentle giants at Manta Point. Dinner under the Milky Way.",seed:112},
  {day:"Day 13",date:"May 24",title:"Return to the Gods",       location:"Ubud, Bali",               desc:"QZ647 departs LBJ 13:05, arrives DPS 14:20 (ref AFJ5MN, seats 2C/2D). Check into The Kayon Jungle Resort, Ubud — valley and rice terrace views.",seed:113},
  {day:"Day 14",date:"May 25",title:"Jungle & Spa",             location:"Ubud, Bali",               desc:"Unstructured day. Evening at Kubu at Mandapa — private cocoon pods over the Ayung River gorge, candlelit. Smart casual dress code strictly enforced at the door.",seed:114},
  {day:"Day 15",date:"May 26",title:"Beach Club Hedonism",      location:"Bali",                     desc:"Unstructured day. Concierge recommends a daybed at Potato Head Beach Club or Savaya — sunset cocktails and beats above the Indian Ocean.",seed:115},
  {day:"Day 16",date:"May 27",title:"The Final Sunset",         location:"Bali",                     desc:"Last full day. 40th birthday dinner feast. Note: 15-hour gap between noon check-out and 00:35 EK399 departure — arrange day-use room or late checkout in advance.",seed:116},
  {day:"Day 17",date:"May 28",title:"The Midnight Flight",      location:"DPS → DXB → JFK",          desc:"EK399 departs DPS 00:35 on Boeing 777-300ER Business. Arrives DXB 05:35. 2h 55m connection. EK201 departs DXB 08:30 on A380-800. Arrives JFK 14:25. Chauffeur confirmed.",seed:117},
];

const PACKING = [
  {category:"The Essentials & Docs",color:T.ocean,
   items:["Passports (Valid 6+ months)","Printed E-Visas (Sri Lanka & Indonesia)","Travel Insurance Docs","International Driving Permit","Zada Liveaboard & Ceylon Tour Confirmations","Etihad BET4KE · Batik NJFCLT · AirAsia AFJ5MN","Cash (USD for exchange)","Credit Cards (No foreign transaction fees)"]},
  {category:"Safari & Adventure",color:T.jungle,
   items:["Sturdy trail/hiking shoes (Padar & Sigiriya)","Neutral/Khaki lightweight trousers","Breathable moisture-wicking tees","Binoculars (Yala Leopard spotting)","High-DEET Mosquito Repellent","Lightweight rain shell","Dry bag (for Liveaboard transfers)","GoPro with underwater housing & floatie","Reef-safe SPF 50+ Sunscreen","Motion sickness pills/patches"]},
  {category:"Resort & Evening (Bali)",color:"#7B5E2A",
   items:["Linen button-down shirts","Chino shorts","Evening loafers / nice sandals","Silk or lightweight evening shirts","Signature evening cologne","Lightweight blazer (optional)","Sunglasses (Polarized)"]},
  {category:"Temple & Culture",color:"#5C4A1E",
   items:["Sarong (or buy locally)","T-shirts covering shoulders","Easy slip-on/off shoes (for temple entry)","Lightweight pants covering knees"]},
  {category:"Apparel Basics",color:"#2D6A4F",
   items:["Underwear (18+ pairs)","Socks (10+ pairs, mostly ankle/hiking)","Sleepwear","Swim trunks (3-4 pairs)","Rashguard (for Manta snorkeling)","Everyday walking sneakers","Flip-flops / slides"]},
  {category:"Tech & Apothecary",color:"#457B9D",
   items:["Universal Power Adapters (UK for SL, EU for Indo)","Power banks (High capacity)","Kindle / Books","Noise-canceling headphones","Aloe Vera / Aftersun","Basic First Aid (Bandaids, Advil, Imodium)","Daily medications & vitamins"]},
];

// ──────────────────────────────────────────────────────
// GRAIN
// ──────────────────────────────────────────────────────
function Grain(){
  return <div style={{position:"fixed",inset:0,zIndex:9998,pointerEvents:"none",
    backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
    opacity:0.04,mixBlendMode:"overlay"}}/>;
}

// ──────────────────────────────────────────────────────
// NAV
// ──────────────────────────────────────────────────────
function Nav(){
  const [sc,setSc]=useState(false);
  useEffect(()=>{const h=()=>setSc(window.scrollY>60);window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h);},[]);
  return(
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:500,background:sc?"rgba(10,34,57,0.97)":"transparent",backdropFilter:sc?"blur(16px)":"none",borderBottom:sc?"1px solid rgba(212,175,55,0.22)":"none",transition:"all 0.4s",padding:"14px 40px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div>
        <p style={{fontFamily:T.sm,fontSize:8,color:T.gold,letterSpacing:"0.3em",opacity:0.55,margin:0}}>PRIVATE EXPEDITION · 2026</p>
        <p style={{fontFamily:T.ser,fontSize:14,fontStyle:"italic",fontWeight:700,color:T.paper,margin:0}}>Between the Stars & the Sea</p>
      </div>
      <div style={{display:"flex",gap:24}}>
        {[["#expedition","The Log"],["#flight-map","Flight Map"],["#the-kit","The Kit"],["#the-vault","The Vault"]].map(([h,l])=>(
          <a key={l} href={h} style={{fontFamily:T.sm,fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",color:T.gold,textDecoration:"none",opacity:0.75}}>{l}</a>
        ))}
      </div>
    </nav>
  );
}

// ──────────────────────────────────────────────────────
// SECTION HEADER
// ──────────────────────────────────────────────────────
function SHead({eyebrow,title,light}){
  return(
    <motion.div initial={{opacity:0,y:32}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.75}} style={{textAlign:"center",marginBottom:64}}>
      <p style={{fontFamily:T.sm,fontSize:9,color:T.terra,letterSpacing:"0.32em",textTransform:"uppercase",marginBottom:14}}>{eyebrow}</p>
      <h2 style={{fontFamily:T.ser,fontSize:"clamp(36px,5vw,64px)",fontStyle:"italic",fontWeight:900,color:light?T.paper:T.ocean,margin:0}}>{title}</h2>
      <div style={{width:56,height:5,background:T.gold,margin:"14px auto 0",borderRadius:3}}/>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────
// FLIGHT MAP
// ──────────────────────────────────────────────────────
function arcD(a,b){
  const mx=(a.x+b.x)/2, my=(a.y+b.y)/2;
  const dx=b.x-a.x, dy=b.y-a.y;
  const cx=mx+(dy*0.25);
  const cy=my-(Math.abs(dx)*0.32);
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

function FlightMap(){
  const [active,setActive]=useState(null);
  const leg=active!=null?LEGS[active]:null;

  return(
    <section id="flight-map" style={{background:"#060f1a",padding:"96px 56px",borderTop:"1px solid rgba(212,175,55,0.1)"}}>
      <div style={{maxWidth:1040,margin:"0 auto"}}>
        <SHead eyebrow="8 Real Flight Legs · 4 Airlines · All Booking References Confirmed" title="The Flight Plan" light/>

        <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9}}
          style={{position:"relative",background:"rgba(6,15,26,0.9)",border:"1px solid rgba(212,175,55,0.18)",borderRadius:8,overflow:"hidden",marginBottom:28}}>

          {/* Grid bg */}
          <div style={{position:"absolute",inset:0,opacity:0.06,backgroundImage:`linear-gradient(rgba(212,175,55,1) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,1) 1px,transparent 1px)`,backgroundSize:"80px 80px"}}/>

          <svg viewBox="0 0 1000 440" style={{width:"100%",height:"auto",display:"block",position:"relative",zIndex:2}}>

            {/* ── Simplified land masses ── */}
            {/* North America east */}
            <path d="M200,75 L265,82 L295,118 L302,155 L288,192 L265,205 L242,196 L218,172 L202,148 L208,115 Z" fill="rgba(27,67,50,0.32)" stroke="rgba(44,106,79,0.5)" strokeWidth="0.8"/>
            {/* Greenland hint */}
            <ellipse cx="330" cy="55" rx="28" ry="18" fill="rgba(27,67,50,0.2)" stroke="rgba(44,106,79,0.3)" strokeWidth="0.5"/>
            {/* Western Europe */}
            <path d="M432,62 L492,58 L525,72 L540,88 L536,106 L518,114 L498,110 L474,112 L457,104 L442,90 Z" fill="rgba(27,67,50,0.32)" stroke="rgba(44,106,79,0.5)" strokeWidth="0.8"/>
            {/* Africa */}
            <path d="M456,126 L508,120 L542,138 L555,172 L552,218 L540,258 L520,272 L498,268 L476,248 L460,218 L452,178 L456,148 Z" fill="rgba(27,67,50,0.32)" stroke="rgba(44,106,79,0.5)" strokeWidth="0.8"/>
            {/* Arabian Peninsula */}
            <path d="M578,152 L638,148 L668,162 L674,188 L658,206 L632,212 L604,202 L582,184 Z" fill="rgba(27,67,50,0.32)" stroke="rgba(44,106,79,0.5)" strokeWidth="0.8"/>
            {/* Indian subcontinent */}
            <path d="M678,150 L734,146 L750,158 L756,182 L745,212 L724,228 L702,224 L684,202 L676,174 Z" fill="rgba(27,67,50,0.32)" stroke="rgba(44,106,79,0.5)" strokeWidth="0.8"/>
            {/* SE Asia */}
            <path d="M758,148 L824,144 L850,160 L856,182 L840,200 L812,207 L784,202 L762,186 Z" fill="rgba(27,67,50,0.32)" stroke="rgba(44,106,79,0.5)" strokeWidth="0.8"/>
            {/* Bali / Lombok blob */}
            <path d="M806,242 L856,238 L870,246 L868,256 L848,262 L816,260 L802,252 Z" fill="rgba(27,67,50,0.32)" stroke="rgba(44,106,79,0.5)" strokeWidth="0.8"/>
            {/* Sri Lanka */}
            <circle cx="722" cy="226" r="6" fill="rgba(27,67,50,0.5)" stroke="rgba(44,106,79,0.7)" strokeWidth="0.8"/>

            {/* Ocean labels */}
            <text x="360" y="295" fill="rgba(212,175,55,0.1)" fontFamily="Georgia,serif" fontSize="13" fontStyle="italic" textAnchor="middle">Indian Ocean</text>
            <text x="195" y="318" fill="rgba(212,175,55,0.1)" fontFamily="Georgia,serif" fontSize="11" fontStyle="italic" textAnchor="middle">Atlantic</text>
            <text x="620" y="340" fill="rgba(212,175,55,0.08)" fontFamily="Georgia,serif" fontSize="11" fontStyle="italic" textAnchor="middle">Arabian Sea</text>

            {/* ── FLIGHT ARCS ── */}
            {LEGS.map((l,i)=>{
              const a=AP[l.from], b=AP[l.to];
              const isActive=active===i;
              const d=arcD(a,b);
              // midpoint on the quadratic bezier at t=0.5
              const mx=(a.x+b.x)/2+(( b.y-a.y)*0.25);
              const my=(a.y+b.y)/2-(Math.abs(b.x-a.x)*0.32);
              const planeMx=(a.x/4 + mx/2 + b.x/4);
              const planeMy=(a.y/4 + my/2 + b.y/4);
              return(
                <g key={i} onClick={()=>setActive(active===i?null:i)} style={{cursor:"pointer"}}>
                  {/* Ghost */}
                  <path d={d} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5"/>
                  {/* Line */}
                  <motion.path d={d} fill="none"
                    stroke={isActive?l.color:"rgba(212,175,55,0.25)"}
                    strokeWidth={isActive?2.8:1.2}
                    strokeDasharray={isActive?"none":"5 4"}
                    initial={{pathLength:0,opacity:0}}
                    whileInView={{pathLength:1,opacity:1}}
                    viewport={{once:true}}
                    transition={{duration:1.6,delay:i*0.16,ease:"easeInOut"}}
                    style={{filter:isActive?`drop-shadow(0 0 5px ${l.color})`:"none"}}
                  />
                  {/* Plane dot */}
                  {isActive&&(
                    <motion.g initial={{scale:0}} animate={{scale:1}} transition={{delay:0.5}}>
                      <circle cx={planeMx} cy={planeMy} r={8} fill={l.color} opacity={0.2}/>
                      <circle cx={planeMx} cy={planeMy} r={4} fill={l.color}/>
                      <circle cx={planeMx} cy={planeMy} r={2} fill="#fff"/>
                    </motion.g>
                  )}
                  {/* Flight number on hover */}
                  {isActive&&(
                    <text x={planeMx} y={planeMy-14} fill={l.color} fontFamily="'Space Mono',monospace" fontSize="9" textAnchor="middle" fontWeight="700">{l.flight}</text>
                  )}
                </g>
              );
            })}

            {/* ── AIRPORT NODES ── */}
            {Object.values(AP).map(ap=>{
              const isActive=leg&&(leg.from===ap.code||leg.to===ap.code);
              return(
                <g key={ap.code}>
                  {isActive&&<circle cx={ap.x} cy={ap.y} r={12} fill={T.gold} opacity={0.12}/>}
                  <circle cx={ap.x} cy={ap.y} r={isActive?6:4} fill={isActive?T.gold:"rgba(212,175,55,0.6)"} stroke={isActive?"rgba(212,175,55,0.35)":"none"} strokeWidth={8} style={{filter:isActive?`drop-shadow(0 0 7px ${T.gold})`:"none",transition:"all 0.3s"}}/>
                  <circle cx={ap.x} cy={ap.y} r={isActive?2.5:1.5} fill="#fff" opacity={0.95}/>
                  <text x={ap.x+10} y={ap.y-5} fill={isActive?T.gold:"rgba(212,175,55,0.75)"} fontFamily="'Space Mono',monospace" fontSize="9" fontWeight="700" style={{transition:"fill 0.3s"}}>{ap.code}</text>
                  <text x={ap.x+10} y={ap.y+7} fill="rgba(244,238,221,0.38)" fontFamily="'Space Mono',monospace" fontSize="7">{ap.city}</text>
                </g>
              );
            })}
          </svg>

          {/* Info card */}
          {leg&&(
            <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
              style={{position:"absolute",top:16,left:16,background:"rgba(6,15,26,0.96)",border:`1.5px solid ${leg.color}`,borderRadius:6,padding:"16px 20px",backdropFilter:"blur(14px)",minWidth:260,zIndex:10}}>
              <p style={{fontFamily:T.sm,fontSize:8,color:leg.color,letterSpacing:"0.22em",textTransform:"uppercase",margin:"0 0 5px"}}>{leg.airline}</p>
              <p style={{fontFamily:T.ser,fontSize:26,fontWeight:900,fontStyle:"italic",color:T.paper,margin:"0 0 10px",lineHeight:1}}>{leg.flight}</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:10}}>
                <div>
                  <p style={{fontFamily:T.sm,fontSize:7,color:T.gold,opacity:0.5,margin:"0 0 2px",letterSpacing:"0.14em"}}>FROM</p>
                  <p style={{fontFamily:T.sm,fontSize:16,fontWeight:700,color:T.paper,margin:0,letterSpacing:"0.05em"}}>{leg.from}</p>
                  <p style={{fontFamily:T.sm,fontSize:11,color:T.paper,opacity:0.5,margin:"2px 0 0"}}>{leg.depart}</p>
                </div>
                <div>
                  <p style={{fontFamily:T.sm,fontSize:7,color:T.gold,opacity:0.5,margin:"0 0 2px",letterSpacing:"0.14em"}}>TO</p>
                  <p style={{fontFamily:T.sm,fontSize:16,fontWeight:700,color:T.paper,margin:0,letterSpacing:"0.05em"}}>{leg.to}</p>
                  <p style={{fontFamily:T.sm,fontSize:11,color:T.paper,opacity:0.5,margin:"2px 0 0"}}>{leg.arrive}</p>
                </div>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:leg.warn||leg.note?8:0}}>
                <span style={{fontFamily:T.sm,fontSize:8,padding:"2px 8px",borderRadius:2,border:`1px solid ${leg.cls==="Business"?"rgba(212,175,55,0.5)":"rgba(44,106,79,0.5)"}`,background:leg.cls==="Business"?"rgba(212,175,55,0.1)":"rgba(44,106,79,0.1)",color:leg.cls==="Business"?T.gold:"#7aaa92"}}>{leg.cls}</span>
                <span style={{fontFamily:T.sm,fontSize:8,padding:"2px 8px",borderRadius:2,border:"1px solid rgba(255,255,255,0.1)",color:T.paper,opacity:0.5}}>{leg.date}</span>
                {leg.ref&&<span style={{fontFamily:T.sm,fontSize:8,padding:"2px 8px",borderRadius:2,border:"1px solid rgba(212,175,55,0.2)",color:T.gold,opacity:0.7}}>Ref: {leg.ref}</span>}
              </div>
              {leg.warn&&<p style={{fontFamily:T.sm,fontSize:9,color:T.terra,margin:"6px 0 0",lineHeight:1.5,borderTop:"1px solid rgba(224,122,95,0.2)",paddingTop:7}}>⚠ {leg.warn}</p>}
              {leg.note&&<p style={{fontFamily:T.sm,fontSize:9,color:T.paper,opacity:0.5,margin:"6px 0 0",lineHeight:1.5}}>{leg.note}</p>}
            </motion.div>
          )}

          {!leg&&(
            <div style={{position:"absolute",bottom:14,left:"50%",transform:"translateX(-50%)",zIndex:10}}>
              <p style={{fontFamily:T.sm,fontSize:8,color:"rgba(212,175,55,0.38)",letterSpacing:"0.22em",margin:0,whiteSpace:"nowrap"}}>↑ TAP ANY FLIGHT ARC TO SEE DETAILS</p>
            </div>
          )}
        </motion.div>

        {/* Leg grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:8}}>
          {LEGS.map((l,i)=>{
            const isAct=active===i;
            return(
              <motion.div key={i} onClick={()=>setActive(active===i?null:i)}
                initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.06,duration:0.55}}
                whileHover={{y:-3}} whileTap={{scale:0.98}}
                style={{background:isAct?"rgba(10,34,57,0.9)":"rgba(255,255,255,0.025)",border:`1px solid ${isAct?l.color:"rgba(212,175,55,0.1)"}`,borderLeft:`3px solid ${l.color}`,borderRadius:"0 4px 4px 0",padding:"12px 14px",cursor:"pointer",transition:"all 0.25s"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{fontFamily:T.sm,fontSize:11,fontWeight:700,color:l.color,letterSpacing:"0.08em"}}>{l.flight}</span>
                  <span style={{fontFamily:T.sm,fontSize:8,color:T.paper,opacity:0.3}}>{l.date}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
                  <span style={{fontFamily:T.sm,fontSize:14,fontWeight:700,color:T.paper}}>{l.from}</span>
                  <Plane size={10} color={l.color} style={{flexShrink:0}}/>
                  <span style={{fontFamily:T.sm,fontSize:14,fontWeight:700,color:T.paper}}>{l.to}</span>
                </div>
                <p style={{fontFamily:T.sm,fontSize:9,color:T.paper,opacity:0.38,margin:0,letterSpacing:"0.06em"}}>{l.depart} → {l.arrive} · {l.cls}</p>
                {l.warn&&<p style={{fontFamily:T.sm,fontSize:8,color:T.terra,margin:"4px 0 0",lineHeight:1.4}}>⚠ {l.warn.split(" — ")[0]}</p>}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────
// HERO
// ──────────────────────────────────────────────────────
function Hero(){
  return(
    <section style={{minHeight:"100vh",position:"relative",overflow:"hidden",background:`linear-gradient(160deg,${T.ocean} 0%,#0d2b45 40%,${T.jungle} 100%)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"120px 48px 80px",textAlign:"center"}}>
      <div style={{position:"absolute",inset:0,pointerEvents:"none",opacity:0.055,backgroundImage:`linear-gradient(${T.gold} 1px,transparent 1px),linear-gradient(90deg,${T.gold} 1px,transparent 1px)`,backgroundSize:"72px 72px"}}/>
      {[580,410,260].map((s,i)=>(
        <motion.div key={s} initial={{opacity:0,scale:0.3}} animate={{opacity:0.065-i*0.015,scale:1}} transition={{duration:3+i*0.5}}
          style={{position:"absolute",width:s,height:s,border:`1px solid ${T.gold}`,borderRadius:"50%",top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none"}}/>
      ))}
      <motion.div initial={{opacity:0,scale:0.2,rotate:-30}} animate={{opacity:1,scale:1,rotate:0}} transition={{duration:1.2,ease:[0.34,1.56,0.64,1],delay:0.2}}
        style={{width:116,height:116,border:`2.5px solid ${T.gold}`,borderRadius:"50%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",marginBottom:36,gap:3,zIndex:10}}>
        <Compass size={22} color={T.gold}/>
        <span style={{fontFamily:T.sm,fontSize:7,color:T.gold,letterSpacing:"0.25em"}}>EXPEDITION</span>
        <span style={{fontFamily:T.sm,fontSize:13,color:T.gold,fontWeight:700,letterSpacing:"0.1em"}}>MMXXVI</span>
      </motion.div>
      <motion.p initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.5,duration:0.8}}
        style={{fontFamily:T.sm,fontSize:10,color:T.terra,letterSpacing:"0.3em",textTransform:"uppercase",marginBottom:18}}>
        A 40th Birthday Expedition · Nick & Josh
      </motion.p>
      <motion.h1 initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:0.7,duration:1}}
        style={{fontFamily:T.ser,fontSize:"clamp(44px,8vw,96px)",fontStyle:"italic",fontWeight:900,lineHeight:0.95,marginBottom:20}}>
        <span style={{color:T.paper}}>Between the Stars</span><br/>
        <span style={{color:T.gold}}>and the Sea</span>
      </motion.h1>
      <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.0,duration:0.8}}
        style={{fontFamily:T.sm,fontSize:10,color:T.paper,opacity:0.38,letterSpacing:"0.28em",marginBottom:56}}>
        SRI LANKA · BALI · KOMODO · MAY 2026
      </motion.p>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.1,duration:0.8}}
        style={{display:"flex",gap:48,flexWrap:"wrap",justifyContent:"center",marginBottom:64}}>
        {[["17","Days"],["3","Countries"],["15","Nights"],["5","Airlines"]].map(([v,l])=>(
          <div key={l} style={{textAlign:"center"}}>
            <p style={{fontFamily:T.ser,fontSize:52,fontWeight:900,color:T.gold,lineHeight:1,margin:0}}>{v}</p>
            <p style={{fontFamily:T.sm,fontSize:8,color:T.paper,opacity:0.45,letterSpacing:"0.25em",marginTop:5}}>{l}</p>
          </div>
        ))}
      </motion.div>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.4}}
        style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",marginBottom:64}}>
        {[{f:"🇱🇰",n:"Sri Lanka",d:"May 14–20",s:"Sigiriya · Yala · Colombo"},{f:"🇮🇩",n:"Bali",d:"May 20–28",s:"Uluwatu · Ubud"},{f:"🦎",n:"Komodo",d:"May 22–24",s:"Zada Nara Liveaboard"}].map(x=>(
          <div key={x.n} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(212,175,55,0.22)",borderRadius:4,padding:"14px 22px",textAlign:"center",minWidth:155}}>
            <p style={{fontSize:24,margin:0}}>{x.f}</p>
            <p style={{fontFamily:T.ser,fontSize:15,fontWeight:700,fontStyle:"italic",color:T.paper,margin:"5px 0 2px"}}>{x.n}</p>
            <p style={{fontFamily:T.sm,fontSize:8,color:T.gold,letterSpacing:"0.18em",margin:0}}>{x.d}</p>
            <p style={{fontFamily:T.sm,fontSize:8,color:T.paper,opacity:0.38,marginTop:3}}>{x.s}</p>
          </div>
        ))}
      </motion.div>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.7}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
        <p style={{fontFamily:T.sm,fontSize:8,color:T.paper,opacity:0.28,letterSpacing:"0.32em"}}>SCROLL TO EXPLORE</p>
        <div style={{width:1,height:52,background:`linear-gradient(to bottom,${T.gold},transparent)`}}/>
      </motion.div>
    </section>
  );
}

// ──────────────────────────────────────────────────────
// POLAROID
// ──────────────────────────────────────────────────────
function Polaroid({d,idx}){
  const rot=ROTS[idx%ROTS.length];
  const tape=TAPE[idx%TAPE.length];
  const tape2=TAPE[(idx+3)%TAPE.length];
  const [hov,setHov]=useState(false);
  return(
    <motion.div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      animate={{rotate:hov?0:rot,scale:hov?1.04:1}} transition={{type:"spring",stiffness:180,damping:22}}
      style={{background:"#fff",padding:"10px 10px 58px",width:320,flexShrink:0,boxShadow:`${rot>0?8:-8}px 14px 44px rgba(0,0,0,0.3)`,cursor:"default",position:"relative"}}>
      <div style={{position:"absolute",top:-14,left:20,width:68,height:22,background:tape,opacity:0.88,borderRadius:2,transform:"rotate(-3deg)",zIndex:10}}/>
      <div style={{position:"absolute",top:-10,right:16,width:50,height:18,background:tape2,opacity:0.65,borderRadius:2,transform:"rotate(4deg)",zIndex:10}}/>
      <div style={{height:250,overflow:"hidden",position:"relative",background:T.paperd}}>
        <img src={`https://picsum.photos/seed/${d.seed}/680/480`} alt={d.title}
          onError={e=>{e.target.src=`https://picsum.photos/seed/${d.seed+200}/680/480`;}}
          style={{width:"100%",height:"100%",objectFit:"cover",display:"block",filter:"sepia(30%) saturate(70%) brightness(0.90) contrast(1.08)"}}/>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 50%,transparent 40%,rgba(10,34,57,0.3) 100%)"}}/>
        <div style={{position:"absolute",bottom:10,left:10,background:T.ocean,padding:"3px 10px",borderRadius:1}}>
          <span style={{fontFamily:T.sm,fontSize:8,color:T.gold,letterSpacing:"0.15em"}}>{d.day} · {d.date}</span>
        </div>
      </div>
      <div style={{paddingTop:12,textAlign:"center"}}>
        <p style={{fontFamily:T.sm,fontSize:8,color:"#888",letterSpacing:"0.18em",textTransform:"uppercase",margin:0}}>{d.location}</p>
        <div style={{width:28,height:2,background:tape,margin:"8px auto 0",borderRadius:2}}/>
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────
// DAY ROW
// ──────────────────────────────────────────────────────
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
          <p style={{fontFamily:T.sm,fontSize:12,color:T.ocean,lineHeight:1.95,opacity:0.78,maxWidth:380,margin:0}}>{d.desc}</p>
        </div>
      </motion.div>
    </div>
  );
}

// ──────────────────────────────────────────────────────
// PACKING CARD
// ──────────────────────────────────────────────────────
function PackCard({cat,checked,onToggle}){
  const done=cat.items.filter(it=>checked[`${cat.category}::${it}`]).length;
  const pct=(done/cat.items.length)*100;
  return(
    <div style={{background:T.paper,border:`1px solid ${T.paperd}`,borderTop:`4px solid ${cat.color}`,borderRadius:4,padding:"20px 18px",breakInside:"avoid",marginBottom:14}}>
      <h3 style={{fontFamily:T.ser,fontSize:14,fontWeight:700,color:cat.color,margin:"0 0 12px"}}>{cat.category}</h3>
      <div style={{height:3,background:T.paperd,borderRadius:4,overflow:"hidden",marginBottom:5}}>
        <motion.div animate={{width:`${pct}%`}} transition={{duration:0.5}} style={{height:"100%",background:done===cat.items.length?T.jungle:cat.color,borderRadius:4}}/>
      </div>
      <p style={{fontFamily:T.sm,fontSize:8,color:cat.color,opacity:0.55,marginBottom:14,letterSpacing:"0.12em"}}>{done}/{cat.items.length} PACKED</p>
      {cat.items.map((item,i)=>{
        const k=`${cat.category}::${item}`;const c=!!checked[k];
        return(
          <motion.div key={i} onClick={()=>onToggle(k)} whileHover={{x:3}} whileTap={{scale:0.97}}
            style={{display:"flex",alignItems:"flex-start",gap:8,padding:"7px 0",cursor:"pointer",borderBottom:i<cat.items.length-1?`1px solid ${T.paperd}`:"none"}}>
            {c?<CheckSquare size={13} color={T.jungle} style={{flexShrink:0,marginTop:2}}/>:<Square size={13} color={T.ocean} style={{flexShrink:0,marginTop:2,opacity:0.28}}/>}
            <span style={{fontFamily:T.sm,fontSize:11,lineHeight:1.5,color:c?T.jungle:T.ocean,textDecoration:c?"line-through":"none",opacity:c?0.45:0.85,transition:"all 0.2s"}}>{item}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────
// VAULT BUTTON
// ──────────────────────────────────────────────────────
function VaultBtn({label,sub,Icon,bg,href,delay}){
  return(
    <motion.a href={href} target="_blank" rel="noopener noreferrer"
      initial={{opacity:0,x:-40}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay,duration:0.7,ease:[0.22,1,0.36,1]}}
      whileHover={{scale:1.015,y:-3}} whileTap={{scale:0.98}}
      style={{display:"flex",alignItems:"center",gap:18,background:bg,color:T.paper,padding:"20px 24px",borderRadius:3,textDecoration:"none",boxShadow:"0 6px 28px rgba(0,0,0,0.3)",border:"1px solid rgba(212,175,55,0.15)"}}>
      <div style={{width:50,height:50,borderRadius:"50%",background:"rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon size={21} color={T.paper}/></div>
      <div style={{flex:1}}>
        <p style={{fontFamily:T.ser,fontSize:16,fontWeight:700,fontStyle:"italic",margin:0,lineHeight:1.2,color:T.paper}}>{label}</p>
        <p style={{fontFamily:T.sm,fontSize:9,margin:"4px 0 0",opacity:0.52,letterSpacing:"0.1em"}}>{sub}</p>
      </div>
      <ExternalLink size={14} color={T.paper} style={{opacity:0.35,flexShrink:0}}/>
    </motion.a>
  );
}

// ──────────────────────────────────────────────────────
// APP
// ──────────────────────────────────────────────────────
export default function App(){
  const [checked,setChecked]=useState({});
  const toggle=k=>setChecked(p=>({...p,[k]:!p[k]}));
  const totalItems=PACKING.reduce((a,c)=>a+c.items.length,0);
  const totalDone=Object.values(checked).filter(Boolean).length;
  const pct=totalItems?Math.round((totalDone/totalItems)*100):0;

  return(
    <div style={{background:T.paper,minHeight:"100vh",overflowX:"hidden"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700;1,9..144,900&family=Space+Mono:wght@400;700&display=swap');*,*::before,*::after{box-sizing:border-box;}body{margin:0;}::selection{background:#D4AF37;color:#0A2239;}`}</style>
      <Grain/><Nav/><Hero/>

      {/* ══ EXPEDITION LOG ══ */}
      <section id="expedition" style={{padding:"96px 56px",background:T.paper}}>
        <div style={{maxWidth:980,margin:"0 auto"}}>
          <SHead eyebrow="17-Day Private Expedition · May 12–28, 2026" title="The Expedition Log"/>
          <div style={{display:"flex",gap:5,justifyContent:"center",padding:"0 0 52px",opacity:0.2}}>
            {Array.from({length:14}).map((_,i)=><div key={i} style={{width:24,height:16,border:`2px solid ${T.gold}`,borderRadius:2}}/>)}
          </div>
          {DAYS.map((d,i)=><DayRow key={i} d={d} idx={i}/>)}
        </div>
      </section>

      {/* ══ FLIGHT MAP ══ */}
      <FlightMap/>

      {/* ══ THE KIT ══ */}
      <section id="the-kit" style={{background:T.ocean,padding:"96px 56px"}}>
        <div style={{maxWidth:980,margin:"0 auto"}}>
          <SHead eyebrow="Interactive Expedition Checklist" title="The Kit" light/>
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
            style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(212,175,55,0.22)",borderRadius:4,padding:"18px 24px",marginBottom:44,display:"flex",alignItems:"center",gap:24}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontFamily:T.sm,fontSize:9,color:T.gold,letterSpacing:"0.2em",textTransform:"uppercase"}}>Overall Progress</span>
                <span style={{fontFamily:T.sm,fontSize:9,color:T.gold}}>{totalDone} / {totalItems} Items</span>
              </div>
              <div style={{height:6,background:"rgba(255,255,255,0.1)",borderRadius:6,overflow:"hidden"}}>
                <motion.div animate={{width:`${pct}%`}} transition={{duration:0.6}} style={{height:"100%",background:pct===100?T.jungle:T.gold,borderRadius:6}}/>
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
              <motion.div key={cat.category} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.07,duration:0.6}}>
                <PackCard cat={cat} checked={checked} onToggle={toggle}/>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ THE VAULT ══ */}
      <section id="the-vault" style={{background:T.jungle,padding:"96px 56px"}}>
        <div style={{maxWidth:720,margin:"0 auto"}}>
          <SHead eyebrow="Secure Operations Centre" title="The Vault" light/>
          <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}
            style={{border:"2px solid rgba(212,175,55,0.25)",borderRadius:4,padding:"28px 24px",background:"rgba(0,0,0,0.22)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:22,paddingBottom:18,borderBottom:"1px solid rgba(212,175,55,0.15)"}}>
              <div style={{display:"flex",gap:6}}>
                {["#E07A5F","#D4AF37","#2D6A4F"].map(c=><div key={c} style={{width:10,height:10,borderRadius:"50%",background:c,opacity:0.7}}/>)}
              </div>
              <p style={{fontFamily:T.sm,fontSize:8,color:T.gold,opacity:0.38,letterSpacing:"0.22em",margin:0}}>● EXPEDITION BTSTS/2026 · CLASSIFIED · SECURE</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <VaultBtn label="Track Flights: EY2 & EY392" sub="JFK 15:45 → AUH 12:25 → CMB 08:35 · Business · Ref BET4KE" Icon={Plane} bg={T.ocean} href="https://www.flightradar24.com/data/flights/ey2" delay={0}/>
              <VaultBtn label="Track Flights: ID6333 & QZ647" sub="DPS 07:55→LBJ 09:10 · LBJ 13:05→DPS 14:20 · Refs NJFCLT / AFJ5MN" Icon={Plane} bg="#1a3a5c" href="https://www.flightradar24.com" delay={0.1}/>
              <VaultBtn label="Track Flights: EK399 & EK201" sub="DPS 00:35→DXB 05:35 · DXB 08:30→JFK 14:25 · Business · 777 + A380" Icon={Plane} bg="#1a2c40" href="https://www.flightradar24.com/data/flights/ek399" delay={0.15}/>
              <VaultBtn label="Download: Ceylon Expeditions Tour Dossier" sub="Sri Lanka Private Itinerary · PDF · Full Booking Confirmation" Icon={Download} bg={T.terra} href="#" delay={0.2}/>
              <VaultBtn label="Download: Zada Nara Liveaboard Booking" sub="Komodo National Park · Master Suite · Full Charter Details" Icon={FileText} bg="#7B5E2A" href="#" delay={0.3}/>
            </div>
          </motion.div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:24}}>
            {[
              {l:"🔒 Visa Alert",b:"Sri Lanka e-ETA required before boarding EY392. Indonesia e-VOA clears at CGK Terminal 3 — not Bali. Pre-apply: molina.imigrasi.go.id"},
              {l:"⚠️ Batik Air 20kg",b:"ID6333 strict 20kg limit (ref NJFCLT). Both pax confirmed: 20kg + 7kg carry-on. Weigh bags night before at Alila Uluwatu."},
              {l:"🌋 Lewotobi Watch",b:"Monitor BMKG ash alerts 48hrs before QZ647 (LBJ→DPS). Contingency: speedboat Labuan Bajo→Lombok then fly to Bali."},
              {l:"✈️ Emirates Return",b:"EK399: Boeing 777-300ER Business. EK201: A380-800 Business. Chauffeur confirmed JFK pickup, drop-off 341 West 45th St."},
            ].map((a,i)=>(
              <motion.div key={i} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:0.4+i*0.08,duration:0.6}}
                style={{background:"rgba(224,122,95,0.1)",border:"1px solid rgba(224,122,95,0.3)",borderLeft:`3px solid ${T.terra}`,borderRadius:"0 3px 3px 0",padding:"14px 16px"}}>
                <p style={{fontFamily:T.sm,fontSize:9,fontWeight:700,color:T.terra,letterSpacing:"0.14em",margin:"0 0 5px"}}>{a.l}</p>
                <p style={{fontFamily:T.sm,fontSize:10,color:T.paper,opacity:0.75,lineHeight:1.6,margin:0}}>{a.b}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{background:T.ocean,borderTop:`3px solid ${T.gold}`,padding:"44px 56px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
        <div style={{width:44,height:44,border:`1.5px solid ${T.gold}`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",opacity:0.5}}>
          <Anchor size={18} color={T.gold}/>
        </div>
        <p style={{fontFamily:T.ser,fontSize:20,fontStyle:"italic",color:T.paper,opacity:0.65,margin:0}}>Between the Stars and the Sea</p>
        <p style={{fontFamily:T.sm,fontSize:8,color:T.gold,opacity:0.4,letterSpacing:"0.3em",textTransform:"uppercase",margin:0}}>Nick & Josh · 40th Birthday Expedition · May 2026</p>
        <p style={{fontFamily:T.sm,fontSize:8,color:T.paper,opacity:0.2,margin:0}}>Private · Not for distribution</p>
      </footer>
    </div>
  );
}
