import React, { useState } from 'react';
import * as api from '../../services/api';
export default function AIPromptGenerator({ roleColor }) {
    const [formData, setFormData] = useState({
        subject: '',
        category: 'Logo Design',
        customCategory: '',
        style: 'Minimalist',
        customStyle: '',
        mood: 'Professional',
        lighting: 'Studio',
        rendering: '4k'
    });
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const categories = ['Logo Design', 'UI/UX Interface', '3D Scene', 'Packaging', 'Social Media Branding'];
    const styles = ['Minimalist', 'Cyberpunk', 'Luxury', 'Retro', 'Bauhaus', 'Futuristic'];
    const subjectLength = formData.subject.trim().length;
    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult('');
        setCopied(false);
        const payload = {
            ...formData,
            category: formData.category === 'Custom' ? formData.customCategory.trim() : formData.category,
            style: formData.style === 'Custom' ? formData.customStyle.trim() : formData.style
        };
        try {
            const res = await api.authenticatedPost('ai/generate-prompt', payload);
            if (res && res.prompt) {
                setResult(res.prompt);
            }
        } catch (err) {
            console.error(err);
            setResult('Error generating prompt. Ensure your session is active.');
        } finally {
            setLoading(false);
        }
    };
    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };
    const surpriseMe = () => {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const style = styles[Math.floor(Math.random() * styles.length)];
        const moods = ['Dreamlike', 'Bold', 'Elegant', 'Mysterious', 'Playful', 'Premium'];
        const lighting = ['Soft studio', 'Golden hour', 'Neon rim light', 'Cinematic contrast', 'Natural daylight'];
        const rendering = ['4k', '8k', 'photorealistic', 'high-detail 3D render', 'editorial polish'];
        setFormData({
            ...formData,
            category,
            style,
            mood: moods[Math.floor(Math.random() * moods.length)],
            lighting: lighting[Math.floor(Math.random() * lighting.length)],
            rendering: rendering[Math.floor(Math.random() * rendering.length)]
        });
        setCopied(false);
    };
    return (
        <div className="grid grid-2" style={{ gap: '40px' }}>
            <div className="card" style={{ padding: '40px', borderTop: `6px solid ${roleColor}` }}>
                <h2 style={{ marginBottom: '30px', fontWeight: '800' }}>AI Prompt Generator</h2>
                <form onSubmit={handleGenerate}>
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', marginBottom: '8px' }}>
                            <label className="label" style={{ margin: 0 }}>Visual Subject</label>
                            <span style={{ fontSize: '0.78rem', color: subjectLength > 120 ? roleColor : '#777', fontWeight: 700 }}>
                                {subjectLength} chars
                            </span>
                        </div>
                        <textarea
                            className="input-field"
                            placeholder="e.g. Coffee shop with vintage atmosphere"
                            required
                            rows={5}
                            value={formData.subject}
                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                            style={{ resize: 'vertical', minHeight: '140px', lineHeight: '1.6' }}
                        />
                    </div>
                    <div className="grid grid-2" style={{ gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label className="label">Category</label>
                            <select 
                                className="input-field"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                <option value="Custom">Custom</option>
                            </select>
                            {formData.category === 'Custom' && (
                                <input
                                    className="input-field"
                                    placeholder="Describe your category"
                                    required
                                    value={formData.customCategory}
                                    onChange={e => setFormData({ ...formData, customCategory: e.target.value })}
                                    style={{ marginTop: '12px' }}
                                />
                            )}
                        </div>
                        <div>
                            <label className="label">Style</label>
                            <select 
                                className="input-field"
                                value={formData.style}
                                onChange={e => setFormData({ ...formData, style: e.target.value })}
                            >
                                {styles.map(s => <option key={s} value={s}>{s}</option>)}
                                <option value="Custom">Custom</option>
                            </select>
                            {formData.style === 'Custom' && (
                                <input
                                    className="input-field"
                                    placeholder="Describe your style"
                                    required
                                    value={formData.customStyle}
                                    onChange={e => setFormData({ ...formData, customStyle: e.target.value })}
                                    style={{ marginTop: '12px' }}
                                />
                            )}
                        </div>
                    </div>
                    <div className="grid grid-3" style={{ gap: '20px', marginBottom: '30px' }}>
                        <div>
                            <label className="label">Mood</label>
                            <input 
                                className="input-field"
                                placeholder="Dark"
                                value={formData.mood}
                                onChange={e => setFormData({ ...formData, mood: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Lighting</label>
                            <input 
                                className="input-field"
                                placeholder="Neon"
                                value={formData.lighting}
                                onChange={e => setFormData({ ...formData, lighting: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Resolution</label>
                            <input 
                                className="input-field"
                                placeholder="8k"
                                value={formData.rendering}
                                onChange={e => setFormData({ ...formData, rendering: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-2" style={{ gap: '14px' }}>
                        <button 
                            type="button"
                            className="btn full-width"
                            onClick={surpriseMe}
                            disabled={loading}
                            style={{ background: '#fff', color: roleColor, border: `1px solid ${roleColor}` }}
                        >
                            Surprise me
                        </button>
                        <button 
                            type="submit" 
                            className="btn full-width" 
                            disabled={loading}
                            style={{ background: roleColor, opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? 'Consulting Gemini...' : 'Generate Design Prompt'}
                        </button>
                    </div>
                </form>
            </div>
            <div className="flex-column" style={{ gap: '20px' }}>
                <div className="card" style={{ flex: 1, padding: '40px', background: '#f8f9fa', border: '1px dashed #ddd', position: 'relative' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '1rem', color: '#666' }}>Engineered Prompt Output</h3>
                    {result ? (
                        <div className="animate-fade-in">
                            <p style={{ 
                                fontSize: '1.1rem', 
                                lineHeight: '1.8', 
                                color: '#333', 
                                fontStyle: 'italic',
                                background: '#fff',
                                padding: '20px',
                                borderRadius: '8px',
                                border: '1px solid #eee'
                            }}>
                                "{result}"
                            </p>
                            <button 
                                onClick={copyToClipboard}
                                className="btn"
                                style={{ marginTop: '20px', background: '#38a169', color: 'white' }}
                            >
                                {copied ? 'Copied!' : 'Copy to Clipboard'}
                            </button>
                        </div>
                    ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', textAlign: 'center' }}>
                            <p>{loading ? 'Translating design concepts...' : 'Ready to engineer your visual prompts. Fill the form to start.'}</p>
                        </div>
                    )}
                </div>
                <div className="card" style={{ padding: '20px', background: '#e6fffa', border: '1px solid #b2f5ea', color: '#2c7a7b' }}>
                    <p style={{ fontSize: '0.8rem', margin: 0, fontWeight: 700 }}>
                        PRO TIP: Use the generated prompt in Midjourney or DALL-E for best results in production.
                    </p>
                </div>
            </div>
        </div>
    );
}
