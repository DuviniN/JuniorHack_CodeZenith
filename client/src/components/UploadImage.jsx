import React, { useState } from "react";

export default function UploadImage() {
  const [imageUrl, setImageUrl] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:5000/api/upload/image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setImageUrl(data.url);
  };

  return (
    <div>
      <input type="file" onChange={handleUpload} />

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Uploaded"
          style={{ width: 200, marginTop: 20 }}
        />
      )}
    </div>
  );
}
