module.exports = {
  name: 'varlet-lowcode-code-editor',

  configureVite(command, config) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
