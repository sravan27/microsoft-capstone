import React, { useState } from 'react';
import './NewsArticlePage.css';

const CircularProgress = ({ percentage, size, color, strokeWidth = 3, showText = false }) => {
  const adjustedRadius = (size - strokeWidth * 2 - 4) / 2;
  const circumference = 2 * Math.PI * adjustedRadius;
  const offset = circumference * (1 - percentage / 100);

  return (
    <svg width={size} height={size} className="progress-svg">
      <circle
        className="progress-bg"
        stroke="#e6e6e6"
        strokeWidth={strokeWidth}
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={adjustedRadius}
      />
      <circle
        className="progress-bar"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={adjustedRadius}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      {showText && (
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          className="progress-text"
          transform={`rotate(90, ${size / 2}, ${size / 2})`}
        >
          {percentage}%
        </text>
      )}
    </svg>
  );
};

const NewsArticlePage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = (e) => {
    e.stopPropagation();
    setModalOpen(false);
  };

  const percentages = {
    politicalBias: 70,
    rhetoricIntensity: 50,
    informationDepth: 80,
  };

  return (
    <div className="article-container">
      <header className="site-header">
        <h1 className="site-title">SOKOVIA NEWS AGENCY</h1>
      </header>
      <article className="news-article">
        <h2>Historic Breakthrough in Space Exploration Unveiled</h2>
        <img src="https://via.placeholder.com/400x200" alt="Space Exploration" />
        <p>
          In a stunning revelation that has captured global attention, scientists announced today a breakthrough in space exploration that promises to redefine humanity’s understanding of the cosmos.
        </p>
        <p>
          Researchers from the International Space Research Consortium (ISRC) have uncovered evidence of a previously unknown celestial phenomenon that could explain gravitational anomalies observed in distant galaxies.
        </p>
        <p>
          “This discovery opens up a new chapter in our exploration of the universe,” stated Dr. Elena Martinez, lead astrophysicist at the ISRC. “It challenges our current theories and compels us to rethink the fundamental laws governing cosmic evolution.”
        </p>
        <p>
          Utilizing advanced telescopic arrays and deep-space sensors, data was gathered over the past decade. The findings, now undergoing rigorous peer review, hint at a potential link between these phenomena and dark matter interactions.
        </p>
        <p>
          With billions invested in space technology by governments and private sectors alike, this discovery may accelerate the timeline for interstellar travel and spark revolutionary energy solutions. Sokovia News Agency will continue to deliver comprehensive coverage as more details emerge.
        </p>
      </article>

      {/* Floating Button */}
      <div className="floating-button" onClick={openModal}>
        <div className="triangle-ring" id="ring1">
          <CircularProgress percentage={percentages.politicalBias} size={45} color="#D32F2F" />
        </div>
        <div className="triangle-ring" id="ring2">
          <CircularProgress percentage={percentages.rhetoricIntensity} size={45} color="#FF9800" />
        </div>
        <div className="triangle-ring" id="ring3">
          <CircularProgress percentage={percentages.informationDepth} size={45} color="#1976D2" />
        </div>
      </div>

      {/* Modal Overlay */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>X</button>
            <div className="modal-scores">
              <div className="score-item">
                <CircularProgress percentage={percentages.politicalBias} size={100} color="#D32F2F" strokeWidth={6} showText={true} />
                <div className="score-title">Political Bias</div>
              </div>
              <div className="score-item">
                <CircularProgress percentage={percentages.rhetoricIntensity} size={100} color="#FF9800" strokeWidth={6} showText={true} />
                <div className="score-title">Rhetoric Intensity</div>
              </div>
              <div className="score-item">
                <CircularProgress percentage={percentages.informationDepth} size={100} color="#1976D2" strokeWidth={6} showText={true} />
                <div className="score-title">Information Depth</div>
              </div>
            </div>
            <p className="score-explanation">
              [Placeholder: Explanation of how these scores are calculated and what they represent.]
            </p>
            <div className="modal-buttons">
              <button className="modal-button">Agree</button>
              <button className="modal-button">I don't Know</button>
              <button className="modal-button">Disagree</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsArticlePage;
