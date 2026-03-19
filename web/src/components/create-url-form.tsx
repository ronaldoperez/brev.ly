import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { createUrl } from '../api/create-url'
import type { Url } from '../api/get-all-urls'
import { Button } from './button'
import { Input } from './input'

const createUrlFormSchema = z.object({
   originalUrl: z.string().url({ message: 'Informe uma URL válida.' }),
   shortCode: z
      .string()
      .min(3, { message: 'Informe pelo menos 3 caracteres.' })
      .regex(/^[a-z0-9-]+$/, {
         message:
            'Informe uma url minúscula usando apenas letras, números e hífens.',
      }),
})

type CreateUrlFormSchema = z.infer<typeof createUrlFormSchema>

export function CreateUrlForm() {
   const queryClient = useQueryClient()

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting },
   } = useForm<CreateUrlFormSchema>({
      resolver: zodResolver(createUrlFormSchema),
      defaultValues: {
         originalUrl: '',
         shortCode: '',
      },
   })

   const { mutateAsync: createUrlMutation } = useMutation({
      mutationFn: createUrl,
      onMutate: async newUrl => {
         await queryClient.cancelQueries({ queryKey: ['urls'] })
         const previousUrls = queryClient.getQueryData(['urls'])
         queryClient.setQueryData(['urls'], (oldUrls: Url[] = []) => [
            ...oldUrls,
            { ...newUrl, clicks: 0 },
         ])
         return { previousUrls }
      },
      onError: (_err, _newItem, context) => {
         if (context?.previousUrls) {
            queryClient.setQueryData(['urls'], context.previousUrls)
         }
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: ['urls'] })
      },
   })

   async function handleCreateUrl(data: CreateUrlFormSchema) {
      try {
         await createUrlMutation({
            originalUrl: data.originalUrl,
            shortCode: data.shortCode,
         })
         toast.success('Link encurtado com sucesso!')
         reset()
      } catch (error) {
         if (isAxiosError(error)) {
            toast.error(error.response?.data.message)
            return
         }
         console.error(error)
         toast.error('Erro ao encurtar a url. Tente novamente mais tarde.')
      }
   }

   return (
      <form
         className="w-full bg-gray-100 p-6 rounded-lg max-w-96 self-start"
         onSubmit={handleSubmit(handleCreateUrl)}
      >
         <fieldset>
            <legend className="text-lg text-gray-600 font-bold">Novo link</legend>
            <div className="mt-5">
               <Input.Label error={!!errors.originalUrl}>
                  LINK ORIGINAL
                  <Input.Root
                     error={!!errors.originalUrl}
                     aria-errormessage={errors.originalUrl?.message}
                  >
                     <Input.Control
                        type="text"
                        placeholder="www.exemplo.com.br"
                        {...register('originalUrl')}
                     />
                  </Input.Root>
               </Input.Label>
            </div>

            <div className="mt-5">
               <Input.Label error={!!errors.shortCode}>
                  LINK ENCURTADO
                  <Input.Root
                     error={!!errors.shortCode}
                     aria-errormessage={errors.shortCode?.message}
                     className="flex items-center gap-[1px]"
                  >
                     <Input.Prefix>brev.ly/</Input.Prefix>
                     <Input.Control type="text" {...register('shortCode')} />
                  </Input.Root>
               </Input.Label>
            </div>
         </fieldset>
         <Button.Root
            type="submit"
            className="mt-6 w-full"
            disabled={isSubmitting}
         >
            {isSubmitting ? 'Salvando...' : 'Salvar link'}
         </Button.Root>
      </form>
   )
}
