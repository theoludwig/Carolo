import fs from 'node:fs'

import { updateRelativePaths, srcURL } from './utils.js'

const watcher = fs.promises.watch(srcURL)

for await (const event of watcher) {
  if (event.eventType === 'change') {
    await updateRelativePaths()
  }
}
