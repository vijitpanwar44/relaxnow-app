import sharp from 'sharp'
import { readdirSync } from 'fs'
import { join } from 'path'

const dir = 'public/images'
const files = readdirSync(dir).filter(f => f.endsWith('.jpg'))

for (const f of files) {
  const { width, height } = await sharp(join(dir, f)).metadata()
  console.log(`${f}: ${width}x${height}  ratio: ${(height/width).toFixed(2)}`)
}
