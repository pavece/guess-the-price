import { MPSessionDatasource } from './mp-session-manager';

export class Housekeeper {
	private static readonly sessionDatasource = new MPSessionDatasource();
	private static runningRoundTick = false;

	public static startRoundClock() {
		if (this.runningRoundTick) return;
		console.log('Round clock running');
		setInterval(this.sessionDatasource.roundTick, 1000);
	}
}
