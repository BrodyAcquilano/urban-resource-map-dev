// src/components/AddLocationModal.jsx

import React, { useState } from "react";
import "./AddLocationModal.css";
import axios from "axios";

const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? "00" : "30";
  const suffix = hour < 12 ? "a.m." : "p.m.";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:${minutes} ${suffix}`;
});

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function AddLocationModal({ isOpen, onClose, setMarkers }) {
  //Modal States
  const [page, setPage] = useState(1);
  //Basic Information States
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longtitude, setLongtitude] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [wheelchairAccessible, setWheelchairAccessible] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = false;
      return acc;
    }, {})
  );
  const [openHours, setOpenHours] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = { open: "", close: "" };
      return acc;
    }, {})
  );
  //Resource States
  const [resources, setResources] = useState({
    Warming: false,
    Cooling: false,
    "Clean Air": false,
    "Drinking Water": false,
    Meals: false,
    "Homeless Shelter": false,
    Washrooms: false,
    "Hygiene Products": false,
    "Female Hygiene Products": false,
    Showers: false,
    "Community Centre": false,
    "Food Bank": false,
    Clothing: false,
  });
  //Service States:
  const [services, setServices] = useState({
    healthCareServices: false,
    mentalHealthServices: false,
    addictionServices: false,
    harmReductionServices: false,
    housingServices: false,
    legalAidServices: false,
    employmentServices: false,
    financialAssistanceServices: false,
    identificationServices: false,
    interpretationServices: false,
    communityOutreach: false,
    accessibilityServices: false,
    transportationServices: false,
  });
  //Comfort States
  const [comforts, setComforts] = useState({
    wifi: false,
    chargingStations: false,
    indoorSeating: false,
    outdoorSeating: false,
    petFriendly: false,
    quietSpace: false,
    publicComputerAccess: false,
    libraryAccess: false,
    artOrMusicPrograms: false,
    exerciseSpace: false,
    socialSpace: false,
    privateSpace: false,
    lowIntervention: false,
  });

  const handleSubmit = async () => {
    const locationData = {
      name,
      latitude: parseFloat(latitude),
      longtitude: parseFloat(longtitude),
      address: address || "",
      website: website || "",
      phone: phone || "",
      wheelchairAccessible,
      isLocationOpen,
      openHours,
      resources,
      services,
      comforts,
    };

    try {
      const res = await axios.post("/api/locations", locationData);
      const newMarker = { _id: res.data.id, ...locationData };
      setMarkers((prev) => [...prev, newMarker]);
      onClose();
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="add-location-modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>Add New Location</h2>

        {page === 1 && (
          <>
            <h3>Basic Information</h3>
            <label>
              Location Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Latitude:
              <input
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                required
              />
            </label>
            <label>
              Longitude:
              <input
                type="number"
                value={longtitude}
                onChange={(e) => setLongtitude(e.target.value)}
                required
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                value={address}
                placeholder="Optional..."
                onChange={(e) => setAddress(e.target.value)}
              />
            </label>
            <label>
              Website:
              <input
                type="text"
                value={website}
                placeholder="Optional..."
                onChange={(e) => setWebsite(e.target.value)}
              />
            </label>
            <label>
              Phone:
              <input
                type="text"
                value={phone}
                placeholder="Optional..."
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
            <div className="inline-checkbox-row">
              <label className="label-container">
                ♿ Wheelchair Accessible
              </label>
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  checked={wheelchairAccessible}
                  onChange={(e) => setWheelchairAccessible(e.target.checked)}
                />
              </div>
            </div>
            <h3>Open Hours</h3>
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Open?</th>
                  <th>Open</th>
                  <th>Close</th>
                </tr>
              </thead>
              <tbody>
                {daysOfWeek.map((day) => (
                  <tr key={day}>
                    <td>{day}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={isLocationOpen[day]}
                        onChange={(e) =>
                          setIsLocationOpen({
                            ...isLocationOpen,
                            [day]: e.target.checked,
                          })
                        }
                      />
                    </td>

                    {isLocationOpen[day] ? (
                      <>
                        <td>
                          <select
                            value={openHours[day].open}
                            onChange={(e) =>
                              setOpenHours({
                                ...openHours,
                                [day]: {
                                  ...openHours[day],
                                  open: e.target.value,
                                },
                              })
                            }
                          >
                            {timeOptions.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select
                            value={openHours[day].close}
                            onChange={(e) =>
                              setOpenHours({
                                ...openHours,
                                [day]: {
                                  ...openHours[day],
                                  close: e.target.value,
                                },
                              })
                            }
                          >
                            {timeOptions.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </td>
                      </>
                    ) : (
                      <>
                        <td colSpan={2}>
                          <div className="closed-cell">Closed</div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {page === 2 && (
          <>
            <h3>Resources</h3>
            <div className="resources-list">
              {Object.keys(resources).map((res) => (
                <div key={res} className="inline-checkbox-row">
                  <label className="label-container">{res}</label>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={resources[res]}
                      onChange={(e) =>
                        setResources({ ...resources, [res]: e.target.checked })
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {page === 3 && (
          <>
            <h3>Services</h3>
            <div className="services-section">
              {[
                {
                  key: "healthCareServices",
                  label: "Health Services",
                  note: "General medical care",
                },
                {
                  key: "mentalHealthServices",
                  label: "Mental Health Services",
                  note: "Counseling or crisis support",
                },
                {
                  key: "addictionServices",
                  label: "Addiction Services",
                  note: "Substance use support",
                },
                {
                  key: "harmReductionServices",
                  label: "Harm Reduction Services",
                  note: "Supplies or education",
                },
                {
                  key: "housingServices",
                  label: "Housing Services",
                  note: "Transitional or emergency housing support",
                },
                {
                  key: "legalAidServices",
                  label: "Legal Aid Services",
                  note: "Access to legal help",
                },
                {
                  key: "employmentServices",
                  label: "Employment Services",
                  note: "Job training or search assistance",
                },
                {
                  key: "financialAssistanceServices",
                  label: "Financial Assistance Services",
                  note: "Direct aid or financial advice",
                },
                {
                  key: "identificationServices",
                  label: "Identification Services",
                  note: "Help obtaining IDs or documents",
                },
                {
                  key: "interpretationServices",
                  label: "Interpretation Services",
                  note: "Language support",
                },
                {
                  key: "communityOutreach",
                  label: "Community Outreach",
                  note: "Street outreach and mobile help",
                },
                {
                  key: "accessibilityServices",
                  label: "Accessibility Services",
                  note: "Help navigating barriers or providing accessible equipment",
                },
                {
                  key: "transportationServices",
                  label: "Transportation Services",
                  note: "Bus tokens, rides, or shuttles",
                },
              ].map(({ key, label, note }) => (
                <div key={key} className="inline-checkbox-row">
                  <label className="label-container">{label}</label>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={services[key]}
                      onChange={(e) =>
                        setServices({ ...services, [key]: e.target.checked })
                      }
                    />
                  </div>
                  <div className="notes-cell">{note}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {page === 4 && (
          <>
            <h3>Comforts</h3>
            <div className="comforts-section">
              {[
                {
                  key: "wifi",
                  label: "Free Wi-Fi",
                  note: "Public wireless internet access",
                },
                {
                  key: "chargingStations",
                  label: "Charging Stations",
                  note: "Places to charge phones or devices",
                },
                {
                  key: "indoorSeating",
                  label: "Indoor Seating",
                  note: "Safe indoor places to sit and rest",
                },
                {
                  key: "outdoorSeating",
                  label: "Outdoor Seating",
                  note: "Benches or sheltered outdoor areas",
                },
                {
                  key: "petFriendly",
                  label: "Pet-Friendly",
                  note: "Allows animals or has accommodations for pets",
                },
                {
                  key: "quietSpace",
                  label: "Quiet Space",
                  note: "Noise-free or calm areas for rest or focus",
                },
                {
                  key: "publicComputerAccess",
                  label: "Public Computer Access",
                  note: "Workstations with internet or tools",
                },
                {
                  key: "libraryAccess",
                  label: "Library Access",
                  note: "Books, reading space, or educational resources",
                },
                {
                  key: "artOrMusicPrograms",
                  label: "Art or Music Programs",
                  note: "Creative drop-ins or workshops",
                },
                {
                  key: "exerciseSpace",
                  label: "Exercise-Friendly",
                  note: "Room to walk, stretch, or do light fitness",
                },
                {
                  key: "socialSpace",
                  label: "Social Gathering Space",
                  note: "Supports informal interaction or community",
                },
                {
                  key: "privateSpace",
                  label: "Offers Some Privacy",
                  note: "Places to be alone or not watched closely",
                },
                {
                  key: "lowIntervention",
                  label: "Low Staff Interruption",
                  note: "You’re unlikely to be asked to leave",
                },
              ].map(({ key, label, note }) => (
                <div key={key} className="inline-checkbox-row">
                  <label className="label-container">{label}</label>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={comforts[key]}
                      onChange={(e) =>
                        setComforts({ ...comforts, [key]: e.target.checked })
                      }
                    />
                  </div>
                  <div className="notes-cell">{note}</div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="navigation-buttons">
          {page > 1 && <button onClick={() => setPage(page - 1)}>Back</button>}
          {page < 4 ? (
            <button onClick={() => setPage(page + 1)}>Next</button>
          ) : (
            <button onClick={handleSubmit}>Submit</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddLocationModal;
