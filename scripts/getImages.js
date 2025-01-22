const { readdirSync, writeFileSync } = require('node:fs')

// NOTE: ran from root project dir

const paths = []

console.log('reading exercise image directories')

for (const dir of readdirSync('assets/images/exercises').filter(
  dir => !dir.startsWith('.')
)) {
  const files = readdirSync(`assets/images/exercises/${dir}`)
  files.forEach(f => {
    paths.push(`${dir}/${f}`)
  })
}

const fileContents = `
export const exerciseImages = {
    ${paths.map(p => `"${p.replace('.webp', '').replace('.avif', '')}" : require("../../assets/images/exercises/${p}")`).join(',\n')}
}
`
console.log('writing exercise image file in progress...')

writeFileSync('app/utils/exerciseImages.ts', fileContents)

console.log('writing exercise image file done')
