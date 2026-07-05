import fs from 'fs-extra'
import assert from 'assert'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

export function assertStringLengthMoreThan(s: string, n: number): void {
  assert(typeof s === 'string' && s.length > n, "String length must be greater than " + n)
}

export function relativeRoot(relativePath: string): string {
  const dir = dirname(fileURLToPath(import.meta.url))
  assertStringLengthMoreThan(dir, 0)
  assertStringLengthMoreThan(relativePath, 0)
  return join(dir, '../', relativePath)
}

async function copy(src: string, dest: string) {
  await fs.copy(src, dest)
}

async function remove(filePath: string) {
  await fs.remove(filePath)
}

async function main() {
  await remove(relativeRoot('../assets'))
  await remove(relativeRoot('../favicon.svg'))
  await remove(relativeRoot('../index.html'))
  await copy(relativeRoot('../react-test/dist/assets'), relativeRoot('../assets'))
  await copy(relativeRoot('../react-test/dist/favicon.svg'), relativeRoot('../favicon.svg'))
  await copy(relativeRoot('../react-test/dist/index.html'), relativeRoot('../index.html'))
}

main()