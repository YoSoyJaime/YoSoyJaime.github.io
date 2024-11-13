import csv
import json

def make_json(csvFilePathGDP, csvFilePathMilitary, jsonFilePath):
    
    # create a dictionary
    dataGDPJson = {}
    dataMilitaryJson = {}
    dataFinal = []
    maximos = [{'Name': '',
                          'CODE': '',
                          'porcentaje': 0}, 
                        {'Name': '',
                          'CODE': '',
                          'porcentaje': 0}, 
                          {'Name': '',
                          'CODE': '',
                          'porcentaje': 0}]
    # Open a csv reader called DictReader
    dataGDP = open(csvFilePathGDP, encoding='utf-8') 
    dataMilitary = open(csvFilePathMilitary, encoding='utf-8') 
    csvReaderGDP = csv.DictReader(dataGDP)
    csvReaderMilitary = csv.DictReader(dataMilitary)
    # Convert each row into a dictionary 
    # and add it to data
    

    j = 1
    for rows in csvReaderGDP:
        
        # Assuming a column named 'No' to
        # be the primary key
        key = rows['Code']
        dataGDPJson[key] = rows
        print(rows)

    for rows in csvReaderMilitary:
        
        # Assuming a column named 'No' to
        # be the primary key
        key = rows['Code']
        year = 1960
        infoByYear = {}
        while year <= 2018 :
            infoByYear[str(year)] = {}
            if (key in dataGDPJson.keys()) :
                valueMilitary = (rows[str(year)])
                valueGdp = (dataGDPJson[key][str(year)])

                if (valueMilitary == '' or valueGdp == ''):
                    porcentaje = 0;    
                else:
                    porcentaje = (float(valueMilitary)/float(valueGdp))*100

                if (valueMilitary == ''):
                    valueMilitary = 0
                if (valueGdp == ''):
                    valueGdp = 0

            infoByYear[str(year)] = {'MilitaryExpend': float(valueMilitary),
                            'GDP': float(valueGdp),
                            'porcentaje': porcentaje}
            year +=1
            
        dataFinal.append({'Name': rows['Name'],
                            'CODE': key,
                            'Info': infoByYear})



        if (porcentaje > maximos[0]['porcentaje']):
            maximos[0] = {'Name': rows['Name'],
                          'CODE': key,
                          'porcentaje': porcentaje}
        elif (porcentaje > maximos[1]['porcentaje']):
            maximos[1] = {'Name': rows['Name'],
                          'CODE': key,
                          'porcentaje': porcentaje}
        elif (porcentaje > maximos[2]['porcentaje']):
            maximos[2] = {'Name': rows['Name'],
                          'CODE': key,
                          'porcentaje': porcentaje}
    
    print(maximos)
    
    # Open a json writer, and use the json.dumps() 
    # function to dump data
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(dataFinal, indent=4))


csvFileGDPPath = r'gdp.csv'
csvFileMilitaryPath = r'Military Expenditure.csv'
jsonFilePath = r'Names.json'

# Call the make_json function
make_json(csvFileGDPPath, csvFileMilitaryPath, jsonFilePath)        