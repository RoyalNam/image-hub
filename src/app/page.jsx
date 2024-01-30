'use client';
import PhotoCard from '@/components/PhotoCard';
import { getPhotos } from '@/service/photos';
import React, { useEffect, useState } from 'react';

const Home = () => {
    const [photos, setPhotos] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const photos = await getPhotos();
            setPhotos(photos);
            console.log('photos', photos);
        };
        fetchData();
    }, []);
    return (
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 space-y-4">
            {photos.map((item) => (
                <PhotoCard key={item.id} photo={item} />
            ))}
        </div>
    );
};

export default Home;
