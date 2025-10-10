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
</script>

<template>
  <div>
    <BaseHeader />
    <BaseHero :actions="[{ label: 'Get started', href: '/', icon: 'mdi:arrow-right' }]"
      :badge="{ label: 'New!', content: 'Boost your business' }" class="p-20" />
    <BaseBannerPromo />
    <BaseFeatures />
    <BaseBenefits />
    <BaseServices />
    <BaseHowItWorks />
    <BaseHeroB />
    <BaseTestimonials />
    <BaseTeam />
    <BasePricing />
    <BaseFaq />
    <BaseCommunity />
    <BaseContact />
    <BaseComments url="https://bsky.app/profile/example.bsky.social/post/abc123" />
    <BaseBlueSkyComments url="https://bsky.app/profile/example.bsky.social/post/abc123" />

    <BaseNotFoundView />
  </div>
</template>
<style scoped></style>
