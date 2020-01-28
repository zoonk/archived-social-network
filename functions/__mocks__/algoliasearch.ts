const algoliasearch = jest.fn().mockReturnValue({
  initIndex: jest.fn().mockReturnValue({
    deleteObject: jest.fn(),
    partialUpdateObject: jest.fn(),
  }),
});

export default algoliasearch;
