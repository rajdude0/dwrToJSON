# dwrToJSON
Converts DWR Serialized String into JS Object. 

## Usage

### dwr_deserialize(String)
Takes a String and returns an Object. 

```javascript
const { dwr_deserialize } = require('dwrtojson')

dwr_serialized_blob = `......`

const dwrObject = dwr_deserialize(dwr_serialized_blob)

```
