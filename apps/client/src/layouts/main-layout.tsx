import { Footer } from '@/components/ui/footer';
import { Navbar } from '@/components/ui/navbar';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
	return (
		<>
			<div className='absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]'></div>
			<div className='flex flex-col justify-between min-h-screen'>
				<div>
					<Navbar />
					<main className='px-5 py-3 flex flex-col'>
						<Outlet />
					</main>
				</div>
				<Footer />
			</div>
		</>
	);
};
