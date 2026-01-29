import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import type { TransmissionPreview, TransmissionsResponse } from '../../types/transmissions';

export const TransmissionDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [transmission, setTransmission] = useState<TransmissionPreview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransmission = async () => {
            try {
                // Query by slug
                const res = await fetch(`/api/transmissions?where[slug][equals]=${slug}`);
                if (!res.ok) throw new Error('Failed to fetch transmission');

                const data: TransmissionsResponse = await res.json();

                if (data.docs && data.docs.length > 0) {
                    setTransmission(data.docs[0]);
                } else {
                    setError('Transmission not found');
                }
            } catch (err) {
                console.error('Transmission fetch error:', err);
                setError('Unable to load transmission');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchTransmission();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen pt-40 px-6 lg:px-20 text-center">
                <div className="animate-pulse">
                    <div className="h-8 bg-white/5 w-1/3 mx-auto mb-8" />
                    <div className="h-4 bg-white/5 w-1/4 mx-auto" />
                </div>
            </div>
        )
    }

    if (error || !transmission) {
        return (
            <div className="min-h-screen pt-40 px-6 lg:px-20 text-center">
                <h1 className="text-h2-fluid font-display text-text mb-6">404</h1>
                <p className="text-body-fluid text-secondary mb-8">{error || 'Transmission not found'}</p>
                <Link to="/transmissions" className="text-accent hover:text-white underline">
                    Return to Transmissions
                </Link>
            </div>
        );
    }

    return (
        <article className="min-h-screen pt-32 pb-20">
            {/* Hero Header */}
            <header className="px-6 lg:px-20 max-w-5xl mx-auto mb-16 text-center">
                {transmission.category && (
                    <motion.span
                        className="text-label-fluid text-accent mb-6 block"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {transmission.category.title}
                    </motion.span>
                )}

                <motion.h1
                    className="text-h2-fluid font-display text-text mb-6 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {transmission.title}
                </motion.h1>

                {transmission.publishedAt && (
                    <motion.time
                        className="text-nano text-secondary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {new Date(transmission.publishedAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </motion.time>
                )}
            </header>

            {/* Hero Image */}
            {transmission.heroImage?.url && (
                <motion.div
                    className="w-full max-w-7xl mx-auto px-6 mb-20"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="aspect-[21/9] overflow-hidden bg-white/5">
                        <img
                            src={transmission.heroImage.url}
                            alt={transmission.heroImage.alt_text || transmission.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </motion.div>
            )}

            {/* Content Body - Requires Rich Text Helper later, using simplified render for now */}
            <div className="px-6 lg:px-20 max-w-3xl mx-auto prose prose-invert prose-lg prose-headings:font-display prose-headings:font-normal prose-p:text-secondary prose-a:text-accent">
                {/* Note: In a real app we'd use a rich text serializer for Payload's JSON content.
              For now we display the excerpt or assume simple structure if needed */ }
                <p className="text-xl leading-relaxed text-text/90">
                    {transmission.excerpt}
                </p>

                {/* Placeholder for actual Rich Text rendering */}
                <div className="mt-12 p-6 border border-white/10 rounded-lg bg-white/5 text-center text-sm text-secondary">
                    [Full Rich Text Content Rendering to be implemented]
                </div>
            </div>

            <div className="text-center mt-20">
                <Link to="/transmissions" className="inline-block px-8 py-4 border border-white/20 hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest text-sm">
                    Back to Transmissions
                </Link>
            </div>
        </article>
    );
};

export default TransmissionDetail;
