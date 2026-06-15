import { useState, useEffect } from 'react';
import { getClients } from '../services/api';
import PartnershipModal from '../components/PartnershipModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { MapPin } from 'lucide-react';
export default function Clients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClient, setSelectedClient] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {
        const load = async () => {
            const data = await getClients();
            setClients(data || []);
            setLoading(false);
        };
        load();
    }, []);
    const activeClients = (clients || []).filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return (
        <div>
            <div className="animate-slide-up">
            <section className="section" style={{ background: '#000', color: '#fff', paddingTop: '80px', paddingBottom: '90px', textAlign: 'center' }}>
                <div className="container">
                    <p className="label" style={{ color: 'var(--accent)', marginBottom: '15px' }}>Global Alliance</p>
                    <h1 style={{ fontSize: '4rem', margin: '0', fontWeight: '900', letterSpacing: '-2px', lineHeight: '1' }}>Clients<span style={{ color: 'var(--primary)' }}>.</span></h1>
                    <p style={{ maxWidth: '600px', margin: '20px auto', fontSize: '1.1rem', color: '#888', fontWeight: '300', lineHeight: '1.5' }}>
                        Partnering with industry leaders to define the future of digital experiences. Our success is reflected in the growth of our collaborators.
                    </p>
                </div>
            </section>
            <section className="section" style={{ background: '#fff', marginTop: '-60px', borderRadius: '40px 40px 0 0', position: 'relative', zIndex: 10, minHeight: '60vh' }}>
                <div className="container">
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            {}
                            <div style={{ marginBottom: '40px' }}>
                                <input
                                    type="text"
                                    placeholder="Search clients by name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '15px 20px',
                                        borderRadius: '50px',
                                        border: '1px solid #eee',
                                        fontSize: '1rem',
                                        fontWeight: '400',
                                        outline: 'none',
                                        transition: 'all 0.3s ease',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={(e) => e.target.style.borderColor = '#eee'}
                                />
                            </div>
                            <div className="grid grid-3" style={{ gap: '30px' }}>
                                {activeClients.map(client => (
                                    <div
                                        key={client.id}
                                        style={{
                                            padding: '50px',
                                            borderRadius: '24px',
                                            background: '#fcfcfc',
                                            border: '1px solid #f0f0f0',
                                            textAlign: 'center',
                                            transition: 'all 0.4s ease',
                                            cursor: 'default'
                                        }}
                                        className="client-card"
                                    >
                                        <div style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px', borderRadius: '16px', background: '#f0f0f0', overflow: 'hidden' }}>
                                            {client.logo ? (
                                                <img
                                                    src={`http://127.0.0.1:8000/storage/${client.logo}`}
                                                    alt={client.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', padding: '14px', boxSizing: 'border-box', opacity: 1 }}
                                                />
                                            ) : (
                                                <span className="notranslate" translate="no" style={{ fontSize: '24px', fontWeight: '900', color: '#ddd' }}>{client.name}</span>
                                            )}
                                        </div>
                                        <h3 className="notranslate" translate="no" style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px' }}>{client.name}</h3>
                                        <p className="label" style={{ color: 'var(--primary)', fontSize: '0.7rem', marginBottom: '15px' }}>{client.industry}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', color: '#555', marginBottom: '20px', fontSize: '0.9rem' }}>
                                            <MapPin size={14} />
                                            <span>{client.address || 'Global'}</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedClient(client);
                                                setShowModal(true);
                                            }}
                                            style={{
                                                marginTop: '20px',
                                                padding: '12px 24px',
                                                background: '#8B2D7C',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                fontSize: '0.8rem',
                                                fontWeight: '700',
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                display: 'block',
                                                width: '100%',
                                                textAlign: 'center'
                                            }}
                                            onMouseOver={(e) => e.target.style.background = '#6B1D5C'}
                                            onMouseOut={(e) => e.target.style.background = '#8B2D7C'}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {activeClients.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                                    <h2 style={{ color: '#ccc' }}>We currently do not have any clients.</h2>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
            </div>
            <PartnershipModal 
                client={selectedClient}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />
        </div>
    );
}
