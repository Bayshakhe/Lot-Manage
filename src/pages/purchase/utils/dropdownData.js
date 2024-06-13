const unitDropdown = [
  {
    conversionFactor: 0,
    value: "6639b84f5b8e534fa8da6d40",
    label: "Gram",
    status: "ACTIVE",
  },
  {
    baseUnit: "6639b84f5b8e534fa8da6d40",
    conversionFactor: 1000,
    value: "6639b8485b8e534fa8da6d3c",
    label: "KG",
    status: "ACTIVE",
  },
];

const lotDropdown = [
  {
    product: "666430c1b4cf3984f60df248",
    value: "66654b55694aa4acb0a935c3",
    label: "L--10001-1013",
    purchasePrice: {
      "6639b8485b8e534fa8da6d3c": 100,
      "6639b84f5b8e534fa8da6d40": 2,
    },
    processingPrice: {
      "6639b8485b8e534fa8da6d3c": 250,
      "6639b84f5b8e534fa8da6d40": 2.5,
    },
    salePrice: {
      "6639b84f5b8e534fa8da6d40": 0,
      "6639b8485b8e534fa8da6d3c": 0,
    },
  },
  {
    product: "666430c1b4cf3984f60df248",
    value: "666430c1b4cf3984f60df24f",
    label: "L--10001-1012",
    purchasePrice: {
      "6639b84f5b8e534fa8da6d40": 2,
      "6639b8485b8e534fa8da6d3c": 200,
    },
    processingPrice: {
      "6639b8485b8e534fa8da6d3c": 250,
      "6639b84f5b8e534fa8da6d40": 2.5,
    },
    salePrice: {
      "6639b84f5b8e534fa8da6d40": 0,
      "6639b8485b8e534fa8da6d3c": 0,
    },
  },
];

// const productDropdown = [
//   {
//     value: "666430c1b4cf3984f60df248",
//     label: "Soyabin oil",
//     totalAvailable: {
//       "6639b84f5b8e534fa8da6d40": 0,
//       "6639b8485b8e534fa8da6d3c": 10,
//     },
//     purchasePrice: {
//       "6639b84f5b8e534fa8da6d40": 2,
//       "6639b8485b8e534fa8da6d3c": 200,
//     },
//     processingPrice: {
//       "6639b8485b8e534fa8da6d3c": 250,
//       "6639b84f5b8e534fa8da6d40": 2.5,
//     },
//     salePrice: {
//       "6639b84f5b8e534fa8da6d40": 0,
//       "6639b8485b8e534fa8da6d3c": 0,
//     },
//     code: "RPD--10001-1004-fefeefe",
//     status: "ACTIVE",
//     units: [
//       {
//         name: "KG",
//         value: "6639b8485b8e534fa8da6d3c",
//         baseUnit: "6639b84f5b8e534fa8da6d40",
//         conversionFactor: 1000,
//         quantity: 0,
//         selected: true,
//         salePrice: 0,
//         purchasePrice: 200,
//         damage: 0,
//         processingPrice: 250,
//         totalAvailable: 10,
//       },
//       {
//         name: "Gram",
//         value: "6639b84f5b8e534fa8da6d40",
//         conversionFactor: 0,
//         quantity: 0,
//         selected: false,
//         salePrice: 0,
//         purchasePrice: 2,
//         damage: 0,
//         processingPrice: 2.5,
//         totalAvailable: 0,
//       },
//     ],
//     prevLot: false,
//     discountPercentage: 0,
//     discount: 0,
//     taxPercentage: 0,
//     tax: 0,
//     subTotal: 0,
//     tempLotProducts: [
//       {
//         selected: true,
//       },
//       {
//         selected: true,
//       },
//     ],
//     selectLotProducts: [
//       {
//         units: [
//           {
//             quantity: 45,
//           },
//         ],
//       },
//       {
//         units: [
//           {
//             quantity: 39,
//           },
//         ],
//       },
//       {
//         product: "666430c1b4cf3984f60df248",
//         value: "66654b55694aa4acb0a935c3",
//         label: "L--10001-1013",
//         purchasePrice: {
//           "6639b8485b8e534fa8da6d3c": 100,
//           "6639b84f5b8e534fa8da6d40": 2,
//         },
//         processingPrice: {
//           "6639b8485b8e534fa8da6d3c": 250,
//           "6639b84f5b8e534fa8da6d40": 2.5,
//         },
//         salePrice: {
//           "6639b84f5b8e534fa8da6d40": 0,
//           "6639b8485b8e534fa8da6d3c": 0,
//         },
//         units: [
//           {
//             name: "KG",
//             value: "6639b8485b8e534fa8da6d3c",
//             baseUnit: "6639b84f5b8e534fa8da6d40",
//             conversionFactor: 1000,
//             quantity: 0,
//             salePrice: 0,
//             purchasePrice: 100,
//             damage: 0,
//             processingPrice: 250,
//           },
//           {
//             name: "Gram",
//             value: "6639b84f5b8e534fa8da6d40",
//             conversionFactor: 0,
//             quantity: 0,
//             salePrice: 0,
//             purchasePrice: 2,
//             damage: 0,
//             processingPrice: 2.5,
//           },
//         ],
//       },
//       {
//         product: "666430c1b4cf3984f60df248",
//         value: "666430c1b4cf3984f60df24f",
//         label: "L--10001-1012",
//         purchasePrice: {
//           "6639b84f5b8e534fa8da6d40": 2,
//           "6639b8485b8e534fa8da6d3c": 200,
//         },
//         processingPrice: {
//           "6639b8485b8e534fa8da6d3c": 250,
//           "6639b84f5b8e534fa8da6d40": 2.5,
//         },
//         salePrice: {
//           "6639b84f5b8e534fa8da6d40": 0,
//           "6639b8485b8e534fa8da6d3c": 0,
//         },
//         units: [
//           {
//             name: "KG",
//             value: "6639b8485b8e534fa8da6d3c",
//             baseUnit: "6639b84f5b8e534fa8da6d40",
//             conversionFactor: 1000,
//             quantity: 0,
//             salePrice: 0,
//             purchasePrice: 200,
//             damage: 0,
//             processingPrice: 250,
//           },
//           {
//             name: "Gram",
//             value: "6639b84f5b8e534fa8da6d40",
//             conversionFactor: 0,
//             quantity: 0,
//             salePrice: 0,
//             purchasePrice: 2,
//             damage: 0,
//             processingPrice: 2.5,
//           },
//         ],
//       },
//     ],
//     lotProducts: [],
//   },
// ];

export { unitDropdown, lotDropdown };
