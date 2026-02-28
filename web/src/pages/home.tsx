import { CreateUrlForm } from '../components/create-url-form'
import { UrlsList } from '../components/urls-list'
import { Logo } from '../components/logo'

export function Home() {
   return (
      <main className="h-dvh bg-gray-200 flex justify-center items-center px-3">
         <div className="w-full flex flex-col gap-8 items-center md:items-start max-w-[980px]">
            <Logo />
            <div className="flex flex-col gap-5 items-center md:items-start md:flex-row w-full">
               <CreateUrlForm />
               <UrlsList />
            </div>
         </div>
      </main>
   )
}
