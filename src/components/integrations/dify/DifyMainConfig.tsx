
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">Habilitar Integração</h3>
          <p className="text-sm text-gray-400">Ative para conectar o Dify ao seu WhatsApp</p>
        </div>
        <Switch 
          checked={enabled} 
          onCheckedChange={setEnabled} 
        />
      </div>

      {enabled && (
        <div className="pl-4 border-l-2 border-blue-700/50 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="difyApiUrl">URL da API do Dify</Label>
            <Input
              id="difyApiUrl"
              placeholder="https://seu-dify.com/api"
              value={difyApiUrl}
              onChange={(e) => setDifyApiUrl(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="difyApiKey">API Key do Dify</Label>
            <Input
              id="difyApiKey"
              type="password"
              placeholder="Sua API Key do Dify"
              value={difyApiKey}
              onChange={(e) => setDifyApiKey(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="flex justify-end">
            <Button 
              type="button"
              onClick={onCheckInstanceStatus}
              disabled={checkingStatus}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {checkingStatus ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Verificar Status da Instância"
              )}
            </Button>
          </div>

          {instanceStatus && (
            <Alert className="mt-4 bg-green-900/20 border-green-500/30">
              <Check className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-500">Instância Ativa</AlertTitle>
              <AlertDescription className="text-gray-300">
                A instância do Dify está {instanceStatus}.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default DifyMainConfig;
