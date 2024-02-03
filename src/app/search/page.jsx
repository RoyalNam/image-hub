'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { searchCollectionsOrUsers, searchPhotos } from '@/service/search';
import PhotoGallery from '@/components/PhotoGallery';
import { FaUser } from 'react-icons/fa';

const SearchPage = () => {
    return (
        <Suspense fallback="loading....">
            <SearchPageContent />
        </Suspense>
    );
};

const SearchPageContent = () => {
    const searchParams = useSearchParams();
    const q = searchParams.get('q');

    const router = useRouter();
    const [photosData, setPhotos] = useState([]);
    const [collectionsData, setCollections] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isEndPage, setEndPage] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const photos = await searchPhotos({ query: q });
            setPhotos(photos);
            const collection = await searchCollectionsOrUsers({ type: 'collections', per_page: 1, query: q });
            setCollections(collection);
        };
        fetchData();
    }, [searchParams]);

    const loadMore = async () => {
        if (!isEndPage) {
            const newPage = currentPage + 1;
            const newPhotos = await searchPhotos({ query: q, page: newPage });
            if (newPhotos.length === 0) setEndPage(true);
            else {
                setPhotos((prev) => [...prev, ...newPhotos]);
                setCurrentPage(newPage);
            }
        }
    };

    return (
        photosData && (
            <div>
                {collectionsData.length > 0 && collectionsData[0].tags && (
                    <div className="flex gap-4 flex-nowrap my-4 justify-center">
                        <button
                            className="flex items-center gap-1 border px-3 rounded"
                            onClick={() => router.push(`/search/users?q=${q}`)}
                        >
                            <FaUser />
                            <span>Users</span>
                        </button>
                        {collectionsData[0].tags.map((item, idx) => (
                            <button
                                key={idx}
                                className="border rounded px-6 py-2 text-nowrap"
                                onClick={() => router.push(`/search?q=${item.title}`)}
                            >
                                {item.title}
                            </button>
                        ))}
                    </div>
                )}
                <div>
                    <PhotoGallery photos={photosData} loadMore={loadMore} />
                </div>
            </div>
        )
    );
};

export default SearchPage;
