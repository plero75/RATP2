import React from 'react';

export const RerAIcon: React.FC = () => (
  <div className="w-7 h-7 rounded-full bg-[#E2001A] border-2 border-white flex items-center justify-center flex-shrink-0">
    <span className="text-white font-bold text-base leading-none">A</span>
  </div>
);

export const BusIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-[#e0e1dd] flex-shrink-0"
  >
    <path d="M8 6v6" />
    <path d="M16 6v6" />
    <path d="M2 12h19.6" />
    <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </svg>
);

export const NoctilienIcon: React.FC = () => (
  <div className="relative w-7 h-7 flex-shrink-0">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[#e0e1dd]"
    >
      <path d="M8 6v6" />
      <path d="M16 6v6" />
      <path d="M2 12h19.6" />
      <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="absolute top-0 right-[-2px] text-yellow-300">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  </div>
);

export const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

export const WarningIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

export const WalkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="5" r="1"></circle><path d="M9 20l3-6-4-3-3 6h13"></path><path d="M11.7 14.5L14 12l4 4"></path></svg>
);

export const BikeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="18.5" cy="17.5" r="3.5" />
    <path d="M15 6l-4 4-4-4" />
    <path d="M9 14l-3 3.5" />
    <path d="M15 14l3 3.5" />
    <path d="M9 6h7" />
    <path d="M12 6v8" />
  </svg>
);

export const BoltIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export const ParkingIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 18H7.5a1.5 1.5 0 0 1-1.5-1.5V5.5A1.5 1.5 0 0 1 7.5 4H15a1.5 1.5 0 0 1 1.5 1.5v1.5" />
    <path d="M16 12h3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-3" />
    <path d="M12 12h2.5a2.5 2.5 0 0 1 0 5H12V9.5A2.5 2.5 0 0 1 14.5 7H16" />
  </svg>
);

// --- Weather Icons ---

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
);

const CloudIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>
);

const CloudRainIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path><line x1="8" y1="19" x2="8" y2="21"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="16" y1="19" x2="16" y2="21"></line></svg>
);

const CloudLightningIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path><polyline points="13 11 9 17 15 17 11 23"></polyline></svg>
);

const CloudDrizzleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path><path d="M8 19v1"></path><path d="M8 14v1"></path><path d="M12 19v1"></path><path d="M12 14v1"></path><path d="M16 19v1"></path><path d="M16 14v1"></path></svg>
);

const CloudFogIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path><line x1="5" y1="17" x2="19" y2="17"></line><line x1="5" y1="20" x2="19" y2="20"></line></svg>
);

export const getWeatherInfo = (code: number): { description: string, Icon: React.FC<{className?: string}> } => {
  switch (code) {
    case 0: return { description: 'Ciel dégagé', Icon: SunIcon };
    case 1: return { description: 'Plutôt dégagé', Icon: SunIcon };
    case 2: return { description: 'Partiellement nuageux', Icon: CloudIcon };
    case 3: return { description: 'Couvert', Icon: CloudIcon };
    case 45:
    case 48: return { description: 'Brouillard', Icon: CloudFogIcon };
    case 51:
    case 53:
    case 55: return { description: 'Bruine', Icon: CloudDrizzleIcon };
    case 61:
    case 63:
    case 65: return { description: 'Pluie', Icon: CloudRainIcon };
    case 80:
    case 81:
    case 82: return { description: 'Averses', Icon: CloudRainIcon };
    case 95:
    case 96:
    case 99: return { description: 'Orages', Icon: CloudLightningIcon };
    default: return { description: 'Météo inconnue', Icon: CloudIcon };
  }
};