import fs from 'node:fs'

export const rulesURL = new URL(
  '../../apps/website/public/rules/',
  import.meta.url
)

export const srcURL = new URL('./src/', import.meta.url)

export const updateRelativePaths = async () => {
  const files = fs
    .readdirSync(rulesURL, { withFileTypes: true })
    .filter((dirent) => {
      return dirent.isFile() && dirent.name.endsWith('.html')
    })

  for (const file of files) {
    const filePath = new URL(file.name, rulesURL)
    const fileContent = await fs.promises.readFile(filePath, {
      encoding: 'utf-8'
    })
    const updatedFileContent = fileContent
      .replaceAll(`href="`, `href="/rules/`)
      .replaceAll(`src="`, `src="/rules/`)
      .replaceAll(`path_to_root = ""`, `path_to_root = "/rules/"`)
    await fs.promises.writeFile(filePath, updatedFileContent)
  }

  console.log('Success: Updated relative links.')
}
