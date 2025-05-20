
import React, { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { getDifyConfig, checkInstanceStatus } from '@/services/difyService';
import DifyIntegrationHeader from './DifyIntegrationHeader';
import DifyConfigForm from './DifyConfigForm';

interface DifyIntegrationProps {
  instanceName: string;
}

const DifyIntegration: React.FC<DifyIntegrationProps> = ({ instanceName }) => {
  const [difyApiKey, setDifyApiKey] = useState("");
  const [difyApiUrl, setDifyApiUrl] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [n8nIntegration, setN8nIntegration] = useState(false);
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState("");
  const [webhookPayloadTemplate, setWebhookPayloadTemplate] = useState('{"message": "{{message}}", "sender": "{{sender}}", "instance": "{{instance}}", "timestamp": "{{timestamp}}"}');
  const [webhookPayloadExample, setWebhookPayloadExample] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [instanceStatus, setInstanceStatus] = useState<string | null>(null);

  useEffect(() => {
    const savedConfig = getDifyConfig(instanceName);
    if (savedConfig) {
      setDifyApiKey(savedConfig.difyApiKey || "");
      setDifyApiUrl(savedConfig.difyUrl || "");
      setEnabled(savedConfig.enabled);
      setN8nIntegration(savedConfig.n8nIntegration || false);
      setN8nWebhookUrl(savedConfig.n8nWebhookUrl || "");
      setWebhookPayloadTemplate(savedConfig.webhookPayloadTemplate || '{"message": "{{message}}", "sender": "{{sender}}", "instance": "{{instance}}", "timestamp": "{{timestamp}}"}');
    }
  }, [instanceName]);

  const handleCheckInstanceStatus = async () => {
    setCheckingStatus(true);
    try {
      const status = await checkInstanceStatus(difyApiUrl, difyApiKey);
      setInstanceStatus(status);
      toast({
        title: "Status da instância",
        description: `A instância do Dify está ${status}`,
      });
    } catch (error) {
      console.error("Erro ao verificar status da instância:", error);
      setInstanceStatus(null);
      toast({
        title: "Erro",
        description: "Houve um erro ao verificar o status da instância do Dify.",
        variant: "destructive",
      });
    } finally {
      setCheckingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      <DifyIntegrationHeader />
      
      <DifyConfigForm
        difyApiKey={difyApiKey}
        setDifyApiKey={setDifyApiKey}
        difyApiUrl={difyApiUrl}
        setDifyApiUrl={setDifyApiUrl}
        enabled={enabled}
        setEnabled={setEnabled}
        n8nIntegration={n8nIntegration}
        setN8nIntegration={setN8nIntegration}
        n8nWebhookUrl={n8nWebhookUrl}
        setN8nWebhookUrl={setN8nWebhookUrl}
        webhookPayloadTemplate={webhookPayloadTemplate}
        setWebhookPayloadTemplate={setWebhookPayloadTemplate}
        webhookPayloadExample={webhookPayloadExample}
        setWebhookPayloadExample={setWebhookPayloadExample}
        instanceName={instanceName}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        checkingStatus={checkingStatus}
        instanceStatus={instanceStatus}
        onCheckInstanceStatus={handleCheckInstanceStatus}
      />
    </div>
  );
};

export default DifyIntegration;
