import os from 'node:os'
import fs from 'node:fs'
import stream from 'node:stream'

import axios from 'axios'
import tar from 'tar'
import extractZip from 'extract-zip'

export const error = (message) => {
  console.error(message)
  process.exit(1)
}

export const BINARY_NAME = 'mdbook'
const VERSION = '0.4.25'
const REPOSITORY_URL = 'https://github.com/rust-lang/mdBook'

const supportedPlatforms = [
  {
    TYPE: 'Windows_NT',
    ARCHITECTURE: 'x64',
    RUST_TARGET: 'x86_64-pc-windows-msvc.zip',
    BINARY_NAME: `${BINARY_NAME}.exe`
  },
  {
    TYPE: 'Linux',
    ARCHITECTURE: 'x64',
    RUST_TARGET: 'x86_64-unknown-linux-gnu.tar.gz',
    BINARY_NAME
  },
  {
    TYPE: 'Darwin',
    ARCHITECTURE: 'x64',
    RUST_TARGET: 'x86_64-apple-darwin.tar.gz',
    BINARY_NAME
  }
]

const getPlatformMetadata = () => {
  const type = os.type()
  const architecture = os.arch()

  for (const supportedPlatform of supportedPlatforms) {
    if (
      type === supportedPlatform.TYPE &&
      architecture === supportedPlatform.ARCHITECTURE
    ) {
      return supportedPlatform
    }
  }

  error(
    `Platform with type "${type}" and architecture "${architecture}" is not supported.`
  )
}

export const platformMetadata = getPlatformMetadata()

export const downloadURL = `${REPOSITORY_URL}/releases/download/v${VERSION}/${BINARY_NAME}-v${VERSION}-${platformMetadata.RUST_TARGET}`

export const binaryURL = new URL(
  `./bin/${platformMetadata.BINARY_NAME}`,
  import.meta.url
)

export const install = async () => {
  if (fs.existsSync(binaryURL)) {
    console.log(`'${BINARY_NAME}' already exists, skipping installation.`)
    return
  }

  const archivePath = new URL('./mdbook.archive', import.meta.url)
  const archiveWriter = fs.createWriteStream(archivePath.pathname)
  const { data } = await axios.get(downloadURL, {
    responseType: 'stream'
  })
  data.pipe(archiveWriter)
  await stream.promises.finished(archiveWriter)

  const cwd = new URL('./bin', import.meta.url).pathname
  await fs.promises.mkdir(cwd, { recursive: true })
  if (platformMetadata.RUST_TARGET.endsWith('.zip')) {
    await extractZip(archivePath.pathname, {
      dir: cwd
    })
  } else {
    await tar.x({
      file: archivePath.pathname,
      cwd
    })
  }
  await fs.promises.rm(archivePath, { force: true })
  console.log(`Installed '${BINARY_NAME}' successfully.`)
}
