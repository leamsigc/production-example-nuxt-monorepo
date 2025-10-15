/**
 * Composable for dashboard metrics operations
 *
 * @author Ismael Garcia <leamsigc@leamsigc.com>
 * @version 0.0.1
 */

// Types
type DashboardMetric = {
  id: string
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: string
  color: string
}

type ChartDataItem = {
  name: string
  value: number
}

type DashboardResponse = {
  success: boolean
  data?: {
    metrics: DashboardMetric[]
    charts: {
      posts: { weekly: number[]; labels: string[] }
      reviews: { weekly: number[]; labels: string[] }
      content: { distribution: ChartDataItem[] }
    }
  }
  error?: string
}

export const useDashboardMetrics = () => {
  // Reactive state
  const metrics = ref<DashboardMetric[]>([
    {
      id: 'posts',
      title: 'totalPostsScheduled',
      value: '142',
      change: '-12%',
      trend: 'down',
      icon: 'lucide:calendar-days',
      color: 'text-blue-600'
    },
    {
      id: 'reviews',
      title: 'newReviews',
      value: '28',
      change: '+8%',
      trend: 'up',
      icon: 'lucide:star',
      color: 'text-yellow-600'
    },
    {
      id: 'content',
      title: 'aiContentGenerated',
      value: '89',
      change: '+24%',
      trend: 'up',
      icon: 'lucide:sparkles',
      color: 'text-purple-600'
    }
  ])

  // Chart data
  const chartData = ref({
    posts: {
      weekly: [10, 20, 15, 25, 30, 18, 22],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    reviews: {
      weekly: [5, 8, 12, 10, 15, 7, 9],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    content: {
      distribution: [
        { name: 'blogPosts', value: 30 },
        { name: 'socialMedia', value: 20 },
        { name: 'emails', value: 15 },
        { name: 'ads', value: 10 }
      ]
    }
  })

  const loading = ref(false)
  const error = ref<string>('')

  // Methods
  const fetchMetrics = async (businessId?: string) => {
    if (!businessId) return

    try {
      loading.value = true
      error.value = ''

      // TODO: Replace with actual API call
      const response = await $fetch<DashboardResponse>(`/api/v1/dashboard/metrics`, {
        query: { businessId }
      })

      if (response.success && response.data) {
        // Update metrics with real data
        metrics.value = response.data.metrics
        chartData.value = response.data.charts
      } else {
        error.value = response.error || 'Failed to fetch metrics'
      }
    } catch (err: any) {
      console.error('Error fetching metrics:', err)
      error.value = err.data?.message || 'Failed to fetch dashboard metrics'
    } finally {
      loading.value = false
    }
  }

  const refreshMetrics = async (businessId?: string) => {
    await fetchMetrics(businessId)
  }

  // Chart configuration helpers
  const getBarChartConfig = (data: readonly number[], labels: readonly string[], name: string) => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'hsl(0 0% 100%)',
      borderColor: 'hsl(20 5.9% 90%)',
      borderWidth: 1,
      textStyle: {
        color: 'hsl(20 14.3% 4.1%)'
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: {
        lineStyle: {
          color: 'hsl(20 5.9% 90%)'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: 'hsl(24.6 95% 48.1%)',
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: 'hsl(25 5.3% 44.7%)',
        fontSize: 12
      },
      splitLine: {
        lineStyle: {
          color: 'hsl(20 5.9% 90%)',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name,
        type: 'bar',
        data,
        itemStyle: {
          color: 'hsl(24.6 95% 48.1%)',
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: 'hsl(24.6 95% 48.1% / 0.8)'
          }
        }
      }
    ]
  })

  const getLineChartConfig = (data: readonly number[], labels: readonly string[], name: string) => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'hsl(0 0% 100%)',
      borderColor: 'hsl(20 5.9% 90%)',
      borderWidth: 1,
      textStyle: {
        color: 'hsl(20 14.3% 4.1%)'
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: labels,
      axisLine: {
        lineStyle: {
          color: 'hsl(20 5.9% 90%)'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: 'hsl(25 5.3% 44.7%)',
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: 'hsl(25 5.3% 44.7%)',
        fontSize: 12
      },
      splitLine: {
        lineStyle: {
          color: 'hsl(20 5.9% 90%)',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: '#10B981'
        },
        itemStyle: {
          color: '#10B981',
          borderWidth: 2,
          borderColor: 'hsl(0 0% 100%)'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16, 185, 129, 0.25)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0.06)' }
            ]
          }
        },
        data
      }
    ]
  })

  const getPieChartConfig = (data: ReadonlyArray<{ name: string; value: number }>, t: (key: string) => string) => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'hsl(0 0% 100%)',
      borderColor: 'hsl(20 5.9% 90%)',
      borderWidth: 1,
      textStyle: {
        color: 'hsl(20 14.3% 4.1%)'
      }
    },
    series: [
      {
        name: t('content'),
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['50%', '55%'],
        avoidLabelOverlap: false,
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: 'hsl(20 14.3% 4.1%)'
          }
        },
        labelLine: {
          show: false
        },
        data: data.map((item, index) => ({
          value: item.value,
          name: t(item.name),
          itemStyle: {
            color: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'][index] || '#8B5CF6'
          }
        }))
      }
    ]
  })

  // Computed
  const hasData = computed(() => metrics.value.length > 0)
  const totalPosts = computed(() => parseInt(metrics.value.find(m => m.id === 'posts')?.value || '0'))
  const totalReviews = computed(() => parseInt(metrics.value.find(m => m.id === 'reviews')?.value || '0'))
  const totalContent = computed(() => parseInt(metrics.value.find(m => m.id === 'content')?.value || '0'))

  return {
    // State
    metrics: readonly(metrics),
    chartData: readonly(chartData),
    loading: readonly(loading),
    error: readonly(error),

    // Computed
    hasData,
    totalPosts,
    totalReviews,
    totalContent,

    // Methods
    fetchMetrics,
    refreshMetrics,
    getBarChartConfig,
    getLineChartConfig,
    getPieChartConfig
  }
}
