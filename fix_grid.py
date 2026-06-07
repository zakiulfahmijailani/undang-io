import glob
import os

for filepath in glob.glob("src/components/dashboard/sections/*.tsx"):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace the grid styling to be strictly 1-column, no grid-cols-2
    new_content = content.replace("md:grid-cols-2", "")
    new_content = new_content.replace("md:col-span-2", "")
    # Remove any double spaces introduced by replacement
    new_content = new_content.replace("  ", " ")
    
    if new_content != content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {filepath}")
