import { useMpStore } from '@/stores/mp-store';
import { useParams } from 'react-router-dom';

export const MultiplayerPage = () => {
	const { id } = useParams();
	const mpStore = useMpStore();

	console.log(mpStore)


	return (
		<div>
			<div className='mb-10'>
				<h1 className='font-semibold text-3xl'>Multiplayer</h1>
				<p className='text-zinc-800'>Play the classic mode with your friends.</p>
			</div>

			<p>{id}</p>
		</div>
	);
};
