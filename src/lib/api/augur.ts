// API client for Augur backend
import { env } from '$env/dynamic/public';

const API_BASE = env.PUBLIC_AUGUR_URL || 'http://localhost:8000';

interface ApiResponse<T> {
    data?: T;
    error?: string;
}

async function fetchApi<T>(
    endpoint: string, 
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });
        
        if (!response.ok) {
            return { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        
        const data = await response.json();
        return { data };
    } catch (error) {
        return { error: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
}

// Providers
export async function getProviders() {
    return fetchApi('/api/providers/');
}

export async function getProviderById(providerId: string) {
    return fetchApi(`/api/providers/id/${providerId}`);
}

export async function getProviderIntegrations() {
    return fetchApi('/api/providers/integrations');
}

// Archive Finders
export async function getArchiveFinders() {
    return fetchApi('/api/archive/finder');
}

export async function getArchiveFinderById(finderId: string) {
    return fetchApi(`/api/archive/finder/id/${finderId}`);
}

export interface CreateArchiveFinderRequest {
    name: string;
    start_date: string;
    end_date: string;
    geometry: string; // GeoJSON string
    rules?: {
        is_resolution_max_cm?: number | null;
        ais_resolution_min_cm?: number | null;
        eo_resolution_max_cm?: number | null;
        eo_resolution_min_cm?: number | null;
        hsi_resolution_max_cm?: number | null;
        hsi_resolution_min_cm?: number | null;
        rf_resolution_max_cm?: number | null;
        rf_resolution_min_cm?: number | null;
        sar_resolution_max_cm?: number | null;
        sar_resolution_min_cm?: number | null;
        cloud_coverage_pct?: number | null;
    };
}

export async function createArchiveFinder(request: CreateArchiveFinderRequest) {
    return fetchApi('/api/archive/finder/create', {
        method: 'POST',
        body: JSON.stringify(request),
    });
}

// Studies
export async function executeStudy(archiveFinderId: number, studyName: string) {
    return fetchApi('/api/archive/study/execute', {
        method: 'POST',
        body: JSON.stringify({
            archive_finder_id: archiveFinderId,
            study_name: studyName,
        }),
    });
}

export async function getStudyResults(studyName: string, studyId: string) {
    return fetchApi(`/api/archive/study/${studyName}/${studyId}/results`);
}

export async function getStudyStatus(studyName: string, studyId: string) {
    return fetchApi(`/api/archive/study/${studyName}/${studyId}/status`);
}

// Augury (Dream system)
export async function getDreamDetails() {
    return fetchApi('/api/augury/dream/details/');
}

export async function getDreamDetailsById(dreamId: string) {
    return fetchApi(`/api/augury/dream/details/${dreamId}`);
}

export async function getDreamStatus(dreamId: number) {
    return fetchApi(`/api/augury/dream/status/${dreamId}`);
}

export async function processDiviner(dreamId: number) {
    return fetchApi('/api/augury/divine', {
        method: 'POST',
        body: JSON.stringify({ dream_id: dreamId }),
    });
}

// Imagery
export async function getImagery() {
    return fetchApi('/api/core/imagery');
}

export async function getImageryById(imageryId: string) {
    return fetchApi(`/api/core/imagery/id/${imageryId}`);
}

export async function createImagery(geometry: string, name: string) {
    return fetchApi('/api/core/imagery/create', {
        method: 'POST',
        body: JSON.stringify({ geometry, name }),
    });
}

// Organizations and Users
export async function getOrganizations() {
    return fetchApi('/api/core/organizations');
}

export async function getUsers() {
    return fetchApi('/api/core/users');
}

