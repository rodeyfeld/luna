export type Phase = 'new' | 'crescent' | 'half' | 'gibbous' | 'full' | 'eclipse';

export interface StatusInfo {
	label: string;
	phase: Phase;
	/** Tailwind text color class for the glyph and label */
	tone: string;
	/** true while work is still happening; the glyph slowly waxes */
	live?: boolean;
}

// Study lifecycle drawn as the moon's: new → waxing → full, eclipsed on failure.
const STATUS: Record<string, StatusInfo> = {
	INITIALIZED: { label: 'Initialized', phase: 'new', tone: 'text-haze' },
	PENDING: { label: 'Pending', phase: 'crescent', tone: 'text-dust', live: true },
	RUNNING: { label: 'Running', phase: 'half', tone: 'text-tide', live: true },
	IN_PROGRESS: { label: 'In progress', phase: 'gibbous', tone: 'text-tide', live: true },
	COMPLETE: { label: 'Complete', phase: 'full', tone: 'text-sage' },
	COMPLETED: { label: 'Completed', phase: 'full', tone: 'text-sage' },
	SUCCESS: { label: 'Success', phase: 'full', tone: 'text-sage' },
	ANOMALOUS: { label: 'Anomalous', phase: 'crescent', tone: 'text-sodium' },
	FAILED: { label: 'Failed', phase: 'eclipse', tone: 'text-rust' },
	ERROR: { label: 'Error', phase: 'eclipse', tone: 'text-rust' },
	ACTIVE: { label: 'Active', phase: 'full', tone: 'text-sage' },
	INACTIVE: { label: 'Inactive', phase: 'new', tone: 'text-haze' }
};

export function statusInfo(status: string | null | undefined): StatusInfo {
	const key = (status || '').toUpperCase();
	if (STATUS[key]) return STATUS[key];
	const label = key
		? key
				.split('_')
				.map((w) => w.charAt(0) + w.slice(1).toLowerCase())
				.join(' ')
		: 'Unknown';
	return { label, phase: 'new', tone: 'text-haze' };
}
