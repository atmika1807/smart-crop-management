import { NavLink } from 'react-router-dom'

const NAV = [
  { to:'/',        icon:'🌾', label:'Dashboard'  },
  { to:'/predict', icon:'🤖', label:'Predict'    },
  { to:'/trends',  icon:'📈', label:'Trends'     },
  { to:'/history', icon:'🗂️', label:'History'    },
  { to:'/metrics', icon:'📊', label:'Model Info' },
]

export default function Sidebar() {
  return (
    <aside style={{ width:220, minHeight:'100vh', background:'var(--bg-card)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', padding:'24px 0', flexShrink:0 }}>
      <div style={{ padding:'0 20px 28px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, background:'var(--green-glow)', border:'1px solid var(--green-dim)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🌿</div>
          <div>
            <div style={{ fontSize:15, fontWeight:600, color:'var(--text)', lineHeight:1.2 }}>CropAI</div>
            <div style={{ fontSize:10, color:'var(--text-muted)', letterSpacing:'0.04em' }}>WSN · IEEE ICCCNT</div>
          </div>
        </div>
      </div>
      <nav style={{ flex:1, padding:'0 10px' }}>
        {NAV.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} end={to==='/'} style={({ isActive }) => ({
            display:'flex', alignItems:'center', gap:10,
            padding:'9px 12px', borderRadius:8, marginBottom:3,
            textDecoration:'none', fontSize:14,
            fontWeight: isActive ? 500 : 400,
            color: isActive ? 'var(--green)' : 'var(--text-secondary)',
            background: isActive ? 'var(--green-glow)' : 'transparent',
            transition:'all 0.15s',
          })}>
            <span style={{ fontSize:16, width:20, textAlign:'center' }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
      <div style={{ padding:'16px 20px', borderTop:'1px solid var(--border)' }}>
        <div style={{ fontSize:11, color:'var(--text-muted)', lineHeight:1.6 }}>
          Decision Tree + Claude AI<br />
          <span style={{ color:'var(--green-dim)' }}>IEEE ICCCNT 2023</span>
        </div>
      </div>
    </aside>
  )
}
