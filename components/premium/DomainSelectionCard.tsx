import { Card, CardBody, CardHeader } from "@heroui/react";
import { Select, SelectItem } from "@heroui/select";
import { TokenMetadata } from "@/hooks/useOwnershipToken";
import { shortenAddress } from "@/utils/token";

interface DomainSelectionCardProps {
  formData: any;
  setFormData: (data: any) => void;
  ownedTokens: TokenMetadata[];
  isLoading: boolean;
  errors: Record<string, string>;
}

export function DomainSelectionCard({
  formData,
  setFormData,
  ownedTokens,
  isLoading,
  errors,
}: DomainSelectionCardProps) {

  const tokenText = (token: TokenMetadata) => {
    return `${token.name} (#${shortenAddress(token.tokenId.toString())})`;
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="3.27,6.96 12,12.01 20.73,6.96" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="22.08" x2="12" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Domain Selection</h3>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <Select
          label="Select Domain Token"
          placeholder="Choose a domain to auction"
          isLoading={isLoading}
          selectedKeys={formData.tokenId ? [formData.tokenId] : []}
          onSelectionChange={(keys) => {
            const tokenId = Array.from(keys)[0] as string;
            setFormData({ ...formData, tokenId });
          }}
          errorMessage={errors.tokenId}
          isInvalid={!!errors.tokenId}
        >
          {ownedTokens.map((token) => (
            <SelectItem key={token.tokenId} textValue={tokenText(token)}>
              {tokenText(token)})
            </SelectItem>
          ))}
        </Select>
      </CardBody>
    </Card>
  );
}