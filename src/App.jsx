import { useState, useEffect, useCallback, useRef } from "react";

/* ─── DESIGN TOKENS ──────────────────────────────────────────
   Single source of truth. Change here, changes everywhere.
   8px base grid. Three radius sizes. Unified type scale.
──────────────────────────────────────────────────────────── */
const T = {
  // Colours
  bg0:   "#0A0A14",
  bg1:   "#0F0F20",
  bg2:   "#141428",
  card:  "#1A1A34",
  bdr:   "#2A2A50",
  teal:  "#00C896",
  teal2: "#00FFD1",
  white: "#FFFFFF",
  body:  "#C4C8E0",       // raised from #B8BEDD, passes 4.7:1 on card surface
  muted: "#9298BC",       // raised from #7880A8, now passes 4.6:1 on bg0
  dim:   "#5A6080",
  err:   "#FF6B6B",
  // Radius
  rSm:   "12px",
  rMd:   "16px",
  rLg:   "24px",
  rPill: "9999px",
  // Spacing (8px grid)
  sp1:  "8px",
  sp2:  "16px",
  sp3:  "24px",
  sp4:  "32px",
  sp5:  "40px",
  sp6:  "48px",
  sp8:  "64px",
  sp10: "80px",
  sp12: "96px",
};

/* ─── LOGO: Ubuntu Rise ──────────────────────────────────── */
function LogoMark({ size = 32 }) {
  const w = size, h = size;
  const hx = w * 0.50, hy = h * 0.56, hubR = w * 0.115;
  const nodes = [
    { x: w * 0.14, y: h * 0.38, r: w * 0.07  },
    { x: w * 0.50, y: h * 0.14, r: w * 0.085 },
    { x: w * 0.86, y: h * 0.38, r: w * 0.07  },
  ];
  const id = `lg${w}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none"
      aria-hidden="true" style={{ flexShrink: 0 }}>
      <defs>
        <radialGradient id={`hub-${id}`} cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#00FFD1"/>
          <stop offset="100%" stopColor="#00C896"/>
        </radialGradient>
        <radialGradient id={`nd-${id}`} cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#00C896"/>
          <stop offset="100%" stopColor="#00A87A"/>
        </radialGradient>
        <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={w * 0.05} result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {nodes.map((n, i) => (
        <line key={i} x1={hx} y1={hy} x2={n.x} y2={n.y}
          stroke="#00C896" strokeWidth={w * 0.022} strokeLinecap="round" opacity={0.30}/>
      ))}
      <path d={`M ${nodes[0].x} ${nodes[0].y} Q ${nodes[1].x} ${nodes[1].y - h*0.06} ${nodes[1].x} ${nodes[1].y} Q ${nodes[1].x} ${nodes[1].y - h*0.06} ${nodes[2].x} ${nodes[2].y}`}
        stroke="#00C896" strokeWidth={w * 0.016} strokeLinecap="round" opacity={0.20} fill="none"/>
      <circle cx={hx} cy={hy} r={hubR * 1.75} fill="#00C896" opacity={0.08}/>
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.r * 1.7} fill="#00C896" opacity={0.09}/>
          <circle cx={n.x} cy={n.y} r={n.r} fill={`url(#nd-${id})`} opacity={0.75}
            filter={i === 1 ? `url(#glow-${id})` : undefined}/>
        </g>
      ))}
      <circle cx={hx} cy={hy} r={hubR * 1.3} fill="#00C896" opacity={0.15}/>
      <circle cx={hx} cy={hy} r={hubR} fill={`url(#hub-${id})`} filter={`url(#glow-${id})`}/>
    </svg>
  );
}

function Logo({ size = "sm", showTagline = false }) {
  const cfg = { xs:[26,15], sm:[32,18], md:[46,22], lg:[68,34], xl:[96,48] };
  const [markSz, nameSz] = cfg[size] || cfg.sm;
  return (
    <div style={{ display:"flex", alignItems:"center", gap: markSz * 0.32 }}>
      <LogoMark size={markSz}/>
      <div style={{ display:"flex", flexDirection:"column", gap:1 }}>
        <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900,
          fontSize:nameSz, letterSpacing:"-0.03em", lineHeight:1.05, color:T.white }}>
          Sibahle
          <span style={{ background:`linear-gradient(120deg,${T.teal},${T.teal2})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
            Digital
          </span>
        </span>
        {showTagline && (
          <span style={{ fontSize:nameSz*0.55, fontWeight:600, letterSpacing:"0.15em",
            textTransform:"uppercase", color:T.teal, opacity:0.75,
            fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
            AI Systems Design
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Scroll helper ──────────────────────────────────────── */
function scrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior:"smooth" });
}

/* ─── GLOBAL STYLES ──────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Outfit:wght@700;800;900&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{background:#0A0A14!important;min-height:100vh;}
body{color:#C4C8E0;font-family:'Plus Jakarta Sans',sans-serif;font-size:16px;line-height:1.65;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
section,footer{scroll-margin-top:80px;}

/* Skip link: screen reader + keyboard navigation */
.skip-link{
  position:fixed;top:-100%;left:16px;z-index:9999;
  background:#00C896;color:#06060F;
  padding:12px 24px;border-radius:0 0 12px 12px;
  font-size:13px;font-weight:700;text-decoration:none;
  transition:top 0.2s;
}
.skip-link:focus{top:0;}

/* Global focus ring: WCAG 2.4.7 */
:focus-visible{
  outline:2px solid #00C896;
  outline-offset:3px;
  border-radius:4px;
}
button:focus-visible,a:focus-visible{border-radius:8px;}

/* Respect reduced motion */
@media(prefers-reduced-motion:reduce){
  *{animation-duration:0.01ms!important;transition-duration:0.01ms!important;}
}

/* Scroll progress bar */
.progress-bar{
  position:fixed;top:0;left:0;z-index:200;height:2px;
  background:linear-gradient(90deg,#00C896,#00FFD1);
  transition:width 0.1s linear;
}

/* ── Type scale ── */
.display{font-family:'Outfit',sans-serif;font-weight:800;line-height:1.06;letter-spacing:-0.03em;color:#FFFFFF;}
.strong{font-family:'Outfit',sans-serif;font-weight:700;line-height:1.15;letter-spacing:-0.02em;color:#FFFFFF;}
.eyebrow{font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#00C896;font-family:'Plus Jakarta Sans',sans-serif;}
.body-text{font-size:15px;color:#C4C8E0;line-height:1.78;}
.teal-grad{background:linear-gradient(120deg,#00C896,#00FFD1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.zulu{font-family:'Outfit',sans-serif;font-weight:900;font-size:clamp(52px,9vw,108px);line-height:1;letter-spacing:-0.04em;background:linear-gradient(120deg,#00C896 0%,#00FFD1 55%,#FFFFFF 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}

/* ── Keyframes ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes float2{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes pdot{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.25)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

/* Buttons: consistent 44px min touch target ── */
.btn-p{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  background:linear-gradient(120deg,#00C896,#00FFD1);
  color:#06060F;border:none;
  padding:13px 32px;min-height:44px;
  font-family:'Plus Jakarta Sans',sans-serif;
  font-size:12px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;
  cursor:pointer;border-radius:9999px;
  box-shadow:0 4px 24px rgba(0,200,150,0.28);
  transition:transform 0.2s,box-shadow 0.2s,opacity 0.2s;text-decoration:none;white-space:nowrap;
}
.btn-p:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 36px rgba(0,200,150,0.44);}
.btn-p:disabled{opacity:0.55;cursor:not-allowed;transform:none;}

.btn-s{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  background:#1A1A34;color:#FFFFFF;border:1px solid #2A2A50;
  padding:13px 32px;min-height:44px;
  font-family:'Plus Jakarta Sans',sans-serif;
  font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
  cursor:pointer;border-radius:9999px;
  transition:border-color 0.2s,color 0.2s,transform 0.2s;text-decoration:none;white-space:nowrap;
}
.btn-s:hover{border-color:#00C896;color:#00C896;transform:translateY(-2px);}

/* Cards: box-shadow lift instead of transform (no layout shift) ── */
.card{
  background:#1A1A34;border:1px solid #2A2A50;border-radius:16px;
  transition:border-color 0.25s,box-shadow 0.25s;
}
.card:hover{
  border-color:rgba(0,200,150,0.38);
  box-shadow:0 0 0 1px rgba(0,200,150,0.12),0 16px 40px rgba(0,0,0,0.5);
}

/* ── Tag ── */
.tag{display:inline-block;padding:4px 12px;border-radius:9999px;background:rgba(0,200,150,0.10);color:#00C896;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;border:1px solid rgba(0,200,150,0.22);}

/* ── Nav link ── */
.nav-link{color:#C4C8E0;text-decoration:none;font-size:13px;font-weight:600;transition:color 0.2s;cursor:pointer;min-height:44px;display:inline-flex;align-items:center;}
.nav-link:hover,.nav-link.active{color:#FFFFFF;}
.nav-link.active{color:#00C896;}

/* ── Section divider ── (applied consistently to all sections) */
.sec-label{display:flex;flex-direction:column;gap:12px;margin-bottom:48px;}
.sec-divider{width:40px;height:3px;background:linear-gradient(90deg,#00C896,transparent);border-radius:2px;}

/* ── Form elements ── */
.field{display:flex;flex-direction:column;gap:6px;}
.field label{font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#9298BC;}
input,textarea,select{
  background:#141428;border:1px solid #2A2A50;
  color:#FFFFFF;font-family:'Plus Jakarta Sans',sans-serif;
  font-size:14px;padding:13px 16px;width:100%;outline:none;border-radius:12px;
  transition:border-color 0.2s,box-shadow 0.2s;-webkit-appearance:none;min-height:44px;
}
input:focus,textarea:focus,select:focus{border-color:#00C896;box-shadow:0 0 0 3px rgba(0,200,150,0.13);}
input[aria-invalid=true],textarea[aria-invalid=true],select[aria-invalid=true]{border-color:#FF6B6B;box-shadow:0 0 0 3px rgba(255,107,107,0.12);}
input::placeholder,textarea::placeholder{color:#4A4A70;}
select option{background:#141428;color:#FFFFFF;}
.field-error{font-size:12px;color:#FF6B6B;font-weight:500;}

/* ── Capability rows ── */
.cap-row{
  display:grid;grid-template-columns:48px 1fr;gap:0 16px;
  padding:20px;border-radius:16px;
  background:#1A1A34;border:1px solid #2A2A50;margin-bottom:8px;
  transition:border-color 0.2s,background 0.2s;
}
.cap-row:hover{border-color:rgba(0,200,150,0.36);background:#1F1F3C;}
.cap-num{font-family:'Outfit',sans-serif;font-weight:900;font-size:13px;color:#00C896;letter-spacing:0.05em;padding-top:3px;}

/* ── Mobile nav overlay ── */
.mob-menu{position:fixed;inset:0;z-index:200;background:#0A0A14;display:flex;flex-direction:column;padding:96px 32px 40px;gap:4px;animation:fadeIn 0.2s ease;}
.mob-link{font-family:'Outfit',sans-serif;font-size:32px;font-weight:800;color:#9298BC;text-decoration:none;padding:14px 0;border-bottom:1px solid #2A2A50;letter-spacing:-0.025em;transition:color 0.18s;cursor:pointer;background:none;border-top:none;border-left:none;border-right:none;text-align:left;width:100%;min-height:44px;display:flex;align-items:center;}
.mob-link:hover{color:#00C896;}

/* ── Floating mobile CTA ── */
.fab{
  position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:90;
  display:none;
  background:linear-gradient(120deg,#00C896,#00FFD1);
  color:#06060F;border:none;
  padding:14px 32px;border-radius:9999px;
  font-family:'Plus Jakarta Sans',sans-serif;
  font-size:13px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;
  box-shadow:0 8px 32px rgba(0,200,150,0.4);
  cursor:pointer;white-space:nowrap;
  animation:fadeUp 0.4s ease both;
}

/* ── Responsive ── */
@media(max-width:1024px){
  .two-col,.three-col,.five-col{grid-template-columns:1fr!important;}
  .s-pad{padding:64px 20px!important;}
  .h-pad{padding:128px 20px 80px!important;}
}
@media(max-width:768px){
  .d-only{display:none!important;}.m-only{display:flex!important;}
  .cap-row{grid-template-columns:1fr!important;}
  .cap-num{margin-bottom:4px;}
  .fab{display:flex;}
  .five-col{grid-template-columns:1fr!important;}
  .five-col > *:last-child{grid-column:1/-1;}
}
@media(min-width:769px){.m-only{display:none!important;}}
`;

/* ─── Icons ──────────────────────────────────────────────── */
const Arr = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M1 7h12M7 1.5l5.5 5.5L7 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 7h18M3 12h18M3 17h12" stroke="#FFF" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <path d="M4 4l14 14M18 4L4 18" stroke="#FFF" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <path d="M4 13l7 7 11-11" stroke="#00C896" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const Spinner = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"
    style={{ animation:"spin 0.8s linear infinite" }}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

/* ─── Form validation ────────────────────────────────────── */
function validate(form) {
  const errs = {};
  if (!form.name.trim())  errs.name = "Please enter your name";
  if (!form.email.trim()) errs.email = "Please enter your email";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Please enter a valid email address";
  if (!form.message.trim()) errs.message = "Please describe your challenge";
  return errs;
}

function Field({ label, error, children, id }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <span className="field-error" role="alert">{error}</span>}
    </div>
  );
}

/* ─── Scroll progress ────────────────────────────────────── */
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setPct(pct);
    };
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return <div className="progress-bar" style={{ width:`${pct}%` }} aria-hidden="true"/>;
}

/* ─── NAV ────────────────────────────────────────────────── */
const NAV_LINKS = [
  { l:"Our Story",  id:"story"      },
  { l:"What We Do", id:"what-we-do" },
  { l:"Solutions",  id:"solutions"  },
  { l:"Process",    id:"process"    },
  { l:"Contact",    id:"contact"    },
];

function Nav({ onConsult }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

 useEffect(() => {
  const observers = [];

  NAV_LINKS.forEach(({ id }) => {
    const el = document.getElementById(id);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(id);
        }
      },
      {
        root: null,
        rootMargin: "-40% 0px -50% 0px", // triggers when section is centered
        threshold: 0,
      }
    );

    observer.observe(el);
    observers.push(observer);
  });

  return () => {
    observers.forEach(o => o.disconnect());
  };
 }, []);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!open) return;
    const fn = e => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open]);

  const go = (id) => { scrollTo(id); setOpen(false); };

  return (
    <>
      <nav aria-label="Main navigation" style={{
        position:"fixed", top:12, left:"50%", transform:"translateX(-50%)",
        zIndex:100, width:"calc(100% - 32px)", maxWidth:1080,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 16px", height:56,
        background: scrolled ? "rgba(10,10,20,0.97)" : "rgba(10,10,20,0.80)",
        border:"1px solid",
        borderColor: scrolled ? "rgba(0,200,150,0.28)" : "#2A2A50",
        borderRadius:"9999px", backdropFilter:"blur(20px)",
        transition:"background 0.3s,border-color 0.3s,box-shadow 0.3s",
        boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.7)" : "none",
      }}>
        <button onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}
          aria-label="Scroll to top"
          style={{ background:"none", border:"none", cursor:"pointer", padding:"8px 8px 8px 0", display:"flex", alignItems:"center" }}>
          <Logo size="md"/>
        </button>

        <div className="d-only" style={{ display:"flex", alignItems:"center", gap:24 }}>
          {NAV_LINKS.map(({ l, id }) => (
            <button key={id} onClick={() => go(id)}
              className={`nav-link${active===id?" active":""}`}
              aria-current={active===id?"page":undefined}
              style={{ background:"none", border:"none", padding:"8px 4px" }}>
              {l}
            </button>
          ))}
        </div>

        <button className="btn-p d-only" onClick={onConsult}
          style={{ padding:"9px 20px", fontSize:11 }}
          aria-label="Start a project: open consultation form">
          Start a Project <Arr/>
        </button>

        <button className="m-only" onClick={() => setOpen(true)}
          aria-label="Open navigation menu" aria-expanded={open}
          style={{ background:"none", border:"none", cursor:"pointer", alignItems:"center",
            padding:"11px 8px", minHeight:44, minWidth:44 }}>
          <MenuIcon/>
        </button>
      </nav>

      {open && (
        <>
          {/* Backdrop */}
          <div onClick={() => setOpen(false)} aria-hidden="true"
            style={{ position:"fixed", inset:0, zIndex:199, background:"rgba(0,0,0,0.5)" }}/>
          <nav className="mob-menu" aria-label="Mobile navigation">
            <button onClick={() => setOpen(false)} aria-label="Close navigation menu"
              style={{ position:"absolute", top:20, right:20,
                background:"#1A1A34", border:"1px solid #2A2A50", borderRadius:"50%",
                width:44, height:44, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <CloseIcon/>
            </button>
            {NAV_LINKS.map(({ l, id }) => (
              <button key={id} onClick={() => go(id)} className="mob-link"
                aria-current={active===id?"page":undefined}>{l}</button>
            ))}
            <button className="btn-p" style={{ marginTop:24, justifyContent:"center" }}
              onClick={() => { setOpen(false); onConsult(); }}>
              Start a Project <Arr/>
            </button>
          </nav>
        </>
      )}
    </>
  );
}

/* ─── HERO ───────────────────────────────────────────────── */
function Hero({ onConsult }) {
  return (
    <section aria-labelledby="hero-heading" style={{ position:"relative", minHeight:"100vh",
      display:"flex", alignItems:"center", overflow:"hidden", background:T.bg0 }}>
      {/* Decorative grid */}
      <div aria-hidden="true" style={{ position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:"linear-gradient(rgba(0,200,150,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,150,0.035) 1px,transparent 1px)",
        backgroundSize:"64px 64px",
        maskImage:"radial-gradient(ellipse 72% 72% at 50% 42%,black 18%,transparent 100%)" }}/>
      {/* Ambient orbs */}
      <div aria-hidden="true" style={{ position:"absolute", top:"-16%", right:"-8%",
        width:560, height:560, borderRadius:"50%", pointerEvents:"none",
        background:"radial-gradient(circle at 40% 40%,rgba(0,200,150,0.11) 0%,transparent 65%)",
        animation:"float 12s ease-in-out infinite" }}/>
      <div aria-hidden="true" style={{ position:"absolute", bottom:"-8%", left:"-5%",
        width:380, height:380, borderRadius:"50%", pointerEvents:"none",
        background:"radial-gradient(circle,rgba(0,60,180,0.07) 0%,transparent 70%)",
        animation:"float2 9s ease-in-out infinite 2s" }}/>

      <div className="h-pad" style={{ maxWidth:1080, margin:"0 auto", width:"100%",
        position:"relative", zIndex:1, padding:"144px 40px 100px" }}>

        {/* Live badge */}
        <div aria-hidden="true" style={{ display:"inline-flex", alignItems:"center", gap:9,
          background:T.card, border:`1px solid ${T.bdr}`, borderRadius:"9999px",
          padding:"7px 18px 7px 12px", marginBottom:36,
          animation:"fadeUp 0.5s ease both" }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:T.teal,
            boxShadow:`0 0 10px ${T.teal}`, animation:"pdot 2s ease-in-out infinite" }}/>
          <span className="eyebrow" style={{ fontSize:10 }}>AI Systems Design Consultants</span>
        </div>

        <h1 id="hero-heading" className="display"
          style={{ fontSize:"clamp(40px,7vw,88px)", maxWidth:780, marginBottom:28,
            animation:"fadeUp 0.6s ease 0.1s both" }}>
          AI systems that solve <span className="teal-grad">real</span> problems for real communities.
        </h1>

        <p className="body-text"
          style={{ maxWidth:520, marginBottom:48, animation:"fadeUp 0.6s ease 0.2s both" }}>
          We design intelligent systems that automate workflows, sharpen decisions, and simplify operations, built around your specific challenge, not a generic template.
        </p>

        <div style={{ display:"flex", flexWrap:"wrap", gap:12, animation:"fadeUp 0.6s ease 0.3s both" }}>
          <button className="btn-p" onClick={onConsult}
            aria-label="Request a consultation: open form">
            Request a Consultation <Arr/>
          </button>
          <button className="btn-s" onClick={() => scrollTo("story")}
            aria-label="Read our story">
            Our Story <Arr/>
          </button>
        </div>

        {/* Value chips */}
        <div style={{ marginTop:56, paddingTop:40, borderTop:`1px solid ${T.bdr}`,
          display:"flex", flexWrap:"wrap", gap:12,
          animation:"fadeUp 0.6s ease 0.4s both" }}>
          {[
            { n:"Sibahle",         s:'"We are beautiful" in isiZulu'       },
            { n:"Community-first", s:"Built for the heart of South Africa"  },
            { n:"AI for all",      s:"No organisation left behind"          },
          ].map(b => (
            <div key={b.n} style={{ background:T.card, border:`1px solid ${T.bdr}`,
              borderRadius:T.rMd, padding:"16px 20px",
              display:"flex", flexDirection:"column", gap:4 }}>
              <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800,
                fontSize:16, color:T.white }}>{b.n}</span>
              <span style={{ fontSize:11, color:T.muted }}>{b.s}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── BRAND STORY ────────────────────────────────────────── */
function BrandStory() {
  return (
    <section id="story" aria-labelledby="story-heading"
      style={{ background:T.bg1, borderTop:`1px solid ${T.bdr}`, padding:"96px 40px" }}
      className="s-pad">
      <div style={{ maxWidth:1080, margin:"0 auto" }}>

        {/* Name reveal */}
        <div style={{ padding:"48px 40px",
          background:"linear-gradient(135deg,rgba(0,200,150,0.07) 0%,#141428 70%)",
          border:"1px solid rgba(0,200,150,0.22)", borderRadius:T.rLg, marginBottom:16 }}>
          <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }}>
            <div>
              <div className="sec-label">
                <div className="sec-divider"/>
                <span className="eyebrow" id="story-heading">The Name Behind the Work</span>
              </div>
              <div className="zulu">Sibahle</div>
              <div style={{ display:"inline-block", marginTop:16, background:T.card,
                border:`1px solid ${T.bdr}`, borderRadius:"9999px", padding:"6px 18px" }}>
                <span style={{ fontSize:13, color:T.body, fontStyle:"italic" }}>
                  "We are beautiful" in <span style={{ color:T.teal, fontWeight:700, fontStyle:"normal" }}>isiZulu</span>
                </span>
              </div>
            </div>
            <div>
              <p className="body-text">
                The name <strong style={{ color:T.white }}>Sibahle</strong> reflects a human-centered philosophy: technology that uplifts people rather than simply automating processes.
              </p>
              <p className="body-text" style={{ marginTop:16 }}>
                It represents solutions built with <strong style={{ color:T.white }}>empathy, simplicity, and inclusivity</strong> in mind. A commitment that runs through every system we design.
              </p>
            </div>
          </div>
        </div>

        {/* Mission + Vision */}
        <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {[
            {
              accent:T.teal, dimBg:"rgba(0,200,150,0.08)", dimBorder:"rgba(0,200,150,0.24)",
              labelColor:T.teal, label:"Our Mission",
              icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3" fill="#00C896"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="#00C896" strokeWidth="1.6" strokeLinecap="round"/></svg>,
              heading:"Democratising high-level system design",
              body:"To build AI-powered solutions for the heart of our communities, bridging the gap between complex technology and local impact. Equipping schools, NGOs, and small businesses with intelligent workflows that enable them to thrive in a digital economy.",
            },
            {
              accent:"#6B9FFF", dimBg:"rgba(107,159,255,0.08)", dimBorder:"rgba(107,159,255,0.24)",
              labelColor:"#6B9FFF", label:"Our Vision",
              icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5z" stroke="#6B9FFF" strokeWidth="1.6" strokeLinecap="round"/><circle cx="12" cy="12" r="3" stroke="#6B9FFF" strokeWidth="1.6"/></svg>,
              heading:"Every community, every organisation, connected",
              body:"A future where every organisation, regardless of size, location, or resources, has access to custom digital systems that support how it operates, makes decisions, and grows. A world where technology is not a barrier but a force that transforms inefficiency into resilience.",
            },
          ].map((c, i) => (
            <div key={i} style={{ background:T.card, border:`1px solid ${T.bdr}`,
              borderRadius:T.rLg, padding:"32px 28px" }}>
              <div style={{ width:40, height:40, borderRadius:T.rSm, marginBottom:20,
                background:c.dimBg, border:`1px solid ${c.dimBorder}`,
                display:"flex", alignItems:"center", justifyContent:"center" }}>{c.icon}</div>
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.2em",
                textTransform:"uppercase", color:c.labelColor, display:"block", marginBottom:12 }}>{c.label}</span>
              <h3 className="strong" style={{ fontSize:18, marginBottom:14 }}>{c.heading}</h3>
              <p className="body-text">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PILLARS ────────────────────────────────────────────── */
function Pillars() {
  const pillars = [
    {
      n:"01", title:"Dignity Through Design",
      color:T.teal, dimBg:"rgba(0,200,150,0.08)", dimBorder:"rgba(0,200,150,0.24)",
      icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#00C896" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#00C896" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      body:"Spaza shops and community schools deserve the same calibre of engineering as multinational corporations.",
      detail:"Our systems are built with respect for the real-world environments in which they operate. No compromises, no second-tier solutions.",
    },
    {
      n:"02", title:"Accessible Intelligence",
      color:"#FFB830", dimBg:"rgba(255,184,48,0.08)", dimBorder:"rgba(255,184,48,0.24)",
      icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="4" stroke="#FFB830" strokeWidth="1.6"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#FFB830" strokeWidth="1.6" strokeLinecap="round"/></svg>,
      body:"Our AI solutions focus on immediate, practical utility: whether managing attendance, tracking local inventory, or optimising NGO resources.",
      detail:"We remove unnecessary complexity so that technology is usable from day one, by anyone in your team.",
    },
    {
      n:"03", title:"Localised Scalability",
      color:"#6B9FFF", dimBg:"rgba(107,159,255,0.08)", dimBorder:"rgba(107,159,255,0.24)",
      icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="2" stroke="#6B9FFF" strokeWidth="1.6"/><circle cx="4" cy="6" r="2" stroke="#6B9FFF" strokeWidth="1.6"/><circle cx="20" cy="6" r="2" stroke="#6B9FFF" strokeWidth="1.6"/><circle cx="4" cy="18" r="2" stroke="#6B9FFF" strokeWidth="1.6"/><circle cx="20" cy="18" r="2" stroke="#6B9FFF" strokeWidth="1.6"/><path d="M6 6.5l4 4M14 13.5l4 4M18 6.5l-4 4M6 17.5l4-4" stroke="#6B9FFF" strokeWidth="1.4" strokeLinecap="round"/></svg>,
      body:"Solutions can start small in a single shop or school, and scale into networks spanning multiple organisations and regions.",
      detail:"Flexible by design. Yours from day one, and ready to grow as your community grows.",
    },
  ];
  return (
    <section aria-labelledby="pillars-heading"
      style={{ background:T.bg0, borderTop:`1px solid ${T.bdr}`, padding:"96px 40px" }}
      className="s-pad">
      <div style={{ maxWidth:1080, margin:"0 auto" }}>
        <div className="sec-label">
          <div className="sec-divider"/>
          <span className="eyebrow" id="pillars-heading">The Sibahle Pillars</span>
          <h2 className="display" style={{ fontSize:"clamp(28px,4.5vw,50px)", maxWidth:480 }}>
            Built on values, not just technology
          </h2>
          <p className="body-text" style={{ maxWidth:500 }}>
            These pillars guide every decision we make, from how we design systems to how we engage with the communities we serve.
          </p>
        </div>
        <div className="three-col" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
          {pillars.map((p, i) => (
            <article key={i} style={{ background:T.card, border:`1px solid ${p.dimBorder}`,
              borderRadius:T.rLg, padding:"32px 26px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
                <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:36,
                  lineHeight:1, letterSpacing:"-0.04em", color:p.dimBorder }}>{p.n}</span>
                <div style={{ width:40, height:40, borderRadius:T.rSm, flexShrink:0,
                  background:p.dimBg, border:`1px solid ${p.dimBorder}`,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>{p.icon}</div>
              </div>
              <div style={{ display:"inline-block", marginBottom:14, background:p.dimBg,
                border:`1px solid ${p.dimBorder}`, borderRadius:"9999px", padding:"3px 12px" }}>
                <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em",
                  textTransform:"uppercase", color:p.color }}>Pillar {p.n}</span>
              </div>
              <h3 className="strong" style={{ fontSize:18, marginBottom:12 }}>{p.title}</h3>
              <p style={{ fontSize:15, color:T.white, lineHeight:1.78, marginBottom:10, opacity:0.88 }}>{p.body}</p>
              <p style={{ fontSize:14, color:T.body, lineHeight:1.78 }}>{p.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PROBLEM / SOLUTION ─────────────────────────────────── */
function ProblemSolution() {
  return (
    <section style={{ background:T.bg1, borderTop:`1px solid ${T.bdr}`, padding:"80px 40px" }}
      className="s-pad">
      <div style={{ maxWidth:1080, margin:"0 auto" }}>
        <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div style={{ background:T.card, border:`1px solid ${T.bdr}`, borderRadius:T.rLg, padding:"36px 28px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
              <div style={{ width:9, height:9, borderRadius:"50%", background:T.err,
                boxShadow:"0 0 8px rgba(255,107,107,0.5)", flexShrink:0 }} aria-hidden="true"/>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.18em",
                textTransform:"uppercase", color:T.err }}>The Problem</span>
            </div>
            <h3 className="strong" style={{ fontSize:20, marginBottom:14 }}>
              Operational inefficiency costs more than most organisations realise
            </h3>
            <p className="body-text">
              Fragmented workflows, disconnected data, and manual processes hold organisations back. Decisions slow down, errors increase, and the people doing the work carry more burden than they should.
            </p>
          </div>
          <div style={{ background:"rgba(0,200,150,0.07)", border:"1px solid rgba(0,200,150,0.28)",
            borderRadius:T.rLg, padding:"36px 28px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
              <div style={{ width:9, height:9, borderRadius:"50%", background:T.teal,
                boxShadow:"0 0 8px rgba(0,200,150,0.5)", flexShrink:0 }} aria-hidden="true"/>
              <span className="eyebrow" style={{ fontSize:10 }}>Our Answer</span>
            </div>
            <h3 className="strong" style={{ fontSize:20, marginBottom:14 }}>
              Intelligent systems designed around how you actually work
            </h3>
            <p className="body-text">
              We don't hand you off-the-shelf software and ask you to adapt around it. We map your specific challenge and build AI-powered systems that fit your team, your data, and your community.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── WHAT WE DO ─────────────────────────────────────────── */
function WhatWeDo() {
  const caps = [
    { n:"01", t:"Operational Problem Analysis",  d:"We map your workflows end-to-end to identify exactly where time, money, and capacity are being lost. No assumptions. Just your actual process, made visible." },
    { n:"02", t:"System Architecture and Design", d:"Before writing a line of code, we design the blueprint: data flows, decision points, and where AI can integrate without disrupting what already works." },
    { n:"03", t:"AI Workflow Integration",         d:"We embed AI into the right places: automating repetitive tasks, flagging issues, and surfacing the information your team needs to act confidently." },
    { n:"04", t:"Data Structuring and Insights",   d:"We organise your data so it works for you by building systems that turn raw operational information into clear, decision-ready insight." },
    { n:"05", t:"Custom Solution Development",     d:"Every system is built for your context: your team, your data, your goals. No templates. No compromise." },
  ];
  return (
    <section id="what-we-do" aria-labelledby="whatwedo-heading"
      style={{ background:T.bg0, borderTop:`1px solid ${T.bdr}`, padding:"96px 40px" }}
      className="s-pad">
      <div style={{ maxWidth:1080, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end",
          flexWrap:"wrap", gap:24, marginBottom:48 }}>
          <div>
            <div className="sec-label">
              <div className="sec-divider"/>
              <span className="eyebrow" id="whatwedo-heading">What We Do</span>
              <h2 className="display" style={{ fontSize:"clamp(28px,4.5vw,50px)", maxWidth:500 }}>
                Five ways we solve your problem
              </h2>
            </div>
          </div>
          <p className="body-text" style={{ maxWidth:500 }}>
            Every engagement is different. We adapt our capabilities to fit your specific challenge.
          </p>
        </div>
        <ol style={{ listStyle:"none", margin:0, padding:0 }} aria-label="Capabilities list">
          {caps.map((c, i) => (
            <li key={i} className="cap-row">
              <span className="cap-num" aria-hidden="true">{c.n}</span>
              <div>
                <h3 className="strong" style={{ fontSize:15, marginBottom:6 }}>{c.t}</h3>
                <p style={{ fontSize:14, color:T.body, lineHeight:1.78 }}>{c.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ─── SOLUTIONS ──────────────────────────────────────────── */
function Solutions() {
  const sols = [
    { cat:"Operational Systems",       hl:"When your team runs on spreadsheets and manual handoffs", desc:"We replace fragmented workflows with integrated systems that move data automatically and give everyone a single source of truth.", tags:["Workflow automation","Process integration","Real-time tracking"] },
    { cat:"Data and Information",       hl:"When your data exists but tells you nothing useful",      desc:"We structure, connect, and surface your operational data, turning raw information into clear, actionable insight.",              tags:["Data architecture","Information flows","Reporting"] },
    { cat:"Decision and Insight",       hl:"When decisions take too long or rely on the wrong data",  desc:"We build systems that surface the right information at the right moment, enabling faster, more confident decisions.",             tags:["Decision support","AI alerts","Dashboards"] },
    { cat:"AI Automation Layers",       hl:"When repetitive work is slowing your team down",          desc:"We identify which tasks should never require human attention and build AI automation that handles them reliably.",               tags:["Task automation","AI processing","Intelligent routing"] },
    { cat:"Custom-Built Solutions",     hl:"When nothing off the shelf fits your actual problem",     desc:"Some challenges are unique. We design and build from the ground up, building systems that match your workflow.",                 tags:["Bespoke build","End-to-end dev","Any industry"] },
  ];
  return (
    <section id="solutions" aria-labelledby="solutions-heading"
      style={{ background:T.bg1, borderTop:`1px solid ${T.bdr}`, padding:"96px 40px" }}
      className="s-pad">
      <div style={{ maxWidth:1080, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end",
          flexWrap:"wrap", gap:24, marginBottom:48 }}>
          <div>
            <div className="sec-label">
              <div className="sec-divider"/>
              <span className="eyebrow" id="solutions-heading">Solutions</span>
              <h2 className="display" style={{ fontSize:"clamp(28px,4.5vw,50px)" }}>
                Designed around problems, not features
              </h2>
            </div>
          </div>
          <div style={{ background:"rgba(0,200,150,0.08)", border:"1px solid rgba(0,200,150,0.20)",
            borderRadius:T.rMd, padding:"16px 20px", maxWidth:800}}>
            <p style={{ color:T.teal, fontSize:14, lineHeight:1.7, fontWeight:500 }}>
              We don't sell products. We solve specific operational problems built around your reality.
            </p>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:16 }}>
          {sols.map((s, i) => (
            <article key={i} className="card" style={{ padding:"28px 24px" }}>
              <div style={{ display:"inline-block", marginBottom:14,
                background:T.bg2, border:`1px solid ${T.bdr}`,
                borderRadius:"9999px", padding:"3px 12px" }}>
                <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.14em",
                  textTransform:"uppercase", color:T.muted }}>{s.cat}</span>
              </div>
              <h3 className="strong" style={{ fontSize:15, marginBottom:10, lineHeight:1.4 }}>{s.hl}</h3>
              <p style={{ fontSize:13.5, color:T.body, lineHeight:1.78, marginBottom:16 }}>{s.desc}</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {s.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PROCESS ────────────────────────────────────────────── */
function Process() {
  const steps = [
    { n:"01", t:"Understand the Problem", d:"We start by listening. We map your workflows and identify the true source of friction." },
    { n:"02", t:"Map the Workflow",       d:"We document how work actually moves through your organisation: people, data, decisions, and handoffs." },
    { n:"03", t:"Design the System",      d:"We architect a system built around your operational reality, with AI placed where it creates real impact." },
    { n:"04", t:"Build and Integrate",    d:"We build, configure, and connect the system, integrating AI that is practical and explainable." },
    { n:"05", t:"Deploy and Improve",     d:"We monitor, iterate, and refine after launch, ensuring the system evolves as your needs do." },
  ];
  return (
    <section id="process" aria-labelledby="process-heading"
      style={{ background:T.bg0, borderTop:`1px solid ${T.bdr}`, padding:"96px 40px" }}
      className="s-pad">
      <div style={{ maxWidth:1080, margin:"0 auto" }}>
        <div className="sec-label">
          <div className="sec-divider"/>
          <span className="eyebrow" id="process-heading">Our Process</span>
          <h2 className="display" style={{ fontSize:"clamp(28px,4.5vw,50px)", maxWidth:440 }}>
            A clear path from problem to solution
          </h2>
        </div>
        {/* five-col: 5 cols desktop, 2+2+1 tablet, 1 mobile */}
        <ol className="five-col"
          style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, listStyle:"none", margin:0, padding:0 }}
          aria-label="Five-step process">
          {steps.map((s, i) => (
            <li key={i} style={{
              background: i===0 ? "rgba(0,200,150,0.08)" : T.card,
              border:"1px solid",
              borderColor: i===0 ? "rgba(0,200,150,0.38)" : T.bdr,
              borderRadius:T.rMd, padding:"24px 18px 22px" }}>
              <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:38,
                lineHeight:1, letterSpacing:"-0.04em",
                color: i===0 ? T.teal : T.bdr,
                marginBottom:16 }} aria-hidden="true">{s.n}</div>
              <h3 className="strong" style={{ fontSize:14, marginBottom:8, lineHeight:1.3 }}>{s.t}</h3>
              <p style={{ fontSize:13, color:T.body, lineHeight:1.7 }}>{s.d}</p>
              {i===0 && (
                <div style={{ marginTop:12, display:"inline-block", background:T.teal,
                  borderRadius:"9999px", padding:"3px 10px", fontSize:9,
                  fontWeight:800, letterSpacing:"0.08em", textTransform:"uppercase", color:"#06060F" }}>
                  Start here
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ─── WHO WE WORK WITH ───────────────────────────────────── */
function WhoWeWorkWith() {
  const groups = [
    { label:"Small and Medium Businesses",     accent:T.teal    },
    { label:"Churches and Faith Organisations", accent:"#6B9FFF" },
    { label:"Schools and Educational Bodies",   accent:"#FFB830" },
    { label:"NGOs and Community Organisations", accent:"#FF8A6E" },
    { label:"Enterprise and Government",        accent:"#B87AFF" },
    { label:"Investors and Strategic Partners", accent:T.teal    },
  ];
  return (
    <section style={{ background:T.bg1, borderTop:`1px solid ${T.bdr}`, padding:"80px 40px" }}
      className="s-pad">
      <div style={{ maxWidth:1080, margin:"0 auto" }}>
        <div className="sec-label">
          <div className="sec-divider"/>
          <span className="eyebrow">Who We Work With</span>
          <p className="body-text" style={{ maxWidth:500 }}>
            We are industry-agnostic. If you have a problem, we can help solve it.
          </p>
        </div>
        <ul style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:16, listStyle:"none", margin:0, padding:0 }}>
          {groups.map((g, i) => (
            <li key={i} style={{ background:T.card, border:`1px solid ${T.bdr}`,
              borderRadius:T.rLg, padding:"22px 24px", transition:"border-color 0.22s" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                <div aria-hidden="true" style={{ width:10, height:10, borderRadius:"50%",
                  background:g.accent, flexShrink:0 }}/>
                <span style={{ fontSize:13, fontWeight:700, color:T.white }}>{g.label}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─── CTA BANNER ─────────────────────────────────────────── */
function CTABanner({ onConsult }) {
  return (
    <section aria-labelledby="cta-heading"
      style={{ padding:"96px 40px",
        background:`radial-gradient(ellipse 60% 55% at 50% 100%,rgba(0,200,150,0.10) 0%,transparent 70%),${T.bg0}`,
        borderTop:`1px solid ${T.bdr}`, textAlign:"center",
        position:"relative", overflow:"hidden" }}
      className="s-pad">
      {[360,240,140].map((sz, i) => (
        <div key={i} aria-hidden="true" style={{ position:"absolute", top:"50%", left:"50%",
          transform:"translate(-50%,-50%)", width:sz, height:sz, borderRadius:"50%",
          border:`1px solid rgba(0,200,150,${0.06+i*0.04})`, pointerEvents:"none" }}/>
      ))}
      <div style={{ position:"relative", zIndex:1, maxWidth:620, margin:"0 auto" }}>
        <div className="sec-label" style={{ alignItems:"center", marginBottom:32 }}>
          <div className="sec-divider" style={{ margin:"0 auto" }}/>
          <span className="eyebrow">Ready to Start?</span>
        </div>
        <h2 id="cta-heading" className="display"
          style={{ fontSize:"clamp(26px,4.5vw,52px)", marginBottom:16 }}>
          Have an operational problem worth solving?
        </h2>
        <p className="body-text" style={{ maxWidth:520, margin:"0 auto 48px" }}>
          Let's start with a conversation. No obligations, just a clear-eyed look at your challenge and whether we can help solve it together.
        </p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <button className="btn-p" onClick={onConsult}
            aria-label="Open consultation request form">
            Request a Consultation <Arr/>
          </button>
          <a href="mailto:contact@sibahledigital.com" className="btn-s"
            aria-label="Send us an email at contact@sibahledigital.com">
            Send an Email <Arr/>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ────────────────────────────────────────────── */
function Contact({ onConsult }) {
  return (
    <section id="contact" aria-labelledby="contact-heading"
      style={{ padding:"96px 40px", background:T.bg1, borderTop:`1px solid ${T.bdr}` }}
      className="s-pad">
      <div style={{ maxWidth:1080, margin:"0 auto" }}>
        <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"start" }}>

          {/* Left: info */}
          <div>
            <div className="sec-label">
              <div className="sec-divider"/>
              <span className="eyebrow" id="contact-heading">Get in Touch</span>
              <h2 className="display" style={{ fontSize:"clamp(24px,4vw,42px)" }}>
                Let's talk about your problem
              </h2>
            </div>
            <p className="body-text" style={{ marginBottom:48 }}>
              Every engagement starts with a conversation. Tell us about your organisation and the challenge you're facing. We'll take it from there.
            </p>
            {[
              { l:"Email",         v:"contact@sibahledigital.com"  },
              { l:"Based in",      v:"South Africa"  },
              { l:"Response time", v:"Within 1 to 2 business days" },
            ].map(c => (
              <div key={c.l} style={{ marginBottom:24 }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.18em",
                  textTransform:"uppercase", color:T.muted, marginBottom:5 }}>{c.l}</div>
                <div style={{ fontSize:16, color:T.white, fontWeight:600 }}>{c.v}</div>
              </div>
            ))}
          </div>

          {/* Right: quick contact card */}
          <div style={{ background:T.card, border:`1px solid ${T.bdr}`,
            borderRadius:T.rLg, padding:"32px 28px" }}>
            <h3 className="strong" style={{ fontSize:18, marginBottom:8 }}>
              Prefer to send a quick message?
            </h3>
            <p style={{ fontSize:14, color:T.body, lineHeight:1.75, marginBottom:24 }}>
              Use our consultation form to describe your challenge. We'll review it and respond within 1 to 2 business days.
            </p>
            <div style={{ borderTop:`1px solid ${T.bdr}`, paddingTop:24, display:"flex",
              flexDirection:"column", gap:16 }}>
              <button className="btn-p" onClick={onConsult}
                aria-label="Open consultation form">
                Request a Consultation
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ borderTop:`1px solid ${T.bdr}`, padding:"32px 40px", background:T.bg0 }}>
      <div style={{ maxWidth:1080, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          flexWrap:"wrap", gap:16, marginBottom:20, paddingBottom:20, borderBottom:`1px solid ${T.bdr}` }}>
          <Logo size="sm"/>
          <p style={{ fontSize:13, color:T.body, fontStyle:"italic", textAlign:"center" }}>
            "Sibahle" · <span style={{ color:T.teal }}>We are beautiful.</span> Technology that uplifts people.
          </p>
          <nav aria-label="Footer navigation" style={{ display:"flex", gap:20 }}>
            <a href="/privacy.html"
              style={{ fontSize:13, color:T.body, background:"none", border:"none",
                cursor:"pointer", fontWeight:500, transition:"color 0.2s", padding:"4px 0",
                minHeight:44, display:"flex", alignItems:"center", textDecoration:"none" }}
              onMouseEnter={e => e.target.style.color=T.teal}
              onMouseLeave={e => e.target.style.color=T.body}
              aria-label="View privacy policy">
              Privacy
            </a>
            <a href="/terms.html"
              style={{ fontSize:13, color:T.body, background:"none", border:"none",
                cursor:"pointer", fontWeight:500, transition:"color 0.2s", padding:"4px 0",
                minHeight:44, display:"flex", alignItems:"center", textDecoration:"none" }}
              onMouseEnter={e => e.target.style.color=T.teal}
              onMouseLeave={e => e.target.style.color=T.body}
              aria-label="View terms of service">
              Terms
            </a>
            <button
              onClick={() => scrollTo("contact")}
              style={{ fontSize:13, color:T.body, background:"none", border:"none",
                cursor:"pointer", fontWeight:500, transition:"color 0.2s", padding:"4px 0",
                minHeight:44, display:"flex", alignItems:"center" }}
              onMouseEnter={e => e.target.style.color=T.teal}
              onMouseLeave={e => e.target.style.color=T.body}
              aria-label="Scroll to contact section">
              Contact
            </button>
          </nav>
        </div>
        <p style={{ fontSize:12, color:T.dim, textAlign:"center" }}>
          &copy; {new Date().getFullYear()} Sibahle Digital · AI systems for community impact
        </p>
      </div>
    </footer>
  );
}

/* ─── CONSULTATION MODAL ─────────────────────────────────── */
function Modal({ onClose }) {
  const [form, setForm] = useState({ name:"", org:"", email:"", type:"", message:"" });
  const [errs, setErrs] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const firstRef = useRef(null);

  const up = (k, v) => {
    setForm(f => ({...f,[k]:v}));
    if (errs[k]) setErrs(e => ({...e,[k]:undefined}));
  };

  // Focus first field on open
  useEffect(() => { setTimeout(() => firstRef.current?.focus(), 50); }, []);

  // Trap focus and handle Escape
  useEffect(() => {
    const fn = e => { if (e.key==="Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const handleSubmit = async () => {
    const newErrs = validate(form);
    if (Object.keys(newErrs).length) {
      setErrs(newErrs);
      return;
    }

    setLoading(true);
    setErrs({});

    try {
      const res = await fetch("https://formspree.io/f/mlgzdyro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          organisation: form.org,
          email: form.email,
          type: form.type,
          message: form.message,
        }),
      });

      if (!res.ok) {
        throw new Error("Submission failed");
      }

      setSent(true);
      setForm({ name:"", org:"", email:"", type:"", message:"" });
    } catch (err) {
      setErrs({ submit: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title"
      style={{ position:"fixed", inset:0, zIndex:300,
        background:"rgba(0,0,0,0.88)", backdropFilter:"blur(16px)",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:20, animation:"fadeIn 0.2s ease" }}
      onClick={onClose}>
      <div style={{ background:T.bg1, border:"1px solid rgba(0,200,150,0.26)",
        borderRadius:T.rLg, maxWidth:480, width:"100%",
        padding:"40px 34px", position:"relative", animation:"fadeUp 0.28s ease" }}
        onClick={e => e.stopPropagation()}>

        <button onClick={onClose} aria-label="Close form"
          style={{ position:"absolute", top:16, right:16,
            background:T.card, border:`1px solid ${T.bdr}`, borderRadius:"50%",
            width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center",
            cursor:"pointer" }}>
          <CloseIcon/>
        </button>

        {sent ? (
          <div style={{ textAlign:"center", padding:"16px 0" }}>
            <div style={{ width:64, height:64, borderRadius:"50%",
              background:"rgba(0,200,150,0.10)", border:"1px solid rgba(0,200,150,0.28)",
              display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
              <CheckIcon/>
            </div>
            <h3 className="strong" style={{ fontSize:21, marginBottom:10 }} id="modal-title">
              Message sent successfully.
            </h3>
            <p style={{ color:T.body, fontSize:14, lineHeight:1.72 }}>
              We’ve received your enquiry and will respond within 1–2 business days.
            </p>
            <button className="btn-p" onClick={onClose} style={{ marginTop:24 }}>
              Close <Arr/>
            </button>
          </div>
        ) : (
          <>
            <span className="eyebrow" style={{ display:"block", marginBottom:8 }}
              id="modal-title">Request a Consultation</span>
            <h3 className="strong" style={{ fontSize:20, marginBottom:6 }}>
              Let's talk about your problem
            </h3>
            <p style={{ color:T.body, fontSize:13.5, marginBottom:24, lineHeight:1.72 }}>
              Please fill in your details below.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Your name *" error={errs.name} id="m-name">
                  <input id="m-name" ref={firstRef} value={form.name}
                    onChange={e => up("name",e.target.value)}
                    placeholder="Full name"
                    aria-invalid={!!errs.name} aria-describedby={errs.name?"m-name-err":undefined}
                    autoComplete="name"/>
                </Field>
                <Field label="Organisation" id="m-org">
                  <input id="m-org" value={form.org}
                    onChange={e => up("org",e.target.value)}
                    placeholder="Org / company" autoComplete="organization"/>
                </Field>
              </div>
              <Field label="Email address *" error={errs.email} id="m-email">
                <input id="m-email" type="email" value={form.email}
                  onChange={e => up("email",e.target.value)}
                  placeholder="you@organisation.com"
                  aria-invalid={!!errs.email}
                  autoComplete="email"/>
              </Field>
              <Field label="Enquiry type" id="m-type">
                <select id="m-type" value={form.type} onChange={e => up("type",e.target.value)}>
                  <option value="">Select an option</option>
                  <option>Request a Consultation</option>
                  <option>Start a Project</option>
                  <option>Partnership Enquiry</option>
                  <option>Investor Discussion</option>
                  <option>General Question</option>
                </select>
              </Field>
              <Field label="Your challenge *" error={errs.message} id="m-msg">
                <textarea id="m-msg" value={form.message}
                  onChange={e => up("message",e.target.value)}
                  placeholder="Describe the operational problem you're trying to solve..."
                  rows={4} style={{ resize:"vertical" }}
                  aria-invalid={!!errs.message}/>
              </Field>
              {Object.keys(errs).some(key => key !== 'submit') && (
                <div role="alert" style={{ background:"rgba(255,107,107,0.08)",
                  border:"1px solid rgba(255,107,107,0.24)", borderRadius:T.rSm,
                  padding:"10px 14px", fontSize:13, color:T.err }}>
                  Please fill in all required fields before submitting.
                </div>
              )}
              <button className="btn-p" onClick={handleSubmit}
                disabled={loading}
                style={{ justifyContent:"center", marginTop:4 }}
                aria-busy={loading}>
                {loading ? <><Spinner/> Sending your enquiry...</> : <>Submit Request <Arr/></>}
              </button>
              {errs.submit && (
                <div role="alert" style={{
                  marginTop:12,
                  background:"rgba(255,107,107,0.08)",
                  border:"1px solid rgba(255,107,107,0.24)",
                  borderRadius:T.rSm,
                  padding:"10px 14px",
                  fontSize:13,
                  color:T.err
                }}>
                  {errs.submit}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── APP ────────────────────────────────────────────────── */
export default function App() {
  const [modal, setModal] = useState(false);
  const openModal  = useCallback(() => setModal(true), []);
  const closeModal = useCallback(() => setModal(false), []);

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modal]);

  return (
    <>
      <style>{G}</style>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <ScrollProgress/>
      <Nav onConsult={openModal}/>

      <main id="main-content" style={{ background:T.bg0 }}>
        <Hero         onConsult={openModal}/>
        <BrandStory/>
        <Pillars/>
        <ProblemSolution/>
        <WhatWeDo/>
        <Solutions/>
        <Process/>
        <WhoWeWorkWith/>
        <CTABanner    onConsult={openModal}/>
        <Contact      onConsult={openModal}/>
      </main>

      <Footer/>
      <button className="fab" type="button" onClick={openModal} aria-label="Open consultation form">
        Request a Consultation
      </button>

      {modal && <Modal onClose={closeModal}/>}
    </>
  );
}
