<!--  Translation file -->
<i18n src="./business.json"></i18n>
<script lang="ts" setup>
/**
 *
 * Business Management Page
 *
 * @author Reflect-Media <reflect.media GmbH>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */
import BusinessCard from './components/BusinessCard.vue';
import AddBusiness from './components/AddBusiness.vue';
import { useBusinessManager, type Business } from './composables/useBusinessManager';

const { businesses, getAllBusinesses, addBusiness, updateBusiness, deleteBusiness } = useBusinessManager();
const showAddBusiness = ref(false);
const editingBusiness = ref<Business | null>(null);

const { data } = await useFetch<Business[]>('/api/v1/business');

if (data.value) {
  businesses.value = data.value;
} else {
  getAllBusinesses(); // Fallback if useFetch doesn't populate
}

const handleAddBusiness = async (newBiz: Omit<Business, 'id' | 'status'>) => {
  await addBusiness(newBiz);
  showAddBusiness.value = false;
};

const handleEditBusiness = (id: string) => {
  editingBusiness.value = businesses.value.find(b => b.id === id) || null;
  showAddBusiness.value = true; // Show the form for editing
};

const handleUpdateBusiness = async (updatedBiz: Business) => {
  if (editingBusiness.value) {
    await updateBusiness(editingBusiness.value.id, updatedBiz);
    editingBusiness.value = null;
    showAddBusiness.value = false;
  }
};

const handleDeleteBusiness = async (id: string) => {
  if (confirm('Are you sure you want to delete this business?')) {
    await deleteBusiness(id);
  }
};

const handleCancelForm = () => {
  showAddBusiness.value = false;
  editingBusiness.value = null;
};

const { t } = useI18n();

useHead({
  title: t('seo_title_all'),
  meta: [
    { name: 'description', content: t('seo_description_all') }
  ]
});
</script>

<template>
  <div class="container mx-auto py-6 space-y-6">
    <BasePageHeader :title="t('title')" :description="t('description')" />
    <div class="grid grid-cols-4 gap-5">
      <AddBusiness @add="handleAddBusiness" @cancel="handleCancelForm" />
      <div v-if="businesses.length > 0" class="">
        <BusinessCard v-for="business in businesses" :key="business.id" :business="business" @edit="handleEditBusiness"
          @delete="handleDeleteBusiness" />
      </div>
      <div v-else class="text-center text-gray-500 grid place-content-center bg-accented rounded">
        {{ t('states.no_businesses') }}
      </div>
    </div>


  </div>
</template>
<style scoped></style>
