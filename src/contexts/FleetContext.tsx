import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { Vehicle, Alert, AIRecommendation, FleetKPIs } from '../types';
import { MOCK_VEHICLES, MOCK_ALERTS, MOCK_AI_RECOMMENDATIONS } from '../data/mockData';
import { checkBackendHealth, fetchFleetSummary } from '../services/api';

interface FleetContextType {
  vehicles: Vehicle[];
  filteredVehicles: Vehicle[];
  alerts: Alert[];
  recommendations: AIRecommendation[];
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (v: Vehicle | null) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterFleet: string;
  setFilterFleet: (fleet: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;
  resolveAlert: (id: string) => void;
  fleetKPIs: FleetKPIs;
  exportCSV: () => void;
  isBackendOnline: boolean;
  syncApiData: () => Promise<void>;
}

const FleetContext = createContext<FleetContextType | undefined>(undefined);

export const FleetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [recommendations] = useState<AIRecommendation[]>(MOCK_AI_RECOMMENDATIONS);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterFleet, setFilterFleet] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  const syncApiData = async () => {
    const isOnline = await checkBackendHealth();
    setIsBackendOnline(isOnline);
    if (isOnline) {
      const summary = await fetchFleetSummary();
      if (summary) {
        console.log('Backend fleet summary loaded:', summary);
      }
    }
  };

  useEffect(() => {
    syncApiData();
  }, []);

  const resolveAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchStatus = filterStatus === 'All' || v.status === filterStatus;
      const matchFleet = filterFleet === 'All' || v.fleet === filterFleet;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        v.vin.toLowerCase().includes(q) ||
        v.id.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.driver.toLowerCase().includes(q) ||
        v.locationName.toLowerCase().includes(q);

      return matchStatus && matchFleet && matchQuery;
    });
  }, [vehicles, filterStatus, filterFleet, searchQuery]);

  const fleetKPIs: FleetKPIs = useMemo(() => {
    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter((v) => v.status === 'Active').length;
    const chargingVehicles = vehicles.filter((v) => v.status === 'Charging').length;
    const maintenanceVehicles = vehicles.filter((v) => v.status === 'Maintenance').length;
    const criticalVehicles = vehicles.filter((v) => v.status === 'Critical Alert').length;

    const sumSOH = vehicles.reduce((acc, v) => acc + v.soh, 0);
    const sumSOC = vehicles.reduce((acc, v) => acc + v.soc, 0);
    const co2OffsetTons = vehicles.reduce((acc, v) => acc + v.co2OffsetTons, 0);

    return {
      totalVehicles,
      activeVehicles,
      chargingVehicles,
      maintenanceVehicles,
      criticalVehicles,
      avgSOH: Number((sumSOH / totalVehicles).toFixed(1)),
      avgSOC: Number((sumSOC / totalVehicles).toFixed(1)),
      totalEnergyMwh: Number((totalVehicles * 94.5).toFixed(0)),
      co2OffsetTons: Number(co2OffsetTons.toFixed(0)),
      activeAlerts: alerts.length,
    };
  }, [vehicles, alerts]);

  const exportCSV = () => {
    const headers = ['Vehicle ID', 'VIN', 'Model', 'Fleet Subgroup', 'Driver', 'Status', 'SOC (%)', 'SOH (%)', 'Pack Temp (°C)', 'Cycle Count', 'Mileage (km)', 'Location'];
    const rows = filteredVehicles.map((v) => [
      v.id,
      v.vin,
      `"${v.model}"`,
      `"${v.fleet}"`,
      `"${v.driver}"`,
      v.status,
      v.soc,
      v.soh,
      v.packTemp,
      v.cycleCount,
      v.mileage,
      `"${v.locationName}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VoltIQ_Fleet_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <FleetContext.Provider
      value={{
        vehicles,
        filteredVehicles,
        alerts,
        recommendations,
        selectedVehicle,
        setSelectedVehicle,
        filterStatus,
        setFilterStatus,
        filterFleet,
        setFilterFleet,
        searchQuery,
        setSearchQuery,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isShortcutsOpen,
        setIsShortcutsOpen,
        resolveAlert,
        fleetKPIs,
        exportCSV,
        isBackendOnline,
        syncApiData,
      }}
    >
      {children}
    </FleetContext.Provider>
  );
};

export const useFleet = () => {
  const context = useContext(FleetContext);
  if (!context) {
    throw new Error('useFleet must be used within a FleetProvider');
  }
  return context;
};
