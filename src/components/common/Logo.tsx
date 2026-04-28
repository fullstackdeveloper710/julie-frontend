import Image from 'next/image';
import logo from '@/assets/images/logo.png';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = '', size = 56 }: LogoProps) {
  return (
    <Image
      src={logo}
      alt="Frontline Frameworks Logo"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}

export default Logo;
