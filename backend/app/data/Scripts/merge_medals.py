import os
import pandas as pd

folder = r'c:\Users\HP\Documents\GitHub\OlympiQ\data\raw\medals'
output_path = r'c:\Users\HP\Documents\GitHub\OlympiQ\data\processed\medals.csv'

dfs = []

for file in sorted(os.listdir(folder)):
    if file.endswith('.csv'):
        path = os.path.join(folder, file)
        df = pd.read_csv(path)

        if all(col in df.columns for col in ['Country', 'Gold', 'Silver', 'Bronze', 'Total', 'Year']):
            dfs.append(df)

        else:
            print(f"❌ Missing columns in {file}: {df.columns}")


# Concatenate all DataFrames into one
merged_df = pd.concat(dfs, ignore_index=True)
merged_df.sort_values(by=["Country", "Year"], inplace=True)
merged_df.to_csv(output_path, index=False)

print(f"✅ Merged {len(dfs)} files into {output_path}")
            
