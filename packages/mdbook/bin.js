#!/usr/bin/env node
import fs from 'node:fs'
import childProcess from 'node:child_process'

import { install, binaryURL, error } from './utils.js'

if (!fs.existsSync(binaryURL)) {
  await install()
}

const [, , ...args] = process.argv
const result = childProcess.spawnSync(binaryURL.pathname, args, {
  stdio: 'inherit',
  cwd: process.cwd()
})
if (result.error) {
  error(result.error)
}
process.exit(result.status)
