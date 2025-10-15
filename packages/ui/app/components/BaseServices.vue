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

enum ProService {
  YES = 1,
  NO = 0,
}

interface ServiceProps {
  title: string;
  pro: ProService;
  description: string;
}
interface Props {
  list?: ServiceProps[];
}
const props = withDefaults(defineProps<Props>(), {
  list: () => [
    {
      title: "AI Content Generation",
      description:
        "Generate engaging posts, captions, and content ideas powered by advanced AI technology tailored for small businesses.",
      pro: 0,
    },
    {
      title: "Social Media Scheduling",
      description:
        "Schedule and automate posts across all major social media platforms with our intelligent posting system.",
      pro: 0,
    },
    {
      title: "Google My Business Integration",
      description: "Manage your Google My Business listing, respond to reviews, and optimize your local presence effortlessly.",
      pro: 0,
    },
    {
      title: "Advanced Analytics & Insights",
      description: "Track performance across platforms with detailed analytics, engagement metrics, and growth insights.",
      pro: 1,
    },
  ],
});

const { list } = toRefs(props);
</script>

<template>
  <section id="services" class="container mx-auto py-24 sm:py-32" v-motion-fade-visible-once>
    <h2 class="text-lg text-primary text-center mb-2 tracking-wider">
      <slot name="title" mdc-unwrap="p"> Features </slot>
    </h2>

    <h3 class="text-3xl md:text-4xl text-center font-bold mb-4">
      <slot name="subtitle" mdc-unwrap="p"> Empower Your Social Media Success </slot>
    </h3>
    <h4 class="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
      <slot name="description" mdc-unwrap="p">
        Discover powerful tools designed to streamline your social media management, content creation, and business
        growth.
      </slot>
    </h4>

    <div class="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full lg:w-[60%] mx-auto">
      <div v-for="{ title, description, pro } in list" :key="title" class="relative">
        <UCard class="bg-muted/60 dark:bg-card h-full relative">
          <template #header>
            <div class="flex justify-between items-start">
              <h3 class="font-bold">{{ title }}</h3>
              <UBadge v-if="pro === ProService.YES" color="secondary">PRO</UBadge>
            </div>
          </template>

          <p class="text-muted-foreground">{{ description }}</p>
        </UCard>
      </div>
    </div>
  </section>
</template>
