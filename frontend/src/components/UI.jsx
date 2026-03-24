import { ACTION_META, YIELD_COLOR } from '../constants'

export function ActionBadge({ action }) {
  const m = ACTION_META[action] || { color:'#7aab8a', bg:'rgba(122,171,138,0.12)', icon:'•' }
  return (
    <span className="badge" style={{ background:m.bg, color:m.color, border:`1px solid ${m.color}33` }}>
      <span style={{ marginRight:5, fontSize:13 }}>{m.icon}</span>{action}
    </span>
  )
}

export function YieldBadge({ value }) {
  const c = YIELD_COLOR[value] || '#7aab8a'
  return (
    <span className="badge" style={{ background:`${c}18`, color:c, border:`1px solid ${c}33` }}>
      {value} Yield
    </span>
  )
}

export function MetricCard({ label, value, unit, color, sub }) {
  return (
    <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'12px 16px' }}>
      <div style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:4 }}>{label}</div>
      <div style={{ fontSize:22, fontWeight:600, color:color||'var(--text)', lineHeight:1.2, fontFamily:'var(--mono)' }}>
        {value}<span style={{ fontSize:12, fontWeight:400, marginLeft:3, color:'var(--text-muted)' }}>{unit}</span>
      </div>
      {sub && <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{sub}</div>}
    </div>
  )
}

export function SensorSlider({ id, config, value, onChange }) {
  const pct = ((value - config.min) / (config.max - config.min)) * 100
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
        <label htmlFor={id} style={{ fontSize:13, color:'var(--text-secondary)' }}>{config.label}</label>
        <span style={{ fontSize:13, fontWeight:500, color:'var(--green)', fontFamily:'var(--mono)' }}>{value}{config.unit}</span>
      </div>
      <input id={id} type="range" min={config.min} max={config.max} step={config.step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ background:`linear-gradient(to right, var(--green-dim) 0%, var(--green) ${pct}%, var(--bg-surface) ${pct}%)` }}
      />
    </div>
  )
}

export function Spinner() {
  return (
    <div style={{ display:'flex', justifyContent:'center', padding:'3rem 0' }}>
      <div className="spin" style={{ width:32, height:32, border:'2px solid var(--border)', borderTop:'2px solid var(--green)', borderRadius:'50%' }} />
    </div>
  )
}

export function ConfidenceBar({ value, color }) {
  return (
    <div style={{ height:5, background:'var(--bg-surface)', borderRadius:3, overflow:'hidden' }}>
      <div style={{ height:'100%', width:`${value}%`, background:color||'var(--green)', borderRadius:3, transition:'width 0.6s ease', boxShadow:`0 0 8px ${color||'var(--green)'}55` }} />
    </div>
  )
}

export function EmptyState({ icon, message }) {
  return (
    <div style={{ textAlign:'center', padding:'4rem 0', color:'var(--text-muted)' }}>
      <div style={{ fontSize:40, marginBottom:12 }}>{icon}</div>
      <div style={{ fontSize:14 }}>{message}</div>
    </div>
  )
}
