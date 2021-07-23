import json

from stix2 import FileSystemSource, Filter
from stix2.utils import get_type_from_id

# create FileSystemSource
fs_source = FileSystemSource("../cti/enterprise-attack")


rels = fs_source.query(Filter("type", "=", "relationship"))

isets = fs_source.query(Filter("type", "=", "intrusion-set"))
groups = []
for iset in isets:
    z = dict(iset).copy()
    z["attack-patterns"] = []

    for rel in rels:
        if (
            get_type_from_id(rel.source_ref) == "intrusion-set"
            and get_type_from_id(rel.target_ref) == "attack-pattern"
            and iset.id == rel.source_ref
        ):
            z["attack-patterns"].append(dict(rel))

    groups.append(z)

# TODO: techniques!

print(len(groups))
print(json.dumps(groups[0], indent=2, default=str))
