<script lang="ts" generics="T">
  interface Props {
    items: T[];
    itemsPerPage?: number;
    children: import('svelte').Snippet<[T]>;
    emptyMessage?: string;
    emptyIcon?: string;
  }

  let {
    items = [],
    itemsPerPage = 10,
    children,
    emptyMessage = "No items found",
    emptyIcon = "📋",
  }: Props = $props();

  let currentPage = $state(1);

  const totalPages = $derived(Math.ceil(items.length / itemsPerPage));
  const startIndex = $derived((currentPage - 1) * itemsPerPage);
  const endIndex = $derived(startIndex + itemsPerPage);
  const paginatedItems = $derived(items.slice(startIndex, endIndex));

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }

  function nextPage() {
    if (currentPage < totalPages) {
      currentPage++;
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
    }
  }

  // Reset to page 1 when items change
  $effect(() => {
    if (items.length > 0 && currentPage > totalPages) {
      currentPage = 1;
    }
  });

  const pageNumbers = $derived.by(() => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = 4;
      }
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  });
</script>

{#if items.length === 0}
  <div class="text-center py-12">
    <div class="text-4xl mb-3 opacity-20">{emptyIcon}</div>
    <p class="text-sm text-surface-500">{emptyMessage}</p>
  </div>
{:else}
  <div class="space-y-4">
    <!-- Items List -->
    <div class="space-y-3">
      {#each paginatedItems as item}
        {@render children(item)}
      {/each}
    </div>

    <!-- Pagination Controls -->
    {#if totalPages > 1}
      <div class="flex items-center justify-between px-4 py-3 border-t border-surface-700">
        <div class="text-sm text-surface-400">
          Showing {startIndex + 1} to {Math.min(endIndex, items.length)} of {items.length}
        </div>

        <div class="flex items-center gap-2">
          <button
            onclick={prevPage}
            disabled={currentPage === 1}
            class="btn btn-sm variant-soft-surface"
            aria-label="Previous page"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {#each pageNumbers as pageNum}
            {#if pageNum === "..."}
              <span class="px-2 text-surface-500">...</span>
            {:else}
              <button
                onclick={() => goToPage(pageNum)}
                class="btn btn-sm {currentPage === pageNum ? 'variant-filled-primary' : 'variant-soft-surface'}"
              >
                {pageNum}
              </button>
            {/if}
          {/each}

          <button
            onclick={nextPage}
            disabled={currentPage === totalPages}
            class="btn btn-sm variant-soft-surface"
            aria-label="Next page"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    {/if}
  </div>
{/if}

