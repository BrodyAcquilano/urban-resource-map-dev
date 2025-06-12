import React, { useState } from "react";
import InfoPanel from "../components/InfoPanel.jsx";
import './Home.css';

function Home({ selectedLocation }) {
  const [showInfo, setShowInfo] = useState(true);

  return (
    <>
     {/* Info Panel Toggle + Panel */}
      <button
        className={`info-side-toggle info-toggle ${
          showInfo ? "" : "collapsed-toggle"
        }`}
        onClick={() => setShowInfo(!showInfo)}
      >
        ☰
      </button>
      <div
        className={`info-overlay-panel info-panel-wrapper ${
          showInfo ? "" : "collapsed"
        }`}
      >
        <InfoPanel selectedLocation={selectedLocation}/>
      </div>
    </>
  );
}

export default Home;
