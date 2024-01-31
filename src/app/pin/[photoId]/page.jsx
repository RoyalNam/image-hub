'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaDownload, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { getPhoto } from '@/service/photos';
import { formatNumber } from '@/utils';
import { searchPhotos } from '@/service/search';
import PhotosGrid from '@/components/PhotosGrid';

const Photo = () => {
    const router = useRouter();
    const { photoId } = useParams();
    const [photoData, setPhoto] = useState();
    const [moreLikePhotos, setMoreLikePhotos] = useState([]);
    const [isOverlayVisible, setOverlayVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchData();
    }, [photoId]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [loading]);

    const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const clientHeight = window.innerHeight;

        if (scrollHeight - scrollTop <= clientHeight + 350 && !loading) {
            loadMoreMovies();
        }
    };

    // Action
    const handleDownload = () => {
        if (photoData && photoData.urls.full) {
            fetch(photoData.urls.full)
                .then((response) => response.blob())
                .then((blob) => {
                    const downloadLink = document.createElement('a');
                    downloadLink.href = window.URL.createObjectURL(new Blob([blob]));
                    downloadLink.download = `${photoData.slug}.jpg`;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                });
        }
    };

    const fetchData = async () => {
        try {
            if (photoId) {
                const photo = await getPhoto(photoId);
                setPhoto(photo);

                const moreLikes = await searchPhotos({ query: photo.tags_preview[0].title });
                setMoreLikePhotos(moreLikes);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const loadMoreMovies = async () => {
        let photo = await getPhoto(photoId);
        setLoading(true);
        const newPage = currentPage + 1;
        const newPhotos = await searchPhotos({ query: photo.tags_preview[0].title, page: newPage });
        setMoreLikePhotos((prev) => [...prev, ...newPhotos]);
        setCurrentPage(newPage);
        setLoading(false);
    };

    // Render
    const ExifComponent = ({ exifData }) => {
        const exifElements = [];
        exifElements.push(
            <div key="dimensions" className="col-span-1">
                {renderItem('Dimensions', `${photoData.height}x${photoData.width}`)}
            </div>,
        );
        for (const key in exifData) {
            if (exifData.hasOwnProperty(key)) {
                exifElements.push(
                    <div key={key} className="col-span-1 max-w-48">
                        {renderItem(key, exifData[key])}
                    </div>,
                );
            }
        }

        return <div className="grid grid-cols-3 gap-y-3 gap-x-2">{exifElements}</div>;
    };

    const renderItem = (tit, val) => (
        <div className="flex flex-col gap-1 text-current">
            <span className="capitalize font-light">{tit}</span>
            <span className="font-medium">{val}</span>
        </div>
    );

    return (
        photoData && (
            <>
                <div className="relative w-full max-w-6xl mx-auto">
                    <div className="sticky bg-white dark:bg-black z-40 top-20 pt-2 flex justify-between items-center gap-4">
                        <div className="flex gap-3 py-4">
                            <img
                                src={photoData.user.profile_image.medium}
                                alt={photoData.user.username}
                                className="rounded-full w-14 h-14 cursor-pointer"
                                onClick={() => router.push(`/${photoData.user.username}`)}
                            />
                            <div className="">
                                <h4
                                    className="font-bold text-lg hover:underline cursor-pointer"
                                    onClick={() => router.push(`/${photoData.user.username}`)}
                                >
                                    {photoData.user.username}
                                </h4>
                                <p className="line-clamp-2 leading-4 font-light text-sm">{photoData.user.bio}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleDownload}
                            title="Download"
                            className="flex text-nowrap items-center gap-1 bg-green-500 text-white font-semibold px-6 py-3 rounded-full"
                        >
                            <FaDownload />
                            <span>Free download</span>
                        </button>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-4">
                        <img src={photoData.urls.regular} alt="" className="max-h-[620px] rounded-lg" />
                        <span>{photoData.description}</span>
                    </div>

                    <div className="text-right my-4">
                        <button
                            className="inline-flex items-center gap-1 border px-5 py-2 rounded"
                            onClick={() => setOverlayVisible(true)}
                        >
                            <FaInfoCircle />
                            <span>More Info</span>
                        </button>
                        {isOverlayVisible && (
                            <div className="fixed inset-0 z-50">
                                <div className="relative w-full h-full flex justify-center items-center ">
                                    <div
                                        onClick={() => setOverlayVisible(false)}
                                        className="h-full w-full absolute bg-black/75"
                                    />
                                    <div className="relative flex justify-center items-center z-10">
                                        <button
                                            className="absolute right-4 top-4 text-black rounded-full p-1 hover:bg-black/15"
                                            title="Close"
                                            onClick={() => setOverlayVisible(false)}
                                        >
                                            <FaTimes className="text-xl" />
                                        </button>
                                        <div className="min-w-[540px] shadow bg-white text-black shadow-black/50 rounded-xl overflow-hidden">
                                            <div className="px-12 py-8">
                                                <div className="flex gap-4 items-center">
                                                    <img
                                                        src={photoData.urls.small}
                                                        alt=""
                                                        className="max-h-40 rounded"
                                                    />
                                                    <div className="text-left">
                                                        <h5 className="text-3xl font-medium">Photo details</h5>
                                                        <span className="font-light">
                                                            Upload on {new Date(photoData.updated_at).toDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-12 text-center mt-6">
                                                    {renderItem('Views', formatNumber(photoData.views))}
                                                    {renderItem('Likes', formatNumber(photoData.likes))}
                                                    {renderItem('Downloads', formatNumber(photoData.downloads))}
                                                </div>
                                            </div>
                                            <div className="px-12 py-8 text-left border-t">
                                                <ExifComponent exifData={photoData.exif} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full mt-4">
                    <h4 className="text-3xl font-semibold text-center py-3">More like this</h4>
                    <PhotosGrid photos={moreLikePhotos} />
                </div>
            </>
        )
    );
};

export default Photo;
