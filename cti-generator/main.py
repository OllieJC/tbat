import json
import markdown

from collections import OrderedDict
from stix2 import FileSystemSource, Filter
from stix2.utils import get_type_from_id


def writefile(filename: str, data: dict):
    with open(f"../cti/{filename}.json", "w", encoding="utf-8") as f:
        json.dump(data, f, default=str)


# create FileSystemSource
fs_source = FileSystemSource("../../cti/enterprise-attack")

rels = fs_source.query(Filter("type", "=", "relationship"))
isets = fs_source.query(
    [Filter("type", "=", "intrusion-set"), Filter("revoked", "=", False)]
)
aps = fs_source.query(
    [Filter("type", "=", "attack-pattern"), Filter("revoked", "=", False)]
)
coas = fs_source.query(
    [Filter("type", "=", "course-of-action"), Filter("revoked", "=", False)]
)

# Mitigations

mitigations = {}
for coa in coas:
    mitigation = {}

    if "x_mitre_deprecated" in coa and coa["x_mitre_deprecated"] == True:
        continue

    if "name" in coa:
        mitigation["name"] = coa["name"]

    if "description" in coa:
        mitigation["description"] = coa["description"]

    if "external_references" in coa:
        for er in coa["external_references"]:
            if er["source_name"] == "mitre-attack":
                mitigation["link"] = er["url"]
                mitigation["external_id"] = er["external_id"]
                break

    if "external_id" in mitigation:
        mitigations[coa["id"].replace("course-of-action--", "")] = mitigation

# exit()

writefile("mitigations", mitigations)

# Tactics, techniques and procedures

ttps_external_ids = {}
ttps = {}
for ap in aps:
    ttp = {}

    if "x_mitre_deprecated" in ap and ap["x_mitre_deprecated"] == True:
        continue

    if "name" in ap:
        ttp["name"] = ap["name"]

    if "description" in ap:
        ttp["description"] = ap["description"]

    if "external_references" in ap:
        for er in ap["external_references"]:
            if er["source_name"] == "mitre-attack":
                ttp["link"] = er["url"]
                ttp["external_id"] = er["external_id"]
                break

    if "kill_chain_phases" in ap:
        for kcp in ap["kill_chain_phases"]:
            if kcp["kill_chain_name"] == "mitre-attack":
                ttp["kill_chain_phase"] = kcp["phase_name"]
                break

    if "external_id" in ttp:
        ttps[ttp["external_id"]] = ttp
        ttps_external_ids[ap["id"]] = ttp["external_id"]

    ttp["mitigations"] = []
    for rel in rels:
        if (
            rel.source_ref.startswith("course-of-action")
            and rel.target_ref.startswith("attack-pattern")
            and rel.target_ref == ap["id"]
        ):
            ttp["mitigations"].append(rel.source_ref.replace("course-of-action--", ""))

writefile("ttps", OrderedDict(sorted(ttps.items())))

# Threat groups

groups = {}
for iset in isets:
    z = {}

    if "x_mitre_deprecated" in iset and iset["x_mitre_deprecated"] == True:
        continue

    for i in ["created", "modified", "description"]:
        if i in iset:
            if type(iset[i]) == str:
                z[i] = markdown.markdown(iset[i])
            else:
                z[i] = iset[i]
        else:
            z[i] = None

    if "aliases" in iset:
        z["aliases"] = iset["aliases"]
    else:
        z["aliases"] = []

    z["link"] = None
    if "external_references" in iset:
        for er in iset["external_references"]:
            if er["source_name"] == "mitre-attack":
                z["link"] = er["url"]
                break

    z["attack-patterns"] = []

    for rel in rels:
        if (
            rel.source_ref.startswith("intrusion-set")
            and rel.target_ref.startswith("attack-pattern")
            and iset.id == rel.source_ref
        ):
            if rel.target_ref in ttps_external_ids:
                z["attack-patterns"].append(ttps_external_ids[rel.target_ref])

    groups[iset["name"]] = z

writefile("groups", OrderedDict(sorted(groups.items())))

# Debug

print(len(groups))
print(len(ttps))
print(len(mitigations))
