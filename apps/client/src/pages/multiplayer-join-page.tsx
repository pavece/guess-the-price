import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const MultiplayerJoinPage = () => {
	const [sessionId, setSessionId] = useState('');
	const navigate = useNavigate();

	const createSession = () => {};

	const joinSession = () => {
		if (sessionId.length > 0) {
			navigate(`/multiplayer/${sessionId}`);
		}
	};

	return (
		<div>
			<div className='mb-10'>
				<h1 className='font-semibold text-3xl'>Multiplayer</h1>
				<p className='text-zinc-800'>Create or join a session to start playing with your friends.</p>
			</div>
			<div className='flex gap-4 flex-col md:flex-row'>
				<Card className='w-full h-fit'>
					<CardHeader>
						<CardTitle>Create new session</CardTitle>
						<CardDescription>Create a new session and let your friends join.</CardDescription>
					</CardHeader>
					<CardContent>
						<Button className='w-full' onClick={createSession}>
							Create new session
						</Button>
					</CardContent>
				</Card>

				<Card className='w-full h-fit'>
					<CardHeader>
						<CardTitle>Join a session</CardTitle>
						<CardDescription>Join an existing session and play with your friends.</CardDescription>
					</CardHeader>
					<CardContent>
						<form onClick={joinSession}>
							<Input
								placeholder='Enter session code...'
								onChange={e => setSessionId(e.target.value)}
								value={sessionId}
							></Input>
							<Button className='w-full mt-4' disabled={sessionId.length <= 0} type='submit'>
								Join
							</Button>
						</form>
					</CardContent>
					<CardFooter>
						<p className='text-sm'>
							If your friend sent you a session link just click it. If not enter the session code here.
						</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
};
