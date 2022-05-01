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

  const removeCSV = () => {
    setRow(null);
    setColumn(null);
  };

  //function for exporting json data
  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(row)
    )}`;

    //creating link , adding href and download and click property
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";

    link.click();
  };

  //styles for crv converter
  const styles = {
    csvReader: {
      display: "flex",
      flexDirection: "row",
      marginBottom: "5rem",
      marginTop: "5rem",
      margin: "auto",
      maxWidth: "400px",
    },
    browseFile: {
      width: "20%",
    },
    acceptedFile: {
      border: "1px solid #ccc",
      height: 45,
      lineHeight: 2.5,
      paddingLeft: 10,
      width: "80%",
    },
    remove: {
      borderRadius: 0,
      padding: "0 20px",
    },
    progressBarBackgroundColor: {
      backgroundColor: "red",
    },
  };

  return (
    <div className="App" style={{ marginTop: "3rem", marginBottom: "3rem" }}>
      {row && (
        <Button
          variant="contained"
          color="success"
          onClick={exportData}
          style={{ marginBottom: "3rem" }}
        >
          Download Json
        </Button>
      )}

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
            <div style={styles.csvReader}>
              <button type="button" {...getRootProps()}>
                Browse file
              </button>
              <div style={styles.acceptedFile}>
                {acceptedFile && acceptedFile.name}
              </div>
              {row && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={removeCSV}
                  // {...getRemoveFileProps()}
                  style={styles.remove}
                >
                  Remove
                </Button>
              )}
            </div>
            <ProgressBar style={styles.progressBarBackgroundColor} />
          </>
        )}
      </CSVReader>

      <div
        style={{
          height: 400,
          width: "100%",
          marginTop: "3rem",
          marginBottom: "3rem",
        }}
      >
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
        <Typography variant="h6" gutterBottom component="div" color="success">
          CSV parser Source:-{" "}
          <a href="https://react-papaparse.js.org/">React papa-parse</a>
        </Typography>
        <Typography variant="h6" gutterBottom component="div" color="success">
          Data Source:- <a href="https://www.mockaroo.com/">Mockaroo</a>
        </Typography>
      </div>
    </div>
  );
}

export default App;
