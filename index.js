 const dwr_deserialize = (dwrString) => {
  const refMap = createRefMap(dwrString);
  const sortedKeys = Object.keys(refMap).sort();
  const dwrObject = sortedKeys.reduce((acc, curr, i) => {
    acc[curr] = recursiveParse(refMap[curr], refMap);
    return acc;
  }, {});
  return dwrToJS(dwrObject);
}



const dwrToJS = (dwrObject) => {
  return Object.entries(dwrObject).reduce((acc, [key, value], i) => {
    if (key.includes("-")) {
      let [, newKey] = key.split("-");
      if (!newKey.startsWith("e")) {
        acc[newKey] = value;
      }
      return acc;
    }
    acc[key] = value;
    return acc;
  }, {});
}

const createRefMap = (dwrString) => {
  const allVars = dwrString.split("\n");
  return allVars.reduce((acc, curr, i) => {
    const [key, value] = curr.split("=");
    acc[key] = value;
    return acc;
  }, {});
}

const splitValueType = (value = "") => {
  let [type, returnValue] = splitAtFirstOccurenceOf(value, ":");

  let returnType = "string"
  switch (type) {
    case "string":
    case "boolean":
    case "number":
    case "array":
    case "reference":
      returnType = type;
      break;
    case "Object_Object":
      returnType = "object";
      break;
    default: // when the type is defined as value in case of global non dwr variables
      returnValue = type;
      break;
  }

  return [returnType, returnValue];
}


const removeObjectArrayBraces = (value = "") => value.replace(/^(\{|\[)(.*)(\}|\])$/, '$2');

const splitAtFirstOccurenceOf = (str, character) => {
  const firstColonIndex = str.indexOf(character);
  if (firstColonIndex < 0) {
    return [str, null];
  }
  const key = str.substring(0, firstColonIndex);
  const value = str.substring(firstColonIndex + 1, str.length);
  return [key, value]
}

const parseNumber = (value) => Number.parseInt(value);

const parseString = (value) => {
  return decodeURIComponent(`${value}`).trim();
}
const parseBoolen = (value) => value === "true" ? true : false;

const parseArray = (value, refMap) => {
  const bracesRemoved = removeObjectArrayBraces(value);
  if (!bracesRemoved) return [];
  const refsInArray = bracesRemoved.split(",");
  return refsInArray.map(refs => recursiveParse(refs, refMap))
}

const parseObject = (value, refMap) => {
  const bracesRemoved = removeObjectArrayBraces(value);
  if (!bracesRemoved) return {};
  const refsInObject = bracesRemoved.split(",");
  return refsInObject.reduce((acc, curr, i) => {
    const [key, value] = splitAtFirstOccurenceOf(curr, ":")
    acc[parseString(key)] = recursiveParse(value, refMap);
    return acc;
  }, {});
}

const recursiveParse = (value, refMap) => {
  const [valueType, valueData] = splitValueType(value);
  let parsed = null;
  switch (valueType) {
    case "number":
      parsed = parseNumber(valueData);
      break;
    case "string":
      parsed = parseString(valueData);
      break;
    case "boolean":
      parsed = parseBoolen(valueData);
      break;
    case "array":
      parsed = parseArray(valueData, refMap);
      break;
    case "object":
      parsed = parseObject(valueData, refMap);
      break;
    case "reference":
      parsed = recursiveParse(refMap[valueData], refMap);
      break;
    default:
      parsed = parseString(valueData);
      break;
  }
  return parsed;
}

module.exports = {
  dwr_deserialize
}

//console.log(JSON.stringify(dwr_deserialize("callCount=1\nc0-scriptName=CommonPollerProxy\nc0-methodName=doPoll\nc0-id=0\nc0-e1=string:DataExplorer_7a1e535f-0944-4ee2-9aa5-ac70fd1883ed%7C0_ccf391e2_GQL_getData\nc0-e4=string:RumTask\nc0-e5=string:getMetricsKeyData\nc0-e11=string:FirstInputDelay\nc0-e12=string:ccf391e2\nc0-e13=string:1704668400000%3AFirstInputDelay%7C3072089\nc0-e15=number:100\nc0-e16=number:300\nc0-e14=array:[reference:c0-e15,reference:c0-e16]\nc0-e17=boolean:true\nc0-e18=boolean:false\nc0-e19=boolean:false\nc0-e20=boolean:false\nc0-e21=boolean:false\nc0-e22=boolean:false\nc0-e10=Object_Object:{id:reference:c0-e11, uuid:reference:c0-e12, cursor:reference:c0-e13, performanceBarRanges:reference:c0-e14, value:reference:c0-e17, beaconCount:reference:c0-e18, p95:reference:c0-e19, p98:reference:c0-e20, moe:reference:c0-e21, history:reference:c0-e22}\nc0-e9=array:[reference:c0-e10]\nc0-e24=boolean:true\nc0-e27=string:mPulse%20Domain\nc0-e28=string:1\nc0-e30=string:mPulse%20Demo\nc0-e29=array:[reference:c0-e30]\nc0-e31=string:Is\nc0-e32=string:\nc0-e33=string:\nc0-e26=Object_Object:{attribute:reference:c0-e27, value:reference:c0-e28, nameList:reference:c0-e29, comparator:reference:c0-e31, secondaryValue:reference:c0-e32, tertiaryValue:reference:c0-e33}\nc0-e35=string:Date%2FTime\nc0-e36=null:null\nc0-e37=null:null\nc0-e38=string:14\nc0-e39=string:\nc0-e40=string:Europe%2FBerlin\nc0-e34=Object_Object:{attribute:reference:c0-e35, value:reference:c0-e36, valueList:reference:c0-e37, comparator:reference:c0-e38, secondaryValue:reference:c0-e39, tertiaryValue:reference:c0-e40}\nc0-e42=string:Percentile\nc0-e43=string:75\nc0-e44=null:null\nc0-e45=string:Is\nc0-e46=string:\nc0-e47=string:\nc0-e41=Object_Object:{attribute:reference:c0-e42, value:reference:c0-e43, valueList:reference:c0-e44, comparator:reference:c0-e45, secondaryValue:reference:c0-e46, tertiaryValue:reference:c0-e47}\nc0-e25=array:[reference:c0-e26,reference:c0-e34,reference:c0-e41]\nc0-e23=Object_Object:{enabled:reference:c0-e24, criteria:reference:c0-e25}\nc0-e8=Object_Object:{widgets:reference:c0-e9, widgetFilter:reference:c0-e23}\nc0-e7=Object_Object:{rumMetricsKeyDataRequestBean:reference:c0-e8}\nc0-e6=array:[reference:c0-e7]\nc0-e48=string:ccf391e2___5___-2___%7B%22cursor%22%3A%221704668400000%3AFirstInputDelay%7C3072089%22%2C%22dimensions%22%3A%5B112%5D%2C%22timeZone%22%3A%22Europe%2FBerlin%22%7D\nc0-e3=Object_Object:{taskName:reference:c0-e4, methodName:reference:c0-e5, methodArgs:reference:c0-e6, callbackUUID:reference:c0-e48}\nc0-e2=array:[reference:c0-e3]\nc0-param0=Object_Object:{pollerUUID:reference:c0-e1, methodRequests:reference:c0-e2}\nscriptSessionId=kQzQHH0DuuzL9uYpaAbxMEQwOVV~KCMkkIo/kQzQHH0DuuzL9uYpaAbxMEQwOVV~KCMkkIo/local.soasta.com%3A9000%2F%2FmPulseUI\npage=local.soasta.com%3A9000%2F%2FmPulseUI\nwindowName=\nbatchId=77\ninstanceId=1\npartialResponse=0"), null, 2));
