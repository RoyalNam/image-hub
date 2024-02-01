'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { searchCollectionsOrUsers, searchPhotos } from '@/service/search';
import PhotosGrid from '@/components/PhotosGrid';

const SearchPage = () => {
    const params = useSearchParams();
    const router = useRouter();
    const q = params.get('q');
    const [photosData, setPhotos] = useState([]);
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            // console.log('params', q);
            const photos = await searchPhotos({ query: q });
            // console.log('x', photos);
            setPhotos(photos);
            const collection = await searchCollectionsOrUsers({ type: 'collections', per_page: 1, query: q });
            setCollections(collection);
            // console.log('col', collection);
        };
        fetchData();
    }, [q]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [loading]);

    const loadMoreMovies = async () => {
        setLoading(true);
        const newPage = currentPage + 1;
        const newPhotos = await searchPhotos({ query: q, page: newPage });
        setPhotos((prev) => [...prev, ...newPhotos]);
        setCurrentPage(newPage);
        setLoading(false);
    };

    const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const clientHeight = window.innerHeight;

        if (scrollHeight - scrollTop <= clientHeight + 250 && !loading) {
            loadMoreMovies();
        }
    };

    return (
        photosData && (
            <div>
                {collections.length > 0 && collections[0].tags && (
                    <div className="flex gap-4 flex-nowrap my-4 justify-center">
                        {collections[0].tags.map((item, idx) => (
                            <button
                                key={idx}
                                className="border rounded px-6 py-2"
                                onClick={() => router.push(`/search?q=${item.title}`)}
                            >
                                {item.title}
                            </button>
                        ))}
                    </div>
                )}
                <div>
                    <PhotosGrid photos={photosData} />
                </div>
            </div>
        )
    );
};

export default SearchPage;