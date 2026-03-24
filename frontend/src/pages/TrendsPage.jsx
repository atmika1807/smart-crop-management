import { useState, useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { genHistorySeries } from '../constants'

const SERIES = [
  { key:'moisture', label:'Soil Moisture (%)', color:'#4da8f5' },
  { key:'temp',     label:'Temperature (°C)',  color:'#e05252' },
  { key:'humidity', label:'Humidity (%)',       color:'#2dd278' },
  { key:'nitrogen', label:'Nitrogen (mg/kg)',   color:'#f0a827' },
]
const TT = { background:'var(--bg-card)', border:'1px solid var(--border-strong)', borderRadius:8, fontSize:12, color:'var(--text)' }

export default function TrendsPage() {
  const [data, setData]   = useState(genHistorySeries(25))
  const [live, setLive]   = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    if (live) {
      timer.current = setInterval(() => {
        setData(prev => {
          const last = prev[prev.length-1]
          const idx  = parseInt(last.t.replace('T-',''))
          return [...prev.slice(-39), {
            t: `T-${idx+1}`,
            moisture: Math.round(Math.max(15, Math.min(95, last.moisture + (Math.random()-0.48)*6))),
            temp:     parseFloat(Math.max(10, Math.min(45, last.temp + (Math.random()-0.48)*2)).toFixed(1)),
            humidity: Math.round(Math.max(20, Math.min(95, last.humidity + (Math.random()-0.48)*5))),
            nitrogen: Math.round(Math.max(5, Math.min(135, last.nitrogen + (Math.random()-0.48)*4))),
          }]
        })
      }, 1500)
    } else { clearInterval(timer.current) }
    return () => clearInterval(timer.current)
  }, [live])

  return (
    <div className="fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:600, marginBottom:4 }}>Sensor Trends</h1>
          <p style={{ color:'var(--text-secondary)', fontSize:14 }}>Simulated WSN time-series feed</p>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          {live && <span className="pulse" style={{ width:8, height:8, borderRadius:'50%', background:'var(--green)', display:'inline-block' }} />}
          <button className={live ? 'btn-primary' : 'btn-secondary'} onClick={() => setLive(l => !l)} style={{ fontSize:13 }}>
            {live ? '⏹ Stop' : '▶ Live Feed'}
          </button>
          <button className="btn-secondary" onClick={() => setData(genHistorySeries(25))} style={{ fontSize:13 }}>Reset</button>
        </div>
      </div>

      <div style={{ display:'flex', flexWrap:'wrap', gap:16, marginBottom:20 }}>
        {SERIES.map(s => (
          <span key={s.key} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--text-secondary)' }}>
            <span style={{ width:10, height:10, borderRadius:2, background:s.color }} />{s.label}
          </span>
        ))}
      </div>

      <div className="card" style={{ marginBottom:20 }}>
        <div style={{ fontSize:12, fontWeight:500, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:16 }}>All Sensors</div>
        <div style={{ height:260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="t" tick={{ fontSize:10, fill:'#4a7055' }} interval={4} />
              <YAxis tick={{ fontSize:10, fill:'#4a7055' }} />
              <Tooltip contentStyle={TT} />
              {SERIES.map(s => <Line key={s.key} type="monotone" dataKey={s.key} stroke={s.color} strokeWidth={1.5} dot={false} />)}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {SERIES.map(s => (
          <div key={s.key} className="card">
            <div style={{ fontSize:12, color:s.color, fontWeight:500, marginBottom:12 }}>{s.label}</div>
            <div style={{ height:140 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.slice(-15)} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="t" tick={{ fontSize:9, fill:'#4a7055' }} interval={4} />
                  <YAxis tick={{ fontSize:9, fill:'#4a7055' }} width={30} />
                  <Tooltip contentStyle={TT} />
                  <Bar dataKey={s.key} fill={s.color} opacity={0.7} radius={[2,2,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
