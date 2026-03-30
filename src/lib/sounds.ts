let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.15) {
  try {
    const c = getCtx()
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, c.currentTime)
    gain.gain.setValueAtTime(vol, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)
    osc.connect(gain)
    gain.connect(c.destination)
    osc.start(c.currentTime)
    osc.stop(c.currentTime + duration)
  } catch { /* AudioContext not available */ }
}

function playNoise(duration: number, vol = 0.08) {
  try {
    const c = getCtx()
    const bufferSize = c.sampleRate * duration
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5
    const source = c.createBufferSource()
    source.buffer = buffer
    const gain = c.createGain()
    gain.gain.setValueAtTime(vol, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)
    source.connect(gain)
    gain.connect(c.destination)
    source.start()
  } catch { /* */ }
}

export function playEnhanceStart() {
  playTone(440, 0.15, 'sine', 0.08)
  setTimeout(() => playTone(554, 0.15, 'sine', 0.08), 80)
  setTimeout(() => playTone(659, 0.2, 'sine', 0.1), 160)
}

export function playSuccess() {
  playTone(523, 0.12, 'sine', 0.12)
  setTimeout(() => playTone(659, 0.12, 'sine', 0.14), 100)
  setTimeout(() => playTone(784, 0.15, 'sine', 0.16), 200)
  setTimeout(() => playTone(1047, 0.4, 'sine', 0.18), 300)
}

export function playMaintain() {
  playTone(330, 0.2, 'triangle', 0.08)
  setTimeout(() => playTone(294, 0.3, 'triangle', 0.06), 150)
}

export function playDestroy() {
  playNoise(0.3, 0.12)
  playTone(200, 0.1, 'sawtooth', 0.1)
  setTimeout(() => playTone(150, 0.15, 'sawtooth', 0.08), 100)
  setTimeout(() => playTone(80, 0.4, 'sawtooth', 0.06), 200)
  setTimeout(() => playNoise(0.2, 0.06), 250)
}

export function playCheckIn() {
  playTone(523, 0.1, 'sine', 0.1)
  setTimeout(() => playTone(659, 0.1, 'sine', 0.1), 80)
  setTimeout(() => playTone(784, 0.2, 'sine', 0.12), 160)
}

export function playBuy() {
  playTone(880, 0.08, 'sine', 0.08)
  setTimeout(() => playTone(1100, 0.12, 'sine', 0.1), 60)
}

export function playAchievement() {
  const notes = [523, 659, 784, 1047, 784, 1047]
  notes.forEach((f, i) => setTimeout(() => playTone(f, 0.15, 'sine', 0.12), i * 80))
}

export function playClick() {
  playTone(800, 0.04, 'sine', 0.05)
}
