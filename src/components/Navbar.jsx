'use client';
import { searchCollectionsOrUsers, searchPhotos } from '@/service/search';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const inputRef = useRef();
    const [isShow, setShow] = useState(false);
    const [collectionsData, setCollections] = useState([]);

    const handleSearch = async () => {
        const query = inputRef.current.value;
        if (query.trim() !== '') {
            const collections = await searchCollectionsOrUsers({
                type: 'collections',
                per_page: 5,
                query,
            });
            const search = await searchPhotos({ query });
            console.log('search', search);
            console.log('collection', collections);
            setCollections(collections);
            setShow(true);
        } else {
            setShow(false);
        }
    };

    useEffect(() => {
        if (pathname === '/search') {
            const q = searchParams.get('q');
            inputRef.current.value = q || '';
        }
    }, [pathname, searchParams]);

    return (
        <nav className="h-20 sticky top-0 inset-x-0 bg-white dark:bg-black z-30">
            <div className="px-2 md:px-4 flex h-full w-full items-center gap-4">
                <Link href={'/'} className="h-full">
                    <img src="/myLogo.png" className="h-full object-cover" alt="Logo" />
                </Link>
                <div className="relative flex-1 flex items-center rounded-full border px-4">
                    <input
                        ref={inputRef}
                        type="search"
                        name=""
                        id=""
                        className="bg-transparent outline-none flex-1 px-3 py-2"
                    />
                    <button onClick={handleSearch} className="border-l pl-3">
                        <FaSearch className="text-xl" />
                    </button>

                    {isShow && (
                        <div className="absolute top-11 inset-x-0 text-black bg-white px-6 py-4 rounded">
                            <div className="flex flex-col gap-1">
                                {[1, 2, 34, 5].map((idx) => (
                                    <h4 key={idx} className="border-b">
                                        Office
                                    </h4>
                                ))}
                            </div>
                            <div className="mt-4">
                                <h5 className="text-xl font-medium">Collections</h5>
                                <div className="flex gap-4 mt-2">
                                    {collectionsData.map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                router.push(`/search?q=${item.title}`);
                                                setShow(false);
                                            }}
                                            className="border px-5 py-2 rounded"
                                        >
                                            {item.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
