// Component to build tables for admin pages, See Alumni Search (Table Section) for implementation

// info = {title:'title of table', search: 'searchbar placeholder text'}

// const [pagination, setPagination] = useState({
//     display: [1, 10], *current range showing
//     currPage: 1, *current active page
//     lastPage: 10, *total number of pages
//     numToShow: 10, *how many items to show (dropdown)
//     total: 999 *total number of items
// });

// toggleFilter = functionToShowFilterModal()
// cols = [{label:'columnname', justify:'', visible:'all, md, lg'}]
// data = [{'columname':<div></div>, 'columname':etc}]


"use client";
import { useState } from "react";
import { Search, SlidersHorizontal, ArrowLeft, ArrowRight } from "lucide-react";

export function TableHeader({ info, pagination, toggleFilter, setPagination, searchQuery, setSearchQuery }) {
  return (
    <div>
      <div className='flex md:hidden flex-col gap-4'>
        <SearchComponent placeholder={info.search} setSearchQuery={setSearchQuery} searchQuery={searchQuery}/>
        <Toolbar toggleFilter={toggleFilter} pagination={pagination} setPagination={setPagination}/>
        <Header title={info.title} pagination={pagination} />
      </div>

      <div className='hidden md:flex md:w-full flex-row gap-4 items-center'>
        <Header title={info.title} pagination={pagination} />
        <div className='flex flex-row w-full justify-end gap-4'>
          <SearchComponent placeholder={info.search} setSearchQuery={setSearchQuery} searchQuery={searchQuery}/>
          <Toolbar toggleFilter={toggleFilter} pagination={pagination} setPagination={setPagination}/>
        </div>
      </div>
    </div>
  );
}

export function SearchComponent({ placeholder, setSearchQuery, searchQuery }) {
  const [inputValue, setInputValue] = useState(searchQuery);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchQuery(inputValue);
    }
  };

  return (
    <div className='flex items-center bg-astrawhite rounded-xl border border-astradarkgray focus-within:border-astraprimary h-12'>
      <Search className='m-4 text-astradarkgray w-5 h-5' />
      <input
        type="text"
        className='outline-none'
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export function Header({ title, pagination }) {
  return (
    <div className="flex flex-row md:order-first w-full justify-center md:justify-start">
      <div className="font-rb bg-astradark text-astrawhite rounded-tl-xl px-4 py-4 shadow-md">
        {title}
      </div>
      <div className="font-s md:font-r bg-astrawhite text-astradarkgray rounded-tr-xl px-4 py-4 shadow-md">
        Displaying <b>{pagination.display[0]}–{pagination.display[1]}</b> of <b>{pagination.total}</b> total
      </div>
    </div>
  );
}

export function Toolbar({ toggleFilter, pagination, setPagination }) {
  const handleNumToShowChange = (e) => {
    const newNumToShow = parseInt(e.target.value);

    setPagination({
      ...pagination,
      numToShow: newNumToShow,
    });
  };

  return (
    <div className="flex flex-row gap-2 justify-end h-12">
      <button
        onClick={toggleFilter}
        className="flex flex-grow flex-row items-center justify-center gap-2 blue-button"
      >
        <SlidersHorizontal className="w-5 h-5" />
        <span className="flex md:hidden lg:flex">Tools</span>
      </button>
      <select
        value={pagination.numToShow}
        onChange={handleNumToShowChange}
        className="px-4 py-2 rounded-xl bg-astrawhite text-astradarkgray border border-astradarkgray outline-none"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
        <option value="25">25</option>
      </select>
    </div>
  );
}

function getVisibilityClass(visible) {
  switch (visible) {
  case "all":
    return "";
  case "md":
    return "hidden md:table-cell";
  case "lg":
    return "hidden lg:table-cell";
  default:
    return "";
  }
}

export function Table({ cols, data }) {
  return (
    <div className='bg-astrawhite shadow-md overflow-x-auto'>
      <table className="w-full table-auto border-collapse">
        <thead className="bg-astratintedwhite text-astraprimary font-s">
          <tr>
            {cols.map((col, idx) => (
              <th
                key={idx}
                className={`py-4 px-2 text-${col.justify === "start" ? "left" : col.justify} font-s ${getVisibilityClass(col.visible)}`}
              >
                {col.label.includes(":label-hidden") ? "" : col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="even:bg-astrawhite odd:bg-white border-b border-astralightgray">
              {cols.map((col, colIndex) => (
                <td key={colIndex} className={`justify-${col.justify} ${getVisibilityClass(col.visible)}`}>
                  {row[col.label]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PageTool({ pagination, setPagination }) {
  const { currPage, lastPage, total, numToShow } = pagination;

  const handlePageChange = (newPage) => {
    const start = (newPage - 1) * numToShow + 1;
    const end = Math.min(newPage * numToShow, total);
    setPagination({ ...pagination, currPage: newPage, display: [start, end] });
  };

  const renderPageButton = (page) => (
    <button
      key={page}
      onClick={() => handlePageChange(page)}
      className={`px-2 md:px-4 py-2 rounded-sm md:rounded-xl font-s ${
        currPage === page
          ? "bg-astraprimary text-astrawhite"
          : "bg-transparent text-astradarkgray hover:bg-astratintedwhite"
      }`}
    >
      {page}
    </button>
  );

  const renderDots = (key) => (
    <span key={key} className="px-2 text-astradarkgray select-none">...</span>
  );

  const getPageButtons = () => {
    const pages = [];
    const { currPage, lastPage } = pagination;

    pages.push(renderPageButton(1));

    const start = Math.max(2, currPage - 1);
    const end = Math.min(lastPage - 1, currPage + 1);

    if (start > 2) {
      pages.push(renderDots("start-dots"));
    }

    for (let i = start; i <= end; i++) {
      pages.push(renderPageButton(i));
    }

    if (end < lastPage - 1) {
      pages.push(renderDots("end-dots"));
    }

    if (lastPage > 1) {
      pages.push(renderPageButton(lastPage));
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-1 py-4 cursor-pointer bg-white rounded-b-xl">
      <button
        onClick={() => handlePageChange(currPage - 1)}
        disabled={currPage === 1}
        className={`p-2 rounded-lg ${
          currPage === 1
            ? "text-astralightgray cursor-not-allowed"
            : "text-astraprimary hover:bg-astratintedwhite"
        }`}
      >
        <svg className="w-5 h-5 stroke-3" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {getPageButtons()}

      <button
        onClick={() => handlePageChange(currPage + 1)}
        disabled={currPage === lastPage}
        className={`p-2 rounded-lg ${
          currPage === lastPage
            ? "text-astralightgray cursor-not-allowed"
            : "text-astraprimary hover:bg-astratintedwhite"
        }`}
      >
        <svg className="w-5 h-5 stroke-3" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
