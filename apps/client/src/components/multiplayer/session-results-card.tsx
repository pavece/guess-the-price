import { PlayerSessionResultsRecord } from '@/interfaces/mp.interfaces';

interface Props {
	results: PlayerSessionResultsRecord[];
    roundsPlayed: number;
	isHost: boolean;
}

export const SessionResultsCard = ({ results, roundsPlayed, isHost }: Props) => {
	return <div>SessionResultsCard</div>;
};
