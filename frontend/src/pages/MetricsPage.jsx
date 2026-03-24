import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { MetricCard, Spinner } from '../components/UI'
import { getMetrics } from '../api'

const TT = { background:'var(--bg-card)', border:'1px solid var(--border-strong)', borderRadius:8, fontSize:12, color:'var(--text)' }

export default function MetricsPage() {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    getMetrics().then(setMetrics).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (error)   return (
    <div className="fade-in card" style={{ borderColor:'rgba(224,82,82,0.3)', background:'rgba(224,82,82,0.06)' }}>
      <div style={{ color:'var(--red)' }}>⚠ {error}</div>
      <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:6 }}>Make sure the backend is running and the model is trained.</div>
    </div>
  )

  const fiData = Object.entries(metrics.feature_importance||{})
    .sort((a,b)=>b[1]-a[1])
    .map(([name,value]) => ({ name:name.replace('_',' '), value:parseFloat((value*100).toFixed(1)) }))

  const classRows = Object.entries(metrics.classification_report||{})
    .filter(([k]) => !['accuracy','macro avg','weighted avg'].includes(k))

  return (
    <div className="fade-in">
      <h1 style={{ fontSize:22, fontWeight:600, marginBottom:6 }}>Model Info</h1>
      <p style={{ color:'var(--text-secondary)', fontSize:14, marginBottom:28 }}>Decision Tree — trained on synthetic WSN sensor data</p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:24 }}>
        <MetricCard label="Test Accuracy" value={(metrics.test_accuracy*100).toFixed(1)} unit="%" color="var(--green)" />
        <MetricCard label="CV Accuracy"   value={(metrics.cv_accuracy_mean*100).toFixed(1)} unit="%" color="var(--blue)" sub={`± ${(metrics.cv_accuracy_std*100).toFixed(1)}%`} />
        <MetricCard label="Classes"       value={metrics.classes?.length||6} unit="" color="var(--amber)" />
      </div>

      <div className="card" style={{ marginBottom:20 }}>
        <div style={{ fontSize:12, fontWeight:500, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:16 }}>Feature Importance</div>
        <div style={{ height:200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fiData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis type="number" tick={{ fontSize:10, fill:'#4a7055' }} unit="%" />
              <YAxis dataKey="name" type="category" tick={{ fontSize:11, fill:'#7aab8a' }} width={90} />
              <Tooltip contentStyle={TT} formatter={v=>[`${v}%`,'Importance']} />
              <Bar dataKey="value" fill="#2dd278" opacity={0.8} radius={[0,3,3,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize:12, fontWeight:500, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:16 }}>Per-Class Metrics</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Action</th><th>Precision</th><th>Recall</th><th>F1-Score</th><th>Support</th></tr></thead>
            <tbody>
              {classRows.map(([cls,v]) => (
                <tr key={cls}>
                  <td style={{ color:'var(--text)', fontWeight:500 }}>{cls}</td>
                  <td style={{ fontFamily:'var(--mono)', color:'var(--blue)' }}>{(v.precision*100).toFixed(1)}%</td>
                  <td style={{ fontFamily:'var(--mono)', color:'var(--amber)' }}>{(v.recall*100).toFixed(1)}%</td>
                  <td style={{ fontFamily:'var(--mono)', color:'var(--green)' }}>{(v['f1-score']*100).toFixed(1)}%</td>
                  <td style={{ fontFamily:'var(--mono)' }}>{v.support}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
