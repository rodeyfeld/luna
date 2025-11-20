import { derived, get, writable, type Readable, type Writable } from 'svelte/store';

type SortDirection = 'asc' | 'desc' | null;

export type TableHandlerOptions<T> = {
	rowsPerPage?: number;
	searchKeys?: Array<keyof T | string>;
};

type RowCount = {
	start: number;
	end: number;
	total: number;
};

export class TableHandler<T extends Record<string, any> = Record<string, any>> {
	public readonly rows: Readable<T[]>;

	private originalRows: T[] = [];
	private filteredRows: Writable<T[]>;
	private rowsPerPage: Writable<number>;
	private pageNumber: Writable<number>;
	private sortState: Writable<{ identifier: string | null; direction: SortDirection }>;
	private rowCount: Readable<RowCount>;
	private pageCount: Readable<number>;
	private pages: Readable<(number | null)[]>;
	private filters: Record<string, string> = {};
	private searchValue = '';

	constructor(rows: T[] = [], private readonly options: TableHandlerOptions<T> = {}) {
		this.originalRows = rows ?? [];
		this.filteredRows = writable<T[]>([]);
		this.rowsPerPage = writable(options.rowsPerPage ?? 10);
		this.pageNumber = writable(1);
		this.sortState = writable({ identifier: null, direction: null });

		this.rows = derived([this.filteredRows, this.pageNumber, this.rowsPerPage], ([list, page, perPage]) => {
			const start = (page - 1) * perPage;
			return list.slice(start, start + perPage);
		});

		this.pageCount = derived([this.filteredRows, this.rowsPerPage], ([list, perPage]) => {
			const safePerPage = Math.max(perPage, 1);
			return Math.max(1, Math.ceil(list.length / safePerPage));
		});

		this.rowCount = derived([this.filteredRows, this.pageNumber, this.rowsPerPage], ([list, page, perPage]) => {
			const total = list.length;
			if (total === 0) {
				return { start: 0, end: 0, total: 0 };
			}
			const start = (page - 1) * perPage + 1;
			return {
				start,
				end: Math.min(start + perPage - 1, total),
				total
			};
		});

		this.pages = derived([this.pageNumber, this.pageCount], ([current, total]) => {
			if (total <= 7) {
				return Array.from({ length: total }, (_, index) => index + 1);
			}

			const windowStart = Math.max(2, current - 1);
			const windowEnd = Math.min(total - 1, current + 1);
			const windowPages: number[] = [];
			for (let i = windowStart; i <= windowEnd; i += 1) {
				windowPages.push(i);
			}

			const output: (number | null)[] = [1];
			if (windowStart > 2) output.push(null);
			output.push(...windowPages);
			if (windowEnd < total - 1) output.push(null);
			output.push(total);
			return output;
		});

		this.rowsPerPage.subscribe(() => this.ensureValidPage());
		this.updateFilteredRows();
	}

	search(value: string) {
		this.searchValue = value ?? '';
		this.pageNumber.set(1);
		this.updateFilteredRows();
	}

	filter(value: string, key: string) {
		if (!key) return;
		this.filters[key] = value ?? '';
		this.pageNumber.set(1);
		this.updateFilteredRows();
	}

	sort(identifier: string) {
		if (!identifier) return;
		const { identifier: current, direction } = get(this.sortState);
		let nextDirection: SortDirection = 'asc';

		if (current === identifier) {
			nextDirection = direction === 'asc' ? 'desc' : direction === 'desc' ? null : 'asc';
		}

		this.sortState.set({
			identifier: nextDirection ? identifier : null,
			direction: nextDirection
		});

		this.updateFilteredRows();
	}

	setRows(rows: T[]) {
		this.originalRows = rows ?? [];
		this.pageNumber.set(1);
		this.updateFilteredRows();
	}

	setRowsPerPage(value: number) {
		const next = Number(value) || 1;
		this.rowsPerPage.set(Math.max(1, next));
		this.ensureValidPage();
	}

	setPage(action: 'next' | 'previous' | number | null) {
		if (action === 'previous') {
			this.pageNumber.update((page) => Math.max(1, page - 1));
			return;
		}
		if (action === 'next') {
			const total = get(this.pageCount);
			this.pageNumber.update((page) => Math.min(total, page + 1));
			return;
		}
		if (typeof action === 'number' && !Number.isNaN(action)) {
			const total = get(this.pageCount);
			const target = Math.min(Math.max(action, 1), total);
			this.pageNumber.set(target);
		}
	}

	getRowsPerPage() {
		return this.rowsPerPage;
	}

	getPageNumber() {
		return this.pageNumber;
	}

	getPageCount() {
		return this.pageCount;
	}

	getPages(_: { ellipsis?: boolean } = {}) {
		return this.pages;
	}

	getRowCount() {
		return this.rowCount;
	}

	getSort() {
		return this.sortState;
	}

	private updateFilteredRows() {
		const query = this.searchValue.trim().toLowerCase();
		const filters = Object.entries(this.filters).filter(([, value]) => value?.length);

		let result = [...this.originalRows];

		if (query.length) {
			result = result.filter((row) => this.rowContainsQuery(row, query));
		}

		if (filters.length) {
			result = result.filter((row) =>
				filters.every(([key, value]) => this.valueIncludes(row, key, value))
			);
		}

		const { identifier, direction } = get(this.sortState);
		if (identifier && direction) {
			result.sort((a, b) => this.compareValues(this.getValue(a, identifier), this.getValue(b, identifier), direction));
		}

		this.filteredRows.set(result);
		this.ensureValidPage(result.length);
	}

	private ensureValidPage(totalLength?: number) {
		const total = totalLength ?? get(this.filteredRows).length;
		const perPage = Math.max(get(this.rowsPerPage), 1);
		const totalPages = Math.max(1, Math.ceil(total / perPage));
		this.pageNumber.update((page) => Math.min(Math.max(page, 1), totalPages));
	}

	private rowContainsQuery(value: any, query: string): boolean {
		if (value == null) return false;
		if (typeof value === 'object') {
			return Object.values(value).some((nested) => this.rowContainsQuery(nested, query));
		}
		return String(value).toLowerCase().includes(query);
	}

	private valueIncludes(row: T, key: string, rawValue: string) {
		const value = rawValue?.toLowerCase?.() ?? '';
		const target = this.getValue(row, key);
		if (target == null) return false;
		if (typeof target === 'object') {
			return this.rowContainsQuery(target, value);
		}
		return String(target).toLowerCase().includes(value);
	}

	private getValue(row: T, path: string) {
		return path.split('.').reduce<any>((acc, segment) => {
			if (acc == null) return undefined;
			return acc[segment];
		}, row);
	}

	private compareValues(a: any, b: any, direction: Exclude<SortDirection, null>) {
		const left = this.normalizeValue(a);
		const right = this.normalizeValue(b);
		if (left === right) return 0;
		const result = left > right ? 1 : -1;
		return direction === 'asc' ? result : -result;
	}

	private normalizeValue(value: any) {
		if (value == null) return '';
		if (typeof value === 'number') return value;
		if (value instanceof Date) return value.getTime();
		if (typeof value === 'string') return value.toLowerCase();
		return String(value).toLowerCase();
	}
}

