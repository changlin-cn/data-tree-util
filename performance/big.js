const dataBig = [];

for (let i = 0; i < 100; i++) {
  dataBig.push({ id: `${i}`, parentId: '0' });
  for (let j = 0; j < 100; j++) {
    dataBig.push({ id: `${i}-${j}`, parentId: `${i}` });
    for (let k = 0; k < 2; k++) {
      dataBig.push({ id: `${i}-${j}-${k}`, parentId: `${i}-${j}` });
    }
  }
}

export { dataBig };
