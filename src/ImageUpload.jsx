import { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
export default function ImageUpload() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  async function upload(e) {
    const input = e.currentTarget,
      form = input.form,
      file = input.files[0];
    if (!file) return;
    setError("");
    if (file.size > 3 * 1024 * 1024) {
      setError("Choose an image smaller than 3 MB.");
      input.value = "";
      return;
    }
    const data = new FormData();
    data.append("file", file);
    setBusy(true);
    try {
      const response = await fetch("/api/media", {
        method: "POST",
        credentials: "same-origin",
        body: data,
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Image upload failed.");
      if (form?.elements.image) form.elements.image.value = result.url;
      setPreview(result.url);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
      input.value = "";
    }
  }
  return (
    <div className="rounded-xl border border-dashed border-stone-300 p-4">
      <label className="grid gap-3 text-xs font-semibold">
        <span>
          <FiUploadCloud className="mr-2 inline" />
          {busy ? "Uploading to Cloudinary…" : "Upload a product image"}
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={busy}
          onChange={upload}
        />
      </label>
      <p className="mt-3 text-[10px] leading-5 text-stone-400">
        JPEG, PNG or WebP, up to 3 MB. Uploads are stored in Cloudinary. Save
        the product after uploading.
      </p>
      {preview && (
        <img
          className="mt-3 h-24 w-24 rounded-xl object-contain"
          src={preview}
          alt="Uploaded product preview"
        />
      )}
      {error && (
        <p role="alert" className="mt-3 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
