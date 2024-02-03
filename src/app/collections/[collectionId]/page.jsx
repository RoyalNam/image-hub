'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PhotoGallery from '@/components/PhotoGallery';
import { getCollection, getCollectionPhotos } from '@/service/collection';
import ErrorDisplay from '@/components/ErrorDisplay';

const Collection = () => {
    const router = useRouter();
    const { collectionId } = useParams();
    const [collectionData, setCollection] = useState(null);
    const [photosData, setPhotos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isEndPage, setEndPage] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (collectionId) {
                    const collection = await getCollection(collectionId);
                    setCollection(collection);
                    const collectionPhotos = await getCollectionPhotos(collectionId);
                    setPhotos(collectionPhotos);
                }
            } catch (err) {
                setError('An error occurred while fetching data. Please try again later.');
            }
        };
        fetchData();
    }, []);

    const loadMore = async () => {
        try {
            if (!isEndPage) {
                const newPage = currentPage + 1;
                const newPhotos = await getCollectionPhotos(collectionId, newPage);
                if (newPhotos.length === 0) setEndPage(true);
                else {
                    setPhotos((prev) => [...prev, ...newPhotos]);
                    setCurrentPage(newPage);
                }
            }
        } catch (error) {
            console.error('Error loading more photos:', error);
        }
    };

    return error ? (
        <ErrorDisplay error={error} />
    ) : (
        collectionData && (
            <div className="my-8">
                <div>
                    <h4 className="text-center text-3xl font-medium">{collectionData.title}</h4>
                    <div className="flex justify-between items-center my-5">
                        <div
                            className="flex items-center cursor-pointer gap-2 group"
                            onClick={() => router.push(`/${collectionData.user.username}`)}
                        >
                            <img src={collectionData.user.profile_image.medium} alt="" className="rounded-full" />
                            <h5 className="group-hover:underline">{collectionData.user.name}</h5>
                        </div>
                        <span>{collectionData.total_photos} photo</span>
                    </div>
                </div>
                {photosData && <PhotoGallery title="Collection photo" photos={photosData} loadMore={loadMore} />}
            </div>
        )
    );
};

export default Collection;
