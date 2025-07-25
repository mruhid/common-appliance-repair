import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import Logo from "@/assets/company-logo.png";

interface UserAvatarProps {
  avatarUrl: string | null | undefined | StaticImageData;
  size?: number;
  className?: string;
}

export default function UserAvatar({
  avatarUrl,
  size,
  className,
}: UserAvatarProps) {
  return (
    <Image
      src={
        avatarUrl
          ? avatarUrl == "company"
            ? Logo
            : avatarUrl
          : avatarPlaceholder
      }
      alt="User avatar"
      width={size ?? 48}
      height={size ?? 48}
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-primary object-cover",
        className
      )}
    />
  );
}
