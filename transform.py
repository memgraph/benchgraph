from transformation.transform_json import TranslateJson
from pathlib import Path
import json

working_directory = Path().absolute()
configs = {
    "memgraph_cold" : sorted(working_directory.glob("memgraph" + "*" + "cold" + "_*.json")),
    "memgraph_hot" : sorted(working_directory.glob("memgraph" + "*" + "hot" + "_*.json")),
    "memgraph_vulcanic" : sorted(working_directory.glob("memgraph"+ "*" + "vulcanic" + "_*.json")),
    "neo4j_cold" : sorted(working_directory.glob("neo4j"+ "*" + "cold" + "_*.json")), 
    "neo4j_hot" : sorted(working_directory.glob("neo4j" + "*" + "hot" + "_*.json")),
    "neo4j_vulcanic" : sorted(working_directory.glob("neo4j" + "*" + "vulcanic" + "_*.json")),

}
mem_cold = sorted(working_directory.glob("memgraph" + "*" + "cold" + "_*.json"))
mem_hot = sorted(working_directory.glob("memgraph" + "*" + "hot" + "_*.json"))
mem_vulcanic = sorted(working_directory.glob("memgraph"+ "*" + "vulcanic" + "_*.json"))
neo4j_cold = sorted(working_directory.glob("neo4j"+ "*" + "cold" + "_*.json"))
neo4j_hot = sorted(working_directory.glob("neo4j" + "*" + "hot" + "_*.json"))
neo4j_vulcanic = sorted(working_directory.glob("neo4j" + "*" + "vulcanic" + "_*.json"))


full_data = {"benchmarks":[]}
for vendor, files in configs.items():
    data = {}
    for file in files:
        if len(data) == 0:
            data = TranslateJson.translate(source=file, destination="temp")
        else: 
            added = False
            res = TranslateJson.translate(source=file, destination="temp")
            for dataset in data["datasets"]:
                if dataset["name"] == res["datasets"][0]["name"] and dataset["size"] == res["datasets"][0]["size"]:
                    for workload in res["datasets"][0]["workloads"]:
                        dataset["workloads"].append(workload)
                        added = True
            if not added:           
                data["datasets"].append(res["datasets"][0])

    full_data["benchmarks"].append(data)
    json_object = json.dumps(data, indent=4)
    with open(vendor + ".json", "w") as f:
        json.dump(data, f)
 
json_object = json.dumps(full_data, indent=4)
with open("benchmarks.json", "w") as f:
    json.dump(full_data, f)