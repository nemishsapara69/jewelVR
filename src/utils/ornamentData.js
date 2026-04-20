// Ornament catalog — swap src paths when real images arrive

export const CATEGORIES = {
  EARRINGS: 'earrings',
  NECKLACES: 'necklaces',
};

export const ORNAMENTS = [
  {
    id: 'gold_jhumka',
    name: 'Gold Jhumka',
    category: CATEGORIES.EARRINGS,
    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23ffd700" opacity="0.8"/><text x="50" y="55" font-family="Arial" font-size="14" fill="%23000" text-anchor="middle">Jhumka</text></svg>',
    // Scale relative to ear-to-ear distance
    scaleX: 0.12,
    scaleY: 0.18,
    // Offset from ear landmark (fraction of ornament size)
    offsetX: 0.5,   // center horizontally on ear
    offsetY: 0.1,   // hang below ear
  },
  {
    id: 'gold_drop',
    name: 'Gold Drop',
    category: CATEGORIES.EARRINGS,
    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path d="M 50 10 Q 80 50 50 90 Q 20 50 50 10" fill="%23ffd700" opacity="0.8"/><text x="50" y="55" font-family="Arial" font-size="14" fill="%23000" text-anchor="middle">Drop</text></svg>',
    scaleX: 0.08,
    scaleY: 0.22,
    offsetX: 0.5,
    offsetY: 0.05,
  },
  {
    id: 'diamond_stud',
    name: 'Diamond Stud',
    category: CATEGORIES.EARRINGS,
    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="20" fill="%23e0e0e0" opacity="0.9"/><text x="50" y="55" font-family="Arial" font-size="12" fill="%23000" text-anchor="middle">Stud</text></svg>',
    scaleX: 0.07,
    scaleY: 0.07,
    offsetX: 0.5,
    offsetY: 0.5,
  },
  {
    id: 'gold_choker',
    name: 'Gold Choker',
    category: CATEGORIES.NECKLACES,
    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><path d="M 20 20 Q 100 80 180 20" fill="none" stroke="%23ffd700" stroke-width="15" opacity="0.8"/><text x="100" y="50" font-family="Arial" font-size="16" fill="%23000" text-anchor="middle">Choker</text></svg>',
    // Scale relative to shoulder width
    scaleX: 0.55,
    scaleY: 0.28,
    offsetX: 0.5,  // center on neck midpoint
    offsetY: 0.1,
  },
  {
    id: 'pearl_strand',
    name: 'Pearl Strand',
    category: CATEGORIES.NECKLACES,
    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><path d="M 20 20 Q 100 80 180 20" fill="none" stroke="%23ffffff" stroke-width="10" opacity="0.9"/><text x="100" y="50" font-family="Arial" font-size="16" fill="%23000" text-anchor="middle">Pearl</text></svg>',
    scaleX: 0.6,
    scaleY: 0.32,
    offsetX: 0.5,
    offsetY: 0.1,
  },
  {
    id: 'layered_gold',
    name: 'Layered Gold',
    category: CATEGORIES.NECKLACES,
    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><path d="M 20 20 Q 100 80 180 20" fill="none" stroke="%23ffd700" stroke-width="5" opacity="0.8"/><path d="M 10 10 Q 100 100 190 10" fill="none" stroke="%23ffd700" stroke-width="5" opacity="0.8"/><text x="100" y="45" font-family="Arial" font-size="16" fill="%23000" text-anchor="middle">Layered</text></svg>',
    scaleX: 0.65,
    scaleY: 0.38,
    offsetX: 0.5,
    offsetY: 0.05,
  },
];
