import { useState } from "react";
import { useForm } from "react-hook-form";
import { uploadFileToR2 } from "../services/uploadService";

const R2UploadForm = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsUploading(true);
      const file = data.file[0]; // File list থেকে প্রথম ফাইলটি নেওয়া

      // সার্ভিস কল করা
      const result = await uploadFileToR2(file, "documents");

      setUploadedUrl(result.publicUrl);
      alert("Upload Successful!");
      reset(); // ফর্ম ক্লিয়ার করা
    } catch (error) {
      console.error(error);
      alert("Upload Failed!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h2>R2 Direct Upload</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: "15px" }}>
          <label>Select File:</label>
          <input
            type="file"
            {...register("file", { required: "Please select a file" })}
            style={{ display: "block", marginTop: "10px" }}
          />
          {errors.file && (
            <span style={{ color: "red" }}>{errors.file.message}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isUploading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: isUploading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {isUploading ? "Uploading to R2..." : "Submit & Upload"}
        </button>
      </form>

      {uploadedUrl && (
        <div style={{ marginTop: "20px" }}>
          <p>Uploaded Image:</p>
          <img
            src={uploadedUrl}
            alt="Uploaded"
            style={{ width: "100%", borderRadius: "4px" }}
          />
        </div>
      )}
    </div>
  );
};

export default R2UploadForm;
