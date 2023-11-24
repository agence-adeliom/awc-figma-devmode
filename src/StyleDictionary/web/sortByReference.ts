const sortByReference = (dictionary) => {
  function sorter(a, b) {
    const aComesFirst = -1;
    const bComesFirst = 1;

    if (a.original && dictionary.usesReference(a.original.value)) {
      if (b.original && dictionary.usesReference(b.original.value)) {
        const aRefs = dictionary.getReferences(a.original.value);
        const bRefs = dictionary.getReferences(b.original.value);

        aRefs.forEach(aRef => {
          if (aRef.name === b.name) {
            return bComesFirst;
          }
        });

        bRefs.forEach(bRef => {
          if (bRef.name === a.name) {
            return aComesFirst;
          }
        });

        return sorter(aRefs[0], bRefs[0]);
      } else {
        return bComesFirst;
      }
    } else {
      return aComesFirst;
    }
  }

  return sorter;
}

export default sortByReference;