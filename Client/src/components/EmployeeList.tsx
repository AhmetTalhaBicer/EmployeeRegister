import React, { useState, useEffect, useCallback } from "react";
import Employee from "./Employee";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { IFieldValues } from "./Employee";

interface IEmployee extends IFieldValues {
  employeeID: number;
  employeeName: string;
  occupation: string;
  imageSrc: string;
}

export default function EmployeeList() {
  const [employeeList, setEmployeeList] = useState<IEmployee[]>([]);
  const [recordForEdit, setRecordForEdit] = useState<IEmployee | null>(null);

  const employeeAPI = useCallback(
    (url = "https://localhost:7062/api/Employee/") => {
      return {
        fetchAll: () => axios.get<IEmployee[]>(url),
        create: (newRecord: FormData) => axios.post(url, newRecord),
        update: (id: number, updatedRecord: FormData) =>
          axios.put(`${url}${id}`, updatedRecord),
        delete: (id: number) => axios.delete(`${url}${id}`),
      };
    },
    []
  );

  const refreshEmployeeList = useCallback(() => {
    employeeAPI()
      .fetchAll()
      .then((res) => {
        setEmployeeList(res.data);
      })
      .catch((err) => console.log(err));
  }, [employeeAPI, setEmployeeList]);

  useEffect(() => {
    refreshEmployeeList();
  }, [refreshEmployeeList]);

  const addOrEdit = (formData: FormData, onSuccess: () => void) => {
    if (formData.get("employeeID") === "0")
      employeeAPI()
        .create(formData)
        .then(() => {
          onSuccess();
          refreshEmployeeList();
        })
        .catch((err) => console.log(err));
    else
      employeeAPI()
        .update(Number(formData.get("employeeID")), formData)
        .then(() => {
          onSuccess();
          refreshEmployeeList();
        })
        .catch((err) => console.log(err));
  };

  const showRecordDetails = (data: IEmployee) => {
    setRecordForEdit(data);
  };

  const onDelete = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) => {
    e.stopPropagation();
    if (window.confirm("Are you sure to delete this record?"))
      employeeAPI()
        .delete(id)
        .then(() => refreshEmployeeList())
        .catch((err) => console.log(err));
  };

  const imageCard = (data: IEmployee) => (
    <Card
      onClick={() => {
        showRecordDetails(data);
      }}
      sx={{ maxWidth: 345, m: 2 }}
    >
      <CardMedia
        component="img"
        height="140"
        image={data.imageSrc}
        alt="Employee"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {data.employeeName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.occupation}
        </Typography>
        <Box textAlign="center" mt={2}>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={(e) => onDelete(e, data.employeeID)}
          >
            Delete
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 3, mb: 1 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Employee Register
        </Typography>
      </Paper>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Employee addOrEdit={addOrEdit} recordForEdit={recordForEdit} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container>
            {employeeList.map((employee, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                {imageCard(employee)}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
