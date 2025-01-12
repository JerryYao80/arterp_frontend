'use client';

import React from 'react';
import { Grid } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import StatsCard from '@/components/common/StatsCard';
import ChartCard from '@/components/common/ChartCard';
import CustomerDistributionChart from './components/CustomerDistributionChart';
import BusinessProcessChart from './components/BusinessProcessChart';
import ResourceUtilizationChart from './components/ResourceUtilizationChart';
import FinancialOverviewChart from './components/FinancialOverviewChart';
import { customerApi } from '../api/customerApi';
import { businessApi } from '../api/businessApi';
import { resourceApi } from '../api/resourceApi';
import { financeApi } from '../api/financeApi';

export default function DashboardPage() {
  const { data: customerStats } = customerApi.useGetCustomerStatsQuery();
  const { data: businessStats } = businessApi.useGetBusinessStatsQuery();
  const { data: resourceStats } = resourceApi.useGetResourceStatsQuery();
  const { data: financeStats } = financeApi.useGetFinanceStatsQuery();

  const defaultCustomerStats = {
    totalCustomers: 0,
    customerGrowth: 0,
    typeDistribution: {},
    statusDistribution: {},
    riskDistribution: {}
  };

  const defaultBusinessStats = {
    activeProcesses: 0,
    processGrowth: 0,
    typeDistribution: {},
    statusDistribution: {},
    riskDistribution: {}
  };

  const defaultResourceStats = {
    availableResources: 0,
    resourceGrowth: 0,
    typeDistribution: {},
    statusDistribution: {},
    qualityDistribution: {}
  };

  const defaultFinanceStats = {
    monthlyRevenue: 0,
    revenueGrowth: 0,
    typeDistribution: {},
    statusDistribution: {},
    paymentMethodDistribution: {}
  };

  return (
    <MainLayout>
      <PageHeader 
        title="Dashboard" 
        subtitle="Welcome to ART ERP System"
      />
      
      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Customers"
            value={customerStats?.data?.totalCustomers || 0}
            icon={<PeopleIcon />}
            trend={{
              value: customerStats?.data?.customerGrowth || 0,
              label: 'vs last month'
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Processes"
            value={businessStats?.data?.activeProcesses || 0}
            icon={<BusinessIcon />}
            trend={{
              value: businessStats?.data?.processGrowth || 0,
              label: 'vs last month'
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Available Resources"
            value={resourceStats?.data?.availableResources || 0}
            icon={<InventoryIcon />}
            trend={{
              value: resourceStats?.data?.resourceGrowth || 0,
              label: 'vs last month'
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Monthly Revenue"
            value={financeStats?.data?.monthlyRevenue || 0}
            icon={<AttachMoneyIcon />}
            trend={{
              value: financeStats?.data?.revenueGrowth || 0,
              label: 'vs last month'
            }}
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Customer Distribution"
            subheader="By customer type and status"
          >
            <CustomerDistributionChart data={customerStats?.data || defaultCustomerStats} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Business Process Status"
            subheader="Current process distribution"
          >
            <BusinessProcessChart data={businessStats?.data || defaultBusinessStats} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Resource Utilization"
            subheader="By resource type"
          >
            <ResourceUtilizationChart data={resourceStats?.data || defaultResourceStats} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Financial Overview"
            subheader="Revenue vs Expenses"
          >
            <FinancialOverviewChart data={financeStats?.data || defaultFinanceStats} />
          </ChartCard>
        </Grid>
      </Grid>
    </MainLayout>
  );
} 