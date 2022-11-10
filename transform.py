from transformation.transform_json import TranslateJson
from pathlib import Path
import json

working_directory = Path().absolute()
configs = {
    "memgraph_cold" : sorted(working_directory.glob("memgraph_cold" + "_*.json")),
    "memgraph_hot" : sorted(working_directory.glob("memgraph_hot" + "_*.json")),
    "neo4j_cold" : sorted(working_directory.glob("neo4j_cold" + "_*.json")), 
    "neo4j_hot" : sorted(working_directory.glob("neo4j_hot" + "_*.json"))

}
mem_cold = sorted(working_directory.glob("memgraph_cold" + "_*.json"))
mem_hot = sorted(working_directory.glob("memgraph_hot" + "_*.json"))
neo4j_cold = sorted(working_directory.glob("neo4j_cold" + "_*.json"))
neo4j_hot = sorted(working_directory.glob("neo4j_hot" + "_*.json"))

for vendor, files in configs.items():
    data = {}
    for file in files:
        if len(data) == 0:
            data = TranslateJson.translate(source=file, destination="temp")
        else: 
            res = TranslateJson.translate(source=file, destination="temp")
            for workload in res["datasets"][0]["workloads"]:
                data["datasets"][0]["workloads"].append(workload)
    

    json_object = json.dumps(data, indent=4)
    with open(vendor + ".json", "w") as f:
        json.dump(data, f)
