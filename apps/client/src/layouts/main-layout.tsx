import { Footer } from '@/components/ui/footer';
import { Navbar } from '@/components/ui/navbar';
import { Toaster } from '@/components/ui/sonner';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
	return (
		<>
			<Toaster position='top-right' richColors closeButton theme='light' toastOptions={{}} />

			<div className='hidden dark:block absolute top-0 z-[-2] h-screen w-screen bg-zinc-950 bg-[radial-gradient(#ffffff33_1px,#09090b_1px)] bg-[size:20px_20px]'></div>
			<div className='dark:hidden fixed inset-0 top-0 right-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]'></div>

			<div className='flex flex-col justify-between min-h-screen dark:text-white'>
				<div>
					<Navbar />
					<main className='px-5 py-8 flex flex-col w-full items-center'>
						<div className='max-w-[1400px] w-full'>
							<Outlet />
						</div>
					</main>
				</div>
				<div className='w-full flex justify-center p-4'>
					<div className='max-w-[1400px] w-full'>
						<Footer />
					</div>
				</div>
			</div>
		</>
	);
};
