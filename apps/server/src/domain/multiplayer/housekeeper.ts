import { MPSessionDatasource } from './mp-session-manager';

export class Housekeeper {
	private static readonly sessionDatasource = new MPSessionDatasource();
	private static running = false;

	private static startRoundClock() {
		console.log('CLK -> Round clock running');
		setInterval(this.sessionDatasource.roundTick, 1000);
	}

	private static startCleanupClock() {
		console.log('CLK -> Cleanup clock running');
		setInterval(this.sessionDatasource.cleanupTick, 60000);
	}

	private static startPlayerCleanupClock() {
		console.log('CLK -> Player cleanup clock running');
		setInterval(this.sessionDatasource.playerCleanupTick, 10000);
	}

	public static start() {
		if (this.running) return;
		this.startRoundClock();
		this.startCleanupClock();
		this.startPlayerCleanupClock();
	}
}
