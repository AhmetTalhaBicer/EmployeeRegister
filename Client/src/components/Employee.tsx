import {
  Button,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";

export interface IFieldValues {
  employeeID: number;
  employeeName: string;
  occupation: string;
  imageName: string;
  imageSrc: string;
  imageFile: File | null;
}

interface IErrors {
  [key: string]: string | boolean; // Allow for string error messages
}

interface IProps {
  addOrEdit: (formData: FormData, resetForm: () => void) => void;
  recordForEdit: IFieldValues | null;
}

const defaultImageSrc = "public/image_placeholder.png";

const initialFieldValues: IFieldValues = {
  employeeID: 0,
  employeeName: "",
  occupation: "",
  imageName: "",
  imageSrc: defaultImageSrc,
  imageFile: null,
};

const Employee: React.FC<IProps> = ({ addOrEdit, recordForEdit }) => {
  const [values, setValues] = useState<IFieldValues>(initialFieldValues);
  const [errors, setErrors] = useState<IErrors>({});

  useEffect(() => {
    if (recordForEdit) setValues(recordForEdit); // Directly setting the values if recordForEdit is not null
  }, [recordForEdit]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const showPreview = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (x) => {
        if (x.target) {
          setValues({
            ...values,
            imageFile,
            imageSrc: x.target.result as string,
          });
        }
      };
      reader.onerror = (error) => console.log(error); // Handling FileReader errors
      reader.readAsDataURL(imageFile);
    } else {
      setValues({
        ...values,
        imageFile: null,
        imageSrc: defaultImageSrc,
      });
    }
  };

  const validate = (): boolean => {
    const temp: IErrors = {};
    temp.employeeName = values.employeeName == "" ? false : true;
    temp.imageSrc = values.imageSrc == defaultImageSrc ? false : true;
    setErrors(temp);
    return Object.values(temp).every((x) => x === true);
  };

  const resetForm = () => {
    setValues(initialFieldValues);
    const imageUploader = document.getElementById(
      "image-uploader"
    ) as HTMLInputElement;
    if (imageUploader) imageUploader.value = ""; // Ensuring the element exists and is the correct type
    setErrors({});
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      const formData = new FormData();
      formData.append("employeeID", values.employeeID.toString());
      formData.append("employeeName", values.employeeName);
      formData.append("occupation", values.occupation);
      formData.append("imageName", values.imageName);
      if (values.imageFile) {
        formData.append("imageFile", values.imageFile);
      }
      addOrEdit(formData, resetForm);
    }
  };

  const applyErrorStyle = (field: string) => ({
    error: field in errors && errors[field] === false,
  });
  return (
    <>
      <Typography variant="h5" component="h2" textAlign="center" gutterBottom>
        An Employee
      </Typography>
      <form autoComplete="off" noValidate onSubmit={handleFormSubmit}>
        <Card>
          <CardMedia
            component="img"
            sizes="small"
            image={values.imageSrc}
            alt="Employee"
          />
          <CardContent>
            <input
              accept="image/*"
              type="file"
              id="image-uploader"
              style={{ display: "none" }}
              onChange={showPreview}
            />
            <label htmlFor="image-uploader">
              <Button variant="contained" color="primary" component="span">
                Upload Image
              </Button>
            </label>
            <TextField
              variant="outlined"
              fullWidth
              margin="normal"
              label="Employee Name"
              name="employeeName"
              value={values.employeeName}
              onChange={handleInputChange}
              {...applyErrorStyle("employeeName")}
            />
            <TextField
              variant="outlined"
              fullWidth
              margin="normal"
              label="Occupation"
              name="occupation"
              value={values.occupation}
              onChange={handleInputChange}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </CardContent>
        </Card>
      </form>
    </>
  );
};

export default Employee;
