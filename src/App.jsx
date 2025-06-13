//External library dependencies
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";

//Components used across pages
import Header from "./components/Header.jsx";
import FilterPanel from "./components/FilterPanel.jsx";
import MapPanel from "./components/MapPanel.jsx";

//Pages
import Home from "./pages/Home.jsx";
import Editor from "./pages/Editor.jsx";
import Export from "./pages/Export.jsx";

//Different Map Styles for Leaflet from Open Street Map
const TILE_STYLES = {
  Standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", // OSM default
  Light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", // Carto Light
  Dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", // Carto Dark
  Terrain: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", // OpenTopoMap (terrain-style)
};

function App() {
  //Input->Output Stream: SetMarkers()->markers ->setFilteredMarkers(markers) -> filteredMarkers

  const [markers, setMarkers] = useState([]);

  const [filteredMarkers, setFilteredMarkers] = useState([]);

  //Control for toggling Filter Panel
  const [showFilter, setShowFilter] = useState(true);

  //Control For displaying one location in Info Panel or editing one Lacoation in Edit Location Panel
  const [selectedLocation, setSelectedLocation] = useState(null);

  //Control for rendering different map styles from Open Street Map
  const [tileStyle, setTileStyle] = useState("Standard");

  //Call to get data from the Mongo DB databse using API routes
  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const res = await axios.get("/api/locations");
        setMarkers(res.data);
      } catch (err) {
        console.error("Failed to fetch markers:", err);
      }
    };

    fetchMarkers();
  }, []);


  //Return block: tell React what to render visually. Components and actions.
  //App is the root level. It contains the routes to each page.
  //It also contains elements that are used across pages like the Header, the Filter Panel, and Map Panel.
  //Doing it this way improves functionality.
  // If you change pages from Home, to the editor, or export pages your filters stay selected
  // and the map still displays the same set of filtered markers.
  // This allows you to switch workflows,without having to reset filters.
  // It also means the browser doesn't have to reload data from the database just because pages are switched.
  //The browser doesn't have to reload data for every component on the screen, just data associated with the new panels and Modals.
  //These elements are loaded separately before the pages so loading a new page  does not affect their state.
  return (
    <div className="app-container">
      {/* Header */}
      <Header />
      {/* Body */}
      <div className="main-layer">
        {/* Filter Panel Toggle + Panel */}
        <button
          className={`filter-side-toggle filter-toggle ${
            showFilter ? "" : "collapsed-toggle"
          }`}
          onClick={() => setShowFilter(!showFilter)}
        >
          ☰
        </button>
        <div
          className={`filter-overlay-panel filter-panel-wrapper ${
            showFilter ? "" : "collapsed"
          }`}
        >
          <FilterPanel
            tileStyle={tileStyle}
            setTileStyle={setTileStyle}
            markers={markers}
            setFilteredMarkers={setFilteredMarkers}
          />
        </div>

        {/* Map Panel */}
        <MapPanel
          tileUrl={TILE_STYLES[tileStyle]}
          filteredMarkers={filteredMarkers}
          setSelectedLocation={setSelectedLocation}
        />

        {/* Pages */}
        <Routes>
          <Route
            path="/"
            element={<Home selectedLocation={selectedLocation} />}
          />
          <Route
            path="/editor"
            element={
              <Editor
                setMarkers={setMarkers}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
              />
            }
          />
          <Route path="/export" element={<Export />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

//REACT APP STRUCTURE//

//In the root we store information we need every time the app starts and either does not have to be reloaded
// when we change pages (like react routes between pages that is called from the react library)
// or information we choose not to reload for functional reasons like the filters or map panel.
//Storing stuff here adss eficiency and functionality
//Root: App

//WORKFLOWS///

//CLIENT SIDE//

//VIEWING CONTROLS WORKFLOW//
//ACCESSED VIA HOME PAGE//

//1) Used to find free resources and services near you when you don't know what to look up in a search engine//
// Useful if you are looking for a resource, and not an address, business name,
// or business tpye (i.e. lawyers near me, restaurants near me,community centres near me)
// Google already handles queries like that well, but it can't tell you where the nearest free water fountain is,
//however other use cases can be imagined.

//2)Even if you do search "lawyers near me",
// or "community centres near me" using google you still have to try to compare results
// and filter them to decide what is closet or what is cheapest or most reliable based on your preferences
//by reserving the data input to locations of your choosing (i.e displaying free resources,
// or displaying high quality resources or displaying reliable resources) and not allowing people
// to buy access to being displayed on this map as a form of advertisement for financial gain
// you can create something that is different than google where people do not have to filter and compare options
//because any option displayed on the map is to their preference

//3) alternatively you can allow people to buy access to be displayed on the map as a form of advertisment,
//so that you can use this app for profit.

// 4)You can also add controls to it for analyzing locations, scoring them, or highlighting patterns. Like areas that have a
//lot of resources could be highlighted green, and areas with low resources yellow, and areas with no resources
// or that are hostile due to social concerns like financial reasons, or accesibility reasons
// or due to physical concerns like harsh weather or lack of water can be highlighted red.
//Add controls for finding routes and highlight corridors between locations
//like fast bus routes, or walking paths or bicycle paths.

//5)You could also update the data model with new data labels to add specificity when filtering.
//  and reduce the number of decisions the user has to make.
////by updating the data model you can track what is important to you and add as many filters as you like.
//For example showing how things change over time.
//A community centre might have different resources that are always availble  at any time as long as they
// are open like washrooms or seating but others like food banks or meals are exceptions that are available at
// specific times. These exceptions can be added to the data model, as duplicate sets of data appended onto
//the original data model, like copies, with small changes to trakc things that occur at specific times.
//you could add controls for seasonal changes like a park that is good to sleep in in the summer diplaying green in the summer
// but displaying red when it is hostile in the winter.
//Or give a location a high resource score during the day and a low resource score when it is closed
// or has less services.
// Currently there is no data inputted to be used to track what resources are available at specific times-
// only when the location opens and closes and whether it has those resources in general

//In other words we are searching for
// (LOCATIONS that have *SPECIFIC RESOURCES* AND *ARE AVAILABLE* at *ANY TIME*) AND (LOCATIONS that *ARE OPEN* at *SPECIFIC TIME*)
// this is not the same as
// (LOCATIONS that have *SPECIFIC RESOURCES* that *ARE AVAILABLE* at *SPECIFIC TIME) AND (LOCATIONS that *ARE OPEN* at *SPECIFIC TIME*)

//In this case the user does not have to figure out what time they are open, or what resources they have,
//but they do have to figure out what times during the day,week,month,or even year those resources are available at that location.
//Implementing a new data model, eliminates the decision by resolving it with the check of a filter box.
//   You can help people find resources that are active in real time without them having to wait
// or spend a lot of time planning by comparing their schedule to the business open hours

//Input-> Filter Map Markers: Filter Panel
//Output-> Display Map Panel  with the filtered set of Map Markers: Map Panel

//EXPORT WORKFLOW//
//ACCESSED VIA EXPORT PAGE//
//If you want to send the map to someone digitally or print it//
//Useful for sending it to someone who has accessibility concerns//
//Like not being able to use computers or not being able to use this particular app due to a disability//
//or not having access to a computer//

//Input-> Panel to control options related to exporting files: Export Options
//Output-> Display a preview of the file, and Export it to a pdf : Export Preview Modal
//+ Viewing Controls
//Input and Output-> Filter Map Markers and Output to Map Panel: Filter Panel
//Output-> Display Map Panel  with the filtered set of Map Markers: Map Panel

//Viewing Controls Integrated into Export Operation adds an additional level of functionality,
// You use the map to set the filters without having to reload data, change pages
// or render a new pdf each time you want to make a change
// Once you have everything set to display the relevant resources or services
//then you can render a preview of the pdf document,
//export it to a folder on your computer,
//use external software to print it or send it to a friend or client

//OPTIONAL CLIENT SIDE OR SERVER SIDE//
//DATA MANAGEMENT WORKFLOW//
//ACCESSED VIA THE EDITOR PAGE//

//There is an option for this workflow
//Server Side for control over data and security reasons
// Client Side if you choose to crowd source data input,
// or if you just want open source software that anyone can contribute to.
//You can always crowd source data initially, and then tighten up control
///by requiring Admin Login to access the Editor Page.
//Currently programmed for an Open Source setup but could be modified to restrict access to the Editor page
//by requiring Admin Login to access the Editor Page.

//Input and Output-> Input New Data in Database and Output Data to Map Panel: Add Location Modal
//Input and Output-> Input Updated Data in Database and Output to Map Panel: Edit Location Panel
//Input and Output-> Delete Data from Database and Output to Map Panel: Edit Location Panel
//+ Viewing Controls
//Input-> Filter Map Markers: Filter Panel
//Output-> Display Map Panel  with the filtered set of Map Markers: Map Panel

//Viewing Controls Integrated into Editor Operations adds an additional level of functionality,
// You use the map and set the filters to verify changes in real time
// Verify changes visually. See changes to updated data such as positions changes,or name changes,
// verify a location has been removed form the map or added to the map
// use filters to verify that a value has been set to true or false like if a location is open at a specific time
//or has a specific resource.
