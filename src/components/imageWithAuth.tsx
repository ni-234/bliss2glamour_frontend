import React, { useEffect, useState } from "react";
export interface ImageWithAuthProps {
  image_url: string;
  alt: string;
  imgClassName?: string;
  loaderClassName?: string;
  errorClassName?: string;
}

const ImageWithAuth: React.FC<ImageWithAuthProps> = ({
  alt,
  image_url,
  errorClassName,
  loaderClassName,
  imgClassName,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(image_url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }

        const blob = await response.blob();
        const imageObjectURL = URL.createObjectURL(blob);
        setImageSrc(imageObjectURL);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchImage();
  }, [image_url]);

  if (error) {
    return <div className={errorClassName}>Error: {error}</div>;
  }

  if (!imageSrc) {
    return <div className={loaderClassName}>Loading...</div>;
  }

  return <img className={imgClassName} src={imageSrc} alt={alt} />;
};

export default ImageWithAuth;
