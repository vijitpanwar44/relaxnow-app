import sharp from 'sharp'
import { readdirSync, renameSync, unlinkSync } from 'fs'
import { join } from 'path'

const dir = 'public/images'
const files = readdirSync(dir).filter(f => f.endsWith('.jpg') && !f.startsWith('_tmp_'))

for (const f of files) {
  const src = join(dir, f)
  const tmp = join(dir, '_tmp_' + f)
  const meta = await sharp(src).metadata()

  // Already clean square crops — skip
  if (meta.width === meta.height) {
    console.log(`${f}: already square, skipping`)
    continue
  }

  // iPhone browser screenshot: 739x1600
  // Browser chrome top (status bar + address bar) ≈ 135px
  // Face image is a ~739x739 square from thispersondoesnotexist.com
  // Crop from y=135, height=760 to get face + slight neck padding
  const cropTop = 135
  const cropHeight = 760

  await sharp(src)
    .extract({ left: 0, top: cropTop, width: meta.width, height: cropHeight })
    .jpeg({ quality: 92 })
    .toFile(tmp)

  unlinkSync(src)
  renameSync(tmp, src)

  const after = await sharp(src).metadata()
  console.log(`${f}: ${meta.width}x${meta.height} → ${after.width}x${after.height}`)
}

console.log('Done.')
