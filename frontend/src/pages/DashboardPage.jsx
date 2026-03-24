import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MetricCard, ActionBadge, YieldBadge } from '../components/UI'
import { getHealth } from '../api'
import { ACTION_META } from '../constants'

const SAMPLE = [
  { crop:'Rice',     action:'Irrigate',       confidence:91, yield_forecast:'High'   },
  { crop:'Wheat',    action:'Fertilize',       confidence:84, yield_forecast:'Medium' },
  { crop:'Maize',    action:'Optimal',         confidence:96, yield_forecast:'High'   },
  { crop:'Cotton',   action:'Apply Pesticide', confidence:78, yield_forecast:'Low'    },
]

export default function DashboardPage() {
  const [health, setHealth] = useState(null)
  useEffect(() => { getHealth().then(setHealth).catch(() => null) }, [])

  return (
    <div className="fade-in">
      <h1 style={{ fontSize:26, fontWeight:600, marginBottom:6 }}>Smart Crop Management</h1>
      <p style={{ color:'var(--text-secondary)', fontSize:14, maxWidth:560, marginBottom:28 }}>
        Real-time AI crop recommendations powered by WSN sensor data. Decision Tree ML.
      </p>

      {/* Health */}
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 16px', marginBottom:28,
        background: health?.ml_model_loaded ? 'rgba(45,210,120,0.08)' : 'rgba(224,82,82,0.08)',
        border:`1px solid ${health?.ml_model_loaded ? 'rgba(45,210,120,0.2)' : 'rgba(224,82,82,0.2)'}`,
        borderRadius:'var(--radius)', fontSize:13 }}>
        <span style={{ width:8, height:8, borderRadius:'50%', flexShrink:0,
          background: health?.ml_model_loaded ? 'var(--green)' : 'var(--red)' }}
          className={health ? '' : 'pulse'} />
        {health
          ? `Backend online · ${health.ml_model_loaded ? `ML model loaded · accuracy ${(health.model_accuracy*100).toFixed(1)}%` : 'Run train_model.py to load model'}`
          : 'Connecting to backend...'}
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:32 }}>
        <MetricCard label="Crops"        value="8"  unit="" color="var(--green)" />
        <MetricCard label="Sensor Inputs" value="7" unit="" color="var(--blue)"  />
        <MetricCard label="Model"        value="DT" unit="" color="var(--amber)" />
        <MetricCard label="Actions"      value="6"  unit="" color="#9b8cf5"      />
      </div>

      {/* Actions reference */}
      <div className="card" style={{ marginBottom:24 }}>
        <div style={{ fontSize:13, fontWeight:500, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:16 }}>Action Types</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
          {Object.entries(ACTION_META).map(([action, meta]) => (
            <div key={action} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', background:meta.bg, border:`1px solid ${meta.color}33`, borderRadius:8, fontSize:13 }}>
              <span>{meta.icon}</span>
              <span style={{ color:meta.color, fontWeight:500 }}>{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sample table */}
      <div className="card" style={{ marginBottom:24 }}>
        <div style={{ fontSize:13, fontWeight:500, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:16 }}>Sample Predictions</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Crop</th><th>Action</th><th>Confidence</th><th>Yield</th></tr></thead>
            <tbody>
              {SAMPLE.map((r,i) => (
                <tr key={i}>
                  <td style={{ color:'var(--text)', fontWeight:500 }}>{r.crop}</td>
                  <td><ActionBadge action={r.action} /></td>
                  <td style={{ fontFamily:'var(--mono)', color:'var(--green)' }}>{r.confidence}%</td>
                  <td><YieldBadge value={r.yield_forecast} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Link to="/predict"><button className="btn-primary">Run a Prediction →</button></Link>
    </div>
  )
}
