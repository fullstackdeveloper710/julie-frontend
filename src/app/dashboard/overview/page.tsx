'use client';

import { Card, CardTitle } from '@/components/ui';
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react';

export default function DashboardOverviewPage() {
  return (
    <div className="px-7 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8" />
            Dashboard Overview
          </h1>
          <p className="">Welcome back</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-(--color-deep-orange)" />
              Active Status
            </CardTitle>
            <p className="text-3xl font-bold text-white mt-4">Operational</p>
          </Card>
          <Card>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-(--color-deep-orange)" />
              Growth
            </CardTitle>
            <p className="text-3xl font-bold text-white mt-4">+12.5%</p>
          </Card>
          <Card>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-(--color-deep-orange)" />
              Team Members
            </CardTitle>
            <p className="text-3xl font-bold text-white mt-4">1</p>
          </Card>
          <Card>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-(--color-deep-orange)" />
              Data Points
            </CardTitle>
            <p className="text-3xl font-bold text-white mt-4">0</p>
          </Card>
        </div>
        <Card>
          <CardTitle>Getting Started</CardTitle>
          <div className="mt-6 space-y-4 ">
            <p>Welcome to Frontline! Here's how to get started:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Complete your Monthly Check-In to activate features</li>
              <li>View Intelligence Graphs to analyze trends</li>
              <li>Generate AI-powered reports for insight</li>
              <li>Monitor alerts and benchmarking data</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
