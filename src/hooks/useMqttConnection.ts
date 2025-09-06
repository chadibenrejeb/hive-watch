import { useState, useEffect, useRef, useCallback } from 'react';
import mqtt, { MqttClient } from 'mqtt';
import { useToast } from '@/hooks/use-toast';

export interface MqttConfig {
  brokerUrl: string;
  username?: string;
  password?: string;
  clientId?: string;
}

export interface SensorData {
  temperature: number | null;
  humidity: number | null;
  weight: number | null;
  battery: number | null;
  gps: { lat: number; lon: number } | null;
  microphone: number | null;
  door: boolean | null;
  humidityExternal: number | null;
  timestamp: Date;
}

export interface UseMqttConnectionReturn {
  isConnected: boolean;
  sensorData: SensorData;
  historicalData: SensorData[];
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  connect: (config: MqttConfig) => void;
  disconnect: () => void;
}

const defaultSensorData: SensorData = {
  temperature: null,
  humidity: null,
  weight: null,
  battery: null,
  gps: null,
  microphone: null,
  door: null,
  humidityExternal: null,
  timestamp: new Date(),
};

export const useMqttConnection = (): UseMqttConnectionReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [sensorData, setSensorData] = useState<SensorData>(defaultSensorData);
  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);
  const clientRef = useRef<MqttClient | null>(null);
  const { toast } = useToast();

  // Update historical data when sensor data changes
  useEffect(() => {
    if (sensorData.temperature !== null || sensorData.humidity !== null || sensorData.weight !== null || 
        sensorData.battery !== null || sensorData.microphone !== null || sensorData.humidityExternal !== null) {
      setHistoricalData(prev => {
        const newData = [...prev, { ...sensorData, timestamp: new Date() }];
        // Keep only last 50 data points
        return newData.slice(-50);
      });
    }
  }, [sensorData]);

  const connect = useCallback((config: MqttConfig) => {
    if (clientRef.current) {
      clientRef.current.end();
    }

    setConnectionStatus('connecting');
    
    const client = mqtt.connect(config.brokerUrl, {
      clientId: config.clientId || `beehouse_dashboard_${Math.random().toString(16).slice(2, 8)}`,
      username: config.username,
      password: config.password,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    });

    client.on('connect', () => {
      setIsConnected(true);
      setConnectionStatus('connected');
      toast({
        title: "🐝 Connected to Beehouse",
        description: "Successfully connected to MQTT broker",
      });

      // Subscribe to sensor topics
      const topics = [
        'beehouse/sensor/temperature',
        'beehouse/sensor/humidity',
        'beehouse/sensor/weight',
        'beehouse/sensor/battery',
        'beehouse/sensor/gps',
        'beehouse/sensor/microphone',
        'beehouse/sensor/door',
        'beehouse/sensor/humidity_external'
      ];
      
      topics.forEach(topic => {
        client.subscribe(topic, (err) => {
          if (err) {
            console.error(`Failed to subscribe to ${topic}:`, err);
          }
        });
      });
    });

    client.on('message', (topic, message) => {
      try {
        const messageStr = message.toString();
        
        setSensorData(prev => {
          const updated = { ...prev };
          
          switch (topic) {
            case 'beehouse/sensor/temperature':
              updated.temperature = parseFloat(messageStr);
              break;
            case 'beehouse/sensor/humidity':
              updated.humidity = parseFloat(messageStr);
              break;
            case 'beehouse/sensor/weight':
              updated.weight = parseFloat(messageStr);
              break;
            case 'beehouse/sensor/battery':
              updated.battery = parseFloat(messageStr);
              break;
            case 'beehouse/sensor/gps':
              try {
                const gpsData = JSON.parse(messageStr);
                updated.gps = { lat: gpsData.lat, lon: gpsData.lon };
              } catch {
                console.error('Invalid GPS data format');
              }
              break;
            case 'beehouse/sensor/microphone':
              updated.microphone = parseFloat(messageStr);
              break;
            case 'beehouse/sensor/door':
              updated.door = messageStr.toLowerCase() === 'true' || messageStr === '1';
              break;
            case 'beehouse/sensor/humidity_external':
              updated.humidityExternal = parseFloat(messageStr);
              break;
          }
          
          return updated;
        });
      } catch (error) {
        console.error('Error parsing MQTT message:', error);
      }
    });

    client.on('error', (error) => {
      setConnectionStatus('error');
      setIsConnected(false);
      toast({
        title: "Connection Error",
        description: "Failed to connect to MQTT broker",
        variant: "destructive",
      });
      console.error('MQTT connection error:', error);
    });

    client.on('offline', () => {
      setIsConnected(false);
      setConnectionStatus('disconnected');
    });

    client.on('reconnect', () => {
      setConnectionStatus('connecting');
    });

    clientRef.current = client;
  }, [toast]);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.end();
      clientRef.current = null;
    }
    setIsConnected(false);
    setConnectionStatus('disconnected');
    toast({
      title: "Disconnected",
      description: "Disconnected from MQTT broker",
    });
  }, [toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.end();
      }
    };
  }, []);

  return {
    isConnected,
    sensorData,
    historicalData,
    connectionStatus,
    connect,
    disconnect,
  };
};
