import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";

import { mint } from "../services/nft.service";
import { FormValues } from "../types/form";

const NftMint = () => {
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const [files, setFiles] = useState<Array<File & { preview: string }>>([]);
  const [message, setMessage] = useState<string>();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png", ".txt"],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    if (files.length === 0) {
      return window.alert("Please select the image.");
    }

    const formdata = new FormData();
    formdata.append("name", data.name);
    formdata.append("description", data.description);
    formdata.append("file", files[0]);

    reset();
    setFiles([]);

    mint(formdata)
      .then((response) => {})
      .catch((error) => {
        setMessage(error.response.data.message || error.message);
      });
  });

  return (
    <form onSubmit={onSubmit}>
      <div className="card card-container">
        {message && (
          <div className="form-group">
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          </div>
        )}
        <div>
          <div className="border rounded mb-2 p-2" {...getRootProps()}>
            <input {...getInputProps()} />
            {files[0] ? (
              <p>{files[0].name}</p>
            ) : (
              <>
                <p>Drag and drop a file here, or click to select file</p>
                <p>
                  <em>(Only *.jpeg, *.png, *.txt files will be accepted)</em>
                </p>
              </>
            )}
          </div>

          <aside>
            {files.length > 0 && (
              <img
                src={files[0].preview}
                alt={files[0].name}
                className="w-100 mb-2"
                style={{
                  borderRadius: "0.5rem",
                }}
              />
            )}
          </aside>
        </div>

        <input
          id="outlined-name"
          placeholder="Name"
          className="border rounded mb-2 p-2"
          {...register("name", { required: true })}
        />
        <textarea
          id="outlined-description"
          placeholder="Description"
          className="border rounded mb-2 p-2"
          {...register("description", { required: true })}
        />

        <button type="submit" className="btn btn-success">
          Mint
        </button>
      </div>
    </form>
  );
};

export default NftMint;
