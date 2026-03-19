import { CreateUrlForm } from '../components/create-url-form'
import { UrlsList } from '../components/urls-list'
import { Logo } from '../components/logo'

export function Home() {
   return (
      <main className="h-dvh bg-gray-200 flex justify-center px-3 py-4">
         <div className="w-full max-w-[980px] flex flex-col gap-6">

            <Logo />

            <div className="flex flex-col md:flex-row gap-5 flex-1 min-h-0">
               <CreateUrlForm />
               <UrlsList />
            </div>

         </div>
      </main>
   )
}
