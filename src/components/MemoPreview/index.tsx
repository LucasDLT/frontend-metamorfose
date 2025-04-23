import React from "react";

const ImagePreviewComponent = (({ url }: { url: string | null }) => {
    if (!url) return null;
    return <img src={url} alt="Preview" className="w-40 h-40 object-cover" />;
  });
  
export const ImagePreview = React.memo(ImagePreviewComponent);
