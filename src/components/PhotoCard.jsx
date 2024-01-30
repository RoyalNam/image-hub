import { useRouter } from 'next/navigation';
import React from 'react';
import { FaHeart } from 'react-icons/fa';

const PhotoCard = ({ photo }) => {
    const router = useRouter();
    return (
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
};

export default PhotoCard;
