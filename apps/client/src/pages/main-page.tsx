import { GameModeCard } from '@/components/main-page/game-mode-card';

export const MainPage = () => {
	return (
		<div>
			<div>
				<h1 className='font-bold text-3xl'>Choose game mode</h1>
				<p className='text-md text-zinc-600 '>Choose your desired game mode and start guessing the price!</p>
			</div>

			<div className='py-12 flex flex-row flex-wrap gap-4'>
				<GameModeCard
					title='Classic mode'
					description='Get a product and guess the price.'
					imageSrc='/images/classic-mode-image.svg'
					link='/classic-mode'
				/>
				<GameModeCard
					title='This or that'
					description='Guess which product is more expensive.'
					imageSrc='/images/this-or-that-mode-image.svg'
					link='/this-that'
				/>
				<GameModeCard
					title='Multiplayer mode (disabled)'
					description='Check the github page to get more info.'
					imageSrc='/images/multiplayer-mode-image.svg'
					link='/'
					disabled
				/>
			</div>
		</div>
	);
};
