'use client';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';
import { searchCollectionsOrUsers } from '@/service/search';
import { getTopics } from '@/service/topics';
import { debounce } from '@/utils';

const Navbar = () => {
    return (
        <Suspense fallback="loading....">
            <NavbarContent />
        </Suspense>
    );
};

const NavbarContent = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const inputRef = useRef();
    const [collectionsData, setCollections] = useState([]);
    const [topicsData, setTopics] = useState([]);
    const [isInputFocused, setInputFocused] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!topicsData.length) {
                const topics = await getTopics();
                setTopics(topics);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (pathname === '/search') {
            const q = searchParams.get('q');
            inputRef.current.value = q || '';
            handleSearch();
        } else {
            inputRef.current.value = '';
        }
    }, [pathname, searchParams]);

    const handleChange = (event) => {
        const inputValue = event.target.value;
        if (inputRef.current?.value) {
            inputRef.current.value = inputValue;
            handleDelayedSearch(inputValue);
        }
    };

    const handleDelayedSearch = useRef(
        debounce(() => {
            handleSearch();
        }, 500),
    ).current;

    const handleSearch = async () => {
        const query = inputRef.current.value.trim();
        if (query !== '') {
            try {
                const collections = await searchCollectionsOrUsers({
                    type: 'collections',
                    per_page: 5,
                    query,
                });

                setCollections(collections);
            } catch (error) {
                console.error('Error during search:', error);
            }
        } else {
            setCollections([]);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const query = inputRef.current.value.trim();
        if (query !== '') {
            inputRef.current.blur();
            handlePush(query);
        }
    };

    const handlePush = (query) => {
        setInputFocused(false);
        router.push(`/search?q=${query}`);
    };

    return (
        <nav className="h-20 sticky top-0 inset-x-0 bg-white dark:bg-black z-30 border-b border-black/10 dark:border-white/10">
            <div className="px-2 md:px-4 flex h-full w-full items-center gap-4">
                <Link href={'/'} className="h-full hidden md:block">
                    <img src="/myLogo.png" className="h-full object-cover" alt="Logo" />
                </Link>
                <div className="relative flex-1 px-4 max-w-5xl">
                    <form
                        action="get"
                        onSubmit={handleFormSubmit}
                        className="flex items-center relative z-20 rounded-full border px-4"
                    >
                        <input
                            ref={inputRef}
                            type="search"
                            name=""
                            id=""
                            placeholder="Search"
                            className="bg-transparent outline-none flex-1 px-3 py-2"
                            onFocus={() => setInputFocused(true)}
                            onChange={handleChange}
                        />
                        <button type="submit" className="border-l pl-3">
                            <FaSearch className="text-xl" />
                        </button>
                    </form>

                    {isInputFocused && (
                        <div className="absolute top-10 shadow-no-top inset-x-0 z-10 overflow-auto mx-1 rounded-t-xl bg-white dark:bg-black px-4 shadow-current py-4 rounded">
                            {isInputFocused && <div className="fixed inset-0" onClick={() => setInputFocused(false)} />}
                            <div className="max-h-[calc(100vh-150px)] overflow-y-auto relative">
                                {collectionsData.length > 0 && (
                                    <div>
                                        <h4 className="text-xl font-semibold mb-2">Collections</h4>
                                        <div className="flex flex-col gap-1">
                                            {collectionsData.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => {
                                                        setCollections([]);
                                                        setInputFocused(false);
                                                        router.push(`/search?q=${item.title}`);
                                                    }}
                                                    className=" border-b py-1 rounded cursor-pointer flex items-center gap-4"
                                                >
                                                    <div className="grid grid-cols-2 w-16 gap-1 rounded-xl overflow-hidden">
                                                        {item.preview_photos.map((photo) => (
                                                            <img
                                                                key={photo.id}
                                                                src={photo.urls.small}
                                                                alt={photo.urls.slug}
                                                                className="object-cover w-full h-8"
                                                            />
                                                        ))}
                                                    </div>
                                                    <div>
                                                        <h5>
                                                            by <span className="font-medium">{item.user.name}</span>
                                                        </h5>
                                                        <span>{item.total_photos} photo</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="my-4">
                                    <h4 className="text-xl font-semibold mb-2">Topics</h4>
                                    <div className="flex gap-4 flex-wrap">
                                        {topicsData.map((item) => (
                                            <button
                                                key={item.id}
                                                className="flex items-center border gap-2 px-2 py-1 rounded-xl"
                                                onClick={() => handlePush(item.title)}
                                            >
                                                <img
                                                    src={item.cover_photo.urls.small}
                                                    alt=""
                                                    className="w-8 h-8 rounded-full"
                                                />
                                                <h4 className="font-medium">{item.title}</h4>
                                            </button>
                                        ))}
                                    </div>
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
