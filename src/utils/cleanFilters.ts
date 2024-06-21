const cleanFilters = (filters: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Object.fromEntries(Object.entries(filters).filter(([_key, v]) => v !== undefined && v !== ''));
};

export default cleanFilters;