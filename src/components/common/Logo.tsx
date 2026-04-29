import Image from 'next/image';
import logo from '@/assets/images/logo.png';

interface Props {
  className?: string;
  size?: number;
}

export function Logo({ className = '', size = 56 }: Props) {
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
