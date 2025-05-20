
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface N8nWebhookConfigProps {
  enableWebhook: boolean;
  setEnableWebhook: React.Dispatch<React.SetStateAction<boolean>>;
  webhookUrl: string;
  setWebhookUrl: React.Dispatch<React.SetStateAction<string>>;
  flowExists: boolean;
}

const N8nWebhookConfig: React.FC<N8nWebhookConfigProps> = ({
  enableWebhook,
  setEnableWebhook,
  webhookUrl,
  setWebhookUrl,
  flowExists
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">Integração via Webhook</h3>
          <p className="text-sm text-gray-400">Receba notificações do WhatsApp no n8n</p>
        </div>
        <Switch 
          checked={enableWebhook} 
          onCheckedChange={setEnableWebhook} 
        />
      </div>
      
      {enableWebhook && (
        <div className="pl-4 border-l-2 border-purple-700/50 space-y-2">
          <Label htmlFor="webhookUrl">URL do Webhook n8n</Label>
          <Input
            id="webhookUrl"
            placeholder="https://seu-n8n.com/webhook/123456"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            readOnly={flowExists}
          />
          <p className="text-xs text-gray-400">
            {flowExists 
              ? "Este webhook foi configurado automaticamente." 
              : "Cole a URL do nó de webhook no seu fluxo n8n"}
          </p>
        </div>
      )}
    </div>
  );
};

export default N8nWebhookConfig;
