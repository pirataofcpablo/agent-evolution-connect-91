
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, Loader2, AlertTriangle } from 'lucide-react';

interface DifyMainConfigProps {
  enabled: boolean;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  difyApiUrl: string;
  setDifyApiUrl: React.Dispatch<React.SetStateAction<string>>;
  difyApiKey: string;
  setDifyApiKey: React.Dispatch<React.SetStateAction<string>>;
  checkingStatus: boolean;
  instanceStatus: string | null;
  onCheckInstanceStatus: () => Promise<void>;
}

const DifyMainConfig: React.FC<DifyMainConfigProps> = ({
  enabled,
  setEnabled,
  difyApiUrl,
  setDifyApiUrl,
  difyApiKey,
  setDifyApiKey,
  checkingStatus,
  instanceStatus,
  onCheckInstanceStatus
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-base">Ativar Integração</Label>
          <div className="text-sm text-gray-400">
            Habilita ou desabilita o processamento de mensagens pelo Dify
          </div>
        </div>
        <Switch 
          checked={enabled} 
          onCheckedChange={setEnabled}
          className="data-[state=checked]:bg-blue-600"
        />
      </div>

      {enabled && (
        <>
          <div className="space-y-2">
            <Label htmlFor="difyApiUrl">URL da API Dify</Label>
            <Input
              id="difyApiUrl"
              placeholder="https://api.dify.ai/v1"
              value={difyApiUrl}
              onChange={(e) => setDifyApiUrl(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="difyApiKey">API Key do Dify</Label>
            <Input
              id="difyApiKey"
              placeholder="app-xxxxxxxxxxxxxxxx"
              value={difyApiKey}
              onChange={(e) => setDifyApiKey(e.target.value)}
              type="password"
              className="bg-gray-800 border-gray-700"
            />
            <div className="text-xs text-gray-400">
              Obtenha sua API Key no console do Dify.ai em Configurações &gt; API Keys
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Status da Instância Dify</Label>
              <Button 
                onClick={onCheckInstanceStatus} 
                variant="outline" 
                size="sm"
                disabled={checkingStatus}
                className="border-gray-700"
              >
                {checkingStatus ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verificando...</>
                ) : (
                  <>Verificar Status</>
                )}
              </Button>
            </div>
            
            {instanceStatus && (
              <Alert className={`${
                instanceStatus === "conectada" 
                  ? "border-green-500/30 bg-green-900/20" 
                  : "border-yellow-500/30 bg-yellow-900/20"
              }`}>
                {instanceStatus === "conectada" ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                )}
                <AlertDescription>
                  {instanceStatus === "conectada"
                    ? "Sua instância Dify está conectada e pronta para processar mensagens"
                    : "Sua instância Dify não está conectada. Verifique a URL e API Key informadas"}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DifyMainConfig;
