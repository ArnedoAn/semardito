import pandas as pd
import sys
import os

date = sys.argv[1]
last_names = sys.argv[2]
month = sys.argv[3]
file_path = sys.argv[4]

try:
    # Load Excel file
    file_path = file_path.replace("\\", "/")
    df = pd.read_excel(file_path, sheet_name=month)

    # Convert last names to lowercase and remove spaces
    last_names = [name.lower().replace(" ", "") for name in last_names]

    # Get column index for date
    date_column = df.columns.get_loc(date)

    # Mark attendance for each last name on the corresponding date
    for name in last_names:
        row = df.loc[df['Last Name'].str.lower().replace(" ", "") == name]
        if not row.empty:
            df.iat[row.index[0], date_column] = 'X'

    # Save Excel file
    writer = pd.ExcelWriter(file_path, engine='xlsxwriter')
    df.to_excel(writer, sheet_name=month, index=False)
    writer.save()

    print("true")
except Exception as e:
    print("error:", str(e))
