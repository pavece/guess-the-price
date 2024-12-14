import { Link } from 'react-router-dom';
import { ThemeToggle } from './theme-toggle';

export const Navbar = () => {
	return (
		<nav className='p-5 flex justify-between'>
			<Link to='/'>
				<img src='/images/logo.svg' alt='Guess the price logo' className='w-[260px]' />
			</Link>
			<div>
				<ThemeToggle />
			</div>
		</nav>
	);
};
