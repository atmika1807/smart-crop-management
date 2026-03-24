export const CROPS = ['Rice','Wheat','Maize','Cotton','Sugarcane','Soybean','Potato','Tomato']

export const SENSOR_CONFIG = {
  soil_moisture: { label:'Soil Moisture',  unit:'%',     min:0,   max:100, step:1   },
  temperature:   { label:'Temperature',    unit:'°C',    min:5,   max:55,  step:0.5 },
  humidity:      { label:'Humidity',       unit:'%',     min:10,  max:100, step:1   },
  nitrogen:      { label:'Nitrogen (N)',   unit:'mg/kg', min:0,   max:140, step:1   },
  phosphorus:    { label:'Phosphorus (P)', unit:'mg/kg', min:0,   max:100, step:1   },
  potassium:     { label:'Potassium (K)',  unit:'mg/kg', min:0,   max:200, step:1   },
  ph:            { label:'Soil pH',        unit:'',      min:4.0, max:9.0, step:0.1 },
}

export const DEFAULT_SENSORS = {
  soil_moisture:50, temperature:27, humidity:65,
  nitrogen:65, phosphorus:40, potassium:80, ph:6.5,
}

export const ACTION_META = {
  'Irrigate':        { color:'#4da8f5', bg:'rgba(77,168,245,0.12)',  icon:'💧' },
  'Fertilize':       { color:'#f0a827', bg:'rgba(240,168,39,0.12)',  icon:'🌱' },
  'Harvest':         { color:'#2dd278', bg:'rgba(45,210,120,0.12)',  icon:'🌾' },
  'Monitor':         { color:'#9b8cf5', bg:'rgba(155,140,245,0.12)', icon:'📡' },
  'Apply Pesticide': { color:'#e05252', bg:'rgba(224,82,82,0.12)',   icon:'🛡️' },
  'Optimal':         { color:'#2dd278', bg:'rgba(45,210,120,0.18)',  icon:'✅' },
}

export const YIELD_COLOR = { Low:'#e05252', Medium:'#f0a827', High:'#2dd278' }

export function randomizeSensors() {
  return {
    soil_moisture: Math.round(15 + Math.random()*75),
    temperature:   parseFloat((12 + Math.random()*35).toFixed(1)),
    humidity:      Math.round(20 + Math.random()*75),
    nitrogen:      Math.round(5  + Math.random()*130),
    phosphorus:    Math.round(5  + Math.random()*90),
    potassium:     Math.round(15 + Math.random()*175),
    ph:            parseFloat((4.2 + Math.random()*4.5).toFixed(1)),
  }
}

export function genHistorySeries(count=25) {
  return Array.from({length:count}, (_,i) => ({
    t: `T-${count-i}`,
    moisture: Math.round(30 + Math.random()*45),
    temp:     Math.round(18 + Math.random()*18),
    humidity: Math.round(45 + Math.random()*40),
    nitrogen: Math.round(40 + Math.random()*70),
  }))
}
