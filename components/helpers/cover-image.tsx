import Image from "next/image";

interface CoverImageProps {
  coverUrl: string;
}

export function CoverImage({ coverUrl }: CoverImageProps) {
  return (
    <div className="w-1/2 relative hidden sm:block">
      {coverUrl && (
        <Image
          width={1280}
          height={720}
          src={coverUrl}
          priority
          alt="Cover"
          className="w-full h-full object-cover object-top"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
    </div>
  );
}
