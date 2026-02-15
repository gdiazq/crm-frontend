import type {
  DashboardExample,
  DashboardExampleActivityRaw,
  DashboardExampleClientRaw,
  DashboardExampleKpiRaw,
  DashboardExamplePipelineStageRaw,
  DashboardExampleRaw,
  DashboardExampleTaskRaw,
} from '@/interfaces'

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value)
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('es-CL').format(value)
}

const mapKpiValue = (item: DashboardExampleKpiRaw) => {
  if (item.unit === 'currency') return formatCurrency(item.value)
  if (item.unit === 'percent') return `${item.value}%`
  return formatNumber(item.value)
}

const mapVariationLabel = (variation: number) => {
  const absoluteValue = Math.abs(variation)
  const sign = variation >= 0 ? '+' : '-'
  return `${sign}${absoluteValue}% vs mes anterior`
}

const mapPipelineStage = (item: DashboardExamplePipelineStageRaw) => {
  return {
    id: item.id,
    label: item.label,
    countLabel: `${formatNumber(item.count)} negocios`,
    amountLabel: formatCurrency(item.amount),
  }
}

const mapTask = (item: DashboardExampleTaskRaw) => {
  return {
    id: item.id,
    title: item.title,
    dueAtLabel: item.dueAt,
    priority: item.priority,
  }
}

const mapClient = (item: DashboardExampleClientRaw) => {
  return {
    id: item.id,
    name: item.name,
    company: item.company,
    amountLabel: formatCurrency(item.amount),
    status: item.status,
  }
}

const mapActivity = (item: DashboardExampleActivityRaw) => {
  return {
    id: item.id,
    text: item.text,
    atLabel: item.at,
  }
}

export const mapperDashboardExample = (result: DashboardExampleRaw): DashboardExample => {
  return {
    seller: result.seller,
    periodLabel: result.periodLabel,
    kpis: result.kpis.map((item) => ({
      id: item.id,
      label: item.label,
      displayValue: mapKpiValue(item),
      variationLabel: mapVariationLabel(item.variation),
      variationPositive: item.variation >= 0,
    })),
    pipeline: result.pipeline.map(mapPipelineStage),
    tasks: result.tasks.map(mapTask),
    topClients: result.topClients.map(mapClient),
    recentActivity: result.recentActivity.map(mapActivity),
  }
}
