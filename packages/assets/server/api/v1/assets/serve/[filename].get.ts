import { auth } from '#layers/BaseAuth/lib/auth'
import { promises as fs } from 'node:fs'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  try {
    // Get authenticated user
    const headers = getHeaders(event)
    const session = await auth.api.getSession({
      headers: new Headers(headers as Record<string, string>)
    })

    if (!session?.user?.id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const filename = getRouterParam(event, 'filename')

    if (!filename) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Filename is required'
      })
    }

    // Construct the user-specific folder path
    // Use the env FILE_STORAGE_MOUNT=./upload/files
    const fileStorageMount = process.env.FILE_STORAGE_MOUNT || './upload/files'
    const userFolder = join(process.cwd(), fileStorageMount, 'userFiles', session.user.id)
    const filePath = join(userFolder, filename)

    // Retrieve the file from local storage
    const fileContent = await fs.readFile(filePath)

    if (!fileContent) {
      throw createError({
        statusCode: 404,
        statusMessage: 'File not found'
      })
    }

    // Determine content type (you might want to store this in the asset service or infer from filename)
    // For now, a simple inference based on common extensions
    let contentType = 'application/octet-stream'
    if (filename.endsWith('.png')) contentType = 'image/png'
    else if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) contentType = 'image/jpeg'
    else if (filename.endsWith('.gif')) contentType = 'image/gif'
    else if (filename.endsWith('.pdf')) contentType = 'application/pdf'
    else if (filename.endsWith('.mp4')) contentType = 'video/mp4'
    // Add more content types as needed

    setHeaders(event, {
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${filename}"` // 'inline' to display in browser, 'attachment' to download
    })

    return fileContent
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    console.error('Error serving asset:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
