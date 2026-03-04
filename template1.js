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

// reveal career keys timeline entries when they scroll into view
const eduEntries = document.querySelectorAll('.keys .entry');
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