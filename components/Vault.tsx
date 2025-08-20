import React, { useState, useCallback, useEffect } from 'react';

interface VaultProps {
  onBack: () => void;
}

const PhotoGrid: React.FC<{ photos: string[] }> = ({ photos }) => (
    <div className="grid grid-cols-3 gap-1 p-1">
        {photos.map((photo, index) => (
            <div key={index} className="aspect-square bg-zinc-200 dark:bg-zinc-700 rounded-md overflow-hidden">
                <img src={photo} alt={`vault item ${index + 1}`} className="w-full h-full object-cover" />
            </div>
        ))}
    </div>
);

const Vault: React.FC<VaultProps> = ({ onBack }) => {
    const [photos, setPhotos] = useState<string[]>([]);

    useEffect(() => {
        // Load initial placeholder photos
        const initialPhotos = Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/${i+1}/200/200`);
        setPhotos(initialPhotos);
    }, []);

    const addPhoto = useCallback(() => {
        const newPhotoId = Math.floor(Math.random() * 1000);
        const newPhoto = `https://picsum.photos/seed/${newPhotoId}/200/200`;
        setPhotos(prevPhotos => [...prevPhotos, newPhoto]);
    }, []);

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#18181a] text-slate-900 dark:text-white p-4">
            <header className="flex items-center justify-between pb-4">
                <button onClick={onBack} className="text-orange-500 dark:text-orange-400 hover:text-orange-400 dark:hover:text-orange-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-semibold">My Vault</h1>
                <div className="w-6"></div>
            </header>
            <p className="text-xs text-zinc-600 dark:text-zinc-500 text-center mb-2">Note: Photos are for demonstration and are not saved permanently.</p>
            <main className="flex-1 overflow-y-auto">
                <PhotoGrid photos={photos} />
            </main>
            <footer className="pt-4">
                <button 
                    onClick={addPhoto} 
                    className="w-full bg-orange-500 text-white py-3 rounded-xl text-lg font-bold hover:bg-orange-600 transition-all active:scale-95"
                >
                    Add Photo
                </button>
            </footer>
        </div>
    );
};

export default Vault;