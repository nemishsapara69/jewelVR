import React, { useState } from 'react';
import { ORNAMENTS, CATEGORIES } from '../utils/ornamentData.js';
import './OrnamentSelector.css';

export default function OrnamentSelector({ selectedOrnament, onSelect }) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES.EARRINGS);

  const filtered = ORNAMENTS.filter((o) => o.category === activeCategory);

  return (
    <aside className="ornament-sidebar" aria-label="Jewelry selector">
      <div className="sidebar-header">
        <span className="sidebar-icon">✦</span>
        <h2 className="sidebar-title">JewelVR</h2>
      </div>

      <p className="sidebar-tagline">Try before you buy</p>

      {/* Category Tabs */}
      <div className="category-tabs" role="tablist">
        {Object.values(CATEGORIES).map((cat) => (
          <button
            key={cat}
            role="tab"
            id={`tab-${cat}`}
            aria-selected={activeCategory === cat}
            className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === CATEGORIES.EARRINGS ? '💎 Earrings' : '📿 Necklaces'}
          </button>
        ))}
      </div>

      {/* Ornament Cards */}
      <div className="ornament-list" role="tabpanel">
        {filtered.map((ornament) => (
          <button
            key={ornament.id}
            id={`ornament-${ornament.id}`}
            className={`ornament-card ${selectedOrnament?.id === ornament.id ? 'selected' : ''}`}
            onClick={() => onSelect(ornament)}
            aria-pressed={selectedOrnament?.id === ornament.id}
          >
            <div className="ornament-preview">
              <img
                src={ornament.src}
                alt={ornament.name}
                className="ornament-img"
                onError={(e) => { e.target.style.opacity = '0.3'; }}
              />
            </div>
            <div className="ornament-info">
              <span className="ornament-name">{ornament.name}</span>
              <span className="ornament-price">${ornament.price.toLocaleString()}</span>
            </div>
            {selectedOrnament?.id === ornament.id && (
              <span className="selected-badge">✓ Wearing</span>
            )}
          </button>
        ))}
      </div>

      <div className="sidebar-footer">
        <p className="footer-note">🔒 All processing is local — no camera data uploaded</p>
      </div>
    </aside>
  );
}
