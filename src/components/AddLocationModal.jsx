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
    "Warming Centre": false,
    "Cooling Centre": false,
    "Clean Air Space": false,
    "Drinking Water": false,
    "Meals": false,
    "Shelter Space": false,
    "Washrooms": false,
    "Hygiene Products": false,
    "Tampons or Pads": false,
    "Showers": false,
    "Community Centre": false,
    "Food Bank": false,
    "Clothing": false,
    "Storage": false,
  });
  //Service States:
  const [services, setServices] = useState({
    "Health Services": false,
    "Mental Health Services": false,
    "Addiction Services": false,
    "Harm Reduction Services": false,
    "Housing Services": false,
    "Legal Aid Services": false,
    "Employment Services": false,
    "Financial Assistance Services": false,
    "Identification Services": false,
    "Interpretation Services": false,
    "Community Outreach": false,
    "Accessibility Services": false,
    "Transportation Services": false,
  });
  //Comfort States
  const [comforts, setComforts] = useState({
    "Wi-Fi": false,
    "Charging Stations": false,
    "Indoor Seating": false,
    "Outdoor Seating": false,
    "Pet Friendly": false,
    "Quiet Space": false,
    "Public Computer Access": false,
    "Library Access": false,
    "Art or Music Programs": false,
    "Exercise Space": false,
    "Social Space": false,
    "Private Space": false,
    "Low-Intervention Environment": false,
    "Nap or Sleep": false,
    "No Purchases Required": false,
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
      if (!name || !latitude || !longitude) {
        window.alert("Missing Required Entries");
        return;
      }
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
                placeholder="Required..."
                required
              />
            </label>
            <label>
              Latitude:
              <input
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Required..."
                required
              />
            </label>
            <label>
              Longitude:
              <input
                type="number"
                value={longtitude}
                onChange={(e) => setLongtitude(e.target.value)}
                placeholder="Required..."
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
                ["Health Services", "General medical care"],
                ["Mental Health Services", "Counseling or crisis support"],
                ["Addiction Services", "Substance use support"],
                ["Harm Reduction Services", "Supplies or education"],
                [
                  "Housing Services",
                  "Transitional or emergency housing support",
                ],
                ["Legal Aid Services", "Access to legal help"],
                ["Employment Services", "Job training or search assistance"],
                [
                  "Financial Assistance Services",
                  "Direct aid or financial advice",
                ],
                ["Identification Services", "Help obtaining IDs or documents"],
                ["Interpretation Services", "Language support"],
                ["Community Outreach", "Street outreach and mobile help"],
                [
                  "Accessibility Services",
                  "Help navigating barriers or providing accessible equipment",
                ],
                ["Transportation Services", "Bus tokens, rides, or shuttles"],
              ].map(([label, note]) => (
                <div key={label} className="inline-checkbox-row">
                  <label className="label-container">{label}</label>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={services[label]}
                      onChange={(e) =>
                        setServices({ ...services, [label]: e.target.checked })
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
                ["Wi-Fi", "Public wireless internet access"],
                ["Charging Stations", "Places to charge phones or devices"],
                ["Indoor Seating", "Safe indoor places to sit and rest"],
                ["Outdoor Seating", "Benches or sheltered outdoor areas"],
                [
                  "Pet Friendly",
                  "Allows animals or has accommodations for pets",
                ],
                ["Quiet Space", "Noise-free or calm areas for rest or focus"],
                [
                  "Public Computer Access",
                  "Workstations with internet or tools",
                ],
                [
                  "Library Access",
                  "Books, reading space, or educational resources",
                ],
                ["Art or Music Programs", "Creative drop-ins or workshops"],
                [
                  "Exercise Space",
                  "Room to walk, stretch, or do light fitness",
                ],
                ["Social Space", "Supports informal interaction or community"],
                ["Private Space", "Places to be alone or not watched closely"],
                [
                  "Low-Intervention Environment",
                  "You’re unlikely to be asked to leave",
                ], [
                  "Nap or Sleep",
                  "Comfortable seating or space to lay down",
                ], [
                  "No Purchases Required",
                  "You can access this space without buying something",
                ],

              ].map(([label, note]) => (
                <div key={label} className="inline-checkbox-row">
                  <label className="label-container">{label}</label>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={comforts[label]}
                      onChange={(e) =>
                        setComforts({ ...comforts, [label]: e.target.checked })
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
