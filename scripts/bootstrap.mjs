import { buildCli, buildCore, buildDnd, buildDesigner, buildProfile, buildRenderer, runTask } from './build.mjs'

await runTask('cli', buildCli)
await runTask('core', buildCore)
await runTask('dnd', buildDnd)
await runTask('designer', buildDesigner)
await runTask('profile', buildProfile)
await runTask('renderer', buildRenderer)
