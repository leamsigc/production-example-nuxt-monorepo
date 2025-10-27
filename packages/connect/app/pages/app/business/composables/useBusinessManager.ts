import { ref } from 'vue';

export interface Business {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  status: 'active' | 'inactive';
}

const businesses = ref<Business[]>([]);

export const useBusinessManager = () => {
  const getAllBusinesses = async () => {
    try {
      const data = await $fetch<Business[]>('/api/v1/businesses');
      businesses.value = data;
    } catch (error) {
      console.error('Error fetching businesses:', error);
    }
  };

  const addBusiness = async (business: Omit<Business, 'id' | 'status'>) => {
    try {
      const newBusiness = await $fetch<Business>('/api/v1/businesses', {
        method: 'POST',
        body: { ...business, status: 'active' }, // Default status to active
      });
      businesses.value.push(newBusiness);
      return newBusiness;
    } catch (error) {
      console.error('Error adding business:', error);
      throw error;
    }
  };

  const updateBusiness = async (id: string, updatedFields: Partial<Business>) => {
    try {
      const updatedBusiness = await $fetch<Business>(`/api/v1/businesses/${id}`, {
        method: 'PUT',
        body: updatedFields,
      });
      const index = businesses.value.findIndex((b) => b.id === id);
      if (index !== -1) {
        businesses.value[index] = { ...businesses.value[index], ...updatedBusiness };
      }
      return updatedBusiness;
    } catch (error) {
      console.error(`Error updating business with ID ${id}:`, error);
      throw error;
    }
  };

  const deleteBusiness = async (id: string) => {
    try {
      await $fetch(`/api/v1/businesses/${id}`, {
        method: 'DELETE',
      });
      businesses.value = businesses.value.filter((b) => b.id !== id);
    } catch (error) {
      console.error(`Error deleting business with ID ${id}:`, error);
      throw error;
    }
  };

  return {
    businesses,
    getAllBusinesses,
    addBusiness,
    updateBusiness,
    deleteBusiness,
  };
};
