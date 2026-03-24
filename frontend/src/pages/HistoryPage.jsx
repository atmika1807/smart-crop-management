import { ActionBadge, YieldBadge, EmptyState } from '../components/UI'

export default function HistoryPage({ history }) {
  if (!history?.length) return (
    <div className="fade-in">
      <h1 style={{ fontSize:22, fontWeight:600, marginBottom:28 }}>Prediction History</h1>
      <EmptyState icon="🗂️" message="No predictions yet. Head to Predict to run your first analysis." />
    </div>
  )

  return (
    <div className="fade-in">
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:22, fontWeight:600, marginBottom:4 }}>Prediction History</h1>
        <p style={{ color:'var(--text-secondary)', fontSize:14 }}>{history.length} prediction{history.length!==1?'s':''} this session</p>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Time</th><th>Crop</th><th>Action</th><th>Confidence</th><th>Yield</th><th>Moisture</th><th>Temp</th><th>AI?</th></tr>
            </thead>
            <tbody>
              {history.map((h,i) => (
                <tr key={i}>
                  <td style={{ fontFamily:'var(--mono)', fontSize:12 }}>{h.ts}</td>
                  <td style={{ color:'var(--text)', fontWeight:500 }}>{h.crop}</td>
                  <td><ActionBadge action={h.ml.action} /></td>
                  <td style={{ fontFamily:'var(--mono)', color:'var(--green)' }}>{h.ml.confidence}%</td>
                  <td>{h.ai ? <YieldBadge value={h.ai.yield_forecast} /> : <span style={{ color:'var(--text-muted)', fontSize:12 }}>—</span>}</td>
                  <td style={{ fontFamily:'var(--mono)', fontSize:12 }}>{h.sensors.soil_moisture}%</td>
                  <td style={{ fontFamily:'var(--mono)', fontSize:12 }}>{h.sensors.temperature}°C</td>
                  <td style={{ fontSize:11, color: h.ai ? 'var(--green)' : 'var(--text-muted)' }}>{h.ai ? '✓ Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
