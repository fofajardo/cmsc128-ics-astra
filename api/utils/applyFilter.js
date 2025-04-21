const applyFilter = (query, filters, config = {}) => {
    const {
        limit = 10,     // default 10 pages
        page = 1,       // default 1st page
    } = filters;

    const {
        ilike = [],       // fields to apply ilike instead of eq (pattern-matching, case-insensitive)
        range = {},       // { field: [from, to] }
        sortBy,           // default sort field
        defaultOrder = "desc",
        specialKeys     // add keys to not check for equality here e.g. defined [from, to] range fields
    } = config;

    for (const [key, value] of Object.entries(filters)) {
        if (ilike.includes(key)) {
            query = query.ilike(key, `%${value}%`);
        } else if (key === "limit" || key === "page" || key === "sort_by" || key === "order" || specialKeys.includes(key)) {
            continue; // skip pagination/sorting here
        } else {
            query = query.eq(key, value);
        }
    }

    // Apply range filters like date
    for (const [field, [from, to]] of Object.entries(range)) {
        if (from) query = query.gte(field, from);
        if (to) query = query.lte(field, to);
    }

    // Sorting
    if (filters.sort_by) {
        query = query.order(filters.sort_by, { ascending: filters.order === "asc" });
    } else if (sortBy) {
        query = query.order(sortBy, { ascending: defaultOrder === "asc" });
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + Number(limit) - 1;
    query = query.range(startIndex, endIndex);

    return query;
};

export {
    applyFilter
};