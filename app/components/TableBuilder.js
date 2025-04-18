"use client"
import { useState } from 'react';
import { Search, SlidersHorizontal, ArrowLeft, ArrowRight } from 'lucide-react';

export default function TableBuilder({ info, cols, data }) {
    const [pagination, setPagination] = useState({
        display: [1, 10],
        currPage: 1,
        lastPage: 10,
        numToShow: 10,
        total: 999
    });

    return (
        <div className='flex flex-col py-4 px-1 md:px-4 lg:px-8'>
            <TableHeader info={info} pagination={pagination} />
            <Table cols={cols} data={data} pagination={pagination} setPagination={setPagination}/>
        </div>
    );
}

function TableHeader({ info, pagination }) {
    return (
        <div>
            <div className='flex md:hidden flex-col gap-4'>
                <SearchComponent placeholder={info.search} />
                <Toolbar />
                <Header title={info.title} pagination={pagination}/>
            </div>

            <div className='hidden md:flex md:w-full flex-row gap-4 items-center'>
                <Header title={info.title} pagination={pagination} />
                <div className='flex flex-row w-full justify-end gap-4'>
                    <SearchComponent placeholder={info.search} />
                    <Toolbar />
                </div>
            </div>
        </div>
    );
}

function SearchComponent({ placeholder }) {
    return (
        <div className='flex items-center bg-astrawhite rounded-xl border border-astradarkgray focus-within:border-astraprimary h-12'>
            <Search className='m-4 text-astradarkgray w-5 h-5' />
            <input type="text" className='outline-none' placeholder={placeholder} />
        </div>
    );
}

function Header({ title, pagination }) {
    return (
        <div className="flex flex-row md:order-first w-full justify-center md:justify-start">
            <div className="font-rb bg-astradark text-astrawhite rounded-tl-xl px-4 py-4">
                {title}
            </div>
            <div className="font-s md:font-r bg-astrawhite text-astradarkgray rounded-tr-xl px-4 py-4">
                Displaying <b>{pagination.display[0]}–{pagination.display[1]}</b> of <b>{pagination.total}</b> total
            </div>
        </div>
    );
}

function Toolbar() {
    return (
        <div className="flex flex-row gap-2 justify-end h-12">
            <button className="flex flex-grow flex-row items-center gap-2 blue-button">
                <SlidersHorizontal className="w-5 h-5" />
                <span className="flex md:hidden lg:flex">Tools</span>
            </button>
            <select className="px-4 py-2 rounded-xl bg-astrawhite text-astradarkgray border border-astradarkgray outline-none">
                <option value="10">5</option>
                <option value="20">10</option>
                <option value="30">15</option>
                <option value="40">20</option>
                <option value="50">25</option>
            </select>
        </div>
    );
}

function getVisibilityClass(visible) {
    switch (visible) {
        case 'all':
            return '';
        case 'md':
            return 'hidden md:table-cell';
        case 'lg':
            return 'hidden lg:table-cell';
        default:
            return '';
    }
}

function Table({ cols, data, pagination, setPagination }) {
    return (
        <div className='bg-astrawhite rounded-xl'>
            <table className="w-full table-auto border-collapse">
                <thead className="bg-astratintedwhite text-astraprimary font-s">
                    <tr>
                        {cols.map((col, idx) => (
                            <th
                                key={idx}
                                className={`py-4 px-2 text-${col.justify === 'start' ? 'left' : col.justify} text-sm font-medium ${getVisibilityClass(col.visible)}`}
                            >
                                {col.label}
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
            <PageTool pagination={pagination} setPagination={setPagination} />
        </div>
    );
}


function PageTool({ pagination, setPagination }) {
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
            className={`px-4 py-2 rounded-xl text-sm ${
                currPage === page
                    ? 'bg-astraprimary text-astrawhite'
                    : 'bg-transparent text-astradarkgray hover:bg-astratintedwhite'
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
            pages.push(renderDots('start-dots'));
        }
    
        for (let i = start; i <= end; i++) {
            pages.push(renderPageButton(i));
        }
    
        if (end < lastPage - 1) {
            pages.push(renderDots('end-dots'));
        }
    
        if (lastPage > 1) {
            pages.push(renderPageButton(lastPage));
        }
    
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 py-6 cursor-pointer">
            <button
                onClick={() => handlePageChange(currPage - 1)}
                disabled={currPage === 1}
                className={`p-2 rounded-lg ${
                    currPage === 1
                        ? 'text-astradarkgray cursor-not-allowed'
                        : 'text-astraprimary hover:bg-astratintedwhite'
                }`}
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
    
            {getPageButtons()}
    
            <button
                onClick={() => handlePageChange(currPage + 1)}
                disabled={currPage === lastPage}
                className={`p-2 rounded-lg ${
                    currPage === lastPage
                        ? 'text-astradarkgray cursor-not-allowed'
                        : 'text-astraprimary hover:bg-astratintedwhite'
                }`}
            >
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    );
}
