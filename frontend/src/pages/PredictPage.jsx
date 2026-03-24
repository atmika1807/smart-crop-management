import { useState } from 'react'
import { SensorSlider, ActionBadge, YieldBadge, ConfidenceBar, Spinner, EmptyState } from '../components/UI'
import { predict } from '../api'
import { CROPS, SENSOR_CONFIG, DEFAULT_SENSORS, ACTION_META, randomizeSensors } from '../constants'

export default function PredictPage({ onPrediction }) {
  const [crop, setCrop]       = useState('Rice')
  const [sensors, setSensors] = useState({ ...DEFAULT_SENSORS })
  const [apiKey, setApiKey]   = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)
  const [error, setError]     = useState(null)

  const update = (k, v) => setSensors(s => ({ ...s, [k]: v }))

  const run = async () => {
    setLoading(true); setError(null); setResult(null)
    try {
      const res = await predict({ crop, ...sensors, anthropic_api_key: apiKey || undefined })
      setResult(res)
      onPrediction?.({ ...res, ts: new Date().toLocaleTimeString() })
    } catch (e) { setError(e.message) }
    setLoading(false)
  }

  const mlMeta = result ? (ACTION_META[result.ml.action] || {}) : {}

  return (
    <div className="fade-in">
      <h1 style={{ fontSize:22, fontWeight:600, marginBottom:6 }}>Predict</h1>
      <p style={{ color:'var(--text-secondary)', fontSize:14, marginBottom:28 }}>
        Enter sensor readings to get a Decision Tree prediction + Claude AI explanation.
      </p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
        {/* Left — inputs */}
        <div>
          <div className="card" style={{ marginBottom:16 }}>
            <div style={{ fontSize:12, fontWeight:500, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:12 }}>Crop</div>
            <select value={crop} onChange={e => setCrop(e.target.value)} style={{ width:'100%' }}>
              {CROPS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="card" style={{ marginBottom:16 }}>
            <div style={{ fontSize:12, fontWeight:500, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:14 }}>Environmental</div>
            {['soil_moisture','temperature','humidity','ph'].map(k => (
              <SensorSlider key={k} id={k} config={SENSOR_CONFIG[k]} value={sensors[k]} onChange={v => update(k,v)} />
            ))}
          </div>

          <div className="card" style={{ marginBottom:16 }}>
            <div style={{ fontSize:12, fontWeight:500, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:14 }}>Nutrients (N-P-K)</div>
            {['nitrogen','phosphorus','potassium'].map(k => (
              <SensorSlider key={k} id={k} config={SENSOR_CONFIG[k]} value={sensors[k]} onChange={v => update(k,v)} />
            ))}
          </div>

          <div className="card" style={{ marginBottom:16 }}>
            <div style={{ fontSize:12, fontWeight:500, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>Anthropic API Key <span style={{ color:'var(--text-muted)', fontWeight:400, textTransform:'none' }}>(optional)</span></div>
            <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:10 }}>Enables Claude AI explanation alongside the ML prediction.</div>
            <input type="password" placeholder="sk-ant-..." value={apiKey} onChange={e => setApiKey(e.target.value)} />
          </div>

          <div style={{ display:'flex', gap:10 }}>
            <button className="btn-secondary" onClick={() => setSensors(randomizeSensors())}>⟳ Randomize</button>
            <button className="btn-primary" style={{ flex:1 }} onClick={run} disabled={loading}>
              {loading ? 'Analyzing...' : 'Run Analysis →'}
            </button>
          </div>
        </div>

        {/* Right — results */}
        <div>
          {loading && <Spinner />}

          {error && (
            <div className="card fade-in" style={{ borderColor:'rgba(224,82,82,0.3)', background:'rgba(224,82,82,0.06)' }}>
              <div style={{ color:'var(--red)', fontSize:14 }}>⚠ {error}</div>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:6 }}>
                Make sure the backend is running: <code style={{ fontFamily:'var(--mono)' }}>uvicorn app:app --reload</code>
              </div>
            </div>
          )}

          {!loading && !error && !result && <EmptyState icon="📡" message="Adjust sensors and click Run Analysis" />}

          {!loading && result && (
            <div className="fade-in" style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {/* ML result */}
              <div className="card" style={{ border:`1px solid ${mlMeta.color||'var(--green)'}44` }}>
                <div style={{ fontSize:12, fontWeight:500, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:12 }}>Decision Tree Prediction</div>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14, flexWrap:'wrap' }}>
                  <ActionBadge action={result.ml.action} />
                  <span style={{ fontFamily:'var(--mono)', fontSize:20, fontWeight:600, color:mlMeta.color||'var(--green)' }}>{result.ml.confidence}%</span>
                  <span style={{ fontSize:13, color:'var(--text-muted)' }}>confidence</span>
                </div>
                <ConfidenceBar value={result.ml.confidence} color={mlMeta.color} />

                <div style={{ marginTop:16 }}>
                  <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>All probabilities</div>
                  {Object.entries(result.ml.probabilities).sort((a,b)=>b[1]-a[1]).map(([action, prob]) => (
                    <div key={action} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
                      <span style={{ fontSize:12, color:'var(--text-secondary)', width:130, flexShrink:0 }}>{action}</span>
                      <div style={{ flex:1, height:4, background:'var(--bg-surface)', borderRadius:2 }}>
                        <div style={{ height:'100%', width:`${prob}%`, background:ACTION_META[action]?.color||'var(--text-muted)', borderRadius:2, transition:'width 0.5s' }} />
                      </div>
                      <span style={{ fontSize:11, color:'var(--text-muted)', width:36, textAlign:'right', fontFamily:'var(--mono)' }}>{prob}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI result */}
              {result.ai && (
                <div className="card fade-in">
                  <div style={{ fontSize:12, fontWeight:500, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:12 }}>Claude AI Explanation</div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                    <YieldBadge value={result.ai.yield_forecast} />
                    <span style={{ fontSize:12, color:'var(--text-muted)' }}>Check-in: {result.ai.next_check_in}</span>
                  </div>
                  <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.7, marginBottom:16 }}>{result.ai.summary}</p>

                  {result.ai.alerts?.length > 0 && (
                    <div style={{ background:'rgba(224,82,82,0.08)', border:'1px solid rgba(224,82,82,0.2)', borderRadius:8, padding:'10px 14px', marginBottom:14 }}>
                      {result.ai.alerts.map((a,i) => (
                        <div key={i} style={{ fontSize:13, color:'var(--red)', display:'flex', gap:6 }}><span>⚠</span><span>{a}</span></div>
                      ))}
                    </div>
                  )}

                  <div style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:10 }}>Recommendations</div>
                  {result.ai.recommendations.map((r,i) => (
                    <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:8 }}>
                      <span style={{ width:20, height:20, borderRadius:'50%', background:'var(--bg-surface)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:600, flexShrink:0, color:'var(--green)', border:'1px solid var(--green-dim)' }}>{i+1}</span>
                      <span style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.5 }}>{r}</span>
                    </div>
                  ))}
                </div>
              )}

              {!result.ai && (
                <div style={{ fontSize:12, color:'var(--text-muted)', padding:'0 4px' }}>
                  Add an Anthropic API key above to get Claude AI explanation.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
