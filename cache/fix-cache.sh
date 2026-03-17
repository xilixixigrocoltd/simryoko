#!/bin/bash
# Fix cache files - only include local products for each country

COUNTRIES="JP KR TH US GB FR IT ES AU SG MY CN HK TW DE"
API_BASE="https://simryoko.com/api/products"

echo "Fixing cache files for countries: $COUNTRIES"

for code in $COUNTRIES; do
  echo "Fetching local products for $code..."
  curl -s "$API_BASE?country=$code&page=1&pageSize=100" -H "User-Agent: Mozilla/5.0" > "/tmp/${code}.json"
  
  # Check if we got valid data
  if grep -q '"success":true' "/tmp/${code}.json"; then
    echo "✓ $code: Success"
  else
    echo "✗ $code: Failed"
  fi
done

echo "Done. Files saved to /tmp/"
