import type { BusinessProfile, CreateBusinessProfileData } from '#layers/BaseDB/db/schema';
import { ref } from 'vue';



const businesses = ref<PaginatedResponse<BusinessProfile>>({
  data: [] as BusinessProfile[],
  pagination: {
    page: 1,
    limit: 10,
    total: 1,
    totalPages: 1
  },
  success: false
});

const activeBusinessId = ref<string>('');

export const useBusinessManager = () => {
  const getAllBusinesses = async () => {
    try {
      const data = await $fetch<Promise<PaginatedResponse<BusinessProfile>>>('/api/v1/business');
      businesses.value = data;
    } catch (error) {
      console.error('Error fetching businesses:', error);
    }
  };

  const addBusiness = async (business: Omit<CreateBusinessProfileData, 'userId'>) => {
    try {
      await $fetch<BusinessProfile>('/api/v1/business', {
        method: 'POST',
        body: { ...business },
      });
      await getAllBusinesses();
    } catch (error) {
      console.error('Error adding business:', error);
      throw error;
    }
  };

  const updateBusiness = async (id: string, updatedFields: Partial<BusinessProfile>) => {
    try {
      const updatedBusiness = await $fetch<BusinessProfile>(`/api/v1/business/${id}`, {
        method: 'PUT',
        body: updatedFields,
      });
      await getAllBusinesses();
    } catch (error) {
      console.error(`Error updating business with ID ${id}:`, error);
      throw error;
    }
  };

  const deleteBusiness = async (id: string) => {
    try {
      await $fetch(`/api/v1/business/${id}`, {
        method: 'DELETE',
      });
      await getAllBusinesses();
    } catch (error) {
      console.error(`Error deleting business with ID ${id}:`, error);
      throw error;
    }
  };
  const setActiveBusiness = async (id: string) => {
    activeBusinessId.value = id
    await $fetch(`/api/v1/business/active`, {
      method: 'POST',
      body: { businessId: id, isActive: true },
    });
  };

  return {
    businesses,
    activeBusinessId,
    getAllBusinesses,
    addBusiness,
    updateBusiness,
    deleteBusiness,
    setActiveBusiness
  };
};
