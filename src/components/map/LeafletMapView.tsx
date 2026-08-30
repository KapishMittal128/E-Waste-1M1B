import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Recycler } from '../../types';

interface LeafletMapViewProps {
  recyclers: Recycler[];
  userLocation: { lat: number; lng: number; name: string };
  onSelectRecycler: (recycler: Recycler) => void;
}

export const LeafletMapView: React.FC<LeafletMapViewProps> = ({
  recyclers,
  userLocation,
  onSelectRecycler
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // leaflet map init
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 12,
        zoomControl: true,
        attributionControl: false
      });

      // cartodb dark tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 12);
    }
  }, [userLocation]);

  // marker updates
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    // pulsing user pin
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="position:relative; width:22px; height:22px;">
          <div style="position:absolute; inset:0; background:#ffffff; opacity:0.3; border-radius:9999px; animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="position:relative; width:22px; height:22px; background:#ffffff; border:3px solid #000000; border-radius:9999px; box-shadow:0 4px 10px rgba(255,255,255,0.4);"></div>
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });

    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .bindPopup(`
        <div style="padding:10px; font-family:sans-serif; background:#18181b; color:#fff; border-radius:8px;">
          <div style="font-size:10px; font-weight:bold; color:#a1a1aa; text-transform:uppercase;">Your Location</div>
          <div style="font-size:12px; font-weight:bold; color:#ffffff; margin-top:2px;">${userLocation.name}</div>
        </div>
      `)
      .addTo(layer);

    // recycler pins
    recyclers.forEach(rec => {
      const recyclerIcon = L.divIcon({
        className: 'custom-recycler-marker',
        html: `
          <div style="
            background:#ffffff; 
            color:#000000; 
            font-weight:900; 
            font-size:12px; 
            width:32px; 
            height:32px; 
            border-radius:10px; 
            display:flex; 
            align-items:center; 
            justify-content:center; 
            border:2px solid #27272a;
            box-shadow:0 10px 25px rgba(0,0,0,0.8);
            cursor:pointer;
          ">
            ⚡
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([rec.coordinates.lat, rec.coordinates.lng], { icon: recyclerIcon })
        .addTo(layer);

      marker.bindPopup(`
        <div style="padding:14px; font-family:sans-serif; min-width:210px; background:#18181b; color:#fff; border-radius:12px;">
          <div style="display:inline-block; font-size:9px; font-weight:bold; color:#ffffff; background:#27272a; padding:2px 6px; border-radius:4px; margin-bottom:6px;">
            ${rec.authorizationTier}
          </div>
          <div style="font-size:13px; font-weight:bold; color:#ffffff; margin-bottom:4px;">${rec.name}</div>
          <div style="font-size:11px; color:#a1a1aa; margin-bottom:8px;">${rec.address}</div>
          <div style="font-size:11px; font-weight:bold; color:#ffffff;">📞 ${rec.phone}</div>
          <div style="font-size:10px; color:#71717a; margin-top:4px;">${rec.openingHours}</div>
        </div>
      `);

      marker.on('click', () => {
        onSelectRecycler(rec);
      });
    });

  }, [recyclers, userLocation, onSelectRecycler]);

  return (
    <div className="w-full h-[450px] sm:h-[550px] rounded-3xl overflow-hidden border border-zinc-800 relative shadow-2xl">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* legend */}
      <div className="absolute top-3 right-3 z-[400] p-3.5 rounded-2xl bg-black/90 backdrop-blur-xl border border-zinc-800 text-[11px] space-y-1.5 shadow-2xl">
        <div className="font-bold text-zinc-300 uppercase tracking-wider text-[10px] mb-1">
          Gwalior Map Legend
        </div>
        <div className="flex items-center gap-2 text-zinc-300">
          <div className="w-3 h-3 rounded-full bg-white border border-black" />
          <span>Your Selected Location</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-300">
          <div className="w-3 h-3 rounded-md bg-zinc-200 border border-zinc-600 text-black text-[9px] flex items-center justify-center font-bold">⚡</div>
          <span>MPPCB Verified Recyclers</span>
        </div>
      </div>
    </div>
  );
};
