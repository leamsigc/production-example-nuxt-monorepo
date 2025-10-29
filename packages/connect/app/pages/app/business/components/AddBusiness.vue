<i18n src="../business.json"></i18n>
<script lang="ts" setup>
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import z from 'zod';
import { CreateBusinessProfileSchema } from '#layers/BaseDB/db/schema';
import { useBusinessManager } from '../composables/useBusinessManager';

const emit = defineEmits(['add', 'cancel']);
const { t } = useI18n();
const modalOpen = defineModel<boolean>('open');
const { addBusiness } = useBusinessManager();
const toast = useToast()

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
  {
    name: 'category',
    type: 'text',
    label: t('form.category'),
    placeholder: t('placeholders.category'),
    required: true
  }

]
const schema = CreateBusinessProfileSchema.omit({ userId: true });
type BusinessForm = z.infer<typeof schema>;

const submitForm = async (payload: FormSubmitEvent<BusinessForm>) => {

  try {
    const validatedData = schema.parse(payload.data);
    await addBusiness(validatedData);
    modalOpen.value = false;
    toast.add({
      title: t('states.business_added'),
      description: t('states.business_added_successfully'),
      color: 'success'
    })

  } catch (error) {
    console.error('Form validation error:', error);
    toast.add({
      title: t('states.error'),
      description: t('states.something_went_wrong'),
      color: 'error'
    })
  }
};


</script>

<template>
  <UModal v-model:open="modalOpen">
    <UButton color="primary" variant="outline" class="grid place-content-center py-8 shadow cursor-pointer">
      <section class="flex flex-col items-center gap-2 border-2 border-primary  rounded-full p-4 mb-2 w-24 h-24">
        <Icon name="lucide:plus" size="80" class="" />
      </section>
      <h3 class=" text-center text-primary">{{ t('states.add_business') }}</h3>
    </UButton>
    <template #content>
      <UCard class="overflow-y-auto">
        <template #default>
          <UAuthForm :schema="schema" :fields="fields" :providers="[]" @submit="submitForm" :title="t('title')"
            :description="t('description')" :submit="{
              label: 'Submit',
              color: 'primary',
              variant: 'subtle'
            }">
          </UAuthForm>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
