import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './App.css';

const A='/images/';

function App(){
  return <div className="site">
    <header className="nav">
      <a className="brand" href="#hero">LOS ÍBEROS</a>
      <nav>{['Historia','Exposiciones','Colecciones','Tour Virtual','Explorar'].map((x,i)=><a key={i} href={['#about','#exhibitions','#collections','#virtual-tour','#contact'][i]}>{x}</a>)}</nav>
      <a className="enter" href="#virtual-tour">Entrar al museo ↗</a>
    </header>
    <main>
      <section id="hero" className="hero">
        <div className="hero-copy"><p className="kicker">Museo Online · Iberia antigua</p><h1>LOS<br/><em>ÍBEROS</em></h1><p>Una civilización ancestral de la Península Ibérica.</p><div className="actions"><a className="primary" href="#about">Descubrir la historia →</a><a href="#virtual-tour">Explorar el tour</a></div></div>
        <div className="hero-art"><div className="hero-glow"/><img src={A+'hero-ibero.png'} alt="Guerrero Íbero"/></div>
      </section>
      <section id="about" className="about"><div><p className="kicker">Establecido 600 a.C.</p><h2>Una Civilización que Forjó la Identidad de <em>Iberia</em></h2></div><div className="about-text"><p>Los íberos fueron un conjunto de pueblos que habitaron la Península Ibérica desde el siglo VI a.C. hasta la romanización completa en el siglo I d.C. Su cultura, arte y organización social dejaron una huella imborrable.</p><div className="stats"><b>500+<small>Años de Historia</small></b><b>30<small>Tribus Íberas</small></b><b>2,500<small>Artefactos Exhibidos</small></b><b>150<small>Yacimientos</small></b></div></div></section>
      <section className="gallery">{[1,2,3,4,5,6].map(n=><img key={n} src={A+`gallery-${n}.jpg`} alt=""/>)}</section>
      <section id="exhibitions" className="dark"><p className="kicker">Exposiciones</p><h2>Una mirada a nuestro <em>legado.</em></h2><div className="grid">{[1,2,3,4].map(n=><img key={n} src={A+`exhibition-${n}.jpg`} alt=""/>)}</div></section>
      <section id="collections" className="collections"><p className="kicker">Colecciones</p><h2>Objetos que <em>hablan.</em></h2><div className="cards">{[1,2,3,4].map(n=><article key={n}><img src={A+`collection-${n}.jpg`} alt=""/><div><span>0{n}</span><h3>{['Escultura y Arte','Cerámica Íbera','Orfebrería','Mundo Funerario'][n-1]}</h3><a href="#virtual-tour">Explorar →</a></div></article>)}</div></section>
      <section id="virtual-tour" className="tour dark"><p className="kicker">Tour Virtual</p><h2>Recorre <em>nuestro museo.</em></h2><div className="tour-grid">{[1,2,3,4].map(n=><a key={n} href={n===1?'#contact':'#virtual-tour'} className="room"><img src={A+`tour-sala${n}.jpg`} alt=""/><span>Sala {n}</span></a>)}</div><a className="primary" href="#contact">Entrar en la experiencia →</a></section>
      <section id="contact" className="contact"><p className="kicker">Experiencia inmersiva</p><h2>El pasado<br/><em>cobra vida.</em></h2><p>Un museo digital para descubrir la historia íbera desde cualquier lugar.</p><a className="primary" href="#hero">Volver al inicio ↑</a></section>
    </main>
    <footer>LOS ÍBEROS · MUSEO ONLINE · Experiencia digital</footer>
  </div>
}
createRoot(document.getElementById('root')).render(<App/>);
