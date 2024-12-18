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
    
    # Convert each row into a dictionary and add it to data
    for rows in csvReaderGDP:
        key = rows['Code']
        dataGDPJson[key] = rows

    for rows in csvReaderMilitary:
        key = rows['Code']
        
        if key in dataGDPJson.keys():
            for year in range(1960, 2019):
                year = str(year)
                valueMilitary = rows.get(year, '')
                valueGdp = dataGDPJson[key].get(year, '')
                if valueMilitary == '' or valueGdp == '':
                    porcentaje = 0    
                else:
                    porcentaje = (float(valueMilitary) / float(valueGdp)) * 100

                if valueMilitary == '':
                    valueMilitary = 0
                if valueGdp == '':
                    valueGdp = 0

                dataFinal.append({
                    'Name': rows['Name'],
                    'CODE': key,
                    'Year': year,
                    'MilitaryExpend': float(valueMilitary),
                    'GDP': float(valueGdp),
                    'porcentaje': porcentaje
                })

                if porcentaje > maximos[0]['porcentaje']:
                    maximos[0] = {'Name': rows['Name'],
                                  'CODE': key,
                                  'Year': year,
                                  'porcentaje': porcentaje}
                elif porcentaje > maximos[1]['porcentaje']:
                    maximos[1] = {'Name': rows['Name'],
                                  'CODE': key,
                                  'Year': year,
                                  'porcentaje': porcentaje}
                elif porcentaje > maximos[2]['porcentaje']:
                    maximos[2] = {'Name': rows['Name'],
                                  'CODE': key,
                                  'Year': year,
                                  'porcentaje': porcentaje}

    print(maximos)
    
    # Open a json writer, and use the json.dumps() function to dump data
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(dataFinal, indent=4))

csvFileGDPPath = r'gdp.csv'
csvFileMilitaryPath = r'Military Expenditure.csv'
jsonFilePath = r'DataToUse.json'

# Call the make_json function
make_json(csvFileGDPPath, csvFileMilitaryPath, jsonFilePath)
