import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getUrl } from '../api/get-url'
import { Logo } from '../components/logo'
import { NotFound } from './not-found'

export function Redirect() {
   const { shortCode } = useParams<{ shortCode: string }>() || {}

   if (!shortCode) return <NotFound />

   const { isLoading, data, error } = useQuery({
      queryKey: ['redirect', shortCode],
      queryFn: () => getUrl(shortCode),
      retry: false,
      enabled: !!shortCode,
   })

   useEffect(() => {
      if (data?.originalUrl) {
         const timeout = setTimeout(() => {
            window.location.href = data.originalUrl
         }, 1000)
         return () => clearTimeout(timeout)
      }
   }, [data])

   if (!shortCode) return <NotFound />

   if (error) return <NotFound />
   return (
      <main className="h-dvh bg-gray-200 flex justify-center items-center px-3">
         <div className="w-full max-w-[480px] bg-white rounded-lg p-8 text-center">
            <div className="flex justify-center">
               <Logo className="w-48" />
            </div>
            <h2 className="text-2xl font-bold text-gray-600 mt-8">
               Redirecionando...
            </h2>
            <p className="text-gray-500 mt-4">
               O link será aberto automaticamente em alguns instantes.
               <br />
               Não foi redirecionado? <Link to="/" className="text-blue-base hover:underline">Acesse aqui</Link>
            </p>
         </div>
      </main>
   )

}
