import React from 'react';
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { saveDifyConfig } from '@/services/difyService';
import { Check, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DifyMainConfig from './DifyMainConfig';
import DifyN8nConfig from './DifyN8nConfig';

interface DifyConfigFormProps {
  difyApiKey: string;
  setDifyApiKey: React.Dispatch<React.SetStateAction<string>>;
  difyApiUrl: string;
  setDifyApiUrl: React.Dispatch<React.SetStateAction<string>>;
  enabled: boolean;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  n8nIntegration: boolean;
  setN8nIntegration: React.Dispatch<React.SetStateAction<boolean>>;
  n8nWebhookUrl: string;
  setN8nWebhookUrl: React.Dispatch<React.SetStateAction<string>>;
  webhookPayloadTemplate: string;
  setWebhookPayloadTemplate: React.Dispatch<React.SetStateAction<string>>;
  webhookPayloadExample: string;
  setWebhookPayloadExample: React.Dispatch<React.SetStateAction<string>>;
  instanceName: string;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  checkingStatus: boolean;
  instanceStatus: string | null;
  onCheckInstanceStatus: () => Promise<void>;
}

const DifyConfigForm: React.FC<DifyConfigFormProps> = ({
  difyApiKey,
  setDifyApiKey,
  difyApiUrl,
  setDifyApiUrl,
  enabled,
  setEnabled,
  n8nIntegration,
  setN8nIntegration,
  n8nWebhookUrl,
  setN8nWebhookUrl,
  webhookPayloadTemplate,
  setWebhookPayloadTemplate,
  webhookPayloadExample,
  setWebhookPayloadExample,
  instanceName,
  isLoading,
  setIsLoading,
  checkingStatus,
  instanceStatus,
  onCheckInstanceStatus
}) => {
  
  const handleSaveIntegration = async (e: React.FormEvent) => {
    e.preventDefault();

    if (enabled && (!difyApiKey || !difyApiUrl)) {
      toast({
        title: "Campos obrigatórios",
        description: "Para habilitar a integração com o Dify, preencha a API Key e a URL da API.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Fix: Pass a single configuration object to saveDifyConfig with apiKey property
      saveDifyConfig({
        instanceName,
        apiKey: difyApiKey,  // Fix: added apiKey to match the required property in DifyConfig interface
        difyApiKey,
        difyUrl: difyApiUrl,
        enabled,
        n8nIntegration,
        n8nWebhookUrl,
        webhookPayloadTemplate
      });

      toast({
        title: "Integração realizada",
        description: "O Dify foi integrado com sucesso à instância " + instanceName,
      });
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
      toast({
        title: "Erro",
        description: "Houve um erro ao salvar a configuração do Dify.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebhookPayloadExample = () => {
    // Define variables for the payload example
    const messageText = "Hello, this is a test message";
    const senderPhone = "+551199998888";
    const instanceNameValue = "instance_name";
    const currentTimestamp = new Date().toISOString();

    let template = webhookPayloadTemplate || '{"message": "{{message}}", "sender": "{{sender}}", "instance": "{{instance}}", "timestamp": "{{timestamp}}"}';
    
    // Replace placeholders with actual values
    let examplePayload = template
      .replace(/{{message}}/g, messageText)
      .replace(/{{sender}}/g, senderPhone)
      .replace(/{{instance}}/g, instanceNameValue)
      .replace(/{{timestamp}}/g, currentTimestamp);
    
    try {
      const jsonObject = JSON.parse(examplePayload);
      setWebhookPayloadExample(JSON.stringify(jsonObject, null, 2));
    } catch (error) {
      console.error("Error parsing webhook template:", error);
      toast({
        title: "Erro no template",
        description: "O formato do template de webhook é inválido. Verifique o JSON.",
        variant: "destructive",
      });
      setWebhookPayloadExample('{"error": "Invalid template format"}');
    }
  };

  return (
    <form onSubmit={handleSaveIntegration} className="space-y-4">
      <DifyMainConfig
        enabled={enabled}
        setEnabled={setEnabled}
        difyApiUrl={difyApiUrl}
        setDifyApiUrl={setDifyApiUrl}
        difyApiKey={difyApiKey}
        setDifyApiKey={setDifyApiKey}
        checkingStatus={checkingStatus}
        instanceStatus={instanceStatus}
        onCheckInstanceStatus={onCheckInstanceStatus}
      />

      <DifyN8nConfig
        n8nIntegration={n8nIntegration}
        setN8nIntegration={setN8nIntegration}
        n8nWebhookUrl={n8nWebhookUrl}
        setN8nWebhookUrl={setN8nWebhookUrl}
        webhookPayloadTemplate={webhookPayloadTemplate}
        setWebhookPayloadTemplate={setWebhookPayloadTemplate}
        webhookPayloadExample={webhookPayloadExample}
        onGenerateExample={handleWebhookPayloadExample}
      />

      <div className="space-y-2">
        <Label>Configurações da Instância</Label>
        <div className="p-3 bg-gray-800 rounded-md">
          <div className="flex justify-between">
            <span className="text-gray-300">Instância conectada:</span>
            <span className="text-blue-400">{instanceName}</span>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end space-x-3">
        <Button 
          type="button" 
          variant="outline"
          className="border-gray-600 hover:bg-gray-800 hover:text-white"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? "Integrando..." : "Salvar Configuração"}
        </Button>
      </div>
    </form>
  );
};

export default DifyConfigForm;
