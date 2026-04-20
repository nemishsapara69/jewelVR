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
    src: '/ornaments/earrings/gold_jhumka.png',
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
    src: '/ornaments/earrings/gold_drop.png',
    scaleX: 0.08,
    scaleY: 0.22,
    offsetX: 0.5,
    offsetY: 0.05,
  },
  {
    id: 'diamond_stud',
    name: 'Diamond Stud',
    category: CATEGORIES.EARRINGS,
    src: '/ornaments/earrings/diamond_stud.png',
    scaleX: 0.07,
    scaleY: 0.07,
    offsetX: 0.5,
    offsetY: 0.5,
  },
  {
    id: 'gold_choker',
    name: 'Gold Choker',
    category: CATEGORIES.NECKLACES,
    src: '/ornaments/necklaces/gold_choker.png',
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
    src: '/ornaments/necklaces/pearl_strand.png',
    scaleX: 0.6,
    scaleY: 0.32,
    offsetX: 0.5,
    offsetY: 0.1,
  },
  {
    id: 'layered_gold',
    name: 'Layered Gold',
    category: CATEGORIES.NECKLACES,
    src: '/ornaments/necklaces/layered_gold.png',
    scaleX: 0.65,
    scaleY: 0.38,
    offsetX: 0.5,
    offsetY: 0.05,
  },
];
