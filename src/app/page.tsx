
"use client";

import { getMetroMedellinAlerts, Disruption } from "@/services/metro-medellin";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle, Bus, Train, CableCar, Search, Moon, Sun, HelpCircle, ArrowLeft } from "lucide-react";
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger, SidebarFooter, SidebarHeader, SidebarMenuItem, SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar"; // Added Sidebar imports

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


const LineNotificationPreferences = () => {
  const [metroA, setMetroA] = useState(true);
  const [metroB, setMetroB] = useState(true);
  const [tranvia, setTranvia] = useState(true);
  const [metroCable, setMetroCable] = useState(true); // Generic Metro Cable toggle
  const [busesIntegrados, setBusesIntegrados] = useState(true);
  const [selectedLineForStations, setSelectedLineForStations] = useState<string | null>(null);

  const lineData: Record<string, { name: string; color: string; stations: Station[]; state: boolean; setStateFunction: (val: boolean) => void; icon: React.ElementType }> = {
    'Metro A': { name: 'Metro A', color: '#A4D16A', stations: metroAStations, state: metroA, setStateFunction: setMetroA, icon: Train },
    'Metro B': { name: 'Metro B', color: '#E57373', stations: metroBStations, state: metroB, setStateFunction: setMetroB, icon: Train },
    'Tranvía': { name: 'Tranvía', color: '#F06292', stations: tranviaStations, state: tranvia, setStateFunction: setTranvia, icon: Train }, // Using Train icon as a placeholder
    'Metro Cable (Línea K)': { name: 'Metro Cable (Línea K)', color: '#64B5F6', stations: metroCableKStations, state: metroCable, setStateFunction: setMetroCable, icon: CableCar },
    'Buses Integrados': { name: 'Buses Integrados', color: '#FFB74D', stations: [], state: busesIntegrados, setStateFunction: setBusesIntegrados, icon: Bus },
  };

  const handleLineSelect = (lineKey: string) => {
    setSelectedLineForStations(lineKey === selectedLineForStations ? null : lineKey); // Toggle display
  };

  return (
    <div className="space-y-4">
      <Accordion type="multiple" className="w-full" defaultValue={['main-metro', 'other-lines']}>
        <AccordionItem value="main-metro">
          <AccordionTrigger>
            <div className="flex items-center space-x-2">
              <Train className="h-5 w-5" />
              <span>Main Metro Lines</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {Object.entries(lineData)
              .filter(([key]) => key === 'Metro A' || key === 'Metro B')
              .map(([key, { name, color, state, setStateFunction, icon: IconComponent }]) => (
                <div key={key} className="flex items-center justify-between py-3 px-1 border-b last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <span className="inline-block h-5 w-5 rounded-full" style={{ backgroundColor: color }}></span>
                    <Button variant="link" className="p-0 h-auto text-base" onClick={() => handleLineSelect(key)}>
                      {name}
                    </Button>
                  </div>
                  <Switch checked={state} onCheckedChange={setStateFunction} />
                </div>
              ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="other-lines">
          <AccordionTrigger>
            <div className="flex items-center space-x-2">
              <CableCar className="h-5 w-5" /> {/* Or a generic icon */}
              <span>Other Lines & Services</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {Object.entries(lineData)
              .filter(([key]) => key !== 'Metro A' && key !== 'Metro B')
              .map(([key, { name, color, state, setStateFunction, icon: IconComponent }]) => (
                <div key={key} className="flex items-center justify-between py-3 px-1 border-b last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <span className="inline-block h-5 w-5 rounded-full" style={{ backgroundColor: color }}></span>
                    <Button variant="link" className="p-0 h-auto text-base" onClick={() => handleLineSelect(key)}>
                      {name}
                    </Button>
                  </div>
                  <Switch checked={state} onCheckedChange={setStateFunction} />
                </div>
              ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {selectedLineForStations && lineData[selectedLineForStations] && (
        <Card className="mt-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Stations for {selectedLineForStations}</CardTitle>
          </CardHeader>
          <CardContent>
            {lineData[selectedLineForStations].stations.length > 0 ? (
              <ScrollArea className="h-48 border rounded-md p-2">
                <ul className="space-y-2">
                  {lineData[selectedLineForStations].stations.map(station => (
                    <li key={station.id} className="p-2 rounded-md hover:bg-muted text-sm">
                      {station.name}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            ) : (
              <p className="text-muted-foreground">Station information is not applicable or available for this selection.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
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
  // Keeping a small sample for brevity
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
            <ScrollArea className="overflow-y-auto mt-2 flex-grow"> {/* Changed h-full to flex-grow */}
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

    fetchAlerts();

    const intervalId = setInterval(fetchAlerts, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-4">
      {alerts.length > 0 ? (
        alerts.map((alert, index) => (
          <Alert key={index} variant={alert.type === "Error" ? "destructive" : "default"} className="shadow-sm">
            <Info className="h-4 w-4" />
            <AlertTitle className="font-semibold">{alert.type} on {alert.affectedLines.join(', ')}</AlertTitle>
            <AlertDescription>
              Estimated duration: {alert.estimatedDuration} minutes.{" "}
              Alternatives: {alert.alternatives.join(", ")}
            </AlertDescription>
          </Alert>
        ))
      ) : (
        <Alert className="shadow-sm">
          <Info className="h-4 w-4" />
          <AlertTitle className="font-semibold">No alerts at this time.</AlertTitle>
          <AlertDescription>
            The Metro de Medellin is operating normally.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

const OfflineAlert = () => {
  return (
    <Alert variant="destructive" className="shadow-sm">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="font-semibold">Offline Mode</AlertTitle>
      <AlertDescription>
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
  

  const toggleRoutesView = () => {
    setShowRoutes(prev => !prev);
  };

  const totalRoutePages = Math.ceil(MockBusRouteData.length / 20);

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background font-sans antialiased">
        {/* Sidebar */}
        <Sidebar className="bg-card border-r">
            <SidebarHeader>
                 <Button variant="ghost" size="icon" onClick={() => setShowRoutes(false)} className="mb-2">
                    <ArrowLeft className="h-5 w-5" />
                    <span className="sr-only">Go Back</span>
                </Button>
            </SidebarHeader>
            <SidebarContent className="flex-grow">
                <SidebarMenu>
                    <SidebarMenuItem>
                         <SidebarMenuButton onClick={toggleRoutesView} tooltip="Bus Routes">
                            <Bus className="h-5 w-5" />
                            <span>Bus Routes</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                         <SidebarMenuButton tooltip="Help">
                             <HelpCircle className="h-5 w-5" />
                             <span>Help</span>
                         </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                            tooltip="Toggle Theme"
                        >
                            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                            <span>Toggle Theme</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>


        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Metro Medellín Status</h1>
            <SidebarTrigger className="md:hidden" />
          </div>

          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Real-Time Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {!isOnline && <OfflineAlert />}
              <RealTimeAlerts />
            </CardContent>
          </Card>

          {showRoutes ? (
            <Card className="shadow-lg rounded-xl flex flex-col" style={{minHeight: 'calc(100vh - 20rem)'}}> {/* Adjusted height */}
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">Feeder Route Notifications</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4 flex-grow">
                <div className="h-64 relative rounded-lg overflow-hidden shadow-md border">
                  <DynamicMap />
                </div>
                <div className="flex-grow mt-2 min-h-[200px]"> {/* Ensure RouteList has space */}
                  <RouteList pageNumber={routePage} />
                </div>
                {totalRoutePages > 1 && (
                    <div className="flex justify-center space-x-2 pt-2">
                    {[...Array(totalRoutePages)].map((_, index) => (
                        <Button
                            key={index}
                            variant={routePage === index + 1 ? "default" : "outline"}
                            size="sm"
                            onClick={() => setRoutePage(index + 1)}
                        >
                            {index + 1}
                        </Button>
                    ))}
                    </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <LineNotificationPreferences />
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}

    