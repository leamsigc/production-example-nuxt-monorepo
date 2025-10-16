<script lang="ts" setup>
/**
 *
 * Component Description:Individual preview page for BaseChart component
 *
 * @author Ismael Garcia <leamsigc@leamsigc.com>
 * @version 0.0.1
 *
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */

// Sample props for the component
const sampleProps = {
  title: 'Sample Chart',
  description: 'This is a sample chart component',
  icon: 'lucide:bar-chart',
  chartOptions: {
    title: { text: 'Sample Chart' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: { type: 'value' },
    series: [{
      data: [20, 40, 30, 60, 50, 45, 70],
      type: 'line'
    }]
  }
};
</script>

<template>
  <PreviewShell component-name="BaseChart">
    <BaseChart v-bind="sampleProps" />
  </PreviewShell>
</template>

<style scoped></style>
