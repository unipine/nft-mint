import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";

import { mint } from "../services/nft.service";
import { MintFormValuesType } from "../types/form";

const NftMint = () => {
  const { register, handleSubmit, reset } = useForm<MintFormValuesType>();

  const [files, setFiles] = useState<Array<File & { preview: string }>>([]);
  const [message, setMessage] = useState<string>();
  const [success, setSuccess] = useState<boolean>();

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

    setSuccess(false);
    mint(formdata)
      .then((response) => {
        setSuccess(true);
      })
      .catch((error) => {
        setSuccess(undefined);
        setMessage(error.response.data.message || error.message);
      });
  });

  return (
    <form onSubmit={onSubmit}>
      <div className="card w-50">
        <div className="form-group">
          {message && (
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          )}
          {success && (
            <div className="alert alert-success" role="alert">
              Successfully minted!
            </div>
          )}
        </div>

        {success === false ? (
          <p>Minting now, Wait a second...</p>
        ) : (
          <>
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
          </>
        )}
      </div>
    </form>
  );
};

export default NftMint;
