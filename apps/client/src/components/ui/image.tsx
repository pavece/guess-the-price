import { useState } from 'react';

interface Props {
	src: string;
	alt: string;
	className?: string;
}

export const Image = ({ src, alt, className }: Props) => {
	const [loading, setLoading] = useState(true);

	return (
		<div
			className={`${className ?? 'w-[300px] '} aspect-square relative overflow-hidden rounded-md ${loading && 'bg-zinc-200 animate-pulse'}`}
		>
			<img src={src} alt={alt} className='object-cover absolute w-full' onLoad={() => setLoading(false)} />
		</div>
	);
};
