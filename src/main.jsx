import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowUpRight, Check, ChevronRight, Flame, Menu, Sparkles, X } from 'lucide-react'
import { supabase } from './supabase'
import './styles.css'

const pillars = [
  { id: 'intellectual', code: '01', name: 'Intelectual', icon: '◈', color: '#b8ff57', score: 78, verb: 'Compreender', task: 'Mapear uma ideia complexa', description: 'Ciências, humanidades e escola — transformar informação numa visão coerente do mundo.' },
  { id: 'financial', code: '02', name: 'Financeiro', icon: '↗', color: '#55f5d2', score: 62, verb: 'Construir', task: 'Um avanço na Nova Sinapse', description: 'Criar valor, sistemas e independência através de tecnologia e empreendedorismo.' },
  { id: 'physical', code: '03', name: 'Físico', icon: '△', color: '#ff795f', score: 71, verb: 'Mover', task: 'Treino + 15 min mobilidade', description: 'Força, resistência, mobilidade e saúde para sustentar todos os outros pilares.' },
  { id: 'creative', code: '04', name: 'Criativo', icon: '✦', color: '#d579ff', score: 54, verb: 'Criar', task: 'Produzir sem consumir primeiro', description: 'Música, imagem, escrita e performance — dar forma ao que ainda não existe.' },
  { id: 'social', code: '05', name: 'Social', icon: '◎', color: '#5da8ff', score: 46, verb: 'Conectar', task: 'Iniciar uma conversa genuína', description: 'Amizade, amor, colaboração e comunidade; o palco onde todos os pilares se encontram.' },
  { id: 'spiritual', code: '06', name: 'Espiritual', icon: '○', color: '#ffd66b', score: 69, verb: 'Refletir', task: '10 minutos de silêncio', description: 'Sentido, valores, presença e uma relação consciente com a própria vida.' },
  { id: 'entertainment', code: '07', name: 'Entretenimento', icon: '▶', color: '#ff70aa', score: 57, verb: 'Desfrutar', task: 'Escolher lazer intencional', description: 'Descanso, jogo e cultura que restauram energia sem capturar a atenção.' },
]

function Particles() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let frame, pointer = { x: innerWidth / 2, y: innerHeight / 2 }
    let dots = []
    const resize = () => {
      canvas.width = innerWidth * devicePixelRatio
      canvas.height = innerHeight * devicePixelRatio
      canvas.style.width = innerWidth + 'px'
      canvas.style.height = innerHeight + 'px'
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
      dots = Array.from({ length: Math.min(110, Math.floor(innerWidth / 12)) }, () => ({
        x: Math.random() * innerWidth, y: Math.random() * innerHeight,
        r: Math.random() * 1.5 + .2, v: Math.random() * .18 + .04, a: Math.random() * .6 + .15
      }))
    }
    const move = e => { pointer = { x: e.clientX, y: e.clientY } }
    const draw = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      dots.forEach((d, i) => {
        d.y -= d.v; if (d.y < -4) d.y = innerHeight + 4
        const dx = (pointer.x - innerWidth / 2) * (i % 3 + 1) * .0005
        ctx.beginPath(); ctx.arc(d.x + dx, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220,255,205,${d.a})`; ctx.fill()
      })
      frame = requestAnimationFrame(draw)
    }
    resize(); draw(); addEventListener('resize', resize); addEventListener('pointermove', move)
    return () => { cancelAnimationFrame(frame); removeEventListener('resize', resize); removeEventListener('pointermove', move) }
  }, [])
  return <canvas className="particles" ref={canvasRef} aria-hidden="true" />
}

function Orbit({ active, onSelect }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const move = e => {
    const r = e.currentTarget.getBoundingClientRect()
    setTilt({ x: ((e.clientY - r.top) / r.height - .5) * -10, y: ((e.clientX - r.left) / r.width - .5) * 10 })
  }
  return (
    <div className="orbit-stage" onPointerMove={move} onPointerLeave={() => setTilt({x:0,y:0})}>
      <div className="orbit" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
        <div className="core"><span>RENAISSANCE</span><b>LIFE OS</b><i /></div>
        {pillars.map((p, i) => {
          const angle = i * (360 / pillars.length) - 90
          return <button key={p.id} aria-label={p.name} className={`planet ${active.id === p.id ? 'active' : ''}`} style={{ '--angle': `${angle}deg`, '--color': p.color }} onClick={() => onSelect(p)}><span>{p.icon}</span><em>{p.name}</em></button>
        })}
      </div>
    </div>
  )
}

function App() {
  const [active, setActive] = useState(pillars[0])
  const [checked, setChecked] = useState(() => new Set(JSON.parse(localStorage.getItem('life-os-checks') || '[]')))
  const [menu, setMenu] = useState(false)
  const [saved, setSaved] = useState('local')
  const completed = checked.size
  const energy = Math.round(pillars.reduce((sum, p) => sum + p.score, 0) / pillars.length)

  useEffect(() => { localStorage.setItem('life-os-checks', JSON.stringify([...checked])) }, [checked])
  const mark = async p => {
    const next = new Set(checked); next.has(p.id) ? next.delete(p.id) : next.add(p.id); setChecked(next)
    if (supabase) {
      setSaved('saving')
      const { error } = await supabase.from('check_ins').insert({ pillar: p.id, completed: next.has(p.id), score: p.score })
      setSaved(error ? 'local' : 'cloud')
    }
  }

  return <main style={{ '--accent': active.color }}>
    <Particles />
    <div className="aurora a1" /><div className="aurora a2" />
    <nav>
      <a className="brand" href="#top"><span>R</span><div>RENAISSANCE<small>Personal operating system</small></div></a>
      <div className={`navlinks ${menu ? 'open' : ''}`}>
        <button onClick={() => setMenu(false)}>Hoje</button><button onClick={() => setMenu(false)}>Pilares</button><button onClick={() => setMenu(false)}>Visão</button>
      </div>
      <div className="nav-status"><i /> {saved === 'cloud' ? 'Supabase sincronizado' : saved === 'saving' ? 'A sincronizar' : 'Modo local'}</div>
      <button className="menu" onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
    </nav>

    <section className="hero" id="top">
      <div className="hero-copy">
        <div className="eyebrow"><Sparkles size={14}/> SISTEMA PESSOAL · 16 JUL 2026</div>
        <h1>Não administres<br/>tarefas. <em>Orquestra</em><br/>uma vida.</h1>
        <p>Sete pilares. Uma direção. Um sistema vivo para te tornares quem és capaz de ser.</p>
        <div className="metrics">
          <div><b>{energy}<sup>%</sup></b><span>Índice vital</span></div>
          <div><b>{completed}<sup>/7</sup></b><span>Rituais hoje</span></div>
          <div><b>07</b><span>Pilares ativos</span></div>
        </div>
      </div>
      <Orbit active={active} onSelect={setActive}/>
    </section>

    <section className="focus-panel">
      <div className="focus-number">{active.code}</div>
      <div className="focus-copy">
        <span style={{color: active.color}}>{active.icon} PILAR EM FOCO</span>
        <h2>{active.name}</h2><p>{active.description}</p>
      </div>
      <div className="focus-score"><div className="ring" style={{'--score': `${active.score * 3.6}deg`}}><b>{active.score}</b><small>%</small></div><span>Momentum</span></div>
      <button className={`ritual ${checked.has(active.id) ? 'done' : ''}`} onClick={() => mark(active)}>
        <span><small>RITUAL DE HOJE · {active.verb}</small>{active.task}</span>{checked.has(active.id) ? <Check/> : <ChevronRight/>}
      </button>
    </section>

    <section className="pillars-section" id="pillars">
      <header><div><span>O TEU ECOSSISTEMA</span><h2>Sete forças.<br/>Uma identidade.</h2></div><p>Cada pilar alimenta os restantes. O objetivo não é equilíbrio perfeito — é integração consciente.</p></header>
      <div className="pillar-grid">
        {pillars.map((p, i) => <article key={p.id} onClick={() => setActive(p)} style={{'--card': p.color, '--delay': `${i * 70}ms`}}>
          <div className="card-top"><span>{p.code}</span><i>{p.icon}</i></div><h3>{p.name}</h3><p>{p.description}</p>
          <footer><div><span style={{width: `${p.score}%`}} /></div><b>{p.score}%</b><ArrowUpRight/></footer>
        </article>)}
      </div>
    </section>

    <section className="manifesto">
      <Flame/><p>“Uma vida extraordinária não é encontrada.<br/><em>É desenhada, praticada e vivida.</em>”</p><span>O PRINCÍPIO RENAISSANCE</span>
    </section>
    <footer className="page-footer"><span>RENAISSANCE LIFE OS</span><small>CONCEBIDO PARA TOMÁS · 2026</small><b>∞</b></footer>
  </main>
}

createRoot(document.getElementById('root')).render(<App />)
