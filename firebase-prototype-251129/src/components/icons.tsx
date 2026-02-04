export const GrowthIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 20h10" />
      <path d="M12 4v16" />
      <path d="M11 4h2" />
      <path d="M3 12h18" />
      <path d="m3 12 5-5-5-5" />
      <path d="m21 12-5-5 5-5" />
      <path d="m3 12 5 5-5 5" />
      <path d="m21 12-5 5 5 5" />
    </svg>
  );
  
  // A simpler version, keeping both just in case
  export const SimpleGrowthIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      {...props}
    >
      <path d="M17 3v18H7" />
      <path d="M12 14l-5 5m0-5l5 5" />
      <path d="M12 8l4 4" />
    </svg>
  );