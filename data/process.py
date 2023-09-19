import numpy
import pandas
from osgeo import gdal, ogr
import geopandas

from fiona.crs import from_epsg

gdal.UseExceptions()

ds = gdal.OpenEx( "/vsizip/tl_2022_us_county.zip", gdal.OF_VECTOR )
if ds is None:
    print("Open failed.")

us_counties = geopandas.read_file('/vsizip/tl_2022_us_county.zip')

workbook = pandas.read_excel(
  './laucntycur14.xlsx', 
  skiprows=6,
  skipfooter=3, 
  header=None, 
  names=[
    'laus_code', 
    'statefp', 
    'countyfp', 
    'county_name', 
    'period', 
    'labor_force', 
    'employed', 
    'unemployed', 
    'unemployment_rate'
  ],
  dtype={
    'statefp': 'string', 
    'countyfp': 'string', 
    'labor_force': numpy.uint32, 
    'employed': numpy.uint32, 
    'unemployed': numpy.uint32, 
    'unemployment_rate': numpy.float32
  }
)

# filter to a specific Month and Year
june_2023_period = workbook.loc[workbook['period'] == 'Jun-23']

merged = us_counties.merge(june_2023_period, left_on=['STATEFP', 'COUNTYFP'], right_on=['statefp', 'countyfp'], how='left')

selected = merged[['statefp', 'countyfp', 'county_name', 'employed', 'unemployed', 'unemployment_rate', 'geometry']]


selected.to_file("us_counties_unemployment.geojson", driver="GeoJSON", crs=from_epsg(4326))
