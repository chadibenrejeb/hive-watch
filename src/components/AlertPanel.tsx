import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { SensorData } from '@/hooks/useMqttConnection';
import { useToast } from '@/hooks/use-toast';

interface AlertPanelProps {
  sensorData: SensorData;
}

interface AlertRule {
  id: string;
  sensor: keyof Omit<SensorData, 'timestamp'>;
  condition: 'greater' | 'less';
  threshold: number;
  severity: 'warning' | 'critical';
  message: string;
}

const alertRules: AlertRule[] = [
  {
    id: 'humidity_high',
    sensor: 'humidity',
    condition: 'greater',
    threshold: 80,
    severity: 'critical',
    message: 'High humidity detected! Risk of condensation in hive.',
  },
  {
    id: 'temperature_low',
    sensor: 'temperature',
    condition: 'less',
    threshold: 20,
    severity: 'critical',
    message: 'Temperature too low! Bees may be stressed.',
  },
  {
    id: 'temperature_high',
    sensor: 'temperature',
    condition: 'greater',
    threshold: 35,
    severity: 'warning',
    message: 'Temperature getting high. Monitor ventilation.',
  },
  {
    id: 'humidity_low',
    sensor: 'humidity',
    condition: 'less',
    threshold: 30,
    severity: 'warning',
    message: 'Low humidity detected. Check water sources.',
  },
  {
    id: 'weight_low',
    sensor: 'weight',
    condition: 'less',
    threshold: 20,
    severity: 'warning',
    message: 'Hive weight is low. Check honey stores.',
  },
];

export const AlertPanel: React.FC<AlertPanelProps> = ({ sensorData }) => {
  const { toast } = useToast();
  const [activeAlerts, setActiveAlerts] = React.useState<AlertRule[]>([]);
  const [previousAlerts, setPreviousAlerts] = React.useState<Set<string>>(new Set());

  useEffect(() => {
    const newActiveAlerts = alertRules.filter(rule => {
      const value = sensorData[rule.sensor];
      if (value === null || typeof value !== 'number') return false;

      return rule.condition === 'greater' 
        ? value > rule.threshold 
        : value < rule.threshold;
    });

    // Check for new alerts to show toast notifications
    const currentAlertIds = new Set(newActiveAlerts.map(alert => alert.id));
    const newAlerts = newActiveAlerts.filter(alert => !previousAlerts.has(alert.id));

    newAlerts.forEach(alert => {
      toast({
        title: `🚨 Beehouse Alert`,
        description: alert.message,
        variant: alert.severity === 'critical' ? 'destructive' : 'default',
      });
    });

    setActiveAlerts(newActiveAlerts);
    setPreviousAlerts(currentAlertIds);
  }, [sensorData, toast, previousAlerts]);

  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical');
  const warningAlerts = activeAlerts.filter(alert => alert.severity === 'warning');

  return (
    <Card className="bg-gradient-subtle border-amber/20 shadow-warm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {activeAlerts.length > 0 ? (
            <AlertTriangle className="w-5 h-5 text-warning" />
          ) : (
            <CheckCircle className="w-5 h-5 text-success" />
          )}
          Alert System
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            {activeAlerts.length} active
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeAlerts.length === 0 ? (
          <Alert className="border-success/20 bg-success/5">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertTitle className="text-success">All Systems Normal</AlertTitle>
            <AlertDescription className="text-success/80">
              All sensor readings are within acceptable ranges. Your bees are happy! 🐝
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {criticalAlerts.map(alert => (
              <Alert key={alert.id} className="border-red-500/20 bg-red-50 dark:bg-red-900/10">
                <XCircle className="h-4 w-4 text-red-500" />
                <AlertTitle className="text-red-700 dark:text-red-300">
                  Critical Alert
                </AlertTitle>
                <AlertDescription className="text-red-600 dark:text-red-400">
                  {alert.message}
                </AlertDescription>
              </Alert>
            ))}
            
            {warningAlerts.map(alert => (
              <Alert key={alert.id} className="border-warning/20 bg-orange-50 dark:bg-orange-900/10">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <AlertTitle className="text-orange-700 dark:text-orange-300">
                  Warning
                </AlertTitle>
                <AlertDescription className="text-orange-600 dark:text-orange-400">
                  {alert.message}
                </AlertDescription>
              </Alert>
            ))}
          </>
        )}
        
        {/* Status Summary */}
        <div className="pt-2 border-t border-border">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Last Update:</span>
            <span>{sensorData.timestamp.toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};