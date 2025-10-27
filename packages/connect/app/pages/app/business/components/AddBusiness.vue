<i18n src="../business.json"></i18n>
<script lang="ts" setup>
import { ref } from 'vue';
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import type { Business } from '../composables/useBusinessManager';
import z from 'zod';
import { CreateBusinessProfileSchema } from '#layers/BaseDB/db/schema';

const emit = defineEmits(['add', 'cancel']);
const { t } = useI18n();

const newBusiness = ref<Omit<Business, 'id' | 'status'>>({
  name: '',
  description: '',
  address: '',
  phone: '',
  email: '',
  website: '',
});


const fields: AuthFormField[] = [
  {
    name: 'name',
    type: 'text',
    label: t('form.name'),
    placeholder: t('placeholders.name'),
    required: true
  },
  {
    name: 'description',
    type: 'text',
    label: t('form.description'),
    placeholder: t('placeholders.description'),
    required: true
  },
  {
    name: 'address',
    type: 'text',
    label: t('form.address'),
    placeholder: t('placeholders.address'),
    required: true
  },
  {
    name: 'phone',
    type: 'text',
    label: t('form.phone'),
    placeholder: t('placeholders.phone'),
    required: true
  },
  {
    name: 'email',
    type: 'email',
    label: t('form.email'),
    placeholder: t('placeholders.email'),
    required: true
  },
  {
    name: 'website',
    type: 'text',
    label: t('form.website'),
    placeholder: t('placeholders.website'),
    required: true
  },
]
type BusinessForm = z.infer<typeof CreateBusinessProfileSchema>;

const submitForm = async (payload: FormSubmitEvent<BusinessForm>) => {
  try {
    // Validate the form data against the schema
    const validatedData = CreateBusinessProfileSchema.parse(newBusiness.value);
    emit('add', validatedData);
    // Reset form
    newBusiness.value = {
      name: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      website: '',
    };
  } catch (error) {
    console.error('Form validation error:', error);
    // Handle validation errors, e.g., display messages to the user
  }
};


</script>

<template>
  <UModal>
    <UButton color="neutral" variant="subtle" class="grid place-content-center py-8 shadow cursor-pointer">
      <section class="flex flex-col items-center gap-2 border-2 border-muted  rounded-full p-4 mb-2 w-24 h-24">
        <Icon name="lucide:plus" size="80" class="text-muted" />
      </section>
      <h3 class=" text-center text-muted">{{ t('states.add_business') }}</h3>
    </UButton>
    <template #content>
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              {{ t('states.add_business') }}
            </h3>
            <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
              @click="emit('cancel')" />
          </div>
        </template>

        <UAuthForm :schema="CreateBusinessProfileSchema" :fields="fields" :providers="[]" @submit="submitForm">
        </UAuthForm>
      </UCard>
    </template>
  </UModal>
</template>
