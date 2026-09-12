const landing = document.createElement('section');
landing.id = 'museum-landing';
landing.innerHTML = `
  <div class="ml-backdrop"></div>
  <div class="ml-noise"></div>
  <header class="ml-nav">
    <a class="ml-brand" href="#inicio" aria-label="Los Íberos — Museo Virtual">LOS ÍBEROS</a>
    <nav aria-label="Navegación principal">
      <a href="#historia">Historia</a>
      <a href="#colecciones">Colecciones</a>
      <a href="#experiencia">Experiencia</a>
    </nav>
    <button class="ml-enter ml-enter-top" type="button">Entrar al museo <span>↗</span></button>
  </header>

  <main>
    <section class="ml-hero" id="inicio">
      <div class="ml-hero-copy">
        <p class="ml-kicker">Museo Virtual · Iberia antigua</p>
        <h1>LOS<br><em>ÍBEROS</em></h1>
        <p class="ml-lead">Una civilización. Tres mundos.<br>Un viaje para descubrirla.</p>
        <div class="ml-actions">
          <button class="ml-enter ml-primary" type="button">Comenzar experiencia <span>→</span></button>
          <a class="ml-secondary" href="#historia">Descubrir la historia</a>
        </div>
      </div>
      <div class="ml-hero-art" aria-hidden="true">
        <div class="ml-orbit orbit-a"></div>
        <div class="ml-orbit orbit-b"></div>
        <div class="ml-glow"></div>
        <div class="ml-sigil">𐌉<br><small>IBERIA</small></div>
      </div>
      <div class="ml-scroll">Explora <span></span></div>
    </section>

    <section class="ml-section" id="historia">
      <div><p class="ml-kicker">01 · Contexto</p><h2>Una cultura entre<br><em>mundos.</em></h2></div>
      <div class="ml-text"><p>Los pueblos íberos desarrollaron una cultura propia en el Mediterráneo occidental, marcada por el territorio, el comercio, la guerra y el ritual.</p><p>Esta experiencia propone acercarse a ese legado desde el espacio, la luz y los objetos que lo cuentan.</p></div>
    </section>

    <section class="ml-section ml-collections" id="colecciones">
      <div><p class="ml-kicker">02 · Colecciones</p><h2>Objetos que<br><em>hablan.</em></h2></div>
      <div class="ml-cards">
        <article><span>01</span><strong>Cerámica</strong><p>Formas, símbolos y vida cotidiana.</p></article>
        <article><span>02</span><strong>Armas</strong><p>El hierro y la tradición guerrera.</p></article>
        <article><span>03</span><strong>Ritual</strong><p>La relación entre vivos y ancestros.</p></article>
      </div>
    </section>

    <section class="ml-experience" id="experiencia">
      <p class="ml-kicker">03 · Experiencia inmersiva</p>
      <h2>Entra.<br><em>Recorre. Descubre.</em></h2>
      <p>Tres salas diseñadas para explorar a tu ritmo: <b>El Origen</b>, <b>Los Guerreros</b> y <b>El Ritual</b>.</p>
      <button class="ml-enter ml-primary" type="button">Entrar en la experiencia <span>→</span></button>
    </section>
  </main>
  <footer class="ml-footer">LOS ÍBEROS <span>MUSEO VIRTUAL</span><small>Experiencia digital</small></footer>
`;

document.body.appendChild(landing);

const style = document.createElement('style');
style.textContent = `
#museum-landing{position:fixed;inset:0;z-index:110;overflow:auto;background:#090704;color:#eee5d6;font-family:Inter,system-ui,sans-serif;scroll-behavior:smooth;user-select:none}
#museum-landing *{box-sizing:border-box}
.ml-backdrop{position:fixed;inset:0;pointer-events:none;background:radial-gradient(circle at 72% 36%,rgba(200,169,110,.18),transparent 25%),radial-gradient(circle at 22% 80%,rgba(107,65,25,.18),transparent 35%),linear-gradient(135deg,#050403 0%,#120c07 55%,#050403 100%)}
.ml-noise{position:fixed;inset:0;pointer-events:none;opacity:.05;background-image:radial-gradient(#fff 1px,transparent 1px);background-size:4px 4px;mix-blend-mode:soft-light}
.ml-nav{position:fixed;top:0;left:0;right:0;height:76px;padding:0 5vw;display:flex;align-items:center;justify-content:space-between;z-index:4;border-bottom:1px solid rgba(200,169,110,.12);background:rgba(5,4,2,.55);backdrop-filter:blur(18px)}
.ml-brand{font:600 .85rem/1 Cinzel,serif;letter-spacing:.24em;color:#c8a96e;text-decoration:none}.ml-nav nav{display:flex;gap:2rem}.ml-nav nav a{color:rgba(238,229,214,.58);font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;text-decoration:none}.ml-nav nav a:hover{color:#c8a96e}.ml-enter{border:1px solid rgba(200,169,110,.55);background:transparent;color:#c8a96e;padding:.72rem 1.1rem;font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:.25s}.ml-enter:hover{background:#c8a96e;color:#090704;box-shadow:0 0 30px rgba(200,169,110,.22)}.ml-enter span{margin-left:.6rem}
.ml-hero{position:relative;min-height:100svh;display:grid;grid-template-columns:1.05fr .95fr;align-items:center;padding:110px 8vw 70px}.ml-hero-copy{position:relative;z-index:2}.ml-kicker{font-size:.65rem;letter-spacing:.28em;text-transform:uppercase;color:#9a7b49;margin:0 0 1.2rem}.ml-hero h1{font:700 clamp(4.5rem,10vw,9rem)/.82 Cinzel,serif;letter-spacing:.07em;color:#e8dcc8;margin:0}.ml-hero h1 em,.ml-section h2 em,.ml-experience h2 em{font-style:normal;color:#c8a96e}.ml-lead{margin:2rem 0 2.4rem;color:rgba(238,229,214,.58);font-size:1rem;line-height:1.8}.ml-actions{display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap}.ml-primary{background:#c8a96e;color:#0a0704;border-color:#c8a96e;padding:1rem 1.35rem;font-weight:600}.ml-secondary{color:rgba(238,229,214,.55);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;border-bottom:1px solid rgba(200,169,110,.3);padding-bottom:4px}
.ml-hero-art{height:min(70vh,680px);position:relative;display:grid;place-items:center}.ml-glow{width:42%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(200,169,110,.42),rgba(200,169,110,.08) 35%,transparent 70%);filter:blur(12px);animation:mlpulse 5s ease-in-out infinite}.ml-orbit{position:absolute;border:1px solid rgba(200,169,110,.22);border-radius:50%;transform:rotate(-22deg);animation:mlspin 24s linear infinite}.orbit-a{width:62%;height:84%}.orbit-b{width:78%;height:52%;transform:rotate(62deg);animation-duration:30s}.ml-sigil{position:absolute;text-align:center;font:500 clamp(3rem,8vw,6rem)/.8 Cinzel,serif;color:#c8a96e;text-shadow:0 0 50px rgba(200,169,110,.45)}.ml-sigil small{font:500 .48rem Inter,sans-serif;letter-spacing:.5em;margin-left:.5em}.ml-scroll{position:absolute;bottom:28px;left:8vw;color:rgba(238,229,214,.32);font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;display:flex;align-items:center;gap:10px}.ml-scroll span{width:45px;height:1px;background:#8d6d3d}
.ml-section{position:relative;z-index:2;min-height:75svh;padding:12vw 10vw;display:grid;grid-template-columns:1fr 1fr;gap:10vw;border-top:1px solid rgba(200,169,110,.1);background:rgba(4,3,2,.35)}.ml-section h2,.ml-experience h2{font:500 clamp(2.5rem,5vw,5rem)/1.02 Cinzel,serif;margin:0;color:#e8dcc8}.ml-text{max-width:520px;align-self:end}.ml-text p{font-size:1rem;line-height:1.9;color:rgba(238,229,214,.56);margin:0 0 1.3rem}.ml-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;align-self:end}.ml-cards article{min-height:210px;padding:1.5rem;border:1px solid rgba(200,169,110,.16);background:rgba(15,10,6,.58);display:flex;flex-direction:column;justify-content:flex-end}.ml-cards span{color:#8d6d3d;font-size:.65rem;margin-bottom:auto}.ml-cards strong{font:500 1.15rem Cinzel,serif;color:#c8a96e}.ml-cards p{font-size:.72rem;line-height:1.6;color:rgba(238,229,214,.45);margin:.5rem 0 0}
.ml-experience{position:relative;z-index:2;text-align:center;padding:14vw 8vw;background:radial-gradient(circle at 50% 50%,rgba(200,169,110,.11),transparent 45%),#090704;border-top:1px solid rgba(200,169,110,.1)}.ml-experience h2{margin-bottom:1.5rem}.ml-experience>p:not(.ml-kicker){max-width:600px;margin:0 auto 2rem;color:rgba(238,229,214,.52);line-height:1.8}.ml-footer{position:relative;z-index:2;padding:2rem 5vw;border-top:1px solid rgba(200,169,110,.12);color:#c8a96e;font:500 .7rem Cinzel,serif;letter-spacing:.2em}.ml-footer span{color:rgba(238,229,214,.35);margin-left:1rem}.ml-footer small{float:right;color:rgba(238,229,214,.25);font:400 .6rem Inter,sans-serif;letter-spacing:.12em}
@keyframes mlpulse{50%{transform:scale(1.08);opacity:.75}}@keyframes mlspin{to{transform:rotate(338deg)}}
@media(max-width:760px){.ml-nav{height:64px;padding:0 5vw}.ml-nav nav{display:none}.ml-enter-top{padding:.55rem .7rem;font-size:.58rem}.ml-hero{grid-template-columns:1fr;min-height:100svh;padding:110px 7vw 60px}.ml-hero-art{position:absolute;inset:18% -8% auto;height:58vh;opacity:.38}.ml-hero-copy{padding-top:8vh}.ml-hero h1{font-size:clamp(4rem,19vw,7rem)}.ml-section{grid-template-columns:1fr;min-height:auto;padding:24vw 7vw;gap:3rem}.ml-cards{grid-template-columns:1fr}.ml-cards article{min-height:150px}.ml-experience{padding:26vw 7vw}.ml-footer small{display:block;float:none;margin-top:.7rem}.ml-footer span{display:block;margin:.5rem 0 0}}
`;
document.head.appendChild(style);

function enterExperience(){
  landing.style.transition='opacity .55s ease,visibility .55s ease';
  landing.style.opacity='0';
  landing.style.visibility='hidden';
  setTimeout(()=>{
    landing.remove();
    document.getElementById('btn-explore')?.click();
  },560);
}
landing.querySelectorAll('.ml-enter').forEach(btn=>btn.addEventListener('click',enterExperience));
landing.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const target=document.querySelector(a.getAttribute('href'));
  if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'});}
}));
