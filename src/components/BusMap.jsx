import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";

import { userIcon, auditedStopIcon } from "../utils/icons";
import styles from "./BusMap.module.css";

import FlyToStop from "./FlyToStop";
import FlyToUser from "./FlyToUser";
import RecenterMap from "./RecenterMap";
import MapClickHandler from "./MapClickHandler";
import { getStatus } from "../utils/status";

export default function BusMap({
  selectedStop,
  setSelectedStop,
  selectedAudit,
  setSelectedAudit,
  isAddingStop,
  setIsAddingStop,
  audits,
  recenterRequest,
  liveLocation,
}) {
  function AuditValue({ value }) {
    const { label, status } = getStatus(value);

    return (
      <span className={`${styles.auditValue} ${styles[status]}`}>
        {label}
      </span>
    );
  }

  return (
    <MapContainer
      center={[17.45, 78.38]}
      zoom={15}
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <MapClickHandler
        isAddingStop={isAddingStop}
        setSelectedStop={setSelectedStop}
        setIsAddingStop={setIsAddingStop}
      />

      <TileLayer
        url={`https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?key=${import.meta.env.VITE_CARTO_API_KEY}`}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
      />

      <FlyToUser userLocation={liveLocation} />

      <RecenterMap
        userLocation={liveLocation}
        recenterRequest={recenterRequest}
      />

      <FlyToStop selectedStop={selectedAudit} />

      {/* Live user location */}
      {liveLocation && (
        <>
          <Marker
            position={[liveLocation.lat, liveLocation.lon]}
            icon={userIcon}
          >
            <Popup>
              Your Location
              <br />
              Accuracy: {Math.round(liveLocation.accuracy)}m
            </Popup>
          </Marker>

          <Circle
            center={[liveLocation.lat, liveLocation.lon]}
            radius={100}
          />
        </>
      )}

      {/* Audited bus stops */}
      {audits.map((audit) => {
        if (!audit._geolocation) return null;

        const lat = Number(audit._geolocation[0]);
        const lon = Number(audit._geolocation[1]);

        if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
          return null;
        }

        return (
          <Marker
            key={audit._uuid}
            position={[lat, lon]}
            icon={auditedStopIcon}
            eventHandlers={{
              click: () => {
                setSelectedAudit(audit);
              },
            }}
          >
            <Popup>
              <div className={styles.auditPopup}>
                <h3>{audit.Bus_Stop_Name}</h3>

                <div className={styles.auditRow}>
                  <img
                    src="/roof.png"
                    alt=""
                    className={styles.auditIcon}
                  />

                  <span className={styles.auditLabel}>
                    Roof
                  </span>

                  <AuditValue value={audit.roof} />
                </div>

                <div className={styles.auditRow}>
                  <img
                    src="/street-light.png"
                    alt=""
                    className={styles.auditIcon}
                  />

                  <span className={styles.auditLabel}>
                    Lighting
                  </span>

                  <AuditValue value={audit.lighting} />
                </div>

                <div className={styles.auditRow}>
                  <img
                    src="/bench.png"
                    alt=""
                    className={styles.auditIcon}
                  />

                  <span className={styles.auditLabel}>
                    Seating
                  </span>

                  <AuditValue value={audit.Seating} />
                </div>

                <div className={styles.auditRow}>
                  <img
                    src="/route.png"
                    alt=""
                    className={styles.auditIcon}
                  />

                  <span className={styles.auditLabel}>
                    Route map
                  </span>

                  <AuditValue value={audit.route_map} />
                </div>

                <div className={styles.auditRow}>
                  <img
                    src="/project.png"
                    alt=""
                    className={styles.auditIcon}
                  />

                  <span className={styles.auditLabel}>
                    Schedule
                  </span>

                  <AuditValue value={audit.schedule} />
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Marker for a newly added stop */}
      {selectedStop?.stop_lat != null &&
        selectedStop?.stop_lon != null && (
          <Marker
            position={[
              Number(selectedStop.stop_lat),
              Number(selectedStop.stop_lon),
            ]}
          >
            <Popup>New Bus Stop</Popup>
          </Marker>
        )}
    </MapContainer>
  );
}