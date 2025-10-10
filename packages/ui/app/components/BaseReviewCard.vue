<script lang="ts" setup>
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
  img?: string;
  name?: string;
  username?: string;
  body?: string;
}
const props = withDefaults(defineProps<Props>(), {
  img: "/images/avatar-placeholder.png",
  name: "Sarah Johnson",
  username: "@sarahj_business",
  body: "This all-in-one platform has transformed how I manage my small business's social media and content. The AI assistance and Google My Business integration saved me hours every week!"
});
</script>

<template>
  <UCard class="relative w-64 cursor-pointer h-36" v-motion-fade-visible-once>
    <div class="flex items-center space-x-2 mb-2">
      <UAvatar :src="props.img" :alt="`${props.name} ${props.username}`" size="2xs" />
      <p class="flex flex-col space-y-1">
        <span class="text-sm font-medium">
          {{ props.name }}
        </span>
        <span class="text-xs font-medium text-muted-foreground">
          {{ props.username }}
        </span>
      </p>
    </div>

    <div>
      <p class="text-sm leading-none">
        {{ props.body }}
      </p>
    </div>
  </UCard>
</template>
