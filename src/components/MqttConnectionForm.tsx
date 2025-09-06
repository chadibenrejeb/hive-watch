import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff } from 'lucide-react';
import { MqttConfig } from '@/hooks/useMqttConnection';

interface MqttConnectionFormProps {
  onConnect: (config: MqttConfig) => void;
  onDisconnect: () => void;
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

export const MqttConnectionForm: React.FC<MqttConnectionFormProps> = ({
  onConnect,
  onDisconnect,
  isConnected,
  connectionStatus,
}) => {
  const [config, setConfig] = useState<MqttConfig>({
    brokerUrl: 'wss://your-hivemq-broker.com:8884/mqtt',
    username: '',
    password: '',
    clientId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isConnected) {
      onDisconnect();
    } else {
      onConnect(config);
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-success';
      case 'connecting': return 'text-warning';
      case 'error': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'error': return 'Connection Error';
      default: return 'Disconnected';
    }
  };

  return (
    <Card className="bg-gradient-subtle border-amber/20 shadow-warm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isConnected ? <Wifi className="w-5 h-5 text-success" /> : <WifiOff className="w-5 h-5 text-muted-foreground" />}
          MQTT Connection
          <span className={`text-sm font-normal ml-auto ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="brokerUrl">Broker URL</Label>
              <Input
                id="brokerUrl"
                type="text"
                placeholder="wss://your-broker.com:8884/mqtt"
                value={config.brokerUrl}
                onChange={(e) => setConfig(prev => ({ ...prev, brokerUrl: e.target.value }))}
                disabled={isConnected}
                className="bg-background/50"
              />
            </div>
            
            <div>
              <Label htmlFor="username">Username (optional)</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={config.username}
                onChange={(e) => setConfig(prev => ({ ...prev, username: e.target.value }))}
                disabled={isConnected}
                className="bg-background/50"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password (optional)</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={config.password}
                onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
                disabled={isConnected}
                className="bg-background/50"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className={`w-full ${isConnected 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-gradient-honey hover:opacity-90 text-primary-foreground'
            }`}
            disabled={connectionStatus === 'connecting'}
          >
            {connectionStatus === 'connecting' ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect to Beehouse'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};