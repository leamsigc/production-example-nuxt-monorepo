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

enum PopularPlan {
  NO = 0,
  YES = 1,
}

interface PlanProps {
  title: string;
  popular: PopularPlan;
  price: number;
  description: string;
  buttonText: string;
  benefitList: string[];
}

interface Props {
  plans?: PlanProps[];
}
const props = withDefaults(defineProps<Props>(), {
  plans: () => [
    {
      title: "Free",
      popular: 0,
      price: 0,
      description: "Lorem ipsum dolor sit, amet ipsum consectetur adipisicing elit.",
      buttonText: "Start Free Trial",
      benefitList: [
        "1 team member",
        "1 GB storage",
        "Upto 2 pages",
        "Community support",
        "AI assistance",
      ],
    },
    {
      title: "Premium",
      popular: 1,
      price: 45,
      description: "Lorem ipsum dolor sit, amet ipsum consectetur adipisicing elit.",
      buttonText: "Get starterd",
      benefitList: [
        "4 team member",
        "8 GB storage",
        "Upto 6 pages",
        "Priority support",
        "AI assistance",
      ],
    },
    {
      title: "Enterprise",
      popular: 0,
      price: 120,
      description: "Lorem ipsum dolor sit, amet ipsum consectetur adipisicing elit.",
      buttonText: "Contact US",
      benefitList: [
        "10 team member",
        "20 GB storage",
        "Upto 10 pages",
        "Phone & email support",
        "AI assistance",
      ],
    },
  ],
});
const { plans } = toRefs(props);
</script>

<template>
  <section class="container mx-auto py-24 sm:py-32" v-motion-fade-visible-once>
    <h2 class="text-lg text-primary text-center mb-2 tracking-wider">
      <slot name="title"> Your All-in-One Platform for </slot>
    </h2>

    <h3 class="text-3xl md:text-4xl text-center font-bold mb-4">
      <slot name="subtitle"> Small Business Social Media Success </slot>
    </h3>

    <h4 class="md:w-1/2 mx-auto text-xl text-center text-muted-foreground pb-14">
      <slot name="description">
        Effortlessly manage all your social media, Google My Business, and content creation in one powerful platform.
        Save time, boost engagement, and grow your business.
      </slot>
    </h4>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4">
      <UCard v-for="{ title, popular, price, description, buttonText, benefitList } in plans" :key="title" :class="{
        'drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-[1.5px] border-primary lg:scale-[1.1]':
          popular === PopularPlan?.YES,
      }">
        <template #header>
          <h3 class="pb-2 font-bold">
            {{ title }}
          </h3>

          <p class="pb-4">{{ description }}</p>

          <div>
            <span class="text-3xl font-bold">${{ price }}</span>
            <span class="text-muted-foreground"> /month</span>
          </div>
        </template>

        <div class="flex">
          <div class="space-y-4">
            <span v-for="benefit in benefitList" :key="benefit" class="flex">
              <UIcon name="i-lucide-check" class="text-primary mr-2" />
              <h3>{{ benefit }}</h3>
            </span>
          </div>
        </div>

        <template #footer>
          <UButton :variant="popular === PopularPlan?.YES ? 'solid' : 'outline'" color="primary" class="w-full">
            {{ buttonText }}
          </UButton>
        </template>
      </UCard>
    </div>
  </section>
</template>
