import { readFile } from 'fs/promises'
import { join } from 'path'
import { auth } from '~~/lib/auth'

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

    // Get the file path from the route parameters
    const path = getRouterParam(event, 'path')
    
    if (!path) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File path is required'
      })
    }

    // Security: Ensure the path is within the user's folder
    const userFolder = `userFiles/${session.user.id}`
    const safePath = path.replace(/\.\./g, '') // Remove any path traversal attempts
    
    // Build the full file path
    const fileStorageMount = process.env.FILE_STORAGE_MOUNT || './server/files'
    const fullPath = join(fileStorageMount, userFolder, safePath)

    try {
      // Read the file
      const fileBuffer = await readFile(fullPath)
      
      // Determine content type based on file extension
      const ext = safePath.split('.').pop()?.toLowerCase()
      let contentType = 'application/octet-stream'
      
      if (ext) {
        const mimeTypes: Record<string, string> = {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'gif': 'image/gif',
          'webp': 'image/webp',
          'svg': 'image/svg+xml',
          'mp4': 'video/mp4',
          'webm': 'video/webm',
          'pdf': 'application/pdf',
          'txt': 'text/plain',
          'json': 'application/json'
        }
        contentType = mimeTypes[ext] || contentType
      }
      
      // Set appropriate headers
      setHeader(event, 'Content-Type', contentType)
      setHeader(event, 'Cache-Control', 'public, max-age=31536000') // Cache for 1 year
      
      return fileBuffer
    } catch (fileError) {
      throw createError({
        statusCode: 404,
        statusMessage: 'File not found'
      })
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    console.error('File serving error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})