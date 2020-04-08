const micromatch = require('micromatch')
module.exports = {
  '*.{ts,tsx}': files => {
    const match = micromatch.not(files, '**/__tests__/*.{ts,tsx}')
    return match.map(file => 'npm run lint')
  }
}

