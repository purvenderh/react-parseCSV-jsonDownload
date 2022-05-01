import "./App.css";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useCSVReader } from "react-papaparse";
import { useState } from "react";
import Typography from "@mui/material/Typography";

function App() {
  const { CSVReader } = useCSVReader();
  const [column, setColumn] = useState();
  const [row, setRow] = useState();

  const convertJson = (res) => {
    const rawData = res.data;

    //taking out columns array from array
    const colArray = rawData.shift();

    //get array of objects from array of array for datagrid
    const objData = res.data.map((row, index) => {
      //each object with key as column
      const outObj = {};

      //traversing column array
      colArray.forEach((colName, index) => {
        outObj[colName] = row[index];
      });
      return outObj;
    });

    //get array of objects for datagrid column and initializing it with width and headerName
    const colObjForTab = colArray.map((colName) => {
      return {
        field: colName,
        headerName: colName.toUpperCase(),
        minWidth: 100,
        flex: 1,
      };
    });

    //updating columns and rows for tab
    setColumn(colObjForTab);
    setRow(objData);
  };

  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(row)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";

    link.click();
  };

  return (
    <div className="App" style={{ marginTop: "3rem" }}>
      <Button variant="contained" color="success" onClick={exportData}>
        Download Json
      </Button>

      <CSVReader
        onUploadAccepted={(results: any) => {
          convertJson(results);
        }}
      >
        {({
          getRootProps,
          acceptedFile,
          ProgressBar,
          getRemoveFileProps,
        }: any) => (
          <>
            <div>
              <button type="button" {...getRootProps()}>
                Browse file
              </button>
              <div>{acceptedFile && acceptedFile.name}</div>
              <button {...getRemoveFileProps()}>Remove</button>
            </div>
            <ProgressBar />
          </>
        )}
      </CSVReader>

      <div style={{ height: 400, width: "100%", marginY: "2rem" }}>
        {row && (
          <DataGrid
            rows={row}
            columns={column}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        )}
      </div>

      <div>
        <Typography variant="h6" gutterBottom component="div">
          CSV parser Source:-{" "}
          <a href="https://react-papaparse.js.org/">React papa-parse</a>
        </Typography>
        <Typography variant="h6" gutterBottom component="div">
          Data Source:- <a href="https://www.mockaroo.com/">Mockaroo</a>
        </Typography>
      </div>
    </div>
  );
}

export default App;
