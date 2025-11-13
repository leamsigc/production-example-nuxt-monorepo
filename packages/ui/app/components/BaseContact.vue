<script setup lang="ts">
/**
 *
 * Component Description:Desc
 *
 * @author Reflect-Media <reflect.media GmbH>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */
interface ContactFormeProps {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

const contactForm = reactive<ContactFormeProps>({
  firstName: "",
  lastName: "",
  email: "",
  subject: "",
  message: "",
});

const invalidUiInputForm = ref<boolean>(false);

const handleSubmit = () => {
  const { firstName, lastName, email, subject, message } = contactForm;

  const mailToLink = `mailto:MagicSync@leamsigc.com?subject=${subject}&body=Hello I am ${firstName} ${lastName}, my Email is ${email}. %0D%0A${message}`;

  window.location.href = mailToLink;
};
</script>

<template>
  <section id="contact" class="container mx-auto py-24 sm:py-32">
    <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div class="mb-4">
          <h2 class="text-lg text-primary mb-2 tracking-wider">Contact</h2>

          <h2 class="text-3xl md:text-4xl font-bold">Connect With Us</h2>
        </div>
        <p class="mb-8 text-muted-foreground lg:w-5/6">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum ipsam sint
          enim exercitationem ex autem corrupti quas tenetur
        </p>

        <div class="flex flex-col gap-4">
          <div>
            <div class="flex gap-2 mb-1">
              <Icon name="lucide:map-pin" />
              <div class="font-bold">Find Us</div>
            </div>

            <div>742 Evergreen Terrace, Springfield, IL 62704</div>
          </div>

          <div>
            <div class="flex gap-2 mb-1">
              <Icon name="lucide:phone" />
              <div class="font-bold">Call Us</div>
            </div>

            <div>+1 (619) 123-4567</div>
          </div>

          <div>
            <div class="flex gap-2 mb-1">
              <Icon name="lucide:mail" />
              <div class="font-bold">Mail Us</div>
            </div>

            <div>leomirandadev@gmail.com</div>
          </div>

          <div>
            <div class="flex gap-2">
              <Icon name="lucide:home" />
              <div class="font-bold">Visit Us</div>
            </div>

            <div>
              <div>Monday - Friday</div>
              <div>8AM - 4PM</div>
            </div>
          </div>
        </div>
      </div>

      <!-- form -->
      <UCard class="bg-muted/60 dark:bg-card">
        <template #header>
          <h3 class="text-primary text-2xl">Contact Form</h3>
        </template>
        <form class="grid gap-4" @submit.prevent="handleSubmit">
          <div class="flex flex-col md:flex-row gap-8">
            <div class="flex flex-col w-full gap-1.5">
              <ULabel for="first-name">First Name</ULabel>
              <UInput id="first-name" v-model="contactForm.firstName" type="text" placeholder="Leopoldo" />
            </div>

            <div class="flex flex-col w-full gap-1.5">
              <ULabel for="last-name">Last Name</ULabel>
              <UInput id="last-name" v-model="contactForm.lastName" type="text" placeholder="Miranda" />
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <ULabel for="email">Email</ULabel>
            <UInput id="email" v-model="contactForm.email" type="email" placeholder="leomirandadev@gmail.com" />
          </div>

          <div class="flex flex-col gap-1.5">
            <ULabel for="subject">Subject</ULabel>

            <USelect v-model="contactForm.subject" :options="[
              { label: 'Web Development', value: 'Web Development' },
              { label: 'Mobile Development', value: 'Mobile Development' },
              { label: 'Figma Design', value: 'Figma Design' },
              { label: 'REST API', value: 'REST API' },
              { label: 'FullStack Project', value: 'FullStack Project' },
            ]" placeholder="Select a subject" />
          </div>

          <div class="flex flex-col gap-1.5">
            <ULabel for="message">Message</ULabel>
            <UTextarea id="message" v-model="contactForm.message" placeholder="Your message..." />
          </div>

          <UAlert v-if="invalidUiInputForm" icon="i-lucide-alert-circle" color="error" variant="soft" title="Error"
            description="There is an error in the form. Please check your input." />

          <UButton class="mt-4" type="submit">Send message</UButton>
        </form>

        <template #footer>
          <!-- Footer content if any -->
        </template>
      </UCard>
    </section>
  </section>
</template>
