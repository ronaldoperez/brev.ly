import { DownloadSimple, Link, Spinner } from '@phosphor-icons/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'react-toastify'
import { exportUrls } from '../api/export-urls'
import { getAllUrls } from '../api/get-all-urls'
import { Button } from './button'
import { UrlItem } from './url-item'

export function UrlsList() {
   const { data: urls, isLoading } = useQuery({
      queryKey: ['urls'],
      queryFn: getAllUrls,
      refetchInterval: 1000 * 60 * 5, // 5 minutes
   })

   const { mutateAsync: exportUrlsMutation, isPending: isExporting } =
      useMutation({
         mutationFn: exportUrls,
         onSuccess: data => {
            window.open(data.reportUrl, '_blank')
            toast.success('Relatório gerado com sucesso!')
         },
         onError: error => {
            if (isAxiosError(error)) {
               toast.error(error.response?.data.message || 'Erro ao gerar o relatório')
               return
            }
            toast.error('Erro ao gerar o relatório')
         },
      })

   async function handleExportUrls() {
      await exportUrlsMutation()
   }

   return (
      <section className="
         w-full
         bg-gray-100
         p-6
         rounded-lg
         flex-1
         flex
         flex-col
         min-h-0
         relative
      ">

         <div className="absolute top-0 left-0 right-0">
            <div className="h-1 w-full bg-gray-100">
               {isLoading && <div className="h-1 w-[30%] bg-blue-base absolute animate-loading" />}
            </div>
         </div>
         <div className="flex justify-between items-center">
            <h1 className="text-lg text-gray-600 font-bold">Meus links</h1>
            <Button.Root
               variant="secondary"
               className="max-h-8"
               onClick={handleExportUrls}
               disabled={isExporting || urls?.length === 0}
            >
               <Button.Icon>
                  {isExporting ? (
                     <Spinner size={16} className="animate-spin" />
                  ) : (
                     <DownloadSimple size={16} />
                  )}
               </Button.Icon>
               Baixar CSV
            </Button.Root>
         </div>

         <ul className="mt-5 overflow-y-auto flex-1 min-h-0 pr-1">
            {isLoading ? (
               <div className="flex flex-col items-center justify-center gap-4 pt-5 border-t border-gray-200 text-sm mt-5">
                  <Spinner size={32} className="text-gray-400 animate-spin" />
                  <p className="text-gray-400">Carregando links...</p>
               </div>
            ) : urls?.length === 0 ? (
               <p className="text-gray-400 flex flex-col gap-4 pt-5 items-center border-t border-gray-200 text-xs mt-5 uppercase">
                  <Link size={32} />
                  Ainda não há links cadastrados.
               </p>
            ) : (
               urls?.map(url => <UrlItem key={url.shortCode} url={url} />)
            )}
         </ul>
      </section>
   )
}
