import React from 'react';
import PhotoCard from './PhotoCard';

const PhotosGrid = ({ photos }) => {
    return (
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 space-y-4">
            {photos.map((item) => (
                <PhotoCard key={item.id} photo={item} />
            ))}
        </div>
    );
};

export default PhotosGrid;
