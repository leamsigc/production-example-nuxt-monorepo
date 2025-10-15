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
interface TeamProps {
  imageUrl: string;
  firstName: string;
  lastName: string;
  positions: string[];
  socialNetworks: SocialNetworkProps[];
}

interface SocialNetworkProps {
  name: string;
  url: string;
}

interface Props {
  list?: TeamProps[];
}
const props = withDefaults(defineProps<Props>(), {
  list: () => [
    {
      imageUrl: "https://i.pravatar.cc/250?img=58",
      firstName: "Sarah",
      lastName: "Johnson",
      positions: ["Social Media Strategy Expert", "Content Marketing Specialist"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/",
        },
        {
          name: "X",
          url: "https://x.com/",
        },
      ],
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      firstName: "Michael",
      lastName: "Chen",
      positions: ["Digital Marketing Consultant", "Brand Strategist"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/",
        },
        {
          name: "X",
          url: "https://x.com/",
        },
      ],
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      firstName: "Alex",
      lastName: "Rodriguez",
      positions: ["Content Creation Expert", "Video Marketing Specialist"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/",
        },
        {
          name: "X",
          url: "https://x.com/",
        },
      ],
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1573497161161-c3e73707e25c?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      firstName: "Emma",
      lastName: "Williams",
      positions: ["SEO Marketing Manager", "Analytics Guru"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/",
        },
        {
          name: "Github",
          url: "https://github.com/",
        },
      ],
    },
  ],
});

const { list } = toRefs(props);

const socialIcon = (socialName: string) => {
  switch (socialName) {
    case "LinkedIn":
      return "lucide:linkedin";

    case "Github":
      return "lucide:github";

    case "X":
      return "logos:x";

    default:
      return "";
  }
};
</script>

<template>
  <section id="team" class="container mx-auto lg:w-[75%] py-24 sm:py-32">
    <div class="text-center mb-8">
      <h2 class="text-lg text-primary text-center mb-2 tracking-wider">
        <slot name="title" mdc-unwrap="p"> Experts </slot>
      </h2>

      <h3 class="text-3xl md:text-4xl text-center font-bold">
        <slot name="subtitle" mdc-unwrap="p">
          Meet the Social Media Strategy Experts
        </slot>
      </h3>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <UCard v-for="{ imageUrl, firstName, lastName, positions, socialNetworks } in list" :key="imageUrl"
        class="bg-muted/60 dark:bg-card flex flex-col h-full overflow-hidden group/hoverimg">
        <template #header>
          <div class="p-0">
            <div class="h-full overflow-hidden">
              <NuxtImg :src="imageUrl" :alt="firstName + ' ' + lastName" loading="lazy"
                class="w-full aspect-square object-cover saturate-0 transition-all duration-200 ease-linear size-full group-hover/hoverimg:saturate-100 group-hover/hoverimg:scale-[1.01]" />
            </div>
            <h3 class="py-6 pb-4 px-6 font-bold">{{ firstName }}
              <span class="text-primary">{{ lastName }}</span>
            </h3>
          </div>
        </template>

        <div v-for="(position, index) in positions" :key="index" :class="{
          'pb-0 text-muted-foreground ': true,
          'pb-4': index === positions.length - 1,
        }">
          {{ position }}<span v-if="index < positions.length - 1">,</span>
        </div>

        <template #footer>
          <div class="space-x-4 mt-auto">
            <NuxtLink v-for="{ name, url } in socialNetworks" :key="name" :href="url" target="_blank"
              class="hover:opacity-80 transition-all inline-block" :aria-label="`Visit our ${name} page`" :title="name">
              <UIcon :name="socialIcon(name)" />
            </NuxtLink>
          </div>
        </template>
      </UCard>
    </div>
  </section>
</template>
