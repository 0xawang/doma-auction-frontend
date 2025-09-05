import { Button } from '@heroui/button'
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from '@heroui/modal'
import { useConnect, useDisconnect, useAccount, useBalance } from 'wagmi'
import { useState, useEffect } from 'react'
import { formatEther } from 'viem'
import { shortenAddress } from '@/utils/token'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  const handleConnect = (connector: any) => {
    connect({ connector })
    onClose()
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <div className="font-medium">{balance ? parseFloat(formatEther(balance.value)).toFixed(4) : '0'} ETH</div>
          <div className="text-success">{shortenAddress(address)}</div>
        </div>
        <Button size="md" variant="bordered" onPress={() => disconnect()}>
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <>
      <Button color="primary" radius="full" onPress={onOpen}>
        Connect Wallet
      </Button>
      
      <Modal backdrop='blur' isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Connect Wallet</ModalHeader>
          <ModalBody className="pb-6">
            <div className="space-y-3">
              {connectors.map((connector) => {
                const getWalletIcon = (name: string) => {
                  if (name.toLowerCase().includes('metamask')) return '🦊'
                  if (name.toLowerCase().includes('walletconnect')) return '🔗'
                  if (name.toLowerCase().includes('coinbase')) return '🔵'
                  return '💼'
                }
                
                return (
                  <Button
                    key={connector.id}
                    variant="bordered"
                    className="w-full justify-start h-14 transition-all duration-200 hover:bg-primary/10 hover:border-primary hover:scale-[1.02] hover:shadow-lg"
                    onPress={() => handleConnect(connector)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getWalletIcon(connector.name)}</span>
                      <span className="font-medium">{connector.name}</span>
                    </div>
                  </Button>
                )
              })}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}