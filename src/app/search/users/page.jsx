'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { searchCollectionsOrUsers } from '@/service/search';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';
import InfiniteScroll from 'react-infinite-scroll-component';

const SearchUsers = () => {
    return (
        <Suspense fallback="loading....">
            <SearchUsersContent />
        </Suspense>
    );
};
export default SearchUsers;

const SearchUsersContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const q = searchParams.get('q');

    const [usersData, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isEndPage, setEndPage] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const users = await searchCollectionsOrUsers({ per_page: 20, query: q });
            setUsers(users);
        };
        fetchData();
    }, [searchParams]);

    const loadMore = async () => {
        if (!isEndPage) {
            const newPage = currentPage + 1;
            const newUsers = await searchCollectionsOrUsers({ per_page: 20, query: q, page: newPage });
            if (newUsers.length == 0) setEndPage(true);
            else {
                const uniqueNewUsers = newUsers.filter(
                    (newUser) => !usersData.some((existingUser) => existingUser.id === newUser.id),
                );

                setUsers((prev) => [...prev, ...uniqueNewUsers]);
                setCurrentPage(newPage);
            }
        }
    };

    return (
        <div className="my-8">
            {usersData && usersData.length > 0 ? (
                <InfiniteScroll dataLength={usersData.length} next={loadMore} hasMore={true}>
                    <div className="flex justify-center">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center rounded-xl overflow-hidden">
                            {usersData.map(
                                (item) =>
                                    item.photos.length > 0 && (
                                        <div
                                            key={item.id}
                                            className="relative hover:opacity-80 cursor-pointer"
                                            onClick={() => router.push(`/${item.username}`)}
                                        >
                                            <div className="flex w-72">
                                                {item.photos.map((photo) => (
                                                    <img
                                                        key={photo.id}
                                                        src={photo.urls.small}
                                                        alt=""
                                                        className={`${
                                                            item.photos.length === 3
                                                                ? 'w-1/3'
                                                                : item.photos.length === 2
                                                                ? 'w-1/2'
                                                                : 'w-full'
                                                        } h-52 opacity-80 object-cover`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="absolute inset-0">
                                                <div className="w-full h-full flex justify-center flex-col items-center gap-2">
                                                    <img
                                                        src={item.profile_image.medium}
                                                        alt=""
                                                        className="rounded-full border"
                                                    />
                                                    <div className="flex items-center font-medium gap-1">
                                                        <h5 className="text-2xl line-clamp-1">{item.name}</h5>
                                                        {item.for_hire && <FaCheckCircle className="text-red-600" />}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ),
                            )}
                        </div>
                    </div>
                </InfiniteScroll>
            ) : (
                <div>
                    <h5 className="text-red-500 text-xl">User {q} not found.</h5>
                </div>
            )}
        </div>
    );
};
