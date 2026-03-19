import * as Dialog from '@radix-ui/react-dialog'
import { X } from '@phosphor-icons/react'
import { Button } from './button'

interface ConfirmDialogProps {
   open: boolean
   onOpenChange: (open: boolean) => void
   title: string
   description: string
   onConfirm: () => void
   confirmText?: string
   cancelText?: string
   isLoading?: boolean
}

export function ConfirmDialog({
   open,
   onOpenChange,
   title,
   description,
   onConfirm,
   confirmText = 'Confirmar',
   cancelText = 'Cancelar',
   isLoading = false,
}: ConfirmDialogProps) {
   return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
         <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
               <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
                  {title}
               </Dialog.Title>
               <Dialog.Description className="text-sm text-gray-500">
                  {description}
               </Dialog.Description>
               <div className="flex justify-end gap-2">
                  <Dialog.Close asChild>
                     <Button.Root variant="secondary" disabled={isLoading}>
                        {cancelText}
                     </Button.Root>
                  </Dialog.Close>
                  <Button.Root
                     variant="primary"
                     onClick={onConfirm}
                     disabled={isLoading}
                  >
                     {isLoading ? 'Excluindo...' : confirmText}
                  </Button.Root>
               </div>
               <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
               </Dialog.Close>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   )
}