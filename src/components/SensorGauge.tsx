import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SensorGaugeProps {
  title: string;
  value: number | null;
  unit: string;
  min: number;
  max: number;
  icon: React.ReactNode;
  warningThreshold?: { min?: number; max?: number };
  criticalThreshold?: { min?: number; max?: number };
}

export const SensorGauge: React.FC<SensorGaugeProps> = ({
  title,
  value,
  unit,
  min,
  max,
  icon,
  warningThreshold,
  criticalThreshold,
}) => {
  const getStatusColor = () => {
    if (value === null) return 'text-muted-foreground';
    
    if (criticalThreshold) {
      if (
        (criticalThreshold.min !== undefined && value < criticalThreshold.min) ||
        (criticalThreshold.max !== undefined && value > criticalThreshold.max)
      ) {
        return 'text-red-500';
      }
    }
    
    if (warningThreshold) {
      if (
        (warningThreshold.min !== undefined && value < warningThreshold.min) ||
        (warningThreshold.max !== undefined && value > warningThreshold.max)
      ) {
        return 'text-warning';
      }
    }
    
    return 'text-success';
  };

  const getGaugeProgress = () => {
    if (value === null) return 0;
    return Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
  };

  const progress = getGaugeProgress();
  const statusColor = getStatusColor();

  return (
    <Card className="bg-gradient-subtle border-amber/20 shadow-warm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-card-foreground">{title}</CardTitle>
        <div className="p-2 bg-gradient-honey rounded-lg">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">
          <span className={statusColor}>
            {value !== null ? `${value.toFixed(1)}${unit}` : '--'}
          </span>
        </div>
        
        {/* Circular Progress Gauge */}
        <div className="relative w-24 h-24 mx-auto mb-4">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted opacity-20"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className={`${statusColor} transition-all duration-500 ease-out`}
              strokeDasharray={`${(progress * 2.51).toFixed(1)} 251.2`}
              strokeDashoffset="0"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-center">
              {value !== null ? `${Math.round(progress)}%` : ''}
            </span>
          </div>
        </div>

        {/* Range indicator */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>

        {/* Status indicator */}
        <div className="mt-2 text-center">
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            value === null ? 'bg-muted text-muted-foreground' :
            statusColor.includes('red') ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300' :
            statusColor.includes('warning') ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300' :
            'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              value === null ? 'bg-muted-foreground' :
              statusColor.includes('red') ? 'bg-red-500' :
              statusColor.includes('warning') ? 'bg-orange-500' :
              'bg-green-500'
            }`} />
            {value === null ? 'No Data' :
             statusColor.includes('red') ? 'Critical' :
             statusColor.includes('warning') ? 'Warning' : 'Normal'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};