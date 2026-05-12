/* global React, ReactDOM, FAMILY, LAYOUT, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakSlider, TweakColor, TweakSelect */
const { useState, useEffect, useMemo, useRef, useCallback } = React;

// ───────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "view": "hierarchy",
  "density": "regular",
  "depth": 7,
  "palette": "guava",
  "typography": "garamond",
  "showPartners": true,
  "timelineYear": 1950
}/*EDITMODE-END*/;

const PALETTES = {
  // Default: Havana archival — indigo ink, terracotta + turquoise, brass for lineage
  guava:    { leaf:'oklch(0.34 0.07 155)', leafDeep:'oklch(0.50 0.09 150)', guava:'oklch(0.68 0.13 30)',  guavaDeep:'oklch(0.44 0.16 28)', sky:'oklch(0.68 0.085 215)', skyDeep:'oklch(0.40 0.10 215)', ochre:'oklch(0.68 0.14 78)' },
  havana:   { leaf:'oklch(0.40 0.07 145)', leafDeep:'oklch(0.30 0.05 145)', guava:'oklch(0.70 0.13 30)',  guavaDeep:'oklch(0.50 0.15 30)', sky:'oklch(0.58 0.08 220)', skyDeep:'oklch(0.40 0.08 220)', ochre:'oklch(0.75 0.13 70)' },
  mar:      { leaf:'oklch(0.42 0.07 195)', leafDeep:'oklch(0.30 0.06 200)', guava:'oklch(0.72 0.10 10)',  guavaDeep:'oklch(0.52 0.13 12)', sky:'oklch(0.60 0.08 230)', skyDeep:'oklch(0.40 0.08 230)', ochre:'oklch(0.72 0.10 80)' },
  monocromo:{ leaf:'oklch(0.32 0.02 60)', leafDeep:'oklch(0.22 0.02 60)', guava:'oklch(0.58 0.02 60)',  guavaDeep:'oklch(0.40 0.02 60)', sky:'oklch(0.58 0.02 60)', skyDeep:'oklch(0.40 0.02 60)', ochre:'oklch(0.55 0.04 70)' },
};

const TYPOGRAPHY = {
  garamond: { display:'"Cormorant Garamond","Cormorant",Georgia,serif',  body:'"Inter","Helvetica Neue",Arial,sans-serif' },
  fraunces: { display:'"DM Serif Display","Cormorant",Georgia,serif',      body:'"Work Sans","Inter",sans-serif' },
  classic:  { display:'"Playfair Display",Georgia,serif',                  body:'"Lora",Georgia,serif' },
  modern:   { display:'"Libre Caslon Text","Cormorant",Georgia,serif',     body:'"Manrope","Inter",sans-serif' },
};

function initials(p){
  const first = (p.name||'').trim().split(/\s+/)[0] || '';
  const last  = (p.sur||'').trim().split(/\s+/)[0] || '';
  return (first[0]||'')+(last[0]||'');
}

function formatYears(p){
  if (!p.b && !p.d) return '';
  return `${p.b ?? '?'} – ${p.d ?? ''}`.replace(/\s+$/,'');
}

// Walk ancestors of an id; returns Set of ids (incl. self)
function ancestors(id){
  const out = new Set([id]);
  const stack = [id];
  while(stack.length){
    const c = stack.pop();
    const ps = FAMILY.parentsOf[c] || [];
    for (const p of ps){ if (!out.has(p)){ out.add(p); stack.push(p); } }
  }
  return out;
}

// ───────────────────────────────────────────────────────────────
// Pan & Zoom
// ───────────────────────────────────────────────────────────────
function usePanZoom(stageRef){
  const [t, setT] = useState({ x:120, y:120, k:0.9 });
  const drag = useRef(null);
  const didDragRef = useRef(false);

  // Clamp pan/zoom so the tree always stays at least partially visible.
  // Without this, panning off-screen makes the page look blank.
  const clamp = (x, y, k) => {
    const stage = stageRef.current;
    if (!stage) return { x, y, k };
    const r = stage.getBoundingClientRect();
    const w = stage.querySelector('.world');
    const ww = w?.scrollWidth || 0;
    const wh = w?.scrollHeight || 0;
    const M = 80;
    if (ww > 0) x = Math.min(r.width - M, Math.max(-ww * k + M, x));
    if (wh > 0) y = Math.min(r.height - M, Math.max(-wh * k + M, y));
    return { x, y, k };
  };

  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('.person, .life, .drawer, .toolbar, .stats, .zoom-ctrl, .search-wrap, .legend, .lineage-banner, .convergence-mark')) return;
    drag.current = { sx:e.clientX, sy:e.clientY, tx:t.x, ty:t.y };
    didDragRef.current = false;
    stageRef.current?.classList.add('grabbing');
  };
  const onMouseMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (Math.abs(dx) + Math.abs(dy) > 4) didDragRef.current = true;
    // Capture d.tx/d.ty in closure NOW — React may defer the setter and by then
    // onMouseUp could have nulled drag.current, throwing inside the updater.
    const tx = d.tx, ty = d.ty;
    setT(p => clamp(tx + dx, ty + dy, p.k));
  };
  const onMouseUp = () => {
    drag.current = null;
    stageRef.current?.classList.remove('grabbing');
  };
  const onWheel = (e) => {
    e.preventDefault();
    const rect = stageRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setT(p => {
      const factor = Math.exp(-e.deltaY * 0.0015);
      const k = Math.min(2.4, Math.max(0.18, p.k * factor));
      // keep point under cursor stable
      const x = mx - (mx - p.x) * (k / p.k);
      const y = my - (my - p.y) * (k / p.k);
      return clamp(x, y, k);
    });
  };

  useEffect(() => {
    const el = stageRef.current; if (!el) return;
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('wheel', onWheel, { passive:false });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('wheel', onWheel);
    };
  });

  const zoomTo = (k) => setT(p => ({ ...p, k:Math.min(2.4, Math.max(0.18, k)) }));
  const reset = () => setT({ x:120, y:120, k:0.9 });
  const centerOn = (wx, wy, k) => {
    const rect = stageRef.current.getBoundingClientRect();
    const kk = k ?? t.k;
    setT({ k: kk, x: rect.width/2 - wx*kk, y: rect.height/2 - wy*kk });
  };

  return { t, setT, onMouseDown, zoomTo, reset, centerOn, didDragRef };
}

// ───────────────────────────────────────────────────────────────
// Layout calc
// ───────────────────────────────────────────────────────────────
function useGeometry(density){
  return useMemo(() => {
    const COL_W = density === 'compact' ? 104 : density === 'spacious' ? 160 : 128;
    const ROW_H = density === 'compact' ? 118 : density === 'spacious' ? 180 : 148;
    const CARD_W = density === 'compact' ? 88  : density === 'spacious' ? 138 : 108;
    const CARD_H = density === 'compact' ? 92  : density === 'spacious' ? 136 : 116;

    // Find min slot used so we can normalize x → pixel
    let minX = Infinity, maxX = -Infinity;
    for (const id in LAYOUT.X){
      const x = LAYOUT.X[id];
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
    }
    const totalW = (maxX - minX + 1) * COL_W;
    const totalH = LAYOUT.generations.length * ROW_H;

    const pos = {};
    for (const id in LAYOUT.X){
      const p = FAMILY.people[id]; if (!p) continue;
      pos[id] = {
        x: (LAYOUT.X[id] - minX) * COL_W,
        y: (p.gen - 1) * ROW_H,
        cx: (LAYOUT.X[id] - minX) * COL_W + CARD_W/2,
        cy: (p.gen - 1) * ROW_H + CARD_H/2,
      };
    }

    return { COL_W, ROW_H, CARD_W, CARD_H, totalW, totalH, pos, minX };
  }, [density]);
}

// ───────────────────────────────────────────────────────────────
// Connectors SVG
// ───────────────────────────────────────────────────────────────
function Wires({ geo, depth, lineageSet, dimOthers }){
  const paths = [];
  const { pos, CARD_W, CARD_H, ROW_H } = geo;

  // 1. union lines between spouses (horizontal between cards)
  // 2. parent → child branches
  for (const [a,b,children] of FAMILY.unions){
    const A = pos[a], B = b ? pos[b] : null;
    let unionX, unionY;
    if (A && B){
      const ax = A.cx, bx = B.cx;
      const y = A.cy;
      unionX = (ax + bx) / 2;
      unionY = y;
      const left  = Math.min(ax, bx) + CARD_W/2 - 6;
      const right = Math.max(ax, bx) - CARD_W/2 + 6;
      paths.push({
        d:`M ${left} ${y} L ${right} ${y}`,
        cls:'union',
        ids: [a,b]
      });
    } else if (A){
      unionX = A.cx; unionY = A.cy;
    } else continue;

    if (!children || !children.length) continue;
    const childObjs = children.map(c => pos[c]).filter(Boolean);
    if (!childObjs.length) continue;

    // depth filter — only draw if the child's gen <= depth
    const childGen = FAMILY.people[children[0]].gen;
    if (childGen > depth) continue;

    // drop down to mid-y between gens, then horizontal manifold to each child top
    const midY = unionY + (ROW_H * 0.5) - 6;
    paths.push({ d:`M ${unionX} ${unionY + CARD_H/2} L ${unionX} ${midY}`, cls:'parent', ids:[a,b].filter(Boolean) });

    const minCX = Math.min(...childObjs.map(c=>c.cx));
    const maxCX = Math.max(...childObjs.map(c=>c.cx));
    const manifoldL = Math.min(minCX, unionX);
    const manifoldR = Math.max(maxCX, unionX);
    if (manifoldR > manifoldL){
      paths.push({ d:`M ${manifoldL} ${midY} L ${manifoldR} ${midY}`, cls:'parent', ids:[a,b].filter(Boolean) });
    }
    for (const c of childObjs){
      paths.push({ d:`M ${c.cx} ${midY} L ${c.cx} ${c.y}`, cls:'parent', ids:[a,b].filter(Boolean) });
    }
  }

  return (
    <svg className="wires" width={geo.totalW + 600} height={geo.totalH + 200} style={{left:-300, top:-100}}>
      <g transform="translate(300 100)">
        {paths.map((p, i) => {
          const inLineage = lineageSet && p.ids && p.ids.every(id => lineageSet.has(id));
          const isDim = dimOthers && !inLineage;
          return (
            <path key={i}
              d={p.d}
              className={`${p.cls} ${inLineage ? 'lineage':''} ${isDim ? 'dim':''}`}
            />
          );
        })}
      </g>
    </svg>
  );
}

// ───────────────────────────────────────────────────────────────
// Person card
// ───────────────────────────────────────────────────────────────
function PersonCard({ id, geo, onClick, onHover, focusId, lineageSet, dimOthers, hovered }){
  const p = FAMILY.people[id]; if (!p) return null;
  const pp = geo.pos[id]; if (!pp) return null;
  const isFocus = focusId === id;
  const isLineage = lineageSet && lineageSet.has(id);
  const isDim = dimOthers && !isLineage;
  // Married-in: no parents in the tree. These ride alongside a Mir/Narbona to anchor a union.
  const isInlaw = !(FAMILY.parentsOf[id] && FAMILY.parentsOf[id].length);

  return (
    <div
      className={`person ${p.g} gen-${p.gen} ${isFocus?'focus':''} ${isLineage?'lineage':''} ${isDim?'dim':''} ${isInlaw?'inlaw':''}`}
      style={{ left: pp.x, top: pp.y }}
      onClick={(e) => { e.stopPropagation(); onClick(id); }}
      onMouseEnter={(e) => onHover(id, e)}
      onMouseLeave={() => onHover(null)}
      data-screen-label={`Person · ${p.name} ${p.sur}`}
    >
      <div className="portrait">
        <image-slot id={`pf-${id}`} placeholder="" shape="circle"></image-slot>
        {/* fallback initials drawn on top via CSS-less span — actually image-slot covers */}
      </div>
      <div className="name">{p.name}</div>
      <div className="sur">{p.sur}</div>
      <div className="years">{formatYears(p)}</div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Hierarchy view
// ───────────────────────────────────────────────────────────────
// Approximate birth-decade era per generation, for the left-edge era strip.
const GEN_ERAS = {
  1: '1860s',
  2: '1890s',
  3: '1920s',
  4: '1940s',
  5: '1970s',
  6: '1990s',
  7: '2010s',
};

function HierarchyView({ geo, focusId, onPick, depth, lineageSet, dimOthers, onHover, hovered }){
  const visibleIds = Object.keys(FAMILY.people).filter(id => FAMILY.people[id].gen <= depth);

  return (
    <>
      <Wires geo={geo} depth={depth} lineageSet={lineageSet} dimOthers={dimOthers} />

      {/* Era strip — generation row labels with the era they lived through */}
      {LAYOUT.generations.filter(g => g<=depth).map(g => (
        <div key={g} className="gen-label" style={{ top: (g-1)*geo.ROW_H + geo.CARD_H/2 - 18 }}>
          <span className="era">{GEN_ERAS[g]}</span>
          <span className="num">Gen {g.toString().padStart(2,'0')}</span>
        </div>
      ))}

      {visibleIds.map(id => (
        <PersonCard key={id} id={id} geo={geo}
          onClick={onPick}
          onHover={onHover}
          focusId={focusId}
          lineageSet={lineageSet}
          dimOthers={dimOthers}
          hovered={hovered}
        />
      ))}

    </>
  );
}

// ───────────────────────────────────────────────────────────────
// Timeline view — cards become vertical bars from birth → death year
// ───────────────────────────────────────────────────────────────
function TimelineView({ geo, focusId, onPick, depth, lineageSet, dimOthers, onHover, cursorYear, onCursorYear }){
  const YR_MIN = 1850, YR_MAX = 2030;
  const PX_PER_YR = 4;          // 1 year = 4 px
  const totalH = (YR_MAX - YR_MIN) * PX_PER_YR;
  // Timeline uses a tighter horizontal grid than hierarchy — narrow tracks, packed close.
  const COL_W = 80;
  const CARD_W = 28;
  const totalW = (geo.totalW / geo.COL_W) * COL_W;

  const lives = Object.keys(FAMILY.people)
    .filter(id => FAMILY.people[id].gen <= depth)
    .map(id => {
      const p = FAMILY.people[id];
      const b = p.b ?? YR_MIN;
      const d = p.d ?? 2026;
      const x = (LAYOUT.X[id] - geo.minX) * COL_W;
      const y = (b - YR_MIN) * PX_PER_YR;
      const h = Math.max(40, (d - b) * PX_PER_YR);
      return { id, p, x, y, h };
    });

  // Build parent → child connectors based on midpoint years
  const wires = [];
  for (const [a,b,children] of FAMILY.unions){
    if (!children || !children.length) continue;
    const childGen = FAMILY.people[children[0]].gen;
    if (childGen > depth) continue;
    const parentIds = [a,b].filter(Boolean);
    const parentLives = parentIds.map(id => lives.find(l=>l.id===id)).filter(Boolean);
    if (!parentLives.length) continue;
    // Compute union midpoint X & a Y near the avg birth of children
    const avgChildY = children.map(c=>{
      const cp = FAMILY.people[c]; if(!cp) return null;
      return (cp.b ?? YR_MIN - YR_MIN) * PX_PER_YR;
    }).filter(v=>v!=null);
    const childYears = children.map(c => FAMILY.people[c]?.b).filter(Boolean);
    if (!childYears.length) continue;
    const avgChildBirth = childYears.reduce((s,v)=>s+v,0) / childYears.length;
    const unionY = (avgChildBirth - YR_MIN) * PX_PER_YR - 18;
    const parentXs = parentLives.map(l => l.x + CARD_W/2);
    const ux = parentXs.reduce((s,v)=>s+v,0)/parentXs.length;

    // Parents → union point
    for (const pl of parentLives){
      wires.push({
        d:`M ${pl.x + CARD_W/2} ${Math.max(pl.y, unionY-12)} L ${pl.x + CARD_W/2} ${unionY} L ${ux} ${unionY}`,
        ids: parentIds, cls:'parent'
      });
    }
    // union → each child top
    for (const c of children){
      const cl = lives.find(l=>l.id===c); if (!cl) continue;
      wires.push({
        d:`M ${ux} ${unionY} L ${cl.x + CARD_W/2} ${unionY} L ${cl.x + CARD_W/2} ${cl.y}`,
        ids: parentIds, cls:'parent'
      });
    }
  }

  // Year ticks every 10 years
  const ticks = [];
  for (let y = YR_MIN; y <= YR_MAX; y += 10) ticks.push(y);

  // Cursor interaction
  const containerRef = useRef(null);
  const onMouseMoveCanvas = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // We need world-space Y, but the World div is transformed. So we let parent stage map.
    // Use the data attribute set by stage.
    const worldY = parseFloat(containerRef.current.dataset.worldY || 0);
    const year = YR_MIN + worldY / PX_PER_YR;
    onCursorYear(Math.round(Math.max(YR_MIN, Math.min(YR_MAX, year))));
  };

  const cursorY = (cursorYear - YR_MIN) * PX_PER_YR;
  const nowY = (2026 - YR_MIN) * PX_PER_YR;

  const aliveCount = lives.filter(l => {
    const b = l.p.b ?? 0; const d = l.p.d ?? 2026;
    return b <= cursorYear && cursorYear <= d;
  }).length;

  return (
    <div ref={containerRef} style={{ position:'absolute', width: totalW, height: totalH }}>
      {/* Year axis */}
      <div className="timeline-axis" style={{ height: totalH }}>
        {ticks.map(y => (
          <div key={y} className="tick" style={{ top: (y-YR_MIN)*PX_PER_YR }}>
            <span className="yr">{y}</span>
            <span className="ln"></span>
          </div>
        ))}
      </div>

      {/* SVG wires */}
      <svg className="wires timeline-wires" width={totalW + 100} height={totalH + 60} style={{left:0, top:0}}>
        {wires.map((w,i) => {
          const inL = lineageSet && w.ids.every(id => lineageSet.has(id));
          const isDim = dimOthers && !inL;
          return <path key={i} className={`${w.cls} ${inL?'lineage':''} ${isDim?'dim':''}`} d={w.d} />;
        })}
      </svg>

      {/* Union/marriage horizontal links */}
      <svg className="wires timeline-wires" width={totalW + 100} height={totalH + 60} style={{left:0, top:0}}>
        {FAMILY.unions.filter(([a,b])=>a&&b).map(([a,b], i) => {
          const la = lives.find(l=>l.id===a); const lb = lives.find(l=>l.id===b);
          if (!la || !lb) return null;
          const yA = Math.max(la.y, lb.y) + 18;
          return <path key={i} className="union" d={`M ${la.x+CARD_W/2} ${yA} L ${lb.x+CARD_W/2} ${yA}`} />;
        })}
      </svg>

      {/* Now rule */}
      <div className="timeline-now-rule" style={{ top: nowY }}><span className="lab">today</span></div>

      {/* Cursor */}
      <div className="timeline-cursor" style={{ top: cursorY }} >
        <span className="badge">YEAR {cursorYear}</span>
        <span className="count">{aliveCount} alive</span>
      </div>

      {/* Lives — narrow vertical tracks with the name label above the bar */}
      {lives.map(l => {
        const isFocus = focusId === l.id;
        const isLineage = lineageSet && lineageSet.has(l.id);
        const isDim = dimOthers && !isLineage;
        const aliveAtCursor = (l.p.b ?? 0) <= cursorYear && cursorYear <= (l.p.d ?? 2026);
        return (
          <React.Fragment key={l.id}>
            {/* The lifespan bar itself — name rides INSIDE it, rotated, so labels never collide */}
            <div
              className={`life ${l.p.g} ${isLineage?'lineage':''} ${isDim?'dim':''} ${aliveAtCursor?'alive-now':''}`}
              style={{ left:l.x, top:l.y, width: CARD_W, height: l.h, opacity: isDim ? .18 : (aliveAtCursor ? 1 : .55) }}
              onClick={(e)=>{ e.stopPropagation(); onPick(l.id); }}
              onMouseEnter={(e)=>onHover(l.id, e)}
              onMouseLeave={()=>onHover(null)}
              data-screen-label={`Person · ${l.p.name} ${l.p.sur}`}
              title={`${l.p.name} ${l.p.sur} · b. ${l.p.b ?? '?'}${l.p.d ? ' · d. ' + l.p.d : ''}`}
            >
              <span className="yr-b">{l.p.b ?? ''}</span>
              <span className="rot-label">
                <span className="nm">{l.p.name}</span>
                <span className="sur"> {l.p.sur}</span>
              </span>
              {l.p.d && <span className="yr-d">{l.p.d}</span>}
            </div>
          </React.Fragment>
        );
      })}

      {/* Year-pick interaction: invisible overlay tracks cursor */}
      <div
        onMouseMove={(e)=>{
          // Convert client Y to world Y manually using bounding rect of this overlay
          const rect = e.currentTarget.getBoundingClientRect();
          const yInOverlay = (e.clientY - rect.top);
          const year = YR_MIN + (yInOverlay) / PX_PER_YR;
          onCursorYear(Math.round(Math.max(YR_MIN, Math.min(YR_MAX, year))));
        }}
        style={{position:'absolute', inset:0, zIndex:2, pointerEvents:'none'}}
      ></div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Detail Drawer
// ───────────────────────────────────────────────────────────────
function Drawer({ id, onClose, onPick, onHighlight, activeLineageId }){
  if (!id) return null;
  const p = FAMILY.people[id]; if (!p) return null;
  const parents = FAMILY.parentsOf[id] || [];
  const spouse  = FAMILY.spouseOf[id];
  const children = [];
  for (const [a,b,kids] of FAMILY.unions){
    if (a === id || b === id){ for (const k of (kids||[])) children.push(k); }
  }
  const siblings = parents.length ? (() => {
    const par = parents[0];
    const set = new Set();
    for (const [a,b,kids] of FAMILY.unions){
      if ((a === par || b === par) && kids){
        for (const k of kids) if (k !== id) set.add(k);
      }
    }
    return [...set];
  })() : [];

  const Row = ({ role, pid }) => {
    const pp = FAMILY.people[pid]; if (!pp) return null;
    return (
      <div className="relation-row" onClick={()=>onPick(pid)}>
        <span className="role">{role}</span>
        <span className="nm">{pp.name} <em>{pp.sur}</em></span>
      </div>
    );
  };

  return (
    <aside className="drawer open">
      <button className="close" onClick={onClose} aria-label="close">
        <svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 3 L13 13 M13 3 L3 13" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
      </button>
      <div className="header">
        <div className="pf">
          <image-slot id={`drawer-${id}`} shape="circle" placeholder="Drop photo"></image-slot>
        </div>
        <h2>{p.name} <em>{p.sur}</em></h2>
        <div className="meta">
          {formatYears(p)} {p.place ? `· ${p.place}` : ''} · Gen {p.gen}
        </div>
        <div className="action-row" style={{marginTop:18}}>
          {activeLineageId === id ? (
            <button className="action-btn primary active" onClick={()=>onHighlight(null)}>Exit lineage view</button>
          ) : (
            <button className="action-btn primary" onClick={()=>onHighlight(id)}>Highlight lineage</button>
          )}
          <button className="action-btn" onClick={()=>onPick(id, { recenter:true })}>Center on tree</button>
        </div>
      </div>
      <div className="body">
        {parents.length > 0 && (<>
          <h3>Parents</h3>
          <div className="relation-list">
            {parents.map((pid,i)=> <Row key={pid} role={FAMILY.people[pid]?.g==='m'?'Father':'Mother'} pid={pid} />)}
          </div>
        </>)}
        {spouse && (<>
          <h3>Partner</h3>
          <div className="relation-list">
            <Row role="Spouse" pid={spouse} />
          </div>
        </>)}
        {children.length > 0 && (<>
          <h3>Children · {children.length}</h3>
          <div className="relation-list">
            {children.map(c => <Row key={c} role="Child" pid={c} />)}
          </div>
        </>)}
        {siblings.length > 0 && (<>
          <h3>Siblings · {siblings.length}</h3>
          <div className="relation-list">
            {siblings.map(s => <Row key={s} role="Sibling" pid={s} />)}
          </div>
        </>)}
      </div>
    </aside>
  );
}

// ───────────────────────────────────────────────────────────────
// Brand mark (guava sprig)
// ───────────────────────────────────────────────────────────────
const BrandMark = () => (
  <svg viewBox="0 0 38 38" width="38" height="38" aria-hidden>
    <defs>
      <radialGradient id="guava-fruit" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="oklch(0.85 0.06 30)"/>
        <stop offset="100%" stopColor="oklch(0.62 0.13 22)"/>
      </radialGradient>
    </defs>
    {/* leaf */}
    <path d="M5 19 C 8 8, 22 6, 24 16 C 20 18, 12 22, 5 19 Z" fill="oklch(0.42 0.08 145)" />
    <path d="M5 19 L 22 9" stroke="oklch(0.32 0.06 150)" strokeWidth="1" />
    {/* fruit */}
    <circle cx="26" cy="22" r="9" fill="url(#guava-fruit)" />
    <circle cx="26" cy="22" r="9" fill="none" stroke="oklch(0.50 0.13 22)" strokeWidth="0.5" />
    {/* stem */}
    <path d="M26 13 C 26 10, 22 8, 22 6" stroke="oklch(0.42 0.045 60)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
  </svg>
);

// ───────────────────────────────────────────────────────────────
// Stats
// ───────────────────────────────────────────────────────────────
function Stats({ depth }){
  const visible = Object.values(FAMILY.people).filter(p => p.gen <= depth);
  const surnames = new Set(visible.map(p => p.sur).filter(Boolean));
  const generations = new Set(visible.map(p => p.gen)).size;
  const earliest = visible.reduce((m,p)=> p.b && p.b < m ? p.b : m, 9999);
  return (
    <div className="stats">
      <div className="stat"><div className="n">{visible.length}</div><div className="l">People</div></div>
      <div className="stat"><div className="n">{generations}</div><div className="l">Generations</div></div>
      <div className="stat"><div className="n">{surnames.size}</div><div className="l">Surnames</div></div>
      <div className="stat"><div className="n"><em>{earliest === 9999 ? '—' : earliest}</em></div><div className="l">Since</div></div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Top bar + Search
// ───────────────────────────────────────────────────────────────
function TopBar({ view, setView, query, setQuery, results, onPickResult }){
  return (
    <header className="topbar">
      <div className="brand">
        <h1>Family Tree</h1>
      </div>

      <div className="search-wrap">
        <svg viewBox="0 0 14 14"><circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.4"/><path d="M9.5 9.5 L 13 13" stroke="currentColor" strokeWidth="1.4" fill="none"/></svg>
        <input placeholder="Find a relative…" value={query} onChange={(e)=>setQuery(e.target.value)} />
        {query && results.length > 0 && (
          <div className="search-results">
            {results.slice(0,20).map(r => (
              <div key={r.id} className="search-result" onClick={()=>onPickResult(r.id)}>
                <span className="dot" style={{ background: r.g === 'm' ? 'var(--sky)' : 'var(--guava)' }}></span>
                <span>{r.name} <i style={{color:'var(--leaf-deep)'}}>{r.sur}</i></span>
                <span className="yr">{r.b ?? '?'}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="toolbar">
        <button className={`tb-btn ${view==='hierarchy' ? 'active':''}`} onClick={()=>setView('hierarchy')}>
          <svg viewBox="0 0 14 14"><rect x="5" y="1" width="4" height="3" fill="none" stroke="currentColor" strokeWidth="1"/><rect x="1" y="9" width="4" height="3" fill="none" stroke="currentColor" strokeWidth="1"/><rect x="9" y="9" width="4" height="3" fill="none" stroke="currentColor" strokeWidth="1"/><path d="M7 4 V 6.5 H 3 V 9 M 7 6.5 H 11 V 9" stroke="currentColor" strokeWidth="1" fill="none"/></svg>
          Tree
        </button>
        <button className={`tb-btn ${view==='timeline' ? 'active':''}`} onClick={()=>setView('timeline')}>
          <svg viewBox="0 0 14 14"><path d="M2 2 V 12 M 5 4 V 11 M 8 3 V 12 M 11 6 V 11" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/></svg>
          Timeline
        </button>
        <button className="tb-btn" onClick={()=>window.print()}>
          <svg viewBox="0 0 14 14"><rect x="2" y="6" width="10" height="6" fill="none" stroke="currentColor" strokeWidth="1"/><path d="M4 6 V 2 H 10 V 6" fill="none" stroke="currentColor" strokeWidth="1"/><path d="M4 9 H 10" stroke="currentColor" strokeWidth="1"/></svg>
          Poster
        </button>
      </div>
    </header>
  );
}

// ───────────────────────────────────────────────────────────────
// App
// ───────────────────────────────────────────────────────────────
function App(){
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const stageRef = useRef(null);
  const pz = usePanZoom(stageRef);

  const [focusId, setFocusId] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [hoverPt, setHoverPt] = useState({x:0,y:0});
  const [lineageId, setLineageId] = useState(null);
  const [drawerId, setDrawerId] = useState(null);
  const [query, setQuery] = useState('');

  // Escape clears whatever's active: drawer first, else lineage highlight.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (drawerId) { setDrawerId(null); return; }
      if (lineageId) { setLineageId(null); return; }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerId, lineageId]);

  // Apply palette CSS variables
  useEffect(() => {
    const pal = PALETTES[t.palette] || PALETTES.guava;
    const r = document.documentElement.style;
    r.setProperty('--leaf-deep', pal.leaf);
    r.setProperty('--leaf', pal.leafDeep);
    r.setProperty('--guava', pal.guava);
    r.setProperty('--guava-deep', pal.guavaDeep);
    r.setProperty('--sky', pal.sky);
    r.setProperty('--sky-deep', pal.skyDeep);
    r.setProperty('--ochre', pal.ochre);
    const typ = TYPOGRAPHY[t.typography] || TYPOGRAPHY.garamond;
    r.setProperty('--font-display', typ.display);
    r.setProperty('--font-body', typ.body);
  }, [t.palette, t.typography]);

  const geo = useGeometry(t.density);
  const lineageSet = useMemo(() => lineageId ? ancestors(lineageId) : null, [lineageId]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return Object.values(FAMILY.people).filter(p =>
      (p.name||'').toLowerCase().includes(q) ||
      (p.sur||'').toLowerCase().includes(q)
    );
  }, [query]);

  const onPick = (id, opts) => {
    setFocusId(id); setDrawerId(id);
    if (opts?.recenter && geo.pos[id]){
      pz.centerOn(geo.pos[id].cx, geo.pos[id].cy, Math.max(0.85, pz.t.k));
    }
  };

  const onHover = (id, e) => {
    setHovered(id);
    if (e){ setHoverPt({x: e.clientX, y: e.clientY}); }
  };

  // Density class
  const densityClass = `density-${t.density}`;

  return (
    <div className={densityClass}>
      <div className="paper-bg"></div>

      <TopBar
        view={t.view}
        setView={(v)=>setTweak('view', v)}
        query={query} setQuery={setQuery}
        results={results}
        onPickResult={(id)=>{
          setQuery('');
          onPick(id, { recenter:true });
        }}
      />

      {lineageId && (() => {
        const p = FAMILY.people[lineageId];
        return (
          <div className="lineage-banner" onClick={()=>setLineageId(null)} title="Click or press Esc to clear">
            <span className="sw" style={{background:'var(--ochre)'}}></span>
            <span>Showing lineage of <strong>{p?.name} {p?.sur}</strong></span>
            <span className="clear">Clear ✕</span>
          </div>
        );
      })()}

      <div className="legend">
        <div className="item"><span className="sw" style={{background:'var(--sky)'}}></span>male</div>
        <div className="item"><span className="sw" style={{background:'var(--guava)'}}></span>female</div>
        <div className="item"><span className="sw" style={{background:'var(--ochre)'}}></span>lineage</div>
        {t.view === 'timeline' && (
          <div className="item" style={{borderLeft:'1px solid var(--paper-edge)', paddingLeft:14}}>
            <em style={{color:'var(--ink-faint)', fontStyle:'italic'}}>move cursor up/down to scrub year</em>
          </div>
        )}
      </div>

      <div
        className="stage"
        ref={stageRef}
        onMouseDown={pz.onMouseDown}
        onClick={(e) => {
          // Empty-canvas click clears the lineage highlight.
          // Person cards stopPropagation, so this only fires on background.
          if (lineageId && !pz.didDragRef.current) setLineageId(null);
        }}
      >
        <div className="world" style={{ transform:`translate(${pz.t.x}px, ${pz.t.y}px) scale(${pz.t.k})` }}>
          {t.view === 'hierarchy' ? (
            <HierarchyView
              geo={geo}
              focusId={focusId}
              depth={t.depth}
              onPick={onPick}
              lineageSet={lineageSet}
              dimOthers={!!lineageId}
              onHover={onHover}
              hovered={hovered}
            />
          ) : (
            <TimelineView
              geo={geo}
              focusId={focusId}
              depth={t.depth}
              onPick={onPick}
              lineageSet={lineageSet}
              dimOthers={!!lineageId}
              onHover={onHover}
              cursorYear={t.timelineYear}
              onCursorYear={(y)=>setTweak('timelineYear', y)}
            />
          )}
        </div>
      </div>

      <Stats depth={t.depth} />

      <div className="zoom-ctrl">
        <div className="zoom-pct">{Math.round(pz.t.k*100)}%</div>
        <button onClick={()=>pz.zoomTo(pz.t.k * 1.2)} title="Zoom in">
          <svg viewBox="0 0 14 14" width="12" height="12"><path d="M7 3 V 11 M 3 7 H 11" stroke="currentColor" strokeWidth="1.4"/></svg>
        </button>
        <button onClick={()=>pz.zoomTo(pz.t.k * 0.8)} title="Zoom out">
          <svg viewBox="0 0 14 14" width="12" height="12"><path d="M3 7 H 11" stroke="currentColor" strokeWidth="1.4"/></svg>
        </button>
        <button onClick={()=>pz.reset()} title="Reset">
          <svg viewBox="0 0 14 14" width="12" height="12"><path d="M11 3 H 3 V 11 H 11 Z M 3 3 L 11 11" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>
        </button>
        {lineageId && (
          <button onClick={()=>setLineageId(null)} title="Clear lineage" style={{color:'var(--guava-deep)'}}>
            <svg viewBox="0 0 14 14" width="12" height="12"><path d="M3 3 L 11 11 M 11 3 L 3 11" stroke="currentColor" strokeWidth="1.4"/></svg>
          </button>
        )}
      </div>

      <Drawer id={drawerId}
        activeLineageId={lineageId}
        onClose={()=>setDrawerId(null)}
        onPick={(id, opts)=>{ onPick(id, opts); }}
        onHighlight={(id)=>{ setLineageId(id); }}
      />

      {/* Tooltip */}
      {hovered && (() => {
        const p = FAMILY.people[hovered]; if (!p) return null;
        return (
          <div className="tip" style={{ left: Math.min(window.innerWidth - 260, hoverPt.x + 14), top: hoverPt.y + 14 }}>
            <div className="nm">{p.name} <em>{p.sur}</em></div>
            <div className="ln">{formatYears(p) || '—'}</div>
            <div className="pl">{p.place}</div>
          </div>
        );
      })()}

      <TweaksPanel title="Tweaks">
        <TweakSection label="View">
          <TweakRadio label="Layout" value={t.view} onChange={(v)=>setTweak('view', v)} options={[{value:'hierarchy', label:'Tree'},{value:'timeline', label:'Timeline'}]} />
          <TweakSlider label="Generation depth" value={t.depth} min={1} max={7} step={1} onChange={(v)=>setTweak('depth', v)} />
          {t.view === 'timeline' && (
            <TweakSlider label="Year cursor" value={t.timelineYear} min={1850} max={2026} step={1} onChange={(v)=>setTweak('timelineYear', v)} />
          )}
        </TweakSection>
        <TweakSection label="Style">
          <TweakRadio label="Density" value={t.density} onChange={(v)=>setTweak('density', v)} options={[{value:'compact', label:'Compact'},{value:'regular', label:'Regular'},{value:'spacious', label:'Spacious'}]} />
          <TweakSelect label="Palette" value={t.palette} onChange={(v)=>setTweak('palette', v)} options={[
            {value:'guava',  label:'Guava & Leaf'},
            {value:'havana', label:'Havana Ochre'},
            {value:'mar',    label:'Mar Caribe'},
            {value:'monocromo', label:'Monocromo'},
          ]} />
          <TweakSelect label="Typography" value={t.typography} onChange={(v)=>setTweak('typography', v)} options={[
            {value:'garamond', label:'Cormorant Garamond'},
            {value:'fraunces', label:'DM Serif Display'},
            {value:'classic',  label:'Playfair / Lora'},
            {value:'modern',   label:'Libre Caslon / Manrope'},
          ]} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

// Error boundary so an unhandled render error shows a recovery card instead of blanking the page.
class ErrorBoundary extends React.Component {
  constructor(p){ super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err){ return { err }; }
  componentDidCatch(err, info){ console.error('Render error:', err, info); }
  reset = () => this.setState({ err: null });
  render(){
    if (!this.state.err) return this.props.children;
    return (
      <div style={{position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--paper)', padding:24}}>
        <div style={{maxWidth:480, fontFamily:'var(--font-display)', color:'var(--ink)'}}>
          <h2 style={{margin:'0 0 8px', fontWeight:500}}>Something hiccuped.</h2>
          <p style={{margin:'0 0 16px', color:'var(--ink-soft)', fontSize:14}}>
            The tree hit a snag during a pan or click. Your photos and tweaks are saved.
          </p>
          <button onClick={this.reset}
            style={{padding:'8px 16px', borderRadius:99, border:'1px solid var(--paper-edge)',
                    background:'var(--leaf-deep)', color:'var(--paper)', cursor:'pointer', font:'inherit'}}>
            Recover
          </button>
        </div>
      </div>
    );
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary><App /></ErrorBoundary>
);
