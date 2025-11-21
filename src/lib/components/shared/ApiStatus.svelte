<script lang="ts">
    import { onMount } from 'svelte';

    let checking = $state(true);
    let apiAvailable = $state(false);
    let dismissed = $state(false);

    onMount(async () => {
        await checkApi();
    });

    async function checkApi() {
        checking = true;
        try {
            // Check Luna's internal API proxy (which will check Augur connection)
            const response = await fetch('/api/providers', {
                method: 'GET',
                signal: AbortSignal.timeout(5000), // 5 second timeout
            });
            apiAvailable = response.ok;
            if (response.ok) {
                dismissed = false; // Reset dismissed state if connection restored
            }
        } catch (err) {
            apiAvailable = false;
        } finally {
            checking = false;
        }
    }

    function dismiss() {
        dismissed = true;
    }
</script>

{#if !checking && !apiAvailable && !dismissed}
    <div class="w-full bg-warning-500/10 border-b-2 border-warning-500 animate-slideIn">
        <div class="max-w-7xl mx-auto px-4 py-3">
            <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-3 flex-1">
                    <div class="p-1.5 bg-warning-500/20 rounded-full">
                        <svg class="w-5 h-5 text-warning-600-300-token flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <p class="font-semibold text-surface-900-50-token">Backend Connection Lost</p>
                        <p class="text-sm text-surface-600-300-token">
                            Cannot reach Augur API - Archive searches and providers unavailable
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button 
                        onclick={checkApi}
                        class="btn btn-sm variant-soft-warning"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Retry</span>
                    </button>
                    <button 
                        onclick={dismiss}
                        class="btn btn-sm variant-ghost-surface"
                        title="Dismiss"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}

