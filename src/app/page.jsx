'use client';
import React, { useEffect, useState } from 'react';
import PhotosGrid from '@/components/PhotosGrid';
import { getPhotos } from '@/service/photos';

const Home = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            const photos = await getPhotos();
            setPhotos(photos);
            console.log('photos', photos);
        };
        fetchData();
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [loading]);

    const loadMoreMovies = async () => {
        setLoading(true);
        const newPage = currentPage + 1;
        const newPhotos = await getPhotos(newPage);
        setPhotos((prev) => [...prev, ...newPhotos]);
        setCurrentPage(newPage);
        setLoading(false);
    };

    const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const clientHeight = window.innerHeight;

        if (scrollHeight - scrollTop <= clientHeight + 450 && !loading) {
            loadMoreMovies();
        }
    };
    return <PhotosGrid photos={photos} />;
};

export default Home;
