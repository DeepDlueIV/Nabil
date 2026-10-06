/** Original exploded axonometric compute assembly. Pure SVG, no 3D dependency. */
export function computeIllustration() {
  const p = (x, y, z) => [326 + (x-y)*1.52, 318 + (x+y)*.68-z];
  const pts = a => a.map(v => p(...v).join(',')).join(' ');
  function slab(x,y,z,w,d,h,fill='#252829',edge='#60615a') {
    return `<g stroke="${edge}" stroke-width=".85" stroke-linejoin="round"><polygon fill="#131617" points="${pts([[x,y,z],[x+w,y,z],[x+w,y,z-h],[x,y,z-h]])}"/><polygon fill="#1a1d1d" points="${pts([[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z-h],[x+w,y,z-h]])}"/><polygon fill="${fill}" points="${pts([[x,y,z],[x+w,y,z],[x+w,y+d,z],[x,y+d,z]])}"/></g>`;
  }
  let svg = `<svg viewBox="0 0 660 580" xmlns="http://www.w3.org/2000/svg" aria-labelledby="compute-title" role="img"><title id="compute-title">Exploded isometric illustration of a layered GPU compute architecture</title><defs><pattern id="board-grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#ffffff" stroke-opacity=".025"/></pattern><linearGradient id="chip-face" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#eeb087"/><stop offset="1" stop-color="#cb7542"/></linearGradient></defs><rect width="660" height="580" fill="url(#board-grid)"/><g fill="none" stroke="#74746b" stroke-width=".7" opacity=".25"><path d="M60 383L328 508 605 380M57 401L328 526 608 398M60 364L328 488 605 362"/><path d="M326 5V548M25 283H638" stroke-dasharray="2 7"/></g>`;
  svg += `<g class="compute-assembly">${slab(-100,-100,0,200,200,15,'#242827','#65665e')}`;
  for (let i=-80;i<=80;i+=16) svg += `<path d="M${p(i,-92,1)}L${p(i,92,1)}M${p(-92,i,1)}L${p(92,i,1)}" fill="none" stroke="#7b8173" stroke-width=".5" opacity=".18"/>`;
  for (const [x,y] of [[-87,-87],[87,-87],[-87,87],[87,87]]) svg += `<path d="M${p(x,y,0)}L${p(x,y,165)}" stroke="#b99573" stroke-width=".8" stroke-dasharray="3 6" opacity=".45"/><circle cx="${p(x,y,0)[0]}" cy="${p(x,y,0)[1]}" r="2.6" fill="#e79b6c"/>`;
  svg += `<g class="compute-middle">${slab(-82,-82,80,164,164,8,'#202525','#5f6c62')}`;
  for (let a=0;a<3;a++) for(let b=0;b<3;b++) svg+=slab(-66+a*47,-66+b*47,92,37,37,7,a===1&&b===1?'#ae7953':'#333b35','#828673');
  for (let i=0;i<10;i++) svg+= `<path d="M${p(-77,-70+i*15,81)}L${p(-69,-70+i*15,81)}M${p(68,-70+i*15,81)}L${p(77,-70+i*15,81)}" stroke="#db995e" stroke-width="1.5"/>`;
  svg+='</g><g class="compute-top">';
  svg+=slab(-68,-68,178,136,136,6,'#2d3430','#999781');
  for (let i=0;i<7;i++) {
    const pos=-48+i*16;
    svg+=`<path class="board-trace" d="M${p(-64,pos,179)}L${p(-39,pos,179)}L${p(-29,pos*.6,179)}M${p(29,pos*.6,179)}L${p(39,pos,179)}L${p(64,pos,179)}M${p(pos,-64,179)}L${p(pos,-39,179)}L${p(pos*.6,-29,179)}M${p(pos*.6,29,179)}L${p(pos,39,179)}L${p(pos,64,179)}" fill="none" stroke="#be926b" stroke-width="1"/>`;
  }
  svg+=slab(-28,-28,187,56,56,8,'url(#chip-face)','#e4ad82');
  svg+=`<path d="M${p(-14,-14,188)}L${p(14,-14,188)}L${p(14,14,188)}L${p(-14,14,188)}Z" fill="none" stroke="#382a20" stroke-width="1.2"/><path d="M${p(-7,9,188)}L${p(-7,-9,188)}L${p(7,9,188)}L${p(7,-9,188)}" fill="none" stroke="#382a20" stroke-width="2"/>`;
  svg+='</g></g>';
  svg+=`<g class="diagram-labels" font-family="monospace" font-size="9.5" letter-spacing="1.2" fill="#b6b7a9"><path d="M445 112H494L510 96H617" fill="none" stroke="#65685e"/><circle cx="445" cy="112" r="3" fill="#ecac7b"/><text x="517" y="84">01 / MODEL</text><text x="517" y="109" fill="#737971" font-size="8">INFERENCE LAYER</text><path d="M473 277H520L535 263H635" fill="none" stroke="#65685e"/><circle cx="473" cy="277" r="3" fill="#ecac7b"/><text x="540" y="252">02 / COMPUTE</text><text x="540" y="276" fill="#737971" font-size="8">GPU WORKLOADS</text><path d="M170 390H117L94 410H18" fill="none" stroke="#65685e"/><circle cx="170" cy="390" r="3" fill="#ecac7b"/><text x="19" y="432">03 / FOUNDATION</text><text x="19" y="450" fill="#737971" font-size="8">ORCHESTRATION</text><text x="286" y="547" fill="#888d80" font-size="8">FIG. 01 — COMPUTE, DECONSTRUCTED</text></g></svg>`;
  return svg;
}

export const icon = (name='arrow', cls='') => {
  const paths = {
    arrow:'<path d="M5 12h14M12 5l7 7-7 7"/>', diagonal:'<path d="M6 18L18 6M6 6h12v12"/>',
    down:'<path d="M12 4v16M5 13l7 7 7-7"/>', plus:'<path d="M12 5v14M5 12h14"/>', close:'<path d="M6 6l12 12M6 18L18 6"/>',
    chip:'<rect x="6" y="6" width="12" height="12" rx="1"/><path d="M9 1v5m6-5v5M9 18v5m6-5v5M1 9h5m-5 6h5m12-6h5m-5 6h5"/><rect x="10" y="10" width="4" height="4"/>',
    nodes:'<rect x="2" y="2" width="6" height="6"/><rect x="16" y="16" width="6" height="6"/><rect x="2" y="16" width="6" height="6"/><path d="M5 8v8m3 3h8M8 5h11v11"/>',
    shield:'<path d="M12 2l9 4v6c0 5-9 10-9 10S3 17 3 12V6zM8 12l3 3 5-6"/>',
    direction:'<path d="M3 21L21 3M9 3h12v12M3 13v8h8"/>',
    pause:'<path d="M8 5v14M16 5v14"/>', play:'<path d="M7 4l13 8-13 8z"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 5l9 8 9-8"/>',
    globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>'
  };
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
};
