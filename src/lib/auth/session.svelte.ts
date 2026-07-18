/**
 * Sesión de demo del panel (en memoria, runes). Credenciales fijas demo.
 * Se reinicia al recargar, en coherencia con el store de datos ficticio.
 * En producción esto se sustituye por auth real de Supabase (ver ROADMAP-BACKEND.md).
 */
const DEMO_USER = 'demo';
const DEMO_PASS = 'demo2026';

class Session {
	authenticated = $state(false);

	login(user: string, pass: string): boolean {
		if (user.trim() === DEMO_USER && pass === DEMO_PASS) {
			this.authenticated = true;
			return true;
		}
		return false;
	}

	logout(): void {
		this.authenticated = false;
	}
}

export const session = new Session();
