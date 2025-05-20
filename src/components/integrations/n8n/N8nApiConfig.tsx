
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface N8nApiConfigProps {
  enableApi: boolean;
  setEnableApi: React.Dispatch<React.SetStateAction<boolean>>;
  n8nUrl: string;
  setN8nUrl: React.Dispatch<React.SetStateAction<string>>;
  apiKey: string;
  setApiKey: React.Dispatch<React.SetStateAction<string>>;
}

const N8nApiConfig: React.FC<N8nApiConfigProps> = ({
  enableApi,
  setEnableApi,
  n8nUrl,
  setN8nUrl,
  apiKey,
  setApiKey
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">Integração via API</h3>
          <p className="text-sm text-gray-400">Execute fluxos n8n a partir do WhatsApp</p>
        </div>
        <Switch 
          checked={enableApi} 
          onCheckedChange={setEnableApi} 
        />
      </div>
      
      {enableApi && (
        <div className="pl-4 border-l-2 border-purple-700/50 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="n8nUrl">URL do servidor n8n</Label>
            <Input
              id="n8nUrl"
              placeholder="https://seu-n8n.com"
              value={n8nUrl}
              onChange={(e) => setN8nUrl(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key do n8n</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Sua API Key do n8n"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default N8nApiConfig;
