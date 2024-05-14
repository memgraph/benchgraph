import os
import json

from enum import Enum
from typing import Any, Dict, List, Tuple, Type, TypeVar


RUN_CONFIGURATION_KEY = "__run_configuration__"


T = TypeVar("T", bound=Enum)


class InvalidValueException(Exception):
    def __init__(self, type: Type, received: str) -> None:
        message = f"Expected one of the following: {', '.join([member.value for _, member in type.__members__.items()])}, received {received}"
        super().__init__(message)


class RunConfigVendor(Enum):
    NONE = "None"
    MEMGRAPH = "Memgraph"
    NEO4J = "Neo4j"


class RunConfigCondition(Enum):
    NONE = "None"
    HOT = "hot"
    COLD = "cold"
    VULCANIC = "vulcanic"


class DatasetSize(Enum):
    NONE = "None"
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"
    SF01 = "sf0.1"
    SF1 = "sf1"
    SF3 = "sf3"
    SF10 = "sf10"


class QueryCategory(Enum):
    NONE = "None"
    READ = "read"
    WRITE = "write"
    AGGREGATE = "aggregate"
    ANALYTICAL = "analytical"
    UPDATE = "update"


class WorkloadType(Enum):
    NONE = "None"
    ISOLATED = "isolated"
    MIXED = "mixed"
    REALISTIC = "realistic"


def StrToEnum(t: Type, string: str) -> T:
    for _, member in t.__members__.items():
        if string.lower() == member.value.lower():
            return member

    raise InvalidValueException(type=t, received=string)


class QueryStatistics:
    def __init__(
        self,
        iterations: int = 0,
        min: int = 0,
        max: int = 0,
        mean: int = 0,
        p99: float = 0,
        p95: float = 0,
        p90: float = 0,
        p75: float = 0,
        p50: float = 0,
    ) -> None:
        self.iterations = iterations
        self.min = min
        self.max = max
        self.mean = mean
        self.p99 = p99
        self.p95 = p95
        self.p90 = p90
        self.p75 = p75
        self.p50 = p50

    def to_dict(self):
        return {
            "iterations": self.iterations,
            "min": self.min,
            "max": self.max,
            "mean": self.mean,
            "p99": self.p99,
            "p95": self.p95,
            "p90": self.p90,
            "p75": self.p75,
            "p50": self.p50,
        }


class Percentages:
    def __init__(
        self,
        numOfQueries: int = 0,
        writePerc: int = 0,
        readPerc: int = 0,
        updatePerc: int = 0,
        analyticalPerc: int = 0,
        queryPerc: int = 0,
    ) -> None:
        self.numOfQueries = numOfQueries
        self.writePerc = writePerc
        self.readPerc = readPerc
        self.updatePerc = updatePerc
        self.analyticalPerc = analyticalPerc
        self.queryPerc = queryPerc

    def to_dict(self):
        return {
            "numOfQueries": self.numOfQueries,
            "writePerc": self.writePerc,
            "readPerc": self.readPerc,
            "updatePerc": self.updatePerc,
            "analyticalPerc": self.analyticalPerc,
            "queryPerc": self.queryPerc,
        }

    def get_string(self, separator="_") -> str:
        return f"{separator}{self.numOfQueries}"\
                f"{separator}{self.writePerc}"\
                f"{separator}{self.readPerc}"\
                f"{separator}{self.updatePerc}"\
                f"{separator}{self.analyticalPerc}"\
                f"{separator}{self.queryPerc}"


class Database:
    def __init__(
        self,
        cpu: int = 0,
        memory: int = 0,
    ) -> None:
        self.cpu = cpu
        self.memory = memory

    def to_dict(self) -> Dict:
        return {
            "cpu": self.cpu,
            "memory": self.memory,
        }


class Stats:
    def __init__(
        self,
        executedQueries: int = 0,
        duration: float = 0,
        numWorkers: int = 0,
        retries: int = 0,
        throughput: float = 0,
        database: Database = Database(),
    ) -> None:
        self.executedQueries = executedQueries
        self.duration = duration
        self.numWorkers = numWorkers
        self.retries = retries
        self.throughput = throughput
        self.database = database

    def to_dict(self):
        return {
            "executedQueries": self.executedQueries,
            "duration": self.duration,
            "numWorkers": self.numWorkers,
            "retries": self.retries,
            "throughput": self.throughput,
            "database": self.database.to_dict(),
        }


class StatsWithQuery(Stats):
    def __init__(
            self,
            executedQueries: int = 0,
            duration: float = 0,
            numWorkers: int = 0,
            retries: int = 0,
            throughput: float = 0,
            database: Database = Database(),
            queryStatistics: QueryStatistics = QueryStatistics()) -> None:
        super().__init__(
            executedQueries,
            duration,
            numWorkers,
            retries,
            throughput,
            database
        )

        self.queryStatistics = queryStatistics

    def to_dict(self):
        result = super().to_dict()
        result["queryStatistics"] = self.queryStatistics.to_dict()
        return result


class Query:
    def __init__(
        self,
        name: str = "",
        category: QueryCategory = QueryCategory.NONE
    ) -> None:
        self.name = name
        self.category = category

    def to_dict(self):
        return {
            "name": self.name,
            "category": self.category.value
        }


class QueryMixed(Query):
    def __init__(
        self,
        name: str = "",
        category: QueryCategory = QueryCategory.NONE,
        stats: Stats = Stats()
    ) -> None:
        super().__init__(name=name, category=category)
        self.stats = stats

    def to_dict(self):
        result = super().to_dict()
        result["stats"] = self.stats.to_dict()
        return result


class QueryIsolated(Query):
    def __init__(
        self,
        name: str = "",
        category: QueryCategory = QueryCategory.NONE,
        stats: StatsWithQuery = StatsWithQuery()
    ) -> None:
        super().__init__(name=name, category=category)
        self.stats = stats

    def to_dict(self):
        result = super().to_dict()
        result["stats"] = self.stats.to_dict()
        return result


class Workload:
    def __init__(self, workloadType: WorkloadType = WorkloadType.NONE) -> None:
        self.workloadType = workloadType

    def to_dict(self):
        return {
            "workloadType": self.workloadType.value
        }


class WorkloadIsolated(Workload):
    def __init__(
        self,
        queries: List[QueryIsolated] = []
    ) -> None:
        super().__init__(workloadType=WorkloadType.ISOLATED)
        self.queries = queries

    def to_dict(self):
        result = super().to_dict()
        result["queries"] = [query.to_dict() for query in self.queries]
        return result


class WorkloadMixed(Workload):
    def __init__(
        self,
        queries: List[QueryMixed] = [],
        percentages: Percentages = Percentages()
    ) -> None:
        super().__init__(workloadType=WorkloadType.MIXED)
        self.queries = queries
        self.percentages = percentages

    def to_dict(self):
        result = super().to_dict()
        result["queries"] = [query.to_dict() for query in self.queries]
        result["percentages"] = self.percentages.to_dict()
        return result


class WorkloadRealistic(Workload):
    def __init__(
        self,
        percentages: Percentages = Percentages(),
        stats=Stats()
    ) -> None:
        super().__init__(workloadType=WorkloadType.REALISTIC)
        self.percentages = percentages
        self.stats = stats

    def to_dict(self):
        result = super().to_dict()
        result["percentages"] = self.percentages.to_dict()
        result["stats"] = self.stats.to_dict()
        return result


class Dataset:
    def __init__(
        self,
        name: str = "",
        size: DatasetSize = DatasetSize.NONE,
        workloads: List[Workload] = []
    ) -> None:
        self.name = name
        self.size = size
        self.workloads = workloads

    def to_dict(self):
        return {
            "name": self.name,
            "size": self.size.value,
            "workloads": [workload.to_dict() for workload in self.workloads]
        }


class RunConfig:
    def __init__(
        self,
        vendor: RunConfigVendor = RunConfigVendor.NONE,
        condition: RunConfigCondition = RunConfigCondition.NONE,
        platform = None,
        numberWorkers: int = 0,
    ) -> None:
        self.vendor = vendor
        self.condition = condition
        self.platform = platform
        self.numberWorkers = numberWorkers

    def to_dict(self):
        return {
            "vendor": self.vendor.value,
            "condition": self.condition.value,
            "platform": self.platform,
            "numberWorkers": self.numberWorkers,
        }


class Benchmark:
    def __init__(
        self,
        runConfig: RunConfig = RunConfig(),
        datasets: List[Dataset] = [],
    ) -> None:
        self.runConfig = runConfig
        self.datasets = datasets

    def to_dict(self):
        return {
            "runConfig": self.runConfig.to_dict(),
            "datasets": [dataset.to_dict() for dataset in self.datasets]
        }


class TranslateJson:
    @staticmethod
    def translate(
        source: str,
        destination: str
    ) -> {}:
        benchmark = None
        if os.path.exists(source):
            benchmark = TranslateJson._read_json(source=source)
            return benchmark.to_dict()
        #     if benchmark:
        #         TranslateJson._write_to_json(
        #             benchmark=benchmark, destination=destination)
        #     else:
        #         print("Conversion failed.")
        # else:
        #     print (f"Source file on path {source} not found")

    def _write_to_json(
        benchmark: Benchmark,
        destination: str
    ) -> None:
        
        os.makedirs(os.path.dirname(destination), exist_ok=True)
        with open(destination, "w") as f:
            f.write(json.dumps(benchmark.to_dict(), indent=4))

    @staticmethod
    def _read_json(
        source: str
    ) -> Benchmark:
        data = None
        with open(source) as f:
            data = json.load(f)

        runConfig, workloadType, percentages = TranslateJson._process_run_config(
            data[RUN_CONFIGURATION_KEY])

        for key, value in data.items():
            # key - run_configuration, pokec, ...
            print(f"1. {key}")
            if key != RUN_CONFIGURATION_KEY:
                datasets = TranslateJson._process_datasets(
                    key=key,
                    values=value,
                    workloadType=workloadType,
                    percentages=percentages
                )

        return Benchmark(runConfig=runConfig, datasets=datasets)

    @staticmethod
    def _process_run_config(
        value: Dict[str, Any]
    ) -> Tuple[RunConfig, WorkloadType, Percentages]:
        runConfig = RunConfig(
            condition=StrToEnum(RunConfigCondition, value["condition"]),
            vendor=StrToEnum(RunConfigVendor, value["vendor"]),
            platform=value["platform"],
            numberWorkers=value["num_workers_for_benchmark"],
        )
        workloadType: WorkloadType = StrToEnum(WorkloadType, value["benchmark_mode"])

        percentages: Percentages = Percentages(
            numOfQueries=value["benchmark_mode_config"][0],
            writePerc=value["benchmark_mode_config"][1],
            readPerc=value["benchmark_mode_config"][2],
            updatePerc=value["benchmark_mode_config"][3],
            analyticalPerc=value["benchmark_mode_config"][4],
        ) if workloadType in [WorkloadType.REALISTIC, WorkloadType.MIXED] else None

        if workloadType == WorkloadType.MIXED:
            percentages.queryPerc = value["benchmark_mode_config"][5]

        return runConfig, workloadType, percentages

    @staticmethod
    def _process_datasets(
        key: str,
        values: Dict[str, Any],
        workloadType: WorkloadType,
        percentages: Percentages
    ) -> List[Dataset]:
        result: List[Dataset] = []
        for value_key, workload_collection in values.items():
            # value_key - small, medium, large, ...
            print(f"2. {value_key}")
            workloads = TranslateJson._process_workloads(
                workloads=workload_collection,
                workloadType=workloadType,
                percentages=percentages
            )
            result.append(
                Dataset(
                    name=key,
                    size=StrToEnum(DatasetSize, value_key),
                    workloads=workloads
                )
            )

        return result

    @staticmethod
    def _process_workloads(
        workloads: Dict[str, Any],
        workloadType: WorkloadType,
        percentages: Percentages
    ) -> List[Workload]:
        result: List[Workload] = []
        empty_database = 0
        imported_data = 0
        for key, item in workloads.items():
            # key - __import__, imported_data, empty_database, arango, ...
            # somewhere here we should save data from imported_data and empty_database -> maybe in workloads Dict
            
            if key == "__import__":
                continue
            
            if key == "empty_db":
                print(item)
                empty_database = item["database"]["memory"]
                print(f"empty_database: {empty_database}")
                continue
                
            if key == "imported_data":
                imported_data = item["database"]["memory"]
                print(f"imported_data: {imported_data}")
                continue

            print(f"3. {key}")
            workloads = []

            if workloadType == WorkloadType.ISOLATED:
                workloads.append(
                    WorkloadIsolated(
                        queries=TranslateJson._process_queries(
                            queries=item,
                            workloadType=workloadType,
                            percentagesString="",
                            empty_database=empty_database,
                            imported_data=imported_data
                        )
                    )
                )
            elif workloadType == WorkloadType.MIXED:
                workloads.append(
                    WorkloadMixed(
                        queries=TranslateJson._process_queries(
                            queries=item,
                            workloadType=workloadType,
                            percentagesString=percentages.get_string(),
                            empty_database=empty_database,
                            imported_data=imported_data
                        ),
                        percentages=percentages
                    )
                )
            elif workloadType == WorkloadType.REALISTIC:
                for _, value in item.items():
                    workloads.append(
                        WorkloadRealistic(
                            percentages=percentages,
                            stats=TranslateJson._process_stats(value["without_fine_grained_authorization"], False, empty_database, imported_data)
                        )
                    )
            else:
                raise Exception("WorkloadType in workload cannot be None")

            result.extend(workloads)

        return result

    @staticmethod
    def _process_queries(
        queries: Dict[str, Any],
        workloadType: WorkloadType,
        percentagesString: str,
        empty_database: int,
        imported_data: int
    ) -> List[Query]:
        result: List[Query] = []
        for key, query in queries.items():
            print(f"4. {key}")
            result.append(
                TranslateJson._process_query(
                    composite_name=key,
                    query=query,
                    workloadType=workloadType,
                    percentagesString=percentagesString,
                    empty_database=empty_database,
                    imported_data=imported_data
                )
            )

        return result

    @staticmethod
    def _process_query(
        composite_name: str,
        query: Dict[str, Any],
        workloadType: WorkloadType,
        percentagesString: str,
        empty_database: int,
        imported_data: int
    ) -> Query:
        tempList = composite_name.replace(percentagesString, "").split("_")
        name = "_".join(tempList[:-1])
        category = StrToEnum(QueryCategory, tempList[-1])
        if workloadType == WorkloadType.MIXED:
            return QueryMixed(
                name=name,
                category=category,
                stats=TranslateJson._process_stats(
                    stats=query["without_fine_grained_authorization"],
                    withQuery=False,
                    empty_database=empty_database,
                    imported_data=imported_data
                )
            )
        elif workloadType == WorkloadType.ISOLATED:
            return QueryIsolated(
                name=name,
                category=category,
                stats=TranslateJson._process_stats(
                    stats=query["without_fine_grained_authorization"],
                    withQuery=True,
                    empty_database=empty_database,
                    imported_data=imported_data
                )
            )

        raise Exception("WorkloadType in query cannot be None")

    @staticmethod
    def _process_stats(
        stats: str,
        withQuery: bool,
        empty_database: int,
        imported_data: int
    ) -> Stats:

        result = StatsWithQuery(
            queryStatistics=TranslateJson._get_stats_query_statistics(
                stats["latency_stats"]
            )
        ) if withQuery else Stats()

        result.database = TranslateJson._get_stats_database(
            stats.get("database", {}), empty_database, imported_data)
        result.duration = stats["duration"]
        result.executedQueries = stats["count"]
        result.numWorkers = stats["num_workers"]
        result.retries = stats["retries"]
        result.throughput = stats["throughput"]

        return result

    @staticmethod
    def _get_stats_query_statistics(query_statistics) -> QueryStatistics:
        result = QueryStatistics()

        if len(query_statistics) != 0:
            result.iterations = query_statistics["iterations"]
            result.max = query_statistics["max"]
            result.min = query_statistics["min"]
            result.mean = query_statistics["mean"]
            result.p50 = query_statistics["p50"]
            result.p90 = query_statistics["p90"]
            result.p95 = query_statistics["p95"]
            result.p99 = query_statistics["p99"]

        return result

    @staticmethod
    def _get_stats_database(database, empty_database, imported_data) -> Database:
        return Database(
            cpu=database.get("cpu", 0),
            memory=database.get("memory", 0) + empty_database + imported_data
        )
