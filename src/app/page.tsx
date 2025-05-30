
"use client";

import { getMetroMedellinAlerts, Disruption } from "@/services/metro-medellin";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle, Bus, Train, CableCar, Search, Moon, Sun, HelpCircle, MapPinned } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from 'next-themes';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger, SidebarFooter, SidebarHeader, SidebarMenuItem, SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";


interface Station {
  id: string;
  name: string;
}

const metroAStations: Station[] = [
  { id: "NQI", name: "Niquía" }, { id: "BEL", name: "Bello" }, { id: "MDX", name: "Madera" }, { id: "ACE", name: "Acevedo" },
  { id: "TRI", name: "Tricentenario" }, { id: "CAR", name: "Caribe" }, { id: "UNI", name: "Universidad" }, { id: "HOS", name: "Hospital" },
  { id: "PRA", name: "Prado" }, { id: "PBE", name: "Parque Berrío" }, { id: "SAN", name: "San Antonio" }, { id: "ALP", name: "Alpujarra" },
  { id: "EXP", name: "Exposiciones" }, { id: "IND", name: "Industriales" }, { id: "POB", name: "Poblado" }, { id: "AGU", name: "Aguacatala" },
  { id: "AYU", name: "Ayurá" }, { id: "ENV", name: "Envigado" }, { id: "ITA", name: "Itagüí" }, { id: "SAB", name: "Sabaneta" }, { id: "LES", name: "La Estrella" },
];

const metroBStations: Station[] = [
  { id: "SAN_B", name: "San Antonio" }, { id: "CIS_B", name: "Cisneros" }, { id: "SUR_B", name: "Suramericana" }, { id: "EST_B", name: "Estadio" },
  { id: "FLO_B", name: "Floresta" }, { id: "SLU_B", name: "Santa Lucía" }, { id: "SJA_B", name: "San Javier" },
];

const tranviaStations: Station[] = [
  { id: "SAN_T", name: "San Antonio" }, { id: "SJO_T", name: "San José" }, { id: "PAG_T", name: "Pabellón del Agua EPM" }, { id: "BIC_T", name: "Bicentenario" },
  { id: "BUE_T", name: "Buenos Aires" }, { id: "MIR_T", name: "Miraflores" }, { id: "LOY_T", name: "Loyola" }, { id: "AEC_T", name: "Alejandro Echavarría" }, { id: "ORI_T", name: "Oriente" },
];

const metroCableKStations: Station[] = [
  { id: "ACE_K", name: "Acevedo" }, { id: "AND_K", name: "Andalucía" }, { id: "PCS_K", name: "Popular" }, { id: "SDO_K", name: "Santo Domingo Savio" },
];

const metroCableHStations: Station[] = [
  { id: "ORI_H", name: "Oriente" }, { id: "LST_H", name: "Las Torres" }, { id: "VSI_H", name: "Villa Sierra" },
];

const metroCableJStations: Station[] = [
  { id: "SJA_J", name: "San Javier" }, { id: "J23_J", name: "Juan XXIII" }, { id: "VAL_J", name: "Vallejuelos" }, { id: "LAU_J", name: "La Aurora" },
];

const metroCableLStations: Station[] = [ // Tourist line
  { id: "SDO_L", name: "Santo Domingo Savio" }, { id: "ARV_L", name: "Arví" },
];

const metroCableMStations: Station[] = [
  { id: "MIR_M", name: "Miraflores" }, { id: "ELP_M", name: "El Pinal" }, { id: "TRN_M", name: "Trece de Noviembre" },
];

const metroCablePStations: Station[] = [
  { id: "ACE_P", name: "Acevedo" }, { id: "SEN_P", name: "SENA" }, { id: "DOC_P", name: "Doce de Octubre" }, { id: "ELP_P", name: "El Progreso" },
];


interface StationSelectionConfig {
  selectedStations: Record<string, boolean>;
  handleStationCheckChange: (stationId: string, checked: boolean) => void;
}

interface LineDataEntry {
  name: string;
  color: string;
  stations: Station[];
  icon: React.ElementType;
  notificationGloballyEnabled: boolean;
  setNotificationGloballyEnabled: (val: boolean) => void;
  stationSelectionConfig?: StationSelectionConfig;
}


const StationSelectorCard: React.FC<{lineKey: string, lineDetails: LineDataEntry}> = ({ lineKey, lineDetails }) => {
  if (!lineDetails.stationSelectionConfig || lineDetails.stations.length === 0) {
    return (
      <Card className="shadow-xl rounded-xl border-2 border-primary/10">
        <CardHeader className="bg-primary/5 rounded-t-xl">
          <CardTitle className="text-2xl font-semibold text-primary flex items-center">
            <lineDetails.icon className="h-6 w-6 mr-2"/> Stations for {lineDetails.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Station selection is not applicable or available for this line.</p>
        </CardContent>
      </Card>
    );
  }

  const { selectedStations, handleStationCheckChange } = lineDetails.stationSelectionConfig;

  return (
    <Card className="shadow-xl rounded-xl border-2 border-primary/10">
      <CardHeader className="bg-primary/5 rounded-t-xl">
        <CardTitle className="text-2xl font-semibold text-primary flex items-center">
          <lineDetails.icon className="h-6 w-6 mr-2"/> Select Stations for {lineDetails.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ScrollArea className="h-96 border rounded-md p-2"> {/* Increased height */}
          <ul className="space-y-2">
            {lineDetails.stations.map(station => (
              <li key={station.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted text-sm">
                <Label htmlFor={`station-cb-${lineKey}-${station.id}`} className="flex-grow cursor-pointer">{station.name}</Label>
                <Checkbox
                  checked={!!selectedStations[station.id]}
                  onCheckedChange={(checked) => handleStationCheckChange(station.id, !!checked)}
                  id={`station-cb-${lineKey}-${station.id}`}
                />
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};


interface BusRoute {
  id: string;
  name: string;
}

const MockBusRouteData: BusRoute[] = [
  { id: "C3-001", name: "C3-001 Santa Gema ⇄ Aguacatala" },
  { id: "C3-001A", name: "C3-001A Las Cabras ⇄ Aguacatala" },
  { id: "C3-002", name: "C3-002 Aguacatala ⇄ Bolivariana" },
  { id: "C6-001", name: "C6-001 Circular Coonatra" },
  { id: "O", name: "O (Circular)" },
  { id: "130", name: "130 La América" },
  { id: "133", name: "133 Laureles" },
  { id: "250", name: "250 Belén" },
  { id: "300", name: "300 Robledo" },
  { id: "301", name: "301 Castilla" },
  { id: "304", name: "304 Manrique" },
  { id: "305", name: "305 Aranjuez" },
  { id: "C23", name: "C23 Circular Boston" },
];

const DynamicMap = dynamic(() => import('@/components/DynamicMap'), {
  ssr: false,
});

interface RouteListProps {
    pageNumber: number;
}

const RouteList: React.FC<RouteListProps> = ({ pageNumber }) => {
    const routesPerPage = 20;
    const start = (pageNumber - 1) * routesPerPage;
    const end = start + routesPerPage;
    const routes = MockBusRouteData.slice(start, end);
  
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRoutes, setSelectedRoutes] = useState<string[]>(MockBusRouteData.map(route => route.id));

    const filteredRoutes = routes.filter((route) =>
        route.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleRouteSelection = (routeId: string) => {
        setSelectedRoutes((prev) =>
            prev.includes(routeId) ? prev.filter((id) => id !== routeId) : [...prev, routeId]
        );
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center space-x-2 mt-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search feeder route..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                />
            </div>
            <ScrollArea className="overflow-y-auto mt-2 flex-grow">
                {filteredRoutes.map((route) => (
                    <div
                        key={route.id}
                        className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-secondary/10 transition-colors"
                    >
                        <div className="flex items-center space-x-2">
                            <Bus className="h-5 w-5" />
                            <div className="font-medium text-sm">{route.name}</div>
                        </div>
                        <Switch
                            id={`route-${route.id}`}
                            checked={selectedRoutes.includes(route.id)}
                            onCheckedChange={() => toggleRouteSelection(route.id)}
                        />
                    </div>
                ))}
            </ScrollArea>
        </div>
    );
};

const RealTimeAlerts = () => {
  const [alerts, setAlerts] = useState<Disruption[]>([]);
  const [currentTime, setCurrentTime] = useState<string | null>(null);


  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const metroAlerts = await getMetroMedellinAlerts();
        setAlerts(metroAlerts);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
        setAlerts([
          {
            type: "Error",
            estimatedDuration: 0,
            alternatives: ["Check the Metro de Medellin official channels."],
            affectedLines: ["All"],
          },
        ]);
      }
    };
    
    const updateTime = () => {
        setCurrentTime(new Date().toLocaleTimeString());
    }

    fetchAlerts();
    updateTime();
    const alertIntervalId = setInterval(fetchAlerts, 60000); 
    const timeIntervalId = setInterval(updateTime, 1000); 

    return () => {
        clearInterval(alertIntervalId);
        clearInterval(timeIntervalId);
    }
  }, []);

  return (
    <div className="space-y-4">
      {alerts.length > 0 ? (
        alerts.map((alert, index) => (
          <Alert key={index} variant={alert.type === "Error" ? "destructive" : "default"} className={`shadow-md rounded-lg ${alert.type === "Error" ? "bg-red-500/10 border-red-500/50 text-red-700 dark:text-red-300" : "bg-accent/10 border-accent/50 text-accent-foreground"}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {alert.type === "Error" ? <AlertTriangle className="h-5 w-5 mr-2 text-red-500" /> : <Info className="h-5 w-5 mr-2 text-orange-500" />}
                    <AlertTitle className={`font-bold ${alert.type === "Error" ? "text-red-700 dark:text-red-300" : "text-orange-600 dark:text-orange-400"}`}>{alert.type} on {alert.affectedLines.join(', ')}</AlertTitle>
                </div>
                {currentTime && <span className="text-xs text-muted-foreground">Last updated: {currentTime}</span>}
            </div>
            <AlertDescription className="mt-1 ml-7 text-sm">
              {alert.estimatedDuration > 0 && `Estimated duration: ${alert.estimatedDuration} minutes. `}
              Alternatives: {alert.alternatives.join(", ")}
            </AlertDescription>
          </Alert>
        ))
      ) : (
        <Alert className="shadow-md rounded-lg bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-300">
           <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Info className="h-5 w-5 mr-2 text-green-500" />
                    <AlertTitle className="font-bold text-green-700 dark:text-green-300">No alerts at this time.</AlertTitle>
                </div>
                {currentTime && <span className="text-xs text-muted-foreground">Last updated: {currentTime}</span>}
            </div>
          <AlertDescription className="mt-1 ml-7 text-sm">
            The Metro de Medellin is operating normally.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

const OfflineAlert = () => {
  return (
    <Alert variant="destructive" className="shadow-sm rounded-lg mb-4 bg-yellow-500/10 border-yellow-500/50 text-yellow-700 dark:text-yellow-300">
      <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
      <AlertTitle className="font-bold text-yellow-700 dark:text-yellow-300">Offline Mode</AlertTitle>
      <AlertDescription className="ml-7 text-sm">
        Currently displaying the last available information. This may be
        outdated. Please check your internet connection for real-time updates.
      </AlertDescription>
    </Alert>
  );
};

export default function Home() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const { theme, setTheme } = useTheme();
  const [showRoutes, setShowRoutes] = useState(false);
  const [routePage, setRoutePage] = useState(1);
  const [activeLineKeyForStations, setActiveLineKeyForStations] = useState<string | null>(null);

  // Notification preferences state
  const [metroAGlobal, setMetroAGlobal] = useState(true);
  const [metroBGlobal, setMetroBGlobal] = useState(true);
  const [tranviaGlobal, setTranviaGlobal] = useState(true);
  const [metroCableKGlobal, setMetroCableKGlobal] = useState(true);
  const [metroCableHGlobal, setMetroCableHGlobal] = useState(true);
  const [metroCableJGlobal, setMetroCableJGlobal] = useState(true);
  const [metroCableLGlobal, setMetroCableLGlobal] = useState(true);
  const [metroCableMGlobal, setMetroCableMGlobal] = useState(true);
  const [metroCablePGlobal, setMetroCablePGlobal] = useState(true);
  const [busesIntegradosGlobal, setBusesIntegradosGlobal] = useState(true);

  // Station selection states
  const [selectedStationsA, setSelectedStationsA] = useState<Record<string, boolean>>({});
  const [selectedStationsB, setSelectedStationsB] = useState<Record<string, boolean>>({});
  const [selectedStationsTranvia, setSelectedStationsTranvia] = useState<Record<string, boolean>>({});
  const [selectedStationsCableK, setSelectedStationsCableK] = useState<Record<string, boolean>>({});
  const [selectedStationsCableH, setSelectedStationsCableH] = useState<Record<string, boolean>>({});
  const [selectedStationsCableJ, setSelectedStationsCableJ] = useState<Record<string, boolean>>({});
  const [selectedStationsCableL, setSelectedStationsCableL] = useState<Record<string, boolean>>({});
  const [selectedStationsCableM, setSelectedStationsCableM] = useState<Record<string, boolean>>({});
  const [selectedStationsCableP, setSelectedStationsCableP] = useState<Record<string, boolean>>({});


  const lineData: Record<string, LineDataEntry> = {
    'Metro A': { 
      name: 'Metro A', color: '#A4D16A', stations: metroAStations, icon: Train,
      notificationGloballyEnabled: metroAGlobal, setNotificationGloballyEnabled: setMetroAGlobal,
      stationSelectionConfig: { selectedStations: selectedStationsA, handleStationCheckChange: (id, val) => setSelectedStationsA(prev => ({...prev, [id]: val})) }
    },
    'Metro B': { 
      name: 'Metro B', color: '#E57373', stations: metroBStations, icon: Train,
      notificationGloballyEnabled: metroBGlobal, setNotificationGloballyEnabled: setMetroBGlobal,
      stationSelectionConfig: { selectedStations: selectedStationsB, handleStationCheckChange: (id, val) => setSelectedStationsB(prev => ({...prev, [id]: val})) }
    },
    'Tranvía T-A': { 
      name: 'Tranvía (Línea T-A)', color: '#F06292', stations: tranviaStations, icon: Train, // Using Train icon as placeholder for Tram
      notificationGloballyEnabled: tranviaGlobal, setNotificationGloballyEnabled: setTranviaGlobal,
      stationSelectionConfig: { selectedStations: selectedStationsTranvia, handleStationCheckChange: (id, val) => setSelectedStationsTranvia(prev => ({...prev, [id]: val})) }
    },
    'Metro Cable K': { 
      name: 'Metro Cable (Línea K)', color: '#64B5F6', stations: metroCableKStations, icon: CableCar,
      notificationGloballyEnabled: metroCableKGlobal, setNotificationGloballyEnabled: setMetroCableKGlobal,
      stationSelectionConfig: { selectedStations: selectedStationsCableK, handleStationCheckChange: (id, val) => setSelectedStationsCableK(prev => ({...prev, [id]: val})) }
    },
    'Metro Cable H': { 
      name: 'Metro Cable (Línea H)', color: '#BA68C8', stations: metroCableHStations, icon: CableCar,
      notificationGloballyEnabled: metroCableHGlobal, setNotificationGloballyEnabled: setMetroCableHGlobal,
      stationSelectionConfig: { selectedStations: selectedStationsCableH, handleStationCheckChange: (id, val) => setSelectedStationsCableH(prev => ({...prev, [id]: val})) }
    },
    'Metro Cable J': { 
      name: 'Metro Cable (Línea J)', color: '#4DB6AC', stations: metroCableJStations, icon: CableCar,
      notificationGloballyEnabled: metroCableJGlobal, setNotificationGloballyEnabled: setMetroCableJGlobal,
      stationSelectionConfig: { selectedStations: selectedStationsCableJ, handleStationCheckChange: (id, val) => setSelectedStationsCableJ(prev => ({...prev, [id]: val})) }
    },
    'Metro Cable L': { 
      name: 'Metro Cable (Línea L - Arví)', color: '#A1887F', stations: metroCableLStations, icon: CableCar,
      notificationGloballyEnabled: metroCableLGlobal, setNotificationGloballyEnabled: setMetroCableLGlobal,
      stationSelectionConfig: { selectedStations: selectedStationsCableL, handleStationCheckChange: (id, val) => setSelectedStationsCableL(prev => ({...prev, [id]: val})) }
    },
    'Metro Cable M': { 
      name: 'Metro Cable (Línea M)', color: '#7986CB', stations: metroCableMStations, icon: CableCar,
      notificationGloballyEnabled: metroCableMGlobal, setNotificationGloballyEnabled: setMetroCableMGlobal,
      stationSelectionConfig: { selectedStations: selectedStationsCableM, handleStationCheckChange: (id, val) => setSelectedStationsCableM(prev => ({...prev, [id]: val})) }
    },
    'Metro Cable P': { 
      name: 'Metro Cable (Línea P)', color: '#4DD0E1', stations: metroCablePStations, icon: CableCar,
      notificationGloballyEnabled: metroCablePGlobal, setNotificationGloballyEnabled: setMetroCablePGlobal,
      stationSelectionConfig: { selectedStations: selectedStationsCableP, handleStationCheckChange: (id, val) => setSelectedStationsCableP(prev => ({...prev, [id]: val})) }
    },
    'Buses Integrados': { 
      name: 'Buses Integrados', color: '#FFB74D', stations: [], icon: Bus,
      notificationGloballyEnabled: busesIntegradosGlobal, setNotificationGloballyEnabled: setBusesIntegradosGlobal,
      // No stationSelectionConfig for buses
    },
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);
  

  const handleGoBackToMap = () => {
    setActiveLineKeyForStations(null);
    setShowRoutes(false);
  };

  const handleShowBusRoutes = () => {
    setShowRoutes(true);
    setActiveLineKeyForStations(null);
  }

  const handleLineSelectForStations = (lineKey: string) => {
    setActiveLineKeyForStations(lineKey);
    setShowRoutes(false);
  }

  const totalRoutePages = Math.ceil(MockBusRouteData.length / 20);

  return (
    <TooltipProvider>
    <SidebarProvider>
      <div className="flex h-screen bg-background font-sans antialiased">
        <Sidebar className="border-r">
            <SidebarHeader>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleGoBackToMap} className="mb-2">
                            <MapPinned className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right"><p>View Full Map / Home</p></TooltipContent>
                </Tooltip>
            </SidebarHeader>
            <SidebarContent className="flex-grow">
                <SidebarMenu>
                    {Object.entries(lineData).map(([key, { name, icon: IconComponent, notificationGloballyEnabled, setNotificationGloballyEnabled, color }]) => (
                       <SidebarMenuItem key={key}>
                           <div className="flex items-center justify-between w-full group/menu-item">
                               <SidebarMenuButton 
                                   onClick={() => lineData[key].stations.length > 0 ? handleLineSelectForStations(key) : (key === 'Buses Integrados' ? handleShowBusRoutes() : null)}
                                   tooltip={name}
                                   className="flex-grow"
                                   isActive={activeLineKeyForStations === key || (key === 'Buses Integrados' && showRoutes)}
                                >
                                   <span className="inline-block h-3 w-3 rounded-full mr-1 shrink-0" style={{ backgroundColor: color }}></span>
                                   <IconComponent className="h-5 w-5 shrink-0" />
                                   <span className="truncate group-data-[collapsible=icon]:hidden">{name}</span>
                               </SidebarMenuButton>
                               <Switch 
                                   checked={notificationGloballyEnabled} 
                                   onCheckedChange={setNotificationGloballyEnabled}
                                   className="ml-2 mr-2 shrink-0 group-data-[collapsible=icon]:hidden"
                                   aria-label={`Toggle notifications for ${name}`}
                                />
                           </div>
                       </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                         <SidebarMenuButton tooltip="Help">
                             <HelpCircle className="h-5 w-5" />
                             <span className="group-data-[collapsible=icon]:hidden">Help</span>
                         </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                            tooltip="Toggle Theme"
                        >
                            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                            <span className="group-data-[collapsible=icon]:hidden">Toggle Theme</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>


        <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-primary">AppMiMetro</h1>
            <SidebarTrigger className="md:hidden" />
          </div>

          {!isOnline && <OfflineAlert />}
          
          <Card className="shadow-xl rounded-xl border-2 border-primary/20">
            <CardHeader className="bg-primary/5 rounded-t-xl">
              <CardTitle className="text-2xl font-semibold text-primary flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2 text-accent" />
                Real-Time Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <RealTimeAlerts />
            </CardContent>
          </Card>

          {showRoutes ? (
            <Card className="shadow-xl rounded-xl border-2 border-secondary/20 flex flex-col" style={{minHeight: 'calc(100vh - 22rem)'}}>
              <CardHeader className="bg-secondary/5 rounded-t-xl">
                <CardTitle className="text-2xl font-semibold text-secondary flex items-center">
                 <Bus className="h-6 w-6 mr-2"/> Feeder Route Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4 flex-grow p-6">
                <div className="h-64 md:h-72 lg:h-80 relative rounded-lg overflow-hidden shadow-md border border-gray-300">
                  <DynamicMap />
                </div>
                <div className="flex-grow mt-4 min-h-[250px]">
                  <RouteList pageNumber={routePage} />
                </div>
                {totalRoutePages > 1 && (
                    <div className="flex justify-center space-x-2 pt-4 border-t mt-auto">
                    {[...Array(totalRoutePages)].map((_, index) => (
                        <Button
                            key={index}
                            variant={routePage === index + 1 ? "default" : "outline"}
                            size="sm"
                            className="rounded-full"
                            onClick={() => setRoutePage(index + 1)}
                        >
                            {index + 1}
                        </Button>
                    ))}
                    </div>
                )}
              </CardContent>
            </Card>
          ) : activeLineKeyForStations && lineData[activeLineKeyForStations] ? (
            <StationSelectorCard lineKey={activeLineKeyForStations} lineDetails={lineData[activeLineKeyForStations]} />
          ) : (
            <Card className="shadow-xl rounded-xl border-2 border-primary/10" style={{minHeight: 'calc(100vh - 22rem)'}}>
              <CardHeader className="bg-primary/5 rounded-t-xl">
                <CardTitle className="text-2xl font-semibold text-primary flex items-center">
                 <MapPinned className="h-6 w-6 mr-2"/> Metro System Map
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex-grow flex">
                <div className="w-full h-[calc(100vh-28rem)] min-h-[400px] relative rounded-lg overflow-hidden shadow-md border border-gray-300">
                    <DynamicMap />
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </SidebarProvider>
    </TooltipProvider>
  );
}
