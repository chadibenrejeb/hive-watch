import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SensorData } from '@/hooks/useMqttConnection';

interface HistoricalChartProps {
  data: SensorData[];
  title: string;
  dataKey: keyof Omit<SensorData, 'timestamp'>;
  unit: string;
  color?: string;
}

export const HistoricalChart: React.FC<HistoricalChartProps> = ({
  data,
  title,
  dataKey,
  unit,
  color = '#FFC107',
}) => {
  const chartData = data
    .filter(item => item[dataKey] !== null)
    .map(item => ({
      time: item.timestamp.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }),
      value: item[dataKey],
      fullTimestamp: item.timestamp,
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevation">
          <p className="text-sm text-card-foreground">
            {data.fullTimestamp.toLocaleString()}
          </p>
          <p className="text-sm font-medium">
            <span style={{ color: payload[0].color }}>{title}: </span>
            <span className="text-honey">{payload[0].value?.toFixed(1)}{unit}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-subtle border-amber/20 shadow-warm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          {title} History
          <div className="flex-1 h-px bg-gradient-honey opacity-30" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                className="text-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                className="text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={{ r: 3, fill: color }}
                activeDot={{ r: 5, fill: color, strokeWidth: 2 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {chartData.length === 0 && (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p>Waiting for data...</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};