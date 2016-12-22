// /* global describe:true, it:true */
//
// // Utilities:
// import chai from 'chai';
// import dirtyChai from 'dirty-chai';
// import Promise from 'bluebird';
// import sinon from 'sinon';
// import sinonChai from 'sinon-chai';
//
// // Test setup:
// const expect = chai.expect;
// chai.use(dirtyChai);
// chai.use(sinonChai);
//
// // Dependencies:
// import transforms from './transforms';
//
// // Under test:
// import mockDataTransformer from './mock-data-transformer';
//
// describe('server/api/transformers: mockDataTransformer:', () => {
//     it('should update the path to a MockDataFile in all files that reference it', () => {
//         let file = {};
//         let options = {
//             oldName: 'old name',
//             newName: 'new name',
//             oldPath: 'old/path',
//             newPath: 'new/path'
//         };
//
//         sinon.stub(transforms, 'transformReferences').returns(Promise.resolve());
//         sinon.stub(transforms, 'transformReferenceIdentifiers').returns(Promise.resolve());
//
//         return mockDataTransformer(file, options)
//         .then(() => {
//             expect(transforms.transformReferences).to.have.been.calledWith('mockData', 'old/path', 'new/path', 'old name', 'new name');
//         })
//         .finally(() => {
//             transforms.transformReferences.restore();
//             transforms.transformReferenceIdentifiers.restore();
//         });
//     });
//
//     it('should update the name of the constructor of a MockDataFile in files that reference it', () => {
//         let file = {};
//         let options = {
//             oldName: 'old name',
//             newName: 'new name',
//             oldPath: 'old/path',
//             newPath: 'new/path'
//         };
//
//         sinon.stub(transforms, 'transformReferences').returns(Promise.resolve());
//         sinon.stub(transforms, 'transformReferenceIdentifiers').returns(Promise.resolve());
//
//         return mockDataTransformer(file, options)
//         .then(() => {
//             expect(transforms.transformReferenceIdentifiers).to.have.been.calledWith('new/path', 'oldName', 'newName');
//         })
//         .finally(() => {
//             transforms.transformReferences.restore();
//             transforms.transformReferenceIdentifiers.restore();
//         });
//     });
// });
