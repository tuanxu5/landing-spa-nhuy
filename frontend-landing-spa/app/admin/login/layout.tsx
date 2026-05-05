import { ReactNode } from 'react';

export default function LoginLayout({ children }: { children: ReactNode }) {
  // Login page không có sidebar/navigation
  return <>{children}</>;
}
