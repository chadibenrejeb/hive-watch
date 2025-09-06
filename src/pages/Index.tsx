import React from 'react';
import { Thermometer, Droplets, Weight } from 'lucide-react';
import { SensorGauge } from '@/components/SensorGauge';
import { HistoricalChart } from '@/components/HistoricalChart';
import { MqttConnectionForm } from '@/components/MqttConnectionForm';
import { AlertPanel } from '@/components/AlertPanel';
import { useMqttConnection } from '@/hooks/useMqttConnection';

const Index = () => {
  const {
    isConnected,
    sensorData,
    historicalData,
    connectionStatus,
    connect,
    disconnect,
  } = useMqttConnection();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-gradient-honey shadow-warm border-b border-amber/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-background/20 rounded-lg">
              <span className="text-2xl">🐝</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">
                Beehouse Monitor
              </h1>
              <p className="text-primary-foreground/80">
                IoT Dashboard for Smart Hive Management
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Connection Form */}
        <MqttConnectionForm
          onConnect={connect}
          onDisconnect={disconnect}
          isConnected={isConnected}
          connectionStatus={connectionStatus}
        />

        {/* Sensor Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SensorGauge
            title="Temperature"
            value={sensorData.temperature}
            unit="°C"
            min={0}
            max={50}
            icon={<Thermometer className="w-5 h-5 text-primary-foreground" />}
            warningThreshold={{ min: 15, max: 35 }}
            criticalThreshold={{ min: 10, max: 40 }}
          />
          
          <SensorGauge
            title="Humidity"
            value={sensorData.humidity}
            unit="%"
            min={0}
            max={100}
            icon={<Droplets className="w-5 h-5 text-primary-foreground" />}
            warningThreshold={{ min: 30, max: 70 }}
            criticalThreshold={{ max: 80 }}
          />
          
          <SensorGauge
            title="Hive Weight"
            value={sensorData.weight}
            unit="kg"
            min={0}
            max={100}
            icon={<Weight className="w-5 h-5 text-primary-foreground" />}
            warningThreshold={{ min: 20 }}
            criticalThreshold={{ min: 10 }}
          />
        </div>

        {/* Charts and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Historical Charts */}
          <div className="lg:col-span-2 space-y-6">
            <HistoricalChart
              data={historicalData}
              title="Temperature"
              dataKey="temperature"
              unit="°C"
              color="#FFC107"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <HistoricalChart
                data={historicalData}
                title="Humidity"
                dataKey="humidity"
                unit="%"
                color="#2196F3"
              />
              
              <HistoricalChart
                data={historicalData}
                title="Weight"
                dataKey="weight"
                unit="kg"
                color="#4CAF50"
              />
            </div>
          </div>

          {/* Alert Panel */}
          <div className="lg:col-span-1">
            <AlertPanel sensorData={sensorData} />
          </div>
        </div>

        {/* Footer Info */}
        <footer className="text-center text-sm text-muted-foreground pt-8 border-t border-border">
          <p>
            🐝 Beehouse IoT Dashboard - Monitoring topics: beehouse/sensor/temperature, beehouse/sensor/humidity, beehouse/sensor/weight
          </p>
          <p className="mt-2">
            Connect your ESP32 to HiveMQ broker and start monitoring your hive in real-time
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
