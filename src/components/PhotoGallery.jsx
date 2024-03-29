import React from 'react';
import { useRouter } from 'next/navigation';
import { FaHeart } from 'react-icons/fa';
import InfiniteScroll from 'react-infinite-scroll-component';

const PhotoGallery = ({ photos, title = '', loadMore }) => {
    const router = useRouter();

    const PhotoCard = ({ photo }) => (
        <div
            className="relative group cursor-pointer"
            onClick={() => {
                router.push(`/pin/${photo.id}`);
            }}
        >
            <img
                src={photo.urls.small}
                alt=""
                className="rounded-xl shadow-sm shadow-black/30 dark:shadow-white/30 w-full"
            />
            <div className="absolute inset-0 opacity-0 bg-black/50 group-hover:opacity-100 transition-opacity duration-300">
                <div className="h-full w-full flex gap-1 justify-center items-center">
                    <FaHeart className="text-red-400" />
                    <span>{photo.likes}</span>
                </div>
            </div>
        </div>
    );

    return photos.length > 0 ? (
        <InfiniteScroll dataLength={photos.length} next={loadMore} hasMore={true}>
            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 space-y-4">
                {photos.map((item) => (
                    <PhotoCard key={item.id} photo={item} />
                ))}
            </div>
        </InfiniteScroll>
    ) : (
        <div className="text-red-500 text-left">No {title} found.</div>
    );
};

export default PhotoGallery;
