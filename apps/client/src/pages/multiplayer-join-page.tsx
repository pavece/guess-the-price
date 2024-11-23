import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { socket } from '@/socket';
import { PlayerDetailsOutgoingPayload, SessionDetailsOutgoingPayload } from '@/interfaces/mp-payloads.types';
import { Input } from '@/components/ui/input';
import { IncomingEvents, OutgoingEvents } from '@/interfaces/mp-events.types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMpStore } from '@/stores/mp-store';

export const MultiplayerJoinPage = () => {
	const [existingSessionId, setSessionId] = useState('');
	const navigate = useNavigate();
	const { setSession, setPlayer, sessionId } = useMpStore();

	const createSession = () => {
		socket.emit(IncomingEvents.PLAYER_JOIN_SESSION, {});
	};

	const joinSession = () => {
		if (existingSessionId.length > 0) {
			navigate(`/multiplayer/${existingSessionId}`);
		}
	};

	useEffect(() => {
		if(sessionId){
			navigate(`/multiplayer/${sessionId}`);
		}

		const onSessionDetails = (sessionPayload: SessionDetailsOutgoingPayload, playerPayload: PlayerDetailsOutgoingPayload) => {
			if (!sessionPayload || !playerPayload) return;

			setSession({ sessionId: sessionPayload.sessionId, sessionCurrentlyPlaying: sessionPayload.currentlyPlaying });
			setPlayer({ ...playerPayload, isHost: false });

			navigate(`/multiplayer/${sessionPayload.sessionId}`);
		};

		socket.connect();
		socket.on(OutgoingEvents.SESSION_DETAILS, onSessionDetails);

		return () => {
			socket.off('session:details', onSessionDetails);
		};
	}, [navigate, setPlayer, setSession]);

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
								value={existingSessionId}
							></Input>
							<Button className='w-full mt-4' disabled={existingSessionId.length <= 0} type='submit'>
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
