/**
 * Entity Details Service
 *
 * Handles CRUD operations for generic entity details stored as JSON.
 *
 * @author Ismael Garcia <leamsigc@leamsigc.com>
 * @version 0.0.1
 */

import { eq, and } from 'drizzle-orm'
import { entityDetails, type EntityDetails } from '#layers/BaseDB/db/entityDetails/entityDetails'
import { useDrizzle } from '#layers/BaseDB/server/utils/drizzle'

export interface CreateEntityDetailsData {
  entityId: string
  entityType: string
  details: Record<string, unknown>
}

export interface UpdateEntityDetailsData {
  details?: Record<string, unknown>
}

/**
 * Entity Details Service Class
 */
export class EntityDetailsService {
  private db = useDrizzle()

  /**
   * Create new entity details
   */
  async createDetails(data: CreateEntityDetailsData): Promise<EntityDetails> {
    const detailsData = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await this.db
      .insert(entityDetails)
      .values(detailsData)
      .returning()

    const [newDetails] = result

    if (!newDetails) {
      throw new Error('Failed to create entity details')
    }

    return newDetails
  }

  /**
   * Get entity details by ID
   */
  async getDetailsById(id: string): Promise<EntityDetails | null> {
    const [details] = await this.db
      .select()
      .from(entityDetails)
      .where(eq(entityDetails.id, id))
      .limit(1)

    return details || null
  }

  /**
   * Get entity details by entityId and entityType
   */
  async getDetailsByEntity(entityId: string, entityType: string): Promise<EntityDetails | null> {
    const [details] = await this.db
      .select()
      .from(entityDetails)
      .where(
        and(
          eq(entityDetails.entityId, entityId),
          eq(entityDetails.entityType, entityType)
        )
      )
      .limit(1)

    return details || null
  }

  /**
   * Update entity details
   */
  async updateDetails(id: string, data: UpdateEntityDetailsData): Promise<EntityDetails | null> {
    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    const [updatedDetails] = await this.db
      .update(entityDetails)
      .set(updateData)
      .where(eq(entityDetails.id, id))
      .returning()

    return updatedDetails || null
  }

  /**
   * Delete entity details
   */
  async deleteDetails(id: string): Promise<boolean> {
    try {
      await this.db
        .delete(entityDetails)
        .where(eq(entityDetails.id, id))

      return true
    } catch (error) {
      console.error('Error deleting entity details:', error)
      return false
    }
  }
}

export const entityDetailsService = new EntityDetailsService()
