'use client';
import React, { useEffect, useState } from 'react';
import PhotoGallery from '@/components/PhotoGallery';
import { getPhotos } from '@/service/photos';

const Home = () => {
    const [photos, setPhotos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedPhotos = await getPhotos();
            setPhotos(fetchedPhotos);
        };
        fetchData();
    }, []);

    const loadMore = async () => {
        const newPage = currentPage + 1;
        const newPhotos = await getPhotos(newPage);
        setPhotos((prev) => [...prev, ...newPhotos]);
        setCurrentPage(newPage);
    };

    return (
        <div className="py-4">
            <PhotoGallery photos={photos} loadMore={loadMore} />
        </div>
    );
};

export default Home;
