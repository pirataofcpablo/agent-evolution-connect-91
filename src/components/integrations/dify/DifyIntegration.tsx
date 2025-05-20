
import React, { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { getDifyConfig, checkInstanceStatus, registerDifyBot } from '@/services/difyService';
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
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const savedConfig = getDifyConfig(instanceName);
    if (savedConfig) {
      setDifyApiKey(savedConfig.difyApiKey || "");
      setDifyApiUrl(savedConfig.difyUrl || "");
      setEnabled(savedConfig.enabled || false);
      setN8nIntegration(savedConfig.n8nIntegration || false);
      setN8nWebhookUrl(savedConfig.n8nWebhookUrl || "");
      setWebhookPayloadTemplate(savedConfig.webhookPayloadTemplate || '{"message": "{{message}}", "sender": "{{sender}}", "instance": "{{instance}}", "timestamp": "{{timestamp}}"}');
      
      // Check if already registered with Evolution API
      if (savedConfig.enabled) {
        checkRegistrationStatus();
      }
    }
  }, [instanceName]);

  const handleCheckInstanceStatus = async () => {
    setCheckingStatus(true);
    try {
      const status = await checkInstanceStatus(instanceName);
      
      // Convert the status object to a status message string
      const statusMessage = status.exists && status.connected ? "conectada" : "desconectada";
      setInstanceStatus(statusMessage);
      
      toast({
        title: "Status da instância",
        description: `A instância do Dify está ${statusMessage}`,
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

  // Check if the integration is registered with Evolution API
  const checkRegistrationStatus = async () => {
    try {
      // You can implement actual check logic here
      // For now, let's assume if config exists with enabled=true, it's registered
      const config = getDifyConfig(instanceName);
      setIsRegistered(Boolean(config?.enabled));
    } catch (error) {
      console.error("Error checking registration status:", error);
    }
  };

  // Register the bot with Evolution API
  const handleRegisterBot = async () => {
    setIsLoading(true);
    try {
      const config = getDifyConfig(instanceName);
      
      if (!config) {
        toast({
          title: "Erro",
          description: "Salve a configuração primeiro antes de registrar o bot.",
          variant: "destructive",
        });
        return;
      }
      
      const result = await registerDifyBot(instanceName, config);
      
      if (result.success) {
        setIsRegistered(true);
        toast({
          title: "Sucesso",
          description: "Bot Dify registrado com sucesso na Evolution API.",
        });
      } else {
        toast({
          title: "Erro",
          description: "Falha ao registrar o bot na Evolution API.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao registrar bot:", error);
      toast({
        title: "Erro",
        description: "Erro ao registrar o bot na Evolution API.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
        isRegistered={isRegistered}
        onRegisterBot={handleRegisterBot}
      />
    </div>
  );
};

export default DifyIntegration;
