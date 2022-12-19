import "./App.css";
import { useCSVReader } from "react-papaparse";
import { useState } from "react";

function App() {
  const { CSVReader } = useCSVReader();
  const [row, setRow] = useState();

  const exportData = () => {
    var educationList = [];
    for (let i = 1; i <= 10; i++) {
      if (!row["education_" + i]) break;
      educationList.push({
        school: row["education_"+i],
        degree: row["education_degree_"+i],
        speciality: row["education_fos_"+i],
        description: row["education_description_"+i],
        startDate: new Date(row["education_start_"+i]),
        endDate: row["education_end_"+i]?new Date(row["education_end_"+i]):"",
        position: i,
      });
    }

    var employmentList = [];

    for (let i = 1; i <= 10; i++) {
      if (!row["organization_" + i]) break;
      employmentList.push({
        org_name: row["organization_" + i],
        org_linkedin_id: row["organization_id_" + i],
        designation: row["organization_title_" + i],
        description: row["organization_description_" + i],
        startDate: new Date(row["organization_start_" + i]),
        endDate: row["organization_end_" + i]?new Date(row["organization_end_" + i]):"",
        location: row["organization_location_" + i],
        position: i,
      });
    }
    
    var result = {};
    result.educationList = educationList;
    result.employmentList = employmentList;
    console.log(result)
  };

  const convertJson = (res) => {
    const rawData = res.data;

    //taking out columns array from array
    const colArray = rawData.shift();

    //get array of objects from array of array for datagrid
    const objData = rawData.map((row, index) => {
      //each object with key as column
      const outObj = {};

      //traversing column array
      colArray.forEach((colName, index) => {
        outObj[colName] = row[index];
      });
      return outObj;
    });
    setRow(objData[0]);
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
    acceptedFile: {
      border: "1px solid #ccc",
      height: 45,
      lineHeight: 2.5,
      paddingLeft: 10,
      width: "80%",
    }
  };

  return (
    <div className="App" style={{ marginTop: "3rem", marginBottom: "3rem" }}>
      <CSVReader
        onUploadAccepted={(results: any) => {
          convertJson(results);
        }}
      >
        {({ getRootProps, acceptedFile }: any) => (
          <>
            <div style={styles.csvReader}>
              {!row && (
                <button type="button" {...getRootProps()}>
                  Browse file
                </button>
              )}
              {row && <button onClick={exportData}>Upload Data</button>}
              <div style={styles.acceptedFile}>
                {acceptedFile && acceptedFile.name}
              </div>
            </div>
          </>
        )}
      </CSVReader>
    </div>
  );
}

export default App;
