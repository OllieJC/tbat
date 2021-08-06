# tbat
Threat Box Assessment Tool (tbat) is a tool for analysing different threat actors. 

The [cti-generator](cti-generator) Python code loads the STIX data from [mitre/cti] and produces JSON files.
JavaScript code loads the JSON files and allows creating a report of different threat actors, their TTPs and different mitigations.

## Features
- Uses [mitre/cti] for threat intelligence
- Supports multiple languages (only English implemented right now)
- Entirely client-side
- YAML to load/export analysis
- Outputs weighted or scored TTPs (tactics, techniques and procedures) and related mitigations
- Implements [Andy Piazza](https://klrgrz.medium.com/)'s Threat Box method (find out more on their [Quantifying Threat Actors with Threat Box](https://klrgrz.medium.com/quantifying-threat-actors-with-threat-box-e6b641109b11) article)
- (see [GitHub issues] to upvote or create feature requests)

## How to use?
1. (optional) enter project details on the "Product" page
2. (optional) import threat actors from the "Threat Actor Library"
3. edit actors on the "Threat Actors" page to set the intent, willingness, capability, and novelty values
4. view the "Report" page
5. export YAML (here's an example: [itco-example.yaml](/test/fixtures/itco-example.yaml) - this example loosely copies one from [Andy's SANS Whitepaper](https://www.sans.org/white-papers/39585/))

## Contributing
Use [GitHub issues] to raise feature requests or talk through a change before making any pull requests.

Check the existing issues and upvote and issue using the thumbs up reaction. 


[mitre/cti]: https://github.com/mitre/cti
[GitHub issues]: https://github.com/OllieJC/tbat/issues
