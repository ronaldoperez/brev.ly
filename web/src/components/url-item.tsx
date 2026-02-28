import { Copy, Trash } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'react-toastify'
import { deleteUrl } from '../api/delete-url'
import type { Url } from '../api/get-all-urls'
import { env } from '../env'
import { Button } from './button'

interface UrlItemProps {
   url: Url
}

export function UrlItem({ url }: UrlItemProps) {
   const queryClient = useQueryClient()
   const { id, shortCode, originalUrl, clicks  } = url

   const { mutateAsync: deleteUrlMutation, isPending: isLoading } = useMutation({
      mutationFn: deleteUrl,
      onMutate: async deletedShortCode => {
         await queryClient.cancelQueries({ queryKey: ['urls'] })
         const previousUrls = queryClient.getQueryData(['urls'])
         queryClient.setQueryData(['urls'], (old: Url[] = []) => {
            return old.filter(url => url.id !== deletedShortCode)
         })
         return { previousUrls }
      },
      onError: (_err, _deletedShortCode, context) => {
         queryClient.setQueryData(['urls'], context?.previousUrls)
         toast.error('Erro ao excluir a url.')
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: ['urls'] })
      },
      onSuccess: () => {
         toast.success('Url excluída com sucesso!')
      },
   })

   async function handleCopyUrl() {
      const shortUrl = `${env.VITE_APP_URL}/${shortCode}`
      await navigator.clipboard.writeText(shortUrl)
      toast.success('Url copiada para a área de transferência!')
   }

   async function handleDeleteUrl() {
      const confirmed = window.confirm(
         `Tem certeza que deseja excluir o link "${shortCode}"?`
      )
      if (!confirmed) return

      try {
         await deleteUrlMutation(id)
      } catch (error) {
         if (isAxiosError(error)) {
            toast.error(error.response?.data.message)
            return
         }
         console.error(error)
      }
   }

   return (
      <li className="flex items-center gap-3 py-4 border-t border-gray-200">
         <a
            href={`${env.VITE_APP_URL}/${shortCode}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-0"
         >
            <p className="text-blue-base font-medium text-sm line-clamp-1">
               brev.ly/{shortCode}
            </p>
            <p className="text-xs text-gray-500 line-clamp-1">{originalUrl}</p>
         </a>

         <span className="text-xs text-gray-500 mr-5">{clicks > 1 ? `${clicks} acessos` : `${clicks} acesso`}</span>

         <div className="flex gap-2">
            <Button.Root
               variant="secondary"
               title="Copiar url"
               onClick={handleCopyUrl}
            >
               <Button.Icon>
                  <Copy size={16} />
               </Button.Icon>
            </Button.Root>

            <Button.Root
               variant="secondary"
               title="Excluir url"
               className="hover:border-danger"
               onClick={handleDeleteUrl}
               disabled={isLoading}
            >
               <Button.Icon>
                  <Trash size={16} />
               </Button.Icon>
            </Button.Root>
         </div>
      </li>
   )
}
