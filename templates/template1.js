// reveal cards on scroll
const res_col = document.querySelectorAll('.resume-column');
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
// observe cards only
res_col.forEach(c => obs.observe(c));

// reveal cards on scroll
const cards = document.querySelectorAll('.card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
// observe cards only
cards.forEach(c => observer.observe(c));

// animate skill bars when section visible
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
  const skillBars = skillsSection.querySelectorAll('.bar');
  const obsSkills = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        skillBars.forEach(b=> {
          const lvl = b.dataset.level || '0%';
          b.style.setProperty('--level', lvl);
        });
        obsSkills.unobserve(e.target);
      }
    });
  },{threshold:0.4});
  obsSkills.observe(skillsSection);
}

// reveal education timeline entries when they scroll into view
const eduEntries = document.querySelectorAll('.education .entry');
if (eduEntries.length) {
  const obsEdu = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obsEdu.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  eduEntries.forEach(e => obsEdu.observe(e));
}


// hero canvas deep‑learning animation
(function(){
  const hcanvas = document.getElementById('hero-canvas');
  if (!hcanvas || !hcanvas.getContext) return;
  const ctx = hcanvas.getContext('2d');
  function resize() {
    hcanvas.width = hcanvas.offsetWidth;
    hcanvas.height = hcanvas.offsetHeight;
    init();
  }
  window.addEventListener('resize', resize);

  let layers;
  function init() {
    const w = hcanvas.width;
    const h = hcanvas.height;
    // three layers of nodes
    layers = [[],[],[]];
    const cols = [w*0.25, w*0.5, w*0.75];
    // make left layer denser than right (e.g. 6 input nodes, 4 hidden, 2 output)
    const counts = [8,5,3];
    for (let li=0; li<3; li++) {
      const count = counts[li];
      for (let i=0;i<count;i++) {
        layers[li].push({
          x: cols[li],
          y: h*(i+1)/(count+1),
          r: 4 + Math.random()*2,
          pulse: Math.random()*Math.PI*2
        });
      }
    }
  }

  function drawHero() {
    const w = hcanvas.width;
    const h = hcanvas.height;
    ctx.clearRect(0,0,w,h);
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    // draw connections between layers
    for (let li=0; li<layers.length-1; li++) {
      layers[li].forEach(n1=>{
        layers[li+1].forEach(n2=>{
          ctx.beginPath();
          ctx.moveTo(n1.x,n1.y);
          ctx.lineTo(n2.x,n2.y);
          ctx.stroke();
        });
      });
    }
    // draw nodes with pulsing effect
    layers.flat().forEach(n=>{
      const r = n.r + Math.sin(n.pulse)*2;
      ctx.beginPath();
      ctx.arc(n.x,n.y,r,0,2*Math.PI);
      ctx.fill();
      n.pulse += 0.05;
    });
    requestAnimationFrame(drawHero);
  }

  resize();
  drawHero();
})();

// simple network animation in footer (static edges, DPI aware)
const canvas = document.getElementById('net');
if (canvas && canvas.getContext) {
  const ctx = canvas.getContext('2d');
  const dots = [];
  const edges = [];
  function computeEdges() {
    edges.length = 0;
    const n = dots.length;
    const threshold = 100; // maximum distance for a connection (px)
    const threshSq = threshold * threshold;
    for (let i = 0; i < n; i++) {
      const d1 = dots[i];
      const distArr = [];
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const d2 = dots[j];
        const dx = d1.x - d2.x;
        const dy = d1.y - d2.y;
        const dsq = dx*dx + dy*dy;
        if (dsq <= threshSq) {
          distArr.push({j, dist: dsq});
        }
      }
      distArr.sort((a,b)=>a.dist - b.dist);
      for (let k = 0; k < 3 && k < distArr.length; k++) {
        edges.push([i, distArr[k].j]);
      }
    }
  }
  function initFooter() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    dots.length = 0;
    for (let i=0;i<20;i++) {
      dots.push({
        x:Math.random()*canvas.offsetWidth,
        y:Math.random()*canvas.offsetHeight,
        vx:(Math.random()-0.5)*0.05,  // much slower horizontal drift
        vy:(Math.random()-0.5)*0.05   // much slower vertical drift
      });
    }
    computeEdges();
  }
  window.addEventListener('resize', initFooter);
  initFooter();
    // periodically recompute edges so they disappear/appear when nodes move
    setInterval(computeEdges, 3000);

    function draw() {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = '#888';
    dots.forEach(d=> ctx.fillRect(d.x,d.y,2,2));
    // draw precomputed edges with slight opacity modulation
    ctx.strokeStyle = 'rgba(136,136,136,0.4)';
    edges.forEach(([i,j])=>{
      const d1 = dots[i];
      const d2 = dots[j];
      ctx.beginPath();
      ctx.moveTo(d1.x,d1.y);
      ctx.lineTo(d2.x,d2.y);
      ctx.stroke();
    });
    // update positions with gentle drift
    dots.forEach(d=>{
      d.x += d.vx;
      d.y += d.vy;
      if(d.x<0) d.x = w;
      if(d.x>w) d.x = 0;
      if(d.y<0) d.y = h;
      if(d.y>h) d.y = 0;
    });
    requestAnimationFrame(draw);
  }
  draw();
}
