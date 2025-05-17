import Fuse from "fuse.js";

const applyFilter = (query, filters, config = {}) => {
  const {
    limit = 10,
    page = 1
  } = filters;

  const {
    ilike = [],            // fields to apply ilike instead of eq (pattern-matching, case-insensitive)
    range = {},            // { field: [from, to] }
    sortBy,                // default sort field
    defaultOrder = "desc",
    specialKeys            // add keys to not check for equality here e.g. defined [from, to] range fields
  } = config;

  for (const [key, value] of Object.entries(filters)) {
    if (ilike.includes(key)) {
      query = query.ilike(key, `%${value}%`);
    } else if (key === "limit" || key === "page" || key === "sort_by" || key === "order" || specialKeys.includes(key)) {
      continue; // skip pagination/sorting here
    } else if (Array.isArray(value)) {
      query = query.in(key, value);
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

const applySkillsSearch = (data, filterSkills) => {
  if (!filterSkills || filterSkills.length === 0) return data;

  const fuse = new Fuse(data, {
    keys: ['skills'],
    threshold: 0.3,
    includeScore: true
  });

  let resultMap = new Map();

  filterSkills.forEach(skill => {
    const results = fuse.search(skill);
    results.forEach(({ item }) => {
      const key = JSON.stringify(item);
      if (!resultMap.has(key)) {
        resultMap.set(key, { item, matchCount: 0 });
      }
      resultMap.get(key).matchCount += 1;
    });
  });

  const sorted = [...resultMap.values()]
    .sort((a, b) => b.matchCount - a.matchCount)
    .map(entry => entry.item);

  return sorted;
};

const applyArrayFilter = (data, filters) => {
  let filteredData = data;

  if (filters.yearFrom) {
    filteredData = filteredData.filter(alum =>
      alum.year_graduated && alum.year_graduated >= filters.yearFrom
    );
  }

  if (filters.yearTo) {
    filteredData = filteredData.filter(alum =>
      alum.year_graduated && alum.year_graduated <= filters.yearTo
    );
  }

  if (filters.location) {
    filteredData = filteredData.filter(alum =>
      alum.location && alum.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }

  if (filters.field) {
    filteredData = filteredData.filter(alum =>
      alum.field && alum.field.toLowerCase().includes(filters.field.toLowerCase())
    );
  }

  filteredData = applySkillsSearch(filteredData, filters.skills);

  if (filters.sortCategory && filters.sortOrder) {
    const sortMapping = {
      year: (a, b) => (a.year_graduated || "").localeCompare(b.year_graduated || ""),
      name: (a, b) => a.last_name.localeCompare(b.last_name),
      location: (a, b) => (a.location || "").localeCompare(b.location || ""),
      field: (a, b) => (a.field || "").localeCompare(b.field || "")
    };

    const sortFn = sortMapping[filters.sortCategory] || sortMapping.name;
    filteredData.sort(sortFn);

    if (filters.sortOrder === "desc") {
      filteredData.reverse();
    }
  }

  return filteredData;
};

const applyArraySearch = (data, search, fuseOptions) => {
  let filteredData = data;

  if (search) {
    const fuse = new Fuse(filteredData, fuseOptions);
    const results = fuse.search(search);
    filteredData = results.map(result => result.item);
  }

  return filteredData;
};

const applyPagination = (data, page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + Number(limit) - 1;
  const paginatedData = data.slice(startIndex, endIndex + 1);

  return paginatedData;
};

export {
  applyFilter,
  applyArrayFilter,
  applyArraySearch,
  applyPagination
};
