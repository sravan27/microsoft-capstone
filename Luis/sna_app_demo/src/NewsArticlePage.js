import React, { useState, useEffect } from 'react';
import './NewsArticlePage.css';

const CircularProgress = ({ percentage, size, color, strokeWidth = 3, showText = false }) => {
  // Animate from 0 to target percentage
  const [currentPercentage, setCurrentPercentage] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setCurrentPercentage(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const adjustedRadius = (size - strokeWidth * 2 - 4) / 2;
  const circumference = 2 * Math.PI * adjustedRadius;
  const offset = circumference * (1 - currentPercentage / 100);

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
  const [explainOpen, setExplainOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const openModal = () => setModalOpen(true);
  const closeModal = (e) => {
    e.stopPropagation();
    setModalOpen(false);
  };

  const toggleExplain = (e) => {
    e.stopPropagation();
    setExplainOpen((prev) => !prev);
  };

  const handleFeedback = (feedback) => {
    setSelectedFeedback(feedback);
  };

  const percentages = {
    politicalBias: 70,
    rhetoricIntensity: 50,
    informationDepth: 80,
  };

  return (
    <div className="article-container">
      {/* Header */}
      <header className="site-header">
        <h1 className="site-title">
          <span className="mindset-text">MINDset</span>
          <span className="bysna-text"> by SNA</span>
        </h1>
      </header>

      {/* Navigation Panel (mock) */}
      <nav className="nav-panel">
        <ul>
          <li>World</li>
          <li>Companies</li>
          <li>Tech</li>
          <li>Markets</li>
          <li>Climate</li>
          <li>Opinion</li>
          <li>Sports</li>
          <li>Arts</li>
          <li>Lifestyle</li>
        </ul>
      </nav>

      {/* Article Title (Bigger) */}
      <h2 className="article-title">Historic Breakthrough in Space Exploration Unveiled</h2>

      {/* Hero Image */}
      <div className="hero-image">
        <img src="https://picsum.photos/1200/800" alt="Space Exploration" />
      </div>

      {/* Rings Button Container (as an item in the page, below the hero image) */}
      <div className="rings-button-container" onClick={openModal}>
        <div className="button-ring">
          <CircularProgress
            percentage={percentages.politicalBias}
            size={90}
            strokeWidth={8}
            color="lightblue"
            showText
          />
          <div className="ring-label">Political Bias</div>
        </div>
        <div className="button-ring">
          <CircularProgress
            percentage={percentages.rhetoricIntensity}
            size={90}
            strokeWidth={8}
            color="red"
            showText
          />
          <div className="ring-label">Rhetoric Intensity</div>
        </div>
        <div className="button-ring">
          <CircularProgress
            percentage={percentages.informationDepth}
            size={90}
            strokeWidth={8}
            color="darkblue"
            showText
          />
          <div className="ring-label">Information Depth</div>
        </div>
      </div>

      {/* Article Body (Expanded) */}
      <article className="news-article">
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
          Utilizing advanced telescopic arrays and deep-space sensors, data was meticulously gathered over the past decade. The findings, now undergoing rigorous peer review, hint at a potential link between these phenomena and dark matter interactions—a theory that has long puzzled scientists.
        </p>
        <p>
          With billions invested in space technology by governments and private sectors alike, this discovery may accelerate the timeline for interstellar travel and spark revolutionary energy solutions. The implications for science, technology, and society are profound.
        </p>
        <p>
          MINDset by SNA will continue to deliver comprehensive and in-depth coverage as more details emerge and experts debate the significance of this groundbreaking development.
        </p>
      </article>

      {/* Modal Overlay */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>X</button>
            <div className="modal-scores">
              <div className="score-item">
                <CircularProgress
                  percentage={percentages.politicalBias}
                  size={120}
                  strokeWidth={10}
                  color="lightblue"
                  showText
                />
                <div className="score-title">Political Bias</div>
              </div>
              <div className="score-item">
                <CircularProgress
                  percentage={percentages.rhetoricIntensity}
                  size={120}
                  strokeWidth={10}
                  color="red"
                  showText
                />
                <div className="score-title">Rhetoric Intensity</div>
              </div>
              <div className="score-item">
                <CircularProgress
                  percentage={percentages.informationDepth}
                  size={120}
                  strokeWidth={10}
                  color="darkblue"
                  showText
                />
                <div className="score-title">Information Depth</div>
              </div>
            </div>

            <button className="explain-button" onClick={toggleExplain}>
              What Does This Mean?
            </button>
            {explainOpen && (
              <div className="explain-content">
                <p>
                  <strong>Political Bias:</strong> Measures the ideological leaning of the article—from neutral to heavily biased.
                </p>
                <p>
                  <strong>Rhetoric Intensity:</strong> Assesses the emotional charge and manipulative language used.
                </p>
                <p>
                  <strong>Information Depth:</strong> Evaluates the thoroughness and detail of the content.
                </p>
              </div>
            )}

            <div className="feedback-prompt">Do you agree with these metrics?</div>
            <div className="modal-feedback">
              <button
                className={`feedback-button ${selectedFeedback === "up" ? "feedback-up" : ""}`}
                onClick={() => handleFeedback("up")}
              >
                👍
              </button>
              <button
                className={`feedback-button ${selectedFeedback === "down" ? "feedback-down" : ""}`}
                onClick={() => handleFeedback("down")}
              >
                👎
              </button>
              <button
                className={`feedback-button ${selectedFeedback === "question" ? "feedback-question" : ""}`}
                onClick={() => handleFeedback("question")}
              >
                ❓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsArticlePage;
