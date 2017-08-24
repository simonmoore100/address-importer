# Pointer address transform

This node.js app will convert the NI address database, Pointer, into a format which can be used with the locate dataset. Pointer is the address database for Northern Ireland and is maintained by Land & Property Services (LPS), with input from local councils and Royal Mail. More info on what Locate is can be found at https://github.com/alphagov/location-data-importer


### Description
Running the app will strip out unnecessary columns form the original file and produce a json format that can be used for mongodb import. To get the best import possible, the original Pointer file should be sorted by address in natural sort format. The steps are documented below.



### Instructions
The app uses node v6.3.1 but newer versions should work.

If you have got the correct version of node installed, install all the npm dependencies
```sh
$ npm install
```

Place the pointer dataset csv file inside the /csv directory.

Open the CSV file in Excel.

In the Developer tab, click on Visual Basic

Paste the following and select run:

```sh
Sub setUpNIData()

Dim lRow As Long
lRow = Cells(Rows.Count, 3).End(xlUp).Row

'Inserting and renaming columns
Range("C1").EntireColumn.Insert
Range("C2:C1000000").Select
Selection.Formula = "=SUMPRODUCT(MID(0&B2,LARGE(INDEX(ISNUMBER(--MID(B2,ROW($1:$25),1))*ROW($1:$25),0),ROW($1:$25))+1,1)*10^ROW($1:$25)/10)"
Range("C1").Value = "HELPER_2"
Range("F1").EntireColumn.Insert
Range("F2:F1000000").Select
Selection.Formula = "=SUMPRODUCT(MID(0&E2,LARGE(INDEX(ISNUMBER(--MID(E2,ROW($1:$25),1))*ROW($1:$25),0),ROW($1:$25))+1,1)*10^ROW($1:$25)/10)"
Range("F1").Value = "HELPER_1"

End Sub
```

Select the POSTCODE column

Click on Sort & Filter > Custom sort

Sort by POSTCODE AtoZ

Sort by HELPER_1 Smallest to Largest

Sort by BUILDING_NUMBER Smallest to Largest

Sort by HELPER_2 Smallest to Largest

Sort by SUB_BUILDING_NAME AtoZ

Save the Workbook

Create a duplicate pointer csv in the input directory

Rename it to whatever you want and update the settings.js file with the filename you used

Open the newly created csv file

Filter by postcode and remove duplicates by Data > Remove duplicates

Delete all other data so you are just left with a column of unique postcodes

Save the Workbook

Run the application.
```sh
npm start
```

Browse to http://localhost:3000 and select which conversion you require.

Files will appear in the /done directory when complete