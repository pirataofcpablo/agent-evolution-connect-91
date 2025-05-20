
import React from 'react';
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  saveN8nConfig, 
  createN8nFlow
} from '@/services/n8nService';
import { AlertTriangle, Check, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import N8nWebhookConfig from './N8nWebhookConfig';
import N8nApiConfig from './N8nApiConfig';

interface N8nConfigTabProps {
  instanceName: string;
  webhookUrl: string;
  setWebhookUrl: React.Dispatch<React.SetStateAction<string>>;
  apiKey: string;
  setApiKey: React.Dispatch<React.SetStateAction<string>>;
  n8nUrl: string;
  setN8nUrl: React.Dispatch<React.SetStateAction<string>>;
  enableWebhook: boolean;
  setEnableWebhook: React.Dispatch<React.SetStateAction<boolean>>;
  enableApi: boolean;
  setEnableApi: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  flowExists: boolean;
  setFlowExists: React.Dispatch<React.SetStateAction<boolean>>;
  checkingFlow: boolean;
}

const N8nConfigTab: React.FC<N8nConfigTabProps> = ({
  instanceName,
  webhookUrl,
  setWebhookUrl,
  apiKey,
  setApiKey,
  n8nUrl,
  setN8nUrl,
  enableWebhook,
  setEnableWebhook,
  enableApi,
  setEnableApi,
  isLoading,
  setIsLoading,
  flowExists,
  setFlowExists,
  checkingFlow
}) => {
  const handleCreateFlow = async () => {
    setIsLoading(true);
    console.log(`Attempting to create automatic flow for ${instanceName}`);
    
    try {
      // Add more logging for debugging
      console.log("Creating n8n flow with params:", {
        instanceName,
        userName: instanceName,
        webhookUrl: ""
      });
      
      const result = await createN8nFlow({
        instanceName,
        userName: instanceName,
        webhookUrl: ""
      });
      
      console.log("Create flow result:", result);
      
      if (result.success && result.webhookUrl) {
        setWebhookUrl(result.webhookUrl);
        setFlowExists(true);
        setEnableWebhook(true);
        
        console.log("Flow created successfully, saving config with webhook URL:", result.webhookUrl);
        
        // Save the n8n config with the new webhook URL
        saveN8nConfig(instanceName, {
          webhookUrl: result.webhookUrl,
          apiKey,
          n8nUrl,
          enableWebhook: true,
          enableApi,
          aiModel: null,
          aiApiKey: undefined
        });
        
        toast({
          title: "Fluxo criado com sucesso",
          description: "Um novo fluxo no n8n foi criado para " + instanceName,
        });
      } else {
        console.error("Failed to create flow, response:", result);
        toast({
          title: "Erro",
          description: "Não foi possível criar o fluxo no n8n. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating flow:", error);
      toast({
        title: "Erro",
        description: "Houve um erro ao criar o fluxo no n8n: " + (error instanceof Error ? error.message : String(error)),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveIntegration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (enableWebhook && !webhookUrl) {
      toast({
        title: "URL do Webhook obrigatória",
        description: "Por favor, insira a URL do webhook do n8n",
        variant: "destructive",
      });
      return;
    }

    if (enableApi && (!apiKey || !n8nUrl)) {
      toast({
        title: "Campos obrigatórios",
        description: "Para usar a API do n8n, preencha a URL e a API Key",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Salvar a configuração
      saveN8nConfig(instanceName, {
        webhookUrl,
        apiKey,
        n8nUrl,
        enableWebhook,
        enableApi,
        aiModel: null,
        aiApiKey: undefined
      });
      
      toast({
        title: "Integração realizada",
        description: "O n8n foi integrado com sucesso à instância " + instanceName,
      });
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
      toast({
        title: "Erro",
        description: "Houve um erro ao salvar a configuração do n8n.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingFlow) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        <p className="ml-2 text-gray-400">Verificando configuração...</p>
      </div>
    );
  }

  return (
    <>
      {flowExists ? (
        <Alert className="bg-green-900/20 border-green-500/30 mb-6">
          <Check className="h-5 w-5 text-green-500" />
          <AlertTitle className="text-green-500">Fluxo já configurado</AlertTitle>
          <AlertDescription className="text-gray-300">
            Detectamos que você já possui um fluxo n8n configurado para esta instância.
            Você pode gerenciar suas configurações abaixo.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-yellow-900/20 border-yellow-500/30 mb-6">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <AlertTitle className="text-yellow-500">Fluxo não detectado</AlertTitle>
          <AlertDescription className="text-gray-300">
            Não detectamos um fluxo n8n para esta instância. Clique em "Criar Fluxo Automático"
            para configurar seu fluxo agora.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSaveIntegration} className="space-y-4">
        {!flowExists && (
          <div className="mb-6 flex justify-center">
            <Button 
              type="button"
              onClick={handleCreateFlow}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando Fluxo...
                </>
              ) : (
                "Criar Fluxo Automático"
              )}
            </Button>
          </div>
        )}
        
        <N8nWebhookConfig 
          enableWebhook={enableWebhook}
          setEnableWebhook={setEnableWebhook}
          webhookUrl={webhookUrl}
          setWebhookUrl={setWebhookUrl}
          flowExists={flowExists}
        />

        <N8nApiConfig 
          enableApi={enableApi}
          setEnableApi={setEnableApi}
          n8nUrl={n8nUrl}
          setN8nUrl={setN8nUrl}
          apiKey={apiKey}
          setApiKey={setApiKey}
        />

        <div className="space-y-2">
          <Label>Configurações da Instância</Label>
          <div className="p-3 bg-gray-800 rounded-md">
            <div className="flex justify-between">
              <span className="text-gray-300">Instância conectada:</span>
              <span className="text-purple-400">{instanceName}</span>
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
            disabled={isLoading || (flowExists && enableWebhook)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? "Integrando..." : "Salvar Configuração"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default N8nConfigTab;
