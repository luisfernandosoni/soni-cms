import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react'; // Updated import based on new package
import type { TransmissionPreview, TransmissionsResponse } from '../../types/transmissions';

const API_URL = '/api/transmissions?limit=100&sort=-publishedAt';

export const Transmissions: React.FC = () => {
    const [transmissions, setTransmissions] = useState<TransmissionPreview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransmissions = async () => {
            try {
                const res = await fetch(API_URL);
                if (!res.ok) throw new Error('Failed to fetch transmissions');

                const data: TransmissionsResponse = await res.json();

                if (data.docs) {
                    setTransmissions(data.docs);
                }
            } catch (err) {
                console.error('Transmissions fetch error:', err);
                setError('Unable to load transmissions');
            } finally {
                setLoading(false);
            }
        };

        fetchTransmissions();
    }, []);

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 lg:px-20">
            <div className="max-w-8xl mx-auto">
                <header className="mb-20">
                    <motion.h1
                        className="text-h1-fluid font-display text-text leading-none mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        TRANSMISSIONS
                    </motion.h1>
                    <motion.div
                        className="w-full h-px bg-white/10"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    />
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[4/5] bg-white/5 mb-6" />
                                <div className="h-4 bg-white/5 w-1/4 mb-4" />
                                <div className="h-8 bg-white/5 w-3/4 mb-4" />
                                <div className="h-4 bg-white/5 w-full" />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-secondary">
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {transmissions.map((transmission, index) => (
                            <motion.a
                                key={transmission.id}
                                href={`/transmissions/${transmission.slug}`}
                                className="group block"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.05 }}
                            >
                                {/* Image */}
                                <div className="aspect-[4/5] overflow-hidden mb-6 bg-white/5 relative">
                                    {transmission.heroImage?.url && (
                                        <img
                                            src={transmission.heroImage.url}
                                            alt={transmission.heroImage.alt_text || transmission.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                                </div>

                                {/* Content */}
                                <div>
                                    {transmission.category && (
                                        <span className="text-nano text-accent mb-3 block">
                                            {transmission.category.title}
                                        </span>
                                    )}

                                    <h3 className="text-card-title-fluid font-display text-text mb-3 group-hover:text-white transition-colors">
                                        {transmission.title}
                                    </h3>

                                    {transmission.excerpt && (
                                        <p className="text-body-fluid text-secondary line-clamp-2">
                                            {transmission.excerpt}
                                        </p>
                                    )}

                                    {transmission.publishedAt && (
                                        <time className="text-nano text-white/40 mt-4 block">
                                            {new Date(transmission.publishedAt).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </time>
                                    )}
                                </div>
                            </motion.a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transmissions;
