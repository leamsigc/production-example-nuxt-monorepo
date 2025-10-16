<i18n src="./DashboardOverviewCards.json"></i18n>
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
import { type EChartsOption } from 'echarts'


const { t } = useI18n()
const { metrics, chartData, getLineChartConfig, getBarChartConfig, getPieChartConfig } = useDashboardMetrics()

const displayMetrics = computed(() =>
  metrics.value.map(metric => ({
    ...metric,
    title: t(metric.title)
  }))
)

const postOptions = computed((): EChartsOption => {
  const config = getBarChartConfig(
    chartData.value.reviews.weekly,
    chartData.value.reviews.labels,
    t('post')
  )

  return config as EChartsOption
})
const reviewOptions = computed((): EChartsOption => {
  const config = getLineChartConfig(
    chartData.value.reviews.weekly,
    chartData.value.reviews.labels,
    t('review')
  )

  return config as EChartsOption
})
const contentOptions = computed((): EChartsOption => {
  const config = getPieChartConfig(
    chartData.value.content.distribution,
    t
  )

  return config as EChartsOption
})

</script>

<template>
  <BaseDashboardOverviewCards :display-metrics="displayMetrics">
    <BaseChart :title="t('postsScheduled')" :description="t('weeklyOverview')" icon="lucide:bar-chart-3"
      :chart-options="postOptions" />
    <BaseChart :title="t('newReviews')" :description="t('lastSevenDays')" icon="lucide:trending-up"
      :chart-options="reviewOptions" />
    <BaseChart :title="t('aiContent')" :description="t('generatedContent')" icon="lucide:sparkles"
      :chart-options="contentOptions" />
  </BaseDashboardOverviewCards>

</template>
<style scoped></style>