// ── ANIMATION OBSERVER ───────────────────────────────────────
class AnimationObserver {
  constructor() { this.init(); }
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('aos-animate');
        if (entry.target.classList.contains('stat-number')) this.animateCounter(entry.target);
        if (entry.target.classList.contains('skill-card'))  this.animateSkillBar(entry.target);
      });
    }, { threshold:0.12, rootMargin:'0px 0px -80px 0px' });

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
    document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
    document.querySelectorAll('.skill-card').forEach(el => observer.observe(el));
  }
  animateCounter(el) {
    const raw = el.getAttribute('data-count');
    if (!raw || el.classList.contains('counted')) return;
    const target = parseInt(raw);
    if (isNaN(target)) return;
    el.classList.add('counted');
    const dur = 1800, step = target / (dur / 16);
    let cur = 0;
    const tick = () => {
      cur += step;
      if (cur < target) { el.textContent = Math.floor(cur); requestAnimationFrame(tick); }
      else { el.textContent = target; }
    };
    tick();
  }
  animateSkillBar(card) {
    const bar = card.querySelector('.skill-bar');
    if (!bar) return;
    const level = bar.getAttribute('data-level');
    setTimeout(() => { bar.style.width = level + '%'; }, 150);
  }
}

// ── PARALLAX — subtle, no content shifting ───────────────────
class ParallaxEffect {
  constructor() { /* intentionally light — no content shift */ }
}

// ── SMOOTH REVEAL ─────────────────────────────────────────────
class SmoothReveal {
  constructor() {}
  reveal(elements) {
    elements.forEach(el => { el.style.opacity='1'; el.style.transform='translateY(0)'; });
  }
}

// ── STUBS kept for app.js compatibility ──────────────────────
class CursorTrail  { constructor() {} init() {} enable() {} disable() {} }
class TypingEffect { constructor(el,txt,spd=50){this.el=el;this.text=txt;this.speed=spd;this.index=0;} start(){this.el.textContent='';this.index=0;this.type();} type(){if(this.index<this.text.length){this.el.textContent+=this.text.charAt(this.index++);setTimeout(()=>this.type(),this.speed);}} }
class GlitchEffect { constructor(el){this.element=el;} trigger(d=2000){this.element.style.animation=`glitch 0.3s ease-in-out`;setTimeout(()=>{this.element.style.animation='';},d);} }
class TextScramble { constructor(el){this.element=el;this.chars='!<>-_\\/[]{}—=+*^?#';this.update=this.update.bind(this);} setText(t){const ol=this.element.innerText,len=Math.max(ol.length,t.length);const p=new Promise(r=>this.resolve=r);this.queue=[];for(let i=0;i<len;i++){const f=ol[i]||'',to=t[i]||'',s=Math.floor(Math.random()*40),e=s+Math.floor(Math.random()*40);this.queue.push({from:f,to,start:s,end:e});}cancelAnimationFrame(this.frameRequest);this.frame=0;this.update();return p;} update(){let out='',done=0;for(let i=0,n=this.queue.length;i<n;i++){let{from,to,start,end,char}=this.queue[i];if(this.frame>=end){done++;out+=to;}else if(this.frame>=start){if(!char||Math.random()<0.28){char=this.chars[Math.floor(Math.random()*this.chars.length)];this.queue[i].char=char;}out+=char;}else out+=from;}this.element.innerText=out;if(done===this.queue.length)this.resolve();else{this.frameRequest=requestAnimationFrame(this.update);this.frame++;}} }

const glitchStyle = document.createElement('style');
glitchStyle.textContent = `@keyframes glitch{0%{transform:translate(0)}20%{transform:translate(-2px,2px)}40%{transform:translate(-2px,-2px)}60%{transform:translate(2px,2px)}80%{transform:translate(2px,-2px)}100%{transform:translate(0)}}`;
document.head.appendChild(glitchStyle);

window.AnimationObserver = AnimationObserver;
window.ParallaxEffect    = ParallaxEffect;
window.SmoothReveal      = SmoothReveal;
window.CursorTrail       = CursorTrail;
window.TypingEffect      = TypingEffect;
window.GlitchEffect      = GlitchEffect;
window.TextScramble      = TextScramble;
