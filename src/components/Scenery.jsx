import React from 'react';
import Sprite from './Sprite';

// Phông nền phong cảnh: trời hoàng hôn, núi xa, đồi gần, UFO lơ lửng
const Scenery = ({ ufo = true }) => (
  <div className="scenery" aria-hidden="true">
    <div className="sky" />
    <div className="stars" />
    <div className="sun" />
    <div className="mountains far" />
    <div className="mountains near" />
    <div className="ground" />
    {ufo && (
      <div className="ufo">
        <Sprite name="SHIP" size={96} />
      </div>
    )}
  </div>
);

export default Scenery;
