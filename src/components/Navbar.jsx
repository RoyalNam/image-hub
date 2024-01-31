'use client';
import Link from 'next/link';
import React from 'react';
import { FaSearch } from 'react-icons/fa';

const Navbar = () => {
    return (
        <nav className="h-20 sticky top-0 inset-x-0  bg-white dark:bg-black z-30">
            <div className="px-2 md:px-4 flex h-full w-full items-center gap-4">
                <Link href={'/'} className="h-full">
                    <img src="/myLogo.png" className="h-full object-cover" alt="Logo" />
                </Link>
                <div className="flex-1 flex items-center rounded-full border px-4">
                    <input type="search" name="" id="" className="bg-transparent outline-none flex-1 px-3 py-2" />
                    <button className="border-l pl-3">
                        <FaSearch className="text-xl" />
                    </button>
                </div>
                <div>
                    <button>Theme</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
