import { Abi } from "viem";

export const EVIDENZ_ISSUERS_ABI: Abi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
      { indexed: true, internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "address", name: "account", type: "address" }],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "address", name: "account", type: "address" }],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "_address", type: "address" },
      { internalType: "uint256", name: "_issuerID", type: "uint256" },
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_legalReference", type: "string" },
      { internalType: "string", name: "_intentDeclaration", type: "string" },
      { internalType: "string", name: "_host", type: "string" },
      { internalType: "string", name: "_kybHash", type: "string" },
    ],
    name: "addIssuer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_address", type: "address" },
      { internalType: "uint256", name: "_validatorID", type: "uint256" },
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_website", type: "string" },
      { internalType: "string", name: "_legalReference", type: "string" },
      { internalType: "string", name: "_kybHash", type: "string" },
      { internalType: "string", name: "_logoURL", type: "string" },
    ],
    name: "addValidator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_issuerID", type: "uint256" },
      { internalType: "uint256", name: "_blockNumber", type: "uint256" },
    ],
    name: "cancelIssuer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_issuerID", type: "uint256" }],
    name: "cancelIssuerNow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_validatorID", type: "uint256" },
      { internalType: "uint256", name: "_blockNumber", type: "uint256" },
    ],
    name: "cancelValidator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_validatorID", type: "uint256" }],
    name: "cancelValidatorNow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_issuerID", type: "uint256" },
      { internalType: "address", name: "_newAddress", type: "address" },
    ],
    name: "changeAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "issuers",
    outputs: [
      { internalType: "uint256", name: "validatorID", type: "uint256" },
      { internalType: "address", name: "issuerAddress", type: "address" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "legalReference", type: "string" },
      { internalType: "string", name: "intentDeclaration", type: "string" },
      { internalType: "string", name: "host", type: "string" },
      { internalType: "string", name: "kybHash", type: "string" },
      { internalType: "uint256", name: "issuerID", type: "uint256" },
      { internalType: "uint256", name: "lastBlockValidity", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "issuersCounter",
    outputs: [{ internalType: "uint256", name: "_value", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "issuersIDList",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "issuersaddress",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_issuerID", type: "uint256" }],
    name: "pastAddresses",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "pause", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "renounceOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { inputs: [], name: "unpause", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [
      { internalType: "uint256", name: "_issuerID", type: "uint256" },
      { internalType: "string", name: "_newIssuerName", type: "string" },
      { internalType: "string", name: "_newIntentDeclaration", type: "string" },
      { internalType: "string", name: "_newLegalReference", type: "string" },
      { internalType: "string", name: "_newHost", type: "string" },
      { internalType: "string", name: "_newKybHash", type: "string" },
    ],
    name: "updateIssuerParams",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_validatorID", type: "uint256" },
      { internalType: "string", name: "_newName", type: "string" },
      { internalType: "string", name: "_webSite", type: "string" },
      { internalType: "string", name: "_newLegalReference", type: "string" },
      { internalType: "string", name: "_newKybHash", type: "string" },
      { internalType: "string", name: "_newLogoURL", type: "string" },
    ],
    name: "updateValidatorParams",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_issuerID", type: "uint256" }],
    name: "validate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "validatoraddress",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "validators",
    outputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "address", name: "validatorAddress", type: "address" },
      { internalType: "string", name: "legalReference", type: "string" },
      { internalType: "string", name: "kybHash", type: "string" },
      { internalType: "string", name: "webSite", type: "string" },
      { internalType: "string", name: "logoURL", type: "string" },
      { internalType: "uint256", name: "validatorID", type: "uint256" },
      { internalType: "uint256", name: "lastBlockValidity", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "validatorsCounter",
    outputs: [{ internalType: "uint256", name: "_value", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "validatorsIDList",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const EVIDENZ_STORAGE_ABI: Abi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
      { indexed: true, internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "address", name: "account", type: "address" }],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "address", name: "account", type: "address" }],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "_issuerAddress", type: "address" },
      { internalType: "string", name: "_templateId", type: "string" },
      { internalType: "string", name: "_meta", type: "string" },
      { internalType: "string", name: "_template", type: "string" },
    ],
    name: "addTemplate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_issuerAddress", type: "address" }],
    name: "getNbBytesUsedByIssuer",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_issuerAddress", type: "address" },
      { internalType: "string", name: "_templateId", type: "string" },
    ],
    name: "getTemplateAsJson",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_issuerAddress", type: "address" },
      { internalType: "string", name: "_templateId", type: "string" },
    ],
    name: "getTemplateBlockValidity",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_issuerAddress", type: "address" },
      { internalType: "string", name: "_templateId", type: "string" },
    ],
    name: "getTemplateMeta",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_issuerAddress", type: "address" },
      { internalType: "string", name: "_templateId", type: "string" },
    ],
    name: "getTemplateTemplate",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_issuerAddress", type: "address" },
      { internalType: "string", name: "_templateId", type: "string" },
    ],
    name: "isTemplateValid",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_issuerAddress", type: "address" },
      { internalType: "string", name: "_templateId", type: "string" },
      { internalType: "bytes", name: "_data", type: "bytes" },
    ],
    name: "publishData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { inputs: [], name: "renounceOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [
      { internalType: "address", name: "_issuerAddress", type: "address" },
      { internalType: "string", name: "_templateId", type: "string" },
    ],
    name: "templateExists",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_issuerAddress", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "updateNbBytesUsedByIssuer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_issuerAddress", type: "address" },
      { internalType: "string", name: "_templateId", type: "string" },
      { internalType: "uint256", name: "_newBlockValidity", type: "uint256" },
    ],
    name: "updateTemplateBlockValidity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_issuerAddress", type: "address" },
      { internalType: "string", name: "_templateId", type: "string" },
      { internalType: "string", name: "_meta", type: "string" },
    ],
    name: "updateTemplateMeta",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_issuerAddress", type: "address" },
      { internalType: "string", name: "_templateId", type: "string" },
      { internalType: "string", name: "_template", type: "string" },
    ],
    name: "updateTemplateTemplate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// Maps preset option value → ABI. Issuers share one ABI, Storage another.
export const PRESET_ABIS: Record<string, Abi> = {
  "d-is-gno": EVIDENZ_ISSUERS_ABI,
  "s-is-gno": EVIDENZ_ISSUERS_ABI,
  "p-is-gno": EVIDENZ_ISSUERS_ABI,
  "d-st-fuji": EVIDENZ_STORAGE_ABI,
  "d-st-bsct": EVIDENZ_STORAGE_ABI,
  "s-st-fuji": EVIDENZ_STORAGE_ABI,
  "s-st-bsct": EVIDENZ_STORAGE_ABI,
  "p-st-avax": EVIDENZ_STORAGE_ABI,
  "p-st-bsc": EVIDENZ_STORAGE_ABI,
  "p-st-gno": EVIDENZ_STORAGE_ABI,
};

// Maps "address:chainId" (lowercase) → human-readable label for Contract Overview.
export const PRESET_LABEL_BY_ADDRESS: Record<string, string> = {
  "0xff3c86478a2e97969b7e33970102d7f5043b4447:100": "EvidenZIssuers — Gnosis [Demo]",
  "0x52133d1d361aed29434c58433346f3fd234374ee:100": "EvidenZIssuers — Gnosis [Staging]",
  "0x09016ef58b53510b40835e1f4938ee74bb167e05:100": "EvidenZIssuers — Gnosis [Prod]",
  "0x5bc445bbb32f75b9b09b68413d2042d3b87bef8a:43113": "EvidenZStorage — Fuji [Demo]",
  "0xaaeeb4e9160d02137b1e1766666f5f06400345cf:97": "EvidenZStorage — BSC Testnet [Demo]",
  "0xeda530fd0539acf9c86be0b3a34cee5851af3503:43113": "EvidenZStorage — Fuji [Staging]",
  "0xeecd1504879b31e9ec75fcc720adbd723fc5d2b4:97": "EvidenZStorage — BSC Testnet [Staging]",
  "0x5bc445bbb32f75b9b09b68413d2042d3b87bef8a:43114": "EvidenZStorage — Avalanche [Prod]",
  "0x2e13439bacf550b0753699f6811405c0100c7f28:56": "EvidenZStorage — BSC [Prod]",
  "0x2e9e949f19d068b8f6be46136e496f7cdbf5f4ba:100": "EvidenZStorage — Gnosis [Prod]",
};

// Maps "address:chainId" (lowercase) → ABI for direct URL access.
export const PRESET_ABI_BY_ADDRESS: Record<string, Abi> = {
  // EvidenZIssuers
  "0xff3c86478a2e97969b7e33970102d7f5043b4447:100": EVIDENZ_ISSUERS_ABI, // Demo / Gnosis
  "0x52133d1d361aed29434c58433346f3fd234374ee:100": EVIDENZ_ISSUERS_ABI, // Staging / Gnosis
  "0x09016ef58b53510b40835e1f4938ee74bb167e05:100": EVIDENZ_ISSUERS_ABI, // Prod / Gnosis
  // EvidenZStorage
  "0x5bc445bbb32f75b9b09b68413d2042d3b87bef8a:43113": EVIDENZ_STORAGE_ABI, // Demo / Fuji
  "0xaaeeb4e9160d02137b1e1766666f5f06400345cf:97": EVIDENZ_STORAGE_ABI, // Demo / BSC Testnet
  "0xeda530fd0539acf9c86be0b3a34cee5851af3503:43113": EVIDENZ_STORAGE_ABI, // Staging / Fuji
  "0xeecd1504879b31e9ec75fcc720adbd723fc5d2b4:97": EVIDENZ_STORAGE_ABI, // Staging / BSC Testnet
  "0x5bc445bbb32f75b9b09b68413d2042d3b87bef8a:43114": EVIDENZ_STORAGE_ABI, // Prod / Avalanche
  "0x2e13439bacf550b0753699f6811405c0100c7f28:56": EVIDENZ_STORAGE_ABI, // Prod / BSC
  "0x2e9e949f19d068b8f6be46136e496f7cdbf5f4ba:100": EVIDENZ_STORAGE_ABI, // Prod / Gnosis
};
