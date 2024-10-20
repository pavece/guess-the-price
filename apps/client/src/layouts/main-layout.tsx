import { Footer } from '@/components/ui/footer';
import { Navbar } from '@/components/ui/navbar';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
	return (
		<>
			<div className='fixed inset-0 top-0 right-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]'></div>
			<div className='flex flex-col justify-between min-h-screen'>
				<div>
					<Navbar />
					<main className='px-5 py-3 flex flex-col w-full items-center'>
						<div className='max-w-[1400px] w-full'>
							<Outlet />
						</div>
					</main>
				</div>
				<Footer />
			</div>
		</>
	);
};
