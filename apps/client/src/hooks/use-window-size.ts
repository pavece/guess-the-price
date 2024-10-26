import { useEffect, useState } from 'react';

export const useWindowSize = () => {
	const [sizes, setSizes] = useState([window.innerWidth, window.innerHeight]);

	useEffect(() => {
		const handleResize = () => {
			setSizes([window.innerWidth, window.innerHeight]);
			console.log(sizes);
		};

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	return {
		width: sizes[0],
		height: sizes[1],
	};
};
