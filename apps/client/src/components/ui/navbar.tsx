import { Link } from 'react-router-dom';

export const Navbar = () => {
	return (
		<nav className='p-5'>
			<div>
				<Link to='/'>
					<img src='./images/logo.svg' alt='Guess the price logo' className='w-[260px]' />
				</Link>
			</div>
		</nav>
	);
};
