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
interface Props {
  list?: {
    label: string;
    content: string;
  }[];
}

const props = withDefaults(defineProps<Props>(), {
  list: () => [
    {
      label: "What is SmallBusinessSocialMediaTools?",
      content: "It's an all-in-one platform designed for small businesses to manage their social media, Google My Business, and content creation efficiently.",
    },
    {
      label: "Which social media platforms are supported?",
      content: "We support Facebook, Twitter, Instagram, TikTok, and Google My Business.",
    },
    {
      label: "Is there a free trial?",
      content: "Yes, we offer a free tier and a 14-day free trial for our Pro plan.",
    },
    {
      label: "Can I manage multiple businesses?",
      content: "Absolutely! Our platform allows you to connect and manage multiple businesses under one account.",
    },
    {
      label: "How does the AI content generation work?",
      content: "Our AI assists in generating post ideas, bulk content, and smart responses to reviews, saving you time and effort.",
    },
  ],
});
const { list } = toRefs(props);
</script>

<template>
  <section id="faq" class="container mx-auto md:w-[700px] py-24 sm:py-32" v-motion-fade-visible-once :delay="200"
    :duration="1200">
    <div class="text-center mb-8">
      <h2 class="text-lg text-primary text-center mb-2 tracking-wider">
        <slot name="title"> FAQS </slot>
      </h2>

      <h3 class="text-3xl md:text-4xl text-center font-bold">
        <slot name="subtitle"> Common Questions </slot>
      </h3>
    </div>

    <UAccordion :items="list" type="single" collapsible class="AccordionRoot" />

    <h3 class="font-medium mt-4">
      Still have questions?
      <NuxtLink href="/" class="text-muted-foreground underline" aria-label="Contact us" title="Contact us">Contact us
      </NuxtLink>
    </h3>
  </section>
</template>
