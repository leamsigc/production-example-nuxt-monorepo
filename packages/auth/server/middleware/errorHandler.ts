import { createErrorHandler } from "../utils/errorHandler"

export default defineEventHandler(async (event) => {
  // Skip non-API routes
  if (!event.node.req.url?.startsWith('/api/v1/')) {
    return
  }

  const errorHandler = createErrorHandler()

  // Wrap the event handling with error catching
  try {
    // Continue with normal request processing
    return
  } catch (error) {
    // Handle the error and return appropriate response
    const errorResponse = errorHandler(error as Error, event)

    // Set appropriate headers
    setHeader(event, 'Content-Type', 'application/json')

    return errorResponse
  }
})
