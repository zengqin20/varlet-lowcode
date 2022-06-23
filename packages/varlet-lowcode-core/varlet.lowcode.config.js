const { ensureDirSync, copySync } = require('fs-extra')

const destPaths = ['../varlet-lowcode-designer/public', '../varlet-lowcode-skeleton/public']

module.exports = {
  name: 'varlet-lowcode-core',
  plugins: [
    {
      name: 'copy-plugin',
      apply: 'build',
      closeBundle() {
        if (process.env.COMMAND === 'compile') {
          destPaths.forEach((destPath) => {
            ensureDirSync(destPath)
            copySync('lib/varlet-lowcode-core.umd.js', `${destPath}/varlet-lowcode-core.umd.js`)
          })
        }
      },
    },
  ],
}