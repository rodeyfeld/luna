<script lang="ts">
    interface Props {
        status: string;
        size?: 'sm' | 'md' | 'lg';
    }
    
    let { status, size = 'md' }: Props = $props();
    
    const statusConfig: Record<string, { label: string; variant: string; icon: string }> = {
        'COMPLETED': { label: 'Completed', variant: 'variant-filled-success', icon: '✓' },
        'RUNNING': { label: 'Running', variant: 'variant-filled-warning', icon: '⚡' },
        'PENDING': { label: 'Pending', variant: 'variant-soft-surface', icon: '⏳' },
        'FAILED': { label: 'Failed', variant: 'variant-filled-error', icon: '✕' },
        'ANOMALOUS': { label: 'Error', variant: 'variant-filled-error', icon: '⚠' },
        'SUCCESS': { label: 'Success', variant: 'variant-filled-success', icon: '✓' },
        'ACTIVE': { label: 'Active', variant: 'variant-filled-success', icon: '●' },
        'INACTIVE': { label: 'Inactive', variant: 'variant-soft-surface', icon: '○' }
    };
    
    const config = statusConfig[status.toUpperCase()] || { 
        label: status, 
        variant: 'variant-soft-surface', 
        icon: '•' 
    };
    
    const sizeClass = {
        'sm': 'text-xs px-2 py-0.5',
        'md': 'text-sm px-2.5 py-1',
        'lg': 'text-base px-3 py-1.5'
    }[size];
</script>

<span class="badge {config.variant} {sizeClass} inline-flex items-center gap-1.5">
    <span class="opacity-80">{config.icon}</span>
    <span>{config.label}</span>
</span>

