"use client";

import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Bar, getElementAtEvent } from 'react-chartjs-2';

// shadcn/ui imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  title: string;
  description?: string;
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }>;
  };
  className?: string;
  orientation?: 'vertical' | 'horizontal';
  height?: number;
}

export function BarChart({ 
  title, 
  description, 
  data, 
  className = "",
  orientation = 'vertical',
  height = 300
}: BarChartProps) {
  const chartRef = useRef<ChartJS<'bar'>>(null);

  const options: ChartOptions<'bar'> = {
    indexAxis: orientation === 'horizontal' ? 'y' as const : 'x' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          },
          color: 'hsl(var(--foreground))',
        }
      },
      tooltip: {
        backgroundColor: 'hsl(var(--popover))',
        titleColor: 'hsl(var(--popover-foreground))',
        bodyColor: 'hsl(var(--popover-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          title: function(context: any) {
            return context[0].label;
          },
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = typeof context.parsed.y === 'number' 
              ? context.parsed.y.toLocaleString() 
              : context.parsed.y;
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'hsl(var(--border))',
          lineWidth: 1
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'hsl(var(--border))',
          lineWidth: 1
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          font: {
            size: 11
          },
          callback: function(value: any) {
            if (typeof value === 'number') {
              if (value >= 1000000) {
                return (value / 1000000).toFixed(1) + 'M';
              } else if (value >= 1000) {
                return (value / 1000).toFixed(1) + 'K';
              }
              return value.toLocaleString();
            }
            return value;
          }
        }
      }
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart' as const,
    }
  };

  return (
    <Card className={`${className} hover:shadow-lg transition-all duration-300`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          {description && (
            <CardDescription className="text-sm">{description}</CardDescription>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => {
            if (chartRef.current) {
              chartRef.current.update('none');
            }
          }}
          className="h-8 w-8 p-0"
        >
          🔄
        </Button>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px` }} className="w-full">
          <Bar ref={chartRef} data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}