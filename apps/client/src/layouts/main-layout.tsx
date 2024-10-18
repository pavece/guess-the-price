import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
	return (
		<div>
			<h1>MainLayout</h1>
			<Outlet />
		</div>
	);
};
