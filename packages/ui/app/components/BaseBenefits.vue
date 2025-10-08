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

interface BenefitsProps {
  icon: string
  title: string
  description: string
}
interface Props {
  items?: BenefitsProps[]
}
const props = withDefaults(defineProps<Props>(), {
  items: () => [
    {
      icon: 'lucide:target',
      title: 'Targeted Content',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. A odio velit cum aliquam. Natus consectetur dolores.'
    }
  ]
})
const { items } = toRefs(props)
</script>

<template>
  <section id="benefits" class="container mx-auto py-24 sm:py-32">
    <div class="grid lg:grid-cols-2 place-items-center lg:gap-24">
      <div>
        <h2 class="text-lg text-primary mb-2 tracking-wider">
          <slot name="title">
            Benefits
          </slot>
        </h2>

        <h3 class="text-3xl md:text-4xl font-bold mb-4">
          <slot name="subtitle">
            Your Shortcut to Success
          </slot>
        </h3>
        <p class="text-xl text-muted-foreground mb-8">
          <slot name="description">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non ducimus
            reprehenderit architecto rerum similique facere odit deleniti necessitatibus
            quo quae.
          </slot>
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-4 w-full">
        <BaseShinyCard v-for="({ icon, title, description }, index) in items" :key="title" :show-bg="false">
          <UCard
            class="bg-muted/50 dark:bg-card hover:bg-background dark:hover:bg-background transition-all delay-75 group/number h-full">
            <template #header>
              <div class="flex justify-between">
                <Icon class="size-8 mb-6 text-primary" :name="icon" />

                <span
                  class="text-5xl text-muted-foreground/15 font-medium transition-all delay-75 group-hover/number:text-muted-foreground/30">
                  0{{ index + 1 }}
                </span>
              </div>

              <h2>{{ title }}</h2>
            </template>

            <section class="text-muted-foreground">
              {{ description }}
            </section>
          </UCard>
        </BaseShinyCard>
      </div>
    </div>
  </section>
</template>
