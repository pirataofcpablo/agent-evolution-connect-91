
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface DifyN8nConfigProps {
  n8nIntegration: boolean;
  setN8nIntegration: React.Dispatch<React.SetStateAction<boolean>>;
  n8nWebhookUrl: string;
  setN8nWebhookUrl: React.Dispatch<React.SetStateAction<string>>;
  webhookPayloadTemplate: string;
  setWebhookPayloadTemplate: React.Dispatch<React.SetStateAction<string>>;
  webhookPayloadExample: string;
  onGenerateExample: () => void;
}

const DifyN8nConfig: React.FC<DifyN8nConfigProps> = ({
  n8nIntegration,
  setN8nIntegration,
  n8nWebhookUrl,
  setN8nWebhookUrl,
  webhookPayloadTemplate,
  setWebhookPayloadTemplate,
  webhookPayloadExample,
  onGenerateExample
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">Usar n8n como intermediário</h3>
          <p className="text-sm text-gray-400">
            Encaminhe as mensagens para o n8n antes de enviar para o Dify
          </p>
        </div>
        <Switch 
          checked={n8nIntegration} 
          onCheckedChange={setN8nIntegration} 
        />
      </div>

      {n8nIntegration && (
        <div className="pl-4 border-l-2 border-blue-700/50 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="n8nWebhookUrl">URL do Webhook n8n</Label>
            <Input
              id="n8nWebhookUrl"
              placeholder="https://seu-n8n.com/webhook/123456"
              value={n8nWebhookUrl}
              onChange={(e) => setN8nWebhookUrl(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <p className="text-xs text-gray-400">
              Cole a URL do nó de webhook no seu fluxo n8n
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhookPayloadTemplate">Template do Payload Webhook</Label>
            <Input
              id="webhookPayloadTemplate"
              placeholder='{"message": "{{message}}", "sender": "{{sender}}", "instance": "{{instance}}", "timestamp": "{{timestamp}}"}'
              value={webhookPayloadTemplate}
              onChange={(e) => setWebhookPayloadTemplate(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <p className="text-xs text-gray-400">
              Use os placeholders {'{{'}{'{'}message{'}}'}{'}}'}, {'{{'}{'{'}sender{'}}'}{'}}'}, {'{{'}{'{'}instance{'}}'}{'}}'} e {'{{'}{'{'}timestamp{'}}'}{'}}'}
            </p>
          </div>

          <div className="flex justify-end">
            <Button 
              type="button"
              onClick={onGenerateExample}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Gerar Exemplo
            </Button>
          </div>

          {webhookPayloadExample && (
            <div className="space-y-2">
              <Label>Exemplo de Payload</Label>
              <pre className="bg-gray-800 rounded-md p-2 text-sm text-gray-300">
                {webhookPayloadExample}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DifyN8nConfig;
