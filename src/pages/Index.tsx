import React from 'react';
import { Thermometer, Droplets, Weight, Battery, CloudDrizzle, Mic, DoorOpen, MapPin } from 'lucide-react';
import { SensorGauge } from '@/components/SensorGauge';
import { HistoricalChart } from '@/components/HistoricalChart';
import { MqttConnectionForm } from '@/components/MqttConnectionForm';
import { AlertPanel } from '@/components/AlertPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          
          <SensorGauge
            title="Battery"
            value={sensorData.battery}
            unit="%"
            min={0}
            max={100}
            icon={<Battery className="w-5 h-5 text-primary-foreground" />}
            warningThreshold={{ min: 20 }}
            criticalThreshold={{ min: 10 }}
          />
        </div>

        {/* Additional Sensors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SensorGauge
            title="External Humidity"
            value={sensorData.humidityExternal}
            unit="%"
            min={0}
            max={100}
            icon={<CloudDrizzle className="w-5 h-5 text-primary-foreground" />}
            warningThreshold={{ max: 85 }}
            criticalThreshold={{ max: 95 }}
          />
          
          <SensorGauge
            title="Sound Level"
            value={sensorData.microphone}
            unit="dB"
            min={0}
            max={120}
            icon={<Mic className="w-5 h-5 text-primary-foreground" />}
            warningThreshold={{ max: 80 }}
            criticalThreshold={{ max: 100 }}
          />
          
          <Card className="bg-gradient-subtle border-amber/20 shadow-warm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Door Status</CardTitle>
              <div className="p-2 bg-gradient-honey rounded-lg">
                <DoorOpen className="w-5 h-5 text-primary-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                <span className={sensorData.door === null ? 'text-muted-foreground' : 
                  sensorData.door ? 'text-warning' : 'text-success'}>
                  {sensorData.door === null ? '--' : 
                   sensorData.door ? 'OPEN' : 'CLOSED'}
                </span>
              </div>
              <div className="text-center">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  sensorData.door === null ? 'bg-muted text-muted-foreground' :
                  sensorData.door ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300' :
                  'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    sensorData.door === null ? 'bg-muted-foreground' :
                    sensorData.door ? 'bg-orange-500' : 'bg-green-500'
                  }`} />
                  {sensorData.door === null ? 'No Data' :
                   sensorData.door ? 'Open' : 'Secure'}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-subtle border-amber/20 shadow-warm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">GPS Location</CardTitle>
              <div className="p-2 bg-gradient-honey rounded-lg">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-mono mb-2">
                {sensorData.gps ? (
                  <>
                    <div>Lat: {sensorData.gps.lat.toFixed(6)}</div>
                    <div>Lon: {sensorData.gps.lon.toFixed(6)}</div>
                  </>
                ) : (
                  <span className="text-muted-foreground">No GPS data</span>
                )}
              </div>
              <div className="text-center">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  sensorData.gps === null ? 'bg-muted text-muted-foreground' :
                  'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    sensorData.gps === null ? 'bg-muted-foreground' : 'bg-green-500'
                  }`} />
                  {sensorData.gps === null ? 'No Signal' : 'Located'}
                </div>
              </div>
            </CardContent>
          </Card>
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
                title="Battery Level"
                dataKey="battery"
                unit="%"
                color="#9333EA"
              />
              
              <HistoricalChart
                data={historicalData}
                title="External Humidity"
                dataKey="humidityExternal"
                unit="%"
                color="#06B6D4"
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
            🐝 Beehouse IoT Dashboard - Topics: temperature, humidity, weight, battery, gps, microphone, door, humidity_external
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
